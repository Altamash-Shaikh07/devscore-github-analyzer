const github = require('./githubService');
const {
  computeScore,
  detectStrengths,
  detectWeaknesses,
  generateSuggestions,
} = require('../utils/scoring');

async function analyzeProfile(username) {
  // 1. Fetch core data in parallel
  const [profile, repos, events] = await Promise.all([
    github.fetchUserProfile(username),
    github.fetchUserRepos(username),
    github.fetchUserEvents(username),
  ]);

  const originalRepos = repos.filter((r) => !r.fork);
  const forkedRepos = repos.filter((r) => r.fork);

  // 2. Fetch detailed language data for ALL repos (not just primary language)
  const languageBytes = {};
  const languageRepoCount = {};
  
  const langFetches = repos.map((repo) =>
    github.fetchRepoLanguages(username, repo.name).then((langs) => {
      // Track bytes for scoring
      Object.entries(langs || {}).forEach(([lang, bytes]) => {
        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
      });
      
      // Track repo count for display
      Object.keys(langs || {}).forEach((lang) => {
        languageRepoCount[lang] = (languageRepoCount[lang] || 0) + 1;
      });
    })
  );
  await Promise.all(langFetches);

  const languageMap = languageBytes;

  // 3. Accurate commit count using Search Commits API (primary)
  //    Falls back to contributor stats, then event counting if unavailable
  let commitCountLast90Days = await github.fetchCommitCount90Days(username);

  if (commitCountLast90Days === null) {
    // Fallback 1: sum contributions from own repos via contributors endpoint
    const contribCount = await github.fetchContributionCount(username, repos);
    if (contribCount > 0) {
      commitCountLast90Days = contribCount;
    } else {
      // Fallback 2: count from public push events (least accurate)
      const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const recentPushes = events.filter(
        (e) =>
          e.type === 'PushEvent' &&
          new Date(e.created_at).getTime() > ninetyDaysAgo
      );
      commitCountLast90Days = recentPushes.reduce(
        (acc, e) => acc + (e.payload?.commits?.length || 0),
        0
      );
    }
  }

  // 4. Build monthly commit activity from repo commit stats
  const monthlyActivity = await buildMonthlyActivityFromRepos(username, repos);
  console.log('[analyzeProfile] monthlyActivity:', monthlyActivity);

  // 5. Stars & forks totals
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);
  const totalWatchers = repos.reduce((a, r) => a + r.watchers_count, 0);

  // 6. Top repos by stars
  const topRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .map((r) => ({
      name: r.name,
      description: r.description,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      url: r.html_url,
      topics: r.topics || [],
      updatedAt: r.updated_at,
      isFork: r.fork,
    }));

  // 7. Stats summary
  // NOTE: totalRepos = all repos shown in stats card
  //       originalRepos = your own (non-forked) repos used for scoring
  const stats = {
    totalRepos: repos.length,
    originalRepos: originalRepos.length,
    forkedRepos: forkedRepos.length,
    totalStars,
    totalForks,
    totalWatchers,
    commitCountLast90Days,
    forkedBy: totalForks,
    hasOrgs: !!profile.company,
    hasReadme: false,
    followers: profile.followers,
    following: profile.following,
    accountAge: Math.floor(
      (Date.now() - new Date(profile.created_at).getTime()) /
        (365.25 * 24 * 60 * 60 * 1000)
    ),
    languageCount: Object.keys(languageMap).length,
  };

  // 8. Compute score
  const score = computeScore({
    repoCount: originalRepos.length,
    totalStars,
    commitCountLast90Days,
    recentEvents: events,
    languageMap,
    repos: originalRepos,
  });

  // 9. Insights
  const strengths = detectStrengths(score, stats);
  const weaknesses = detectWeaknesses(score, stats);
  const suggestions = generateSuggestions(score, stats, languageMap);

  // 10. Sort languages by repo count for display (frontend uses repo count)
  const sortedLanguages = Object.entries(languageRepoCount)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});

  return {
    profile: {
      login: profile.login,
      name: profile.name,
      avatar: profile.avatar_url,
      bio: profile.bio,
      location: profile.location,
      company: profile.company,
      blog: profile.blog,
      email: profile.email,
      twitterUsername: profile.twitter_username,
      githubUrl: profile.html_url,
      createdAt: profile.created_at,
    },
    stats,
    languages: sortedLanguages,
    monthlyActivity,
    topRepos,
    score,
    strengths,
    weaknesses,
    suggestions,
  };
}

function buildMonthlyActivity(events) {
  const months = {};
  const now = new Date();

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = 0;
  }

  events.forEach((e) => {
    if (e.type !== 'PushEvent') return;
    const d = new Date(e.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (key in months) {
      months[key] += e.payload?.commits?.length || 0;
    }
  });

  return Object.entries(months).map(([month, commits]) => ({
    month,
    commits,
  }));
}

async function buildMonthlyActivityFromRepos(username, repos) {
  const months = {};
  const now = new Date();

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = 0;
  }

  console.log('[buildMonthlyActivity] Starting for user:', username);
  console.log('[buildMonthlyActivity] Month keys:', Object.keys(months));

  try {
    const axios = require('axios');
    const config = require('../config');
    
    const client = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        ...(config.githubToken && {
          Authorization: `Bearer ${config.githubToken}`,
        }),
      },
      timeout: 10000,
    });

    // Use Search API to get commits by month
    const monthKeys = Object.keys(months);
    
    for (const monthKey of monthKeys) {
      const [year, month] = monthKey.split('-');
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      // Create date range for the month
      const startDate = new Date(yearNum, monthNum - 1, 1);
      const endDate = new Date(yearNum, monthNum, 0); // Last day of month
      
      const startStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const endStr = endDate.toISOString().split('T')[0]; // YYYY-MM-DD

      try {
        const { data } = await client.get('/search/commits', {
          params: {
            q: `author:${username} committer-date:${startStr}..${endStr}`,
            per_page: 1,
          },
          headers: {
            Accept: 'application/vnd.github.cloak-preview+json',
          },
          timeout: 5000,
        });

        if (data && typeof data.total_count === 'number') {
          months[monthKey] = data.total_count;
          console.log(`[buildMonthlyActivity] ${monthKey}: ${data.total_count} commits (${startStr} to ${endStr})`);
        }
      } catch (err) {
        console.log(`[buildMonthlyActivity] Search API failed for ${monthKey}:`, err.response?.status, err.message);
        
        // Fallback: count from events if we have them
        repos.forEach((repo) => {
          if (!repo.pushed_at) return;
          const pushDate = new Date(repo.pushed_at);
          const pushKey = `${pushDate.getFullYear()}-${String(pushDate.getMonth() + 1).padStart(2, '0')}`;
          if (pushKey === monthKey) {
            months[monthKey] += 1;
          }
        });
      }
    }

    const total = Object.values(months).reduce((a, b) => a + b, 0);
    console.log('[buildMonthlyActivity] Final total commits:', total);
    console.log('[buildMonthlyActivity] Full breakdown:', JSON.stringify(months));

  } catch (error) {
    console.error('[buildMonthlyActivity] Critical error:', error.message);
  }

  const result = Object.entries(months).map(([month, commits]) => ({
    month,
    commits,
  }));
  
  console.log('[buildMonthlyActivity] Final result array:', JSON.stringify(result));
  return result;
}

module.exports = { analyzeProfile };