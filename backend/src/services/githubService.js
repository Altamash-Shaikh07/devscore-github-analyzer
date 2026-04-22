const axios = require('axios');
const config = require('../config');

const githubClient = axios.create({
  baseURL: config.githubApiBase,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    ...(config.githubToken && {
      Authorization: `Bearer ${config.githubToken}`,
    }),
  },
  timeout: 15000,
});

async function fetchUserProfile(username) {
  const { data } = await githubClient.get(`/users/${username}`);
  return data;
}

async function fetchUserRepos(username) {
  const allRepos = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data } = await githubClient.get(`/users/${username}/repos`, {
      params: { per_page: perPage, page, sort: 'updated' },
    });
    allRepos.push(...data);
    if (data.length < perPage) break;
    page++;
    if (page > 5) break; // cap at 500 repos
  }

  return allRepos;
}

async function fetchRepoLanguages(owner, repo) {
  try {
    const { data } = await githubClient.get(`/repos/${owner}/${repo}/languages`);
    return data;
  } catch {
    return {};
  }
}

async function fetchRepoCommitActivity(owner, repo) {
  try {
    const { data } = await githubClient.get(
      `/repos/${owner}/${repo}/stats/commit_activity`
    );
    return data || [];
  } catch {
    return [];
  }
}

async function fetchUserEvents(username) {
  try {
    const { data } = await githubClient.get(`/users/${username}/events/public`, {
      params: { per_page: 100 },
    });
    return data;
  } catch {
    return [];
  }
}

async function fetchTopRepoDetails(owner, repos) {
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  const details = await Promise.allSettled(
    topRepos.map((repo) => fetchRepoLanguages(owner, repo.name))
  );

  return topRepos.map((repo, i) => ({
    ...repo,
    languages:
      details[i].status === 'fulfilled' ? details[i].value : {},
  }));
}

module.exports = {
  fetchUserProfile,
  fetchUserRepos,
  fetchRepoLanguages,
  fetchRepoCommitActivity,
  fetchUserEvents,
  fetchTopRepoDetails,
};
