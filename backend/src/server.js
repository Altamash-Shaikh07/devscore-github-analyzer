const app = require('./app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio Analyzer API running on http://localhost:${PORT}`);
  console.log(`📡 GitHub Token: ${config.githubToken ? '✅ Configured' : '⚠️  Not set (rate limits apply)'}`);
  console.log(`🌐 CORS Origin: ${config.corsOrigin}\n`);
});
