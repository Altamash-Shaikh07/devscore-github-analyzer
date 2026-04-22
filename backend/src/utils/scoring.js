/**
 * Scoring Utility — each dimension is worth 20 points (total: 100)
 */

function scoreRepoCount(count) {
  // 0–5 repos → 0–8pts, 6–15 → 9–14pts, 16–30 → 15–18pts, 31+ → 19–20pts
  if (count === 0) return 0;
  if (count <= 5) return Math.round((count / 5) * 8);
  if (count <= 15) return 8 + Math.round(((count - 5) / 10) * 6);
  if (count <= 30) return 14 + Math.round(((count - 15) / 15) * 4);
  return Math.min(20, 18 + Math.round(((count - 30) / 20) * 2));
}

function scoreStars(totalStars) {
  if (totalStars === 0) return 0;
  if (totalStars <= 10) return Math.round((totalStars / 10) * 6);
  if (totalStars <= 50) return 6 + Math.round(((totalStars - 10) / 40) * 6);
  if (totalStars <= 200) return 12 + Math.round(((totalStars - 50) / 150) * 5);
  if (totalStars <= 1000) return 17 + Math.round(((totalStars - 200) / 800) * 2);
  return 20;
}

function scoreActivity(commitCountLast90Days, recentEvents) {
  // commits in last 90 days
  const commitScore =
    commitCountLast90Days === 0
      ? 0
      : commitCountLast90Days <= 10
      ? Math.round((commitCountLast90Days / 10) * 8)
      : commitCountLast90Days <= 50
      ? 8 + Math.round(((commitCountLast90Days - 10) / 40) * 7)
      : commitCountLast90Days <= 200
      ? 15 + Math.round(((commitCountLast90Days - 50) / 150) * 4)
      : 20;

  // bonus for recent event diversity
  const eventTypes = new Set((recentEvents || []).map((e) => e.type));
  const diversityBonus = Math.min(3, eventTypes.size - 1);

  return Math.min(20, commitScore + diversityBonus);
}

function scoreLanguageDiversity(languageMap) {
  const count = Object.keys(languageMap).length;
  if (count === 0) return 0;
  if (count === 1) return 5;
  if (count === 2) return 9;
  if (count <= 4) return 13;
  if (count <= 6) return 16;
  if (count <= 8) return 18;
  return 20;
}

function scoreRepoQuality(repos) {
  if (!repos || repos.length === 0) return 0;

  let total = 0;
  const factors = repos.map((r) => {
    let pts = 0;
    if (r.description) pts += 2;
    if (r.has_wiki || r.has_pages) pts += 1;
    if (!r.fork) pts += 1;
    if (r.open_issues_count > 0) pts += 1; // shows community engagement
    if (r.stargazers_count > 0) pts += 2;
    if (r.forks_count > 0) pts += 2;
    if (r.topics && r.topics.length > 0) pts += 2;
    return Math.min(10, pts);
  });

  total = factors.reduce((a, b) => a + b, 0);
  const avg = total / factors.length;
  return Math.round((avg / 10) * 20);
}

function computeScore({ repoCount, totalStars, commitCountLast90Days, recentEvents, languageMap, repos }) {
  const repoScore = scoreRepoCount(repoCount);
  const starScore = scoreStars(totalStars);
  const activityScore = scoreActivity(commitCountLast90Days, recentEvents);
  const langScore = scoreLanguageDiversity(languageMap);
  const qualityScore = scoreRepoQuality(repos);

  const total = repoScore + starScore + activityScore + langScore + qualityScore;

  return {
    total,
    breakdown: {
      repoCount: repoScore,
      stars: starScore,
      activity: activityScore,
      languageDiversity: langScore,
      repoQuality: qualityScore,
    },
  };
}

function detectStrengths(score, stats) {
  const strengths = [];
  const { breakdown } = score;

  if (breakdown.stars >= 15)
    strengths.push('High community recognition with significant GitHub stars');
  if (breakdown.repoCount >= 15)
    strengths.push('Extensive portfolio with a large number of public repositories');
  if (breakdown.activity >= 15)
    strengths.push('Highly active contributor with consistent commit history');
  if (breakdown.languageDiversity >= 15)
    strengths.push('Polyglot developer with strong multi-language expertise');
  if (breakdown.repoQuality >= 15)
    strengths.push('Well-maintained repositories with good documentation practices');
  if (stats.forkedBy > 10)
    strengths.push('Work is recognized and forked by the community');
  if (stats.hasOrgs)
    strengths.push('Active in open-source organizations');
  if (stats.totalWatchers > 20)
    strengths.push('Projects attract ongoing developer interest');

  if (strengths.length === 0)
    strengths.push('GitHub account established and contributing');

  return strengths;
}

function detectWeaknesses(score, stats) {
  const weaknesses = [];
  const { breakdown } = score;

  if (breakdown.repoCount < 8)
    weaknesses.push('Limited number of public repositories to showcase work');
  if (breakdown.stars < 6)
    weaknesses.push('Projects have low star counts — limited community visibility');
  if (breakdown.activity < 8)
    weaknesses.push('Low recent commit activity — inconsistent contribution pattern');
  if (breakdown.languageDiversity < 8)
    weaknesses.push('Technology stack appears narrow — limited language diversity');
  if (breakdown.repoQuality < 8)
    weaknesses.push('Many repositories lack descriptions, topics, or documentation');
  if (stats.forksCount < 2)
    weaknesses.push('Low fork count — community engagement could be improved');

  if (weaknesses.length === 0)
    weaknesses.push('No critical weaknesses detected — keep up the great work!');

  return weaknesses;
}

function generateSuggestions(score, stats, languages) {
  const suggestions = [];
  const { breakdown } = score;

  if (breakdown.repoCount < 10)
    suggestions.push({
      category: 'Portfolio',
      icon: '📁',
      text: 'Add more public projects. Aim for at least 10–15 repos showcasing different skills.',
    });

  if (breakdown.stars < 10)
    suggestions.push({
      category: 'Visibility',
      icon: '⭐',
      text: 'Build a standout open-source tool or library and promote it on social media and dev communities.',
    });

  if (breakdown.activity < 10)
    suggestions.push({
      category: 'Activity',
      icon: '🔥',
      text: 'Commit consistently. Even small daily contributions maintain your streak and show momentum.',
    });

  if (breakdown.languageDiversity < 10) {
    const topLangs = Object.keys(languages).slice(0, 2);
    const suggest = topLangs.length
      ? `You mainly use ${topLangs.join(' and ')}. Explore TypeScript, Go, or Python to broaden your stack.`
      : 'Diversify your language portfolio to become a more well-rounded developer.';
    suggestions.push({ category: 'Skills', icon: '🌐', text: suggest });
  }

  if (breakdown.repoQuality < 10)
    suggestions.push({
      category: 'Quality',
      icon: '📝',
      text: 'Add README files, topics/tags, and descriptions to all your repositories for better discoverability.',
    });

  suggestions.push({
    category: 'Profile',
    icon: '🧑‍💻',
    text: 'Pin your 6 best repositories to your profile to create a strong first impression.',
  });

  if (!stats.hasReadme)
    suggestions.push({
      category: 'Branding',
      icon: '✨',
      text: 'Create a GitHub profile README (github.com/<username>/<username>) to stand out.',
    });

  suggestions.push({
    category: 'Community',
    icon: '🤝',
    text: 'Contribute to established open-source projects to build network and reputation.',
  });

  return suggestions;
}

module.exports = {
  computeScore,
  detectStrengths,
  detectWeaknesses,
  generateSuggestions,
};
