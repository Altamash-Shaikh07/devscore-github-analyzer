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

  // Personalized stars strength
  if (breakdown.stars >= 18) {
    strengths.push(`⭐ Industry recognition: ${stats.totalStars} stars across your repositories — exceptional community engagement`);
  } else if (breakdown.stars >= 15) {
    strengths.push(`⭐ Strong community recognition with ${stats.totalStars}+ GitHub stars`);
  } else if (breakdown.stars >= 10 && stats.totalStars > 0) {
    strengths.push(`⭐ Building momentum: ${stats.totalStars} stars show growing community interest`);
  }

  // Personalized repo count strength
  if (breakdown.repoCount >= 18) {
    strengths.push(`📁 Extensive portfolio: ${stats.originalRepos} original repositories demonstrate broad expertise`);
  } else if (breakdown.repoCount >= 15) {
    strengths.push(`📁 Substantial portfolio with ${stats.originalRepos} public repositories`);
  } else if (breakdown.repoCount >= 10 && stats.originalRepos > 0) {
    strengths.push(`📁 Solid foundation: ${stats.originalRepos} repositories show consistent output`);
  }

  // Personalized activity strength
  if (breakdown.activity >= 18) {
    strengths.push(`🔥 Highly active developer: ${stats.commitCountLast90Days} commits in last 90 days shows dedication and momentum`);
  } else if (breakdown.activity >= 15) {
    strengths.push(`🔥 Strong contributor: Consistent commit history with regular updates`);
  } else if (breakdown.activity >= 10 && stats.commitCountLast90Days > 0) {
    strengths.push(`🔥 Active engagement: ${stats.commitCountLast90Days} recent commits show ongoing development`);
  }

  // Personalized language diversity strength
  if (breakdown.languageDiversity >= 18) {
    strengths.push(`🌐 Polyglot expert: Proficient in ${stats.languageCount}+ programming languages — versatile skill set`);
  } else if (breakdown.languageDiversity >= 15) {
    strengths.push(`🌐 Multi-language expertise: ${stats.languageCount} languages demonstrates breadth`);
  } else if (breakdown.languageDiversity >= 10 && stats.languageCount > 1) {
    strengths.push(`🌐 Diverse tech stack: Working across ${stats.languageCount} different languages`);
  }

  // Personalized quality strength
  if (breakdown.repoQuality >= 15) {
    strengths.push(`📚 Quality focus: Repositories are well-documented with clear descriptions and topics`);
  } else if (breakdown.repoQuality >= 10) {
    strengths.push(`📚 Professional repositories: Good documentation and metadata practices`);
  }

  // Community engagement
  if (stats.totalForks > 20) {
    strengths.push(`🚀 Community impact: ${stats.totalForks} forks show your code is being used and built upon`);
  } else if (stats.totalForks > 5) {
    strengths.push(`🚀 Recognized work: Multiple forks indicate community adoption`);
  }

  // Account maturity
  if (stats.accountAge >= 5) {
    strengths.push(`⏱️ Sustained commitment: ${stats.accountAge} years on GitHub shows dedication to the craft`);
  }

  // Followers
  if (stats.followers >= 50) {
    strengths.push(`👥 Respected in community: ${stats.followers}+ followers attest to your influence`);
  } else if (stats.followers > 10) {
    strengths.push(`👥 Growing influence: Building a following in the developer community`);
  }

  if (strengths.length === 0)
    strengths.push('✅ GitHub account established with active contributions');

  return strengths;
}

