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

  // 2. Aggregate language data from all repos
  const languageMap = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
    }
  });

  // 3. Aggregate commit activity (from events — more reliable than stats endpoint)
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const recentPushes = events.filter(
    (e) =>
      e.type === 'PushEvent' &&
      new Date(e.created_at).getTime() > ninetyDaysAgo
  );
  const commitCountLast90Days = recentPushes.reduce(
    (acc, e) => acc + (e.payload?.commits?.length || 0),
    0
  );

  // 4. Build monthly commit activity (last 12 months from events)
  const monthlyActivity = buildMonthlyActivity(events);

  // 5. Stars & forks totals
  const totalStars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const totalForks = repos.reduce((a, r) => a + r.forks_count, 0);
  const totalWatchers = repos.reduce((a, r) => a + r.watchers_count, 0);
  const originalRepos = repos.filter((r) => !r.fork);
  const forkedRepos = repos.filter((r) => r.fork);

  // 6. Top repos by stars (include language info)
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
    hasReadme: false, // approximation
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

  // 10. Sort languages by usage
  const sortedLanguages = Object.entries(languageMap)
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

module.exports = { analyzeProfile };
