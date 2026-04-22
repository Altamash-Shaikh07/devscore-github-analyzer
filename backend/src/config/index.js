require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  githubToken: process.env.GITHUB_TOKEN || '',
  githubApiBase: 'https://api.github.com',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 50,
  },
};
