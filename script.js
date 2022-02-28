const APIURL = 'https://api.github.com/users/';
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

async function getUser(username) {
    try {
        const {data} = await axios(APIURL + username);
        createUserCard(data);
        addRepos(username);
    } catch (err) {
        if (err.response.status == 404) {
            createErrorCard('Github profile does not exist!');
        }
    }
}

async function addRepos(username) {
    try {
        const {data} = await axios(APIURL + username + '/repos');
        addReposToCard(data);
    } catch (err) {
        createErrorCard('Problem fetching repos.');
    }
}

function createUserCard(user) {
    const card = `
    <div class="card">
        <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>
            <ul>
                <li>${user.followers} <strong>followers</strong></li>
                <li>${user.following} <strong>following</strong></li>
                <li>${user.public_repos} <strong>repos</strong></li>
            </ul>
            <div id="repos">
            </div>
        </div>
    </div>
    `;
    main.innerHTML = card;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos');
    repos.forEach(repo => {
        const repoEl = document.createElement('a');
        repoEl.textContent = repo.name;
        repoEl.href = repo.html_url;
        repoEl.target = '_blank';
        repoEl.classList.add('repos');

        reposEl.appendChild(repoEl);
    })
}

function createErrorCard(msg) {
    const card = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    `;
    main.innerHTML = card;
}

form.addEventListener('submit', e => {
    e.preventDefault();
    const user = search.value;
    if (user) {
        getUser(user);
        search.value = '';
    }
})