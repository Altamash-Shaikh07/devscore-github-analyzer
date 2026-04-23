const analyzerService = require('../services/analyzerService');
const AnalysisResult = require('../models/AnalysisResult');

async function analyzeUser(req, res) {
  const { username } = req.params;

  if (!username || username.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Username is required',
    });
  }

  const cleanUsername = username.trim().toLowerCase();

  // Validate GitHub username format
  if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(cleanUsername)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid GitHub username format',
    });
  }

  try {
    const data = await analyzerService.analyzeProfile(cleanUsername);
    const result = new AnalysisResult(data);

    return res.status(200).json({
      success: true,
      data: result.toJSON(),
    });
  } catch (err) {
    if (err.response?.status === 401) {
      console.error('[AnalyzeUser Auth Error]', err.response.data?.message || err.message);
      return res.status(401).json({
        success: false,
        error: 'GitHub rejected the configured token. Update GITHUB_TOKEN in backend/.env, or remove it to use unauthenticated public requests.',
      });
    }

    if (err.response?.status === 404) {
      return res.status(404).json({
        success: false,
        error: `GitHub user "${username}" not found`,
      });
    }

    if (err.response?.status === 403) {
      return res.status(429).json({
        success: false,
        error: 'GitHub API rate limit exceeded. Please try again later or add a GitHub token.',
      });
    }

    console.error('[AnalyzeUser Error]', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze profile. Please try again.',
    });
  }
}

module.exports = { analyzeUser };
