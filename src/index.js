class GitApi {
	constructor(username) {
		this.username = username
	}

	// from repo you can use language OR "languages_url" (just use languagesurl)
	// get created_at & language from payload.json / fetchrepos
	async LocalTests() {
		const res = await fetch('../payload.json');
		const testres = await res.json();
		return testres;
	}

	async LocalCommits() {
		const res = await fetch('../commits.json');
		const testres = await res.json();
		return testres;
	}

	// this will need a redirect to proxy due to CORS
	async FetchRepos() {
		const response = await fetch(`https://api.github.com/users/${this.username}/repos`);
		const repos = await response.json()
		return repos;
	}

	// so will this
	async FetchCommits(url_array) {
		const commits = await Promise.all(
			url_array.map(async (url) => {
				const response = await fetch(url.commits_url.replace('{/sha}', ''));
				const commit_response = await response.json();
				return commit_response;
			})
		);

		console.log("c: ", commits);
		return commits
	}
}

(async () => {
	const api = new GitApi('MShaw1223');

	const response = await api.FetchRepos();

	console.log('repos: ', response)

	const filtered_urls = response.filter(url => url.name !== "MShaw1223.github.io" && url.name !== "MShaw1223");

	const commit_history = await api.FetchCommits(filtered_urls);

	for (let i = 0; i < filtered_urls.length; i++) {
		const repo = filtered_urls[i];
		const commit = commit_history[i];
		console.log(`repo: ${repo} commit: ${commit}`);
		createCard(repo, commit);
	}
})();

const createCard = (repository, commit_info) => {
	const container = document.getElementsByClassName('card-container')[0];

	const card = document.createElement('div');
	card.className = 'card';
	container.appendChild(card);

	const title = document.createElement('h3');
	title.innerHTML = `<a href="${repository.html_url}">${repository.name}</a> Default Branch: ${repository.default_branch}`;
	title.className = 'montserrat medium';
	card.appendChild(title);

	const main_lang = document.createElement('h3');
	main_lang.textContent = repository.language;
	main_lang.className = 'montserrat medium';
	card.appendChild(main_lang);

	const commit_description = document.createElement('p');
	commit_description.textContent = repository.description;
	commit_description.className = 'montserrat light';
	card.appendChild(commit_description);

	const info_title = document.createElement('h3');
	const sha = commit_info[0].sha;
	const abbr_sha = sha.substring(0, 7);
	info_title.textContent = abbr_sha;
	info_title.className = 'montserrat medium';
	card.appendChild(info_title);

	const info = document.createElement('p');
	info.textContent = commit_info[0].commit.message;
	info.className = 'montserrat light';
	card.appendChild(info);
}