function detectWeaknesses(score, stats, languages = {}) {
  const weaknesses = [];
  const { breakdown } = score;

  // Specific repo count weaknesses
  if (breakdown.repoCount < 5) {
    weaknesses.push(`📁 Limited portfolio: Only ${stats.originalRepos} original repositories — build more projects to showcase diverse skills`);
  } else if (breakdown.repoCount < 8) {
    weaknesses.push(`📁 Growing portfolio needed: ${stats.originalRepos} repositories is a good start — aim for 15+ to demonstrate depth`);
  } else if (breakdown.repoCount < 10) {
    weaknesses.push(`📁 Portfolio expansion: Consider adding 2-3 more public repositories`);
  }

  // Specific star weaknesses
  if (breakdown.stars < 3) {
    weaknesses.push(`⭐ Visibility gap: ${stats.totalStars} total stars indicates projects need more visibility — improve README quality and add topics`);
  } else if (breakdown.stars < 6) {
    weaknesses.push(`⭐ Limited recognition: ${stats.totalStars}+ stars — create a standout project or contribute to trending repositories`);
  } else if (breakdown.stars < 10) {
    weaknesses.push(`⭐ Growing recognition: ${stats.totalStars} stars is a good foundation — keep shipping and marketing your best work`);
  }

  // Specific activity weaknesses  
  if (breakdown.activity < 5) {
    weaknesses.push(`🔥 Activity gap: Only ${stats.commitCountLast90Days} commits in last 90 days — increase frequency to demonstrate ongoing commitment`);
  } else if (breakdown.activity < 8) {
    weaknesses.push(`🔥 Inconsistent contributions: ${stats.commitCountLast90Days} recent commits show gaps — aim for more regular commits`);
  } else if (breakdown.activity < 12) {
    weaknesses.push(`🔥 Boost momentum: Maintain steady contributions — even small daily commits build momentum`);
  }

  // Specific language diversity weaknesses
  if (breakdown.languageDiversity < 3) {
    const topLangs = Object.keys(languages || {}).slice(0, 2).join(' and ');
    weaknesses.push(`🌐 Narrow tech stack: Primarily ${topLangs || 'focused'} — diversify into Go, Rust, or Python to expand marketability`);
  } else if (breakdown.languageDiversity < 5) {
    weaknesses.push(`🌐 Limited diversity: ${stats.languageCount} languages is a start — explore 1-2 more languages to broaden appeal`);
  } else if (breakdown.languageDiversity < 8) {
    weaknesses.push(`🌐 Tech stack growth: Building ${stats.languageCount} languages — consider one more language specialization`);
  }

  // Specific quality weaknesses
  if (breakdown.repoQuality < 5) {
    weaknesses.push(`📝 Documentation needed: Many repositories lack descriptions, topics, or README files — add these to improve discoverability`);
  } else if (breakdown.repoQuality < 8) {
    weaknesses.push(`📝 Quality improvements: ${stats.originalRepos} repos could benefit from better documentation and topic tags`);
  } else if (breakdown.repoQuality < 12) {
    weaknesses.push(`📝 Polish up: Add topics and descriptions to remaining repositories for consistency`);
  }

  // Community engagement gap
  if (stats.totalForks < 2) {
    weaknesses.push(`🚀 Community adoption: 0 forks suggests projects aren't meeting market needs — refocus on solving real problems`);
  } else if (stats.totalForks < 5) {
    weaknesses.push(`🚀 Limited adoption: ${stats.totalForks} forks is modest — make projects more accessible and marketable`);
  }

  // Follower gap
  if (stats.followers < 5) {
    weaknesses.push(`👥 Personal branding: Minimal followers — improve bio, pin best repos, and engage with the community`);
  } else if (stats.followers < 20) {
    weaknesses.push(`👥 Growing presence: ${stats.followers} followers is good start — contribute to open-source to build influence`);
  }

  // Recent activity patterns
  if (stats.accountAge > 2 && stats.commitCountLast90Days < 5) {
    weaknesses.push(`⏰ Dormant projects: Long inactive period — reactivate old projects or start new ones`);
  }

  if (weaknesses.length === 0)
    weaknesses.push('✅ No critical areas identified — maintain your current trajectory!');

  return weaknesses;
}

