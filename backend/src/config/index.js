require('dotenv').config();

function normalizeGithubToken(token = '') {
  const trimmed = token.trim();
  const placeholderTokens = new Set([
    'ghp_your_personal_access_token_here',
    'github_token_here',
    'your_github_token_here',
  ]);

  return placeholderTokens.has(trimmed.toLowerCase()) ? '' : trimmed;
}

module.exports = {
  port: process.env.PORT || 5001,
  githubToken: normalizeGithubToken(process.env.GITHUB_TOKEN),
  githubApiBase: 'https://api.github.com',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 50,
  },
};
