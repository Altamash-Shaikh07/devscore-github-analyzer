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
    if (page > 5) break;
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

/**
 * Fetch up to 300 public events (3 pages) for better monthly activity coverage.
 * The single-page (100 events) approach misses a lot of history.
 */
async function fetchUserEvents(username) {
  try {
    const allEvents = [];
    for (let page = 1; page <= 3; page++) {
      const { data } = await githubClient.get(`/users/${username}/events/public`, {
        params: { per_page: 100, page },
      });
      allEvents.push(...data);
      if (data.length < 100) break;
    }
    return allEvents;
  } catch {
    return [];
  }
}

/**
 * Count commits in the last 90 days using the Search Commits API.
 * This is FAR more accurate than counting from PushEvent payloads,
 * which GitHub caps at 20 commits per event and 100 events total.
 * Returns null on failure so caller can fallback to event counting.
 */
async function fetchCommitCount90Days(username) {
  try {
    const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]; // YYYY-MM-DD

    const { data } = await githubClient.get('/search/commits', {
      params: {
        q: `author:${username} author-date:>=${since}`,
        per_page: 1,
      },
      headers: {
        Accept: 'application/vnd.github.cloak-preview+json',
      },
    });
    return typeof data.total_count === 'number' ? data.total_count : null;
  } catch {
    return null; // caller will fallback to event-based count
  }
}

/**
 * Get per-repo contributor stats to count this user's contributions accurately.
 * Much more accurate than events API for activity scoring.
 */
async function fetchContributionCount(username, repos) {
  const targetRepos = repos.filter((r) => !r.fork).slice(0, 12);
  let total = 0;

  const results = await Promise.allSettled(
    targetRepos.map((repo) =>
      githubClient.get(`/repos/${username}/${repo.name}/contributors`, {
        params: { per_page: 100 },
      })
    )
  );

  results.forEach((result) => {
    if (result.status === 'fulfilled' && Array.isArray(result.value.data)) {
      const me = result.value.data.find(
        (c) => c.login?.toLowerCase() === username.toLowerCase()
      );
      if (me) total += me.contributions || 0;
    }
  });

  return total;
}

/**
 * Fetch up to 1000 public events for better monthly activity coverage.
 */
async function fetchUserEventsExtended(username) {
  try {
    const allEvents = [];
    for (let page = 1; page <= 10; page++) {
      const { data } = await githubClient.get(`/users/${username}/events/public`, {
        params: { per_page: 100, page },
      });
      if (!data || data.length === 0) break;
      allEvents.push(...data);
    }
    return allEvents;
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
  fetchUserEventsExtended,
  fetchCommitCount90Days,
  fetchContributionCount,
  fetchTopRepoDetails,
};