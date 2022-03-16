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
        <div class="card mt-4 m-auto p-3 border bg-transparent" style="max-width: 650px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${user.avatar_url}" class="img-fluid rounded-start w-100 p-3" alt="${user.login}">
                    <div class="mt-1 d-flex justify-content-center flex-wrap">
                        <span class="mx-2 bg-danger text-white rounded mb-2 px-2">${user.followers} <strong>followers</strong></span>
                        <span class="mx-2 bg-danger text-white rounded mb-2 px-2">${user.following} <strong>following</strong></span>
                        <span class="mx-2 bg-danger text-white rounded mb-2 px-2">${user.public_repos} <strong>repos</strong></span>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${user.name}</h5>
                        <p class="mb-0">${user.bio}</p>
                        <h5 class="mt-3 mb-2 card-title fw-bold">Repositories</h5>
                        <div class="d-flex flex-wrap">
                            <div id="repos">
                            </div>
                        </div>
                    </div>
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
        repoEl.classList.add('btn', 'btn-primary', 'rounded-pill', 'badge', 'm-1', 'text-decoration-underline', 'text-light');

        reposEl.appendChild(repoEl);
    })
}

function createErrorCard(msg) {
    const card = `
    <div class="card text-center p-5 border-2 mt-5 bg-danger text-white">
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