function generateSuggestions(score, stats, languages) {
  const suggestions = [];
  const { breakdown } = score;
  const topLangs = Object.keys(languages).slice(0, 3);
  const langStr = topLangs.length > 1 
    ? topLangs.slice(0, -1).join(', ') + ', and ' + topLangs[topLangs.length - 1]
    : topLangs[0];

  // Portfolio suggestions (personalized)
  if (breakdown.repoCount < 5) {
    suggestions.push({
      category: 'Portfolio',
      icon: '📁',
      text: `Start building: You have ${stats.originalRepos} repos. Aim for 10-15 projects that showcase different aspects of your skills. Include problem-solving tools, libraries, and applications.`,
    });
  } else if (breakdown.repoCount < 15) {
    suggestions.push({
      category: 'Portfolio',
      icon: '📁',
      text: `Expand your portfolio: Add ${15 - stats.originalRepos} more public projects. Focus on projects that solve real-world problems or demonstrate expertise in your domain.`,
    });
  } else {
    suggestions.push({
      category: 'Portfolio',
      icon: '📁',
      text: `Maintain momentum: Your ${stats.originalRepos} repositories are impressive. Consider creating specialized projects or tools in emerging technologies.`,
    });
  }

  // Visibility/Stars suggestions (personalized)
  if (breakdown.stars < 5) {
    suggestions.push({
      category: 'Visibility',
      icon: '⭐',
      text: `Boost discoverability: Your projects have ${stats.totalStars} stars. Make your README files stand out with live demos, screenshots, and clear use cases. Share on Dev.to, HN, and Reddit.`,
    });
  } else if (breakdown.stars < 15) {
    suggestions.push({
      category: 'Visibility',
      icon: '⭐',
      text: `Increase reach: Market your best repos. Write blog posts about your projects, share on social media, and contribute to relevant discussions in communities.`,
    });
  } else {
    suggestions.push({
      category: 'Visibility',
      icon: '⭐',
      text: `Leverage your success: With ${stats.totalStars}+ stars, you've got traction. Consider building a personal brand around your most popular projects.`,
    });
  }

  // Activity suggestions (personalized)
  if (breakdown.activity < 8) {
    suggestions.push({
      category: 'Activity',
      icon: '🔥',
      text: `Build consistency: ${stats.commitCountLast90Days} commits in 90 days. Commit every day, even small improvements. Daily commits build discipline and show dedication.`,
    });
  } else if (breakdown.activity < 15) {
    suggestions.push({
      category: 'Activity',
      icon: '🔥',
      text: `Maintain the streak: You're doing well with ${stats.commitCountLast90Days} recent commits. Keep the momentum — aim for at least 5 commits per week.`,
    });
  } else {
    suggestions.push({
      category: 'Activity',
      icon: '🔥',
      text: `Keep shipping: Your ${stats.commitCountLast90Days} recent commits show great momentum. This dedication is exactly what employers look for.`,
    });
  }

  // Language diversity suggestions (personalized)
  if (breakdown.languageDiversity < 3) {
    suggestions.push({
      category: 'Skills',
      icon: '🌐',
      text: `Diversify tech stack: You're strong in ${langStr}. Learn Python, Go, or Rust to expand your toolbox. Create 2-3 projects in new languages.`,
    });
  } else if (breakdown.languageDiversity < 6) {
    suggestions.push({
      category: 'Skills',
      icon: '🌐',
      text: `Broaden expertise: You use ${stats.languageCount} languages. Add one more — consider TypeScript, Rust, or Python depending on your goals.`,
    });
  } else {
    suggestions.push({
      category: 'Skills',
      icon: '🌐',
      text: `Deepen expertise: With ${stats.languageCount} languages, you're versatile. Specialize in 2-3 and become a domain expert in those areas.`,
    });
  }

  // Quality suggestions (personalized)
  if (breakdown.repoQuality < 8) {
    suggestions.push({
      category: 'Quality',
      icon: '📝',
      text: `Polish your repos: Add comprehensive README files with usage examples, add topic tags (5-10 per repo), and descriptions to all ${stats.originalRepos} repositories.`,
    });
  } else if (breakdown.repoQuality < 12) {
    suggestions.push({
      category: 'Quality',
      icon: '📝',
      text: `Final touches: Ensure all repos have descriptions and topics. Consider adding CONTRIBUTING.md and CODE_OF_CONDUCT.md to major projects.`,
    });
  } else {
    suggestions.push({
      category: 'Quality',
      icon: '📝',
      text: `Maintain excellence: Your documentation is strong. Now focus on code quality — add CI/CD, tests, and security checks.`,
    });
  }

  // Profile branding suggestions
  if (stats.accountAge < 1) {
    suggestions.push({
      category: 'Branding',
      icon: '✨',
      text: `Welcome to GitHub! Create an attractive profile README immediately. Use github.com/<username>/<username> repo to showcase your best work.`,
    });
  } else {
    suggestions.push({
      category: 'Branding',
      icon: '✨',
      text: `Build your personal brand: Pin your 6 best repositories. Create a profile README with achievements, skills, and blog feed. Link to portfolio and social media.`,
    });
  }

  // Community engagement suggestions (personalized)
  if (stats.totalForks < 5) {
    suggestions.push({
      category: 'Community',
      icon: '🤝',
      text: `Build adoption: Contribute to trending open-source projects. Help others in issues, write tutorials, and collaborate. This builds reputation and forks.`,
    });
  } else {
    suggestions.push({
      category: 'Community',
      icon: '🤝',
      text: `Deepen impact: With ${stats.totalForks} forks, you're making an impact. Engage with contributors, review PRs, and maintain an active community.`,
    });
  }

  // Advanced growth suggestions
  if (score.total >= 70) {
    suggestions.push({
      category: 'Leadership',
      icon: '👑',
      text: `You're a skilled developer. Mentor others, speak at tech conferences, write technical blog posts, and consider creating an open-source framework.`,
    });
  }

  // Engagement suggestions  
  if (stats.followers < 50) {
    suggestions.push({
      category: 'Network',
      icon: '🌟',
      text: `Grow your following: Follow developers you admire, engage with their code, star interesting repos, and join GitHub discussions in your interest areas.`,
    });
  }

  return suggestions;
}

module.exports = {
  computeScore,
  detectStrengths,
  detectWeaknesses,
  generateSuggestions,
};
