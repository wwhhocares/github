const API_BASE_URL = 'https://api.github.com';

let currentPage = 1;
let pageSize = 10;

function fetchRepositories() {
    const username = $('#username').val();

    if (!username) {
        alert('Please enter a valid GitHub username.');
        return;
    }

    showLoader();

    const apiUrl = `${API_BASE_URL}/users/${username}/repos?per_page=${pageSize}&page=${currentPage}`;

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function (data) {
            displayRepositories(data);
            displayPagination(data.length);
        },
        error: function (error) {
            alert('Error fetching repositories. Please check the username and try again.');
            console.error(error);
        },
        complete: function () {
            hideLoader();
        }
    });
}

function displayRepositories(repositories) {
    const repositoriesList = $('#repositories-list');
    repositoriesList.empty();

    if (repositories.length === 0) {
        repositoriesList.append('<p>No repositories found for the given user.</p>');
        return;
    }

    repositories.forEach(repo => {
        repositoriesList.append(`
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${repo.name}</h5>
                    <p class="card-text">${repo.description || 'No description available.'}</p>
                    <p class="card-text"><small class="text-muted">Topics: ${repo.topics.join(', ')}</small></p>
                </div>
            </div>
        `);
    });
}

function displayPagination(totalRepositories) {
    const totalPages = Math.ceil(totalRepositories / pageSize);
    const pagination = $('#pagination');
    pagination.empty();

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            pagination.append(`
                <button type="button" class="btn btn-outline-primary btn-sm mr-1" onclick="changePage(${i})">${i}</button>
            `);
        }
    }
}

function changePage(page) {
    currentPage = page;
    fetchRepositories();
}

function showLoader() {
    $('#repositories-list').html('<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>');
}

function hideLoader() {
    $('#repositories-list').find('.spinner-border').remove();
}
