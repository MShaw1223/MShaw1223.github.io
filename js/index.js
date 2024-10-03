class GitApi {
	BASE_URL = "https://api.github.com"

	constructor(username) {
		this.username = username
	}

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
		const response = await fetch(`${this.BASE_URL}/users/${this.username}/repos`);
		const repos = await response.json()
		return repos
	}

	// so will this
	async FetchCommits(url) {
		const response = await fetch(url);
		const commits = await response.json()
		return commits
	}
}

(async () => {
	const api = new GitApi("MShaw1223")

	const repos = await api.FetchRepos()

	// removes this repo and the profile readme file
	const filtered_urls = repos.filter(url => url.name !== "MShaw1223.github.io" && url.name !== "MShaw1223")

	// from repo you can use language OR "languages_url" (just use languagesurl)
	// get created_at & language from payload.json / fetchrepos

	filtered_urls.forEach(async (repo) => {
		console.log("commit url (cleaned): ", repo.commits_url.replace('{/sha}', ''));

		const commit = await api.FetchCommits(repo.commits_url.replace('{/sha}', ''));
		console.log("commit array: ", commit);
		createCard(repo, commit[0]);
	});
})();

const createCard = (repository, commit_info) => {
	const container = document.getElementsByClassName('card-container')[0];

	const card = document.createElement('div');
	card.className = 'card';
	container.appendChild(card);

	const title = document.createElement('h3');
	title.textContent = `${repository.name} Default Branch: ${repository.default_branch}`;
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
	const sha = commit_info.sha;
	const abbr_sha = sha.substring(0, 7);
	info_title.textContent = abbr_sha;
	info_title.className('montserrat medium')
	card.appendChild(info_title);

	const info = document.createElement('p');
	info.textContent = commit_info.commit.message;
	info.className = 'montserrat light';
	card.appendChild(info);
}

