import { useAnalyzer } from '../hooks/useAnalyzer';
import SearchBar from '../components/SearchBar';
import ScoreCard from '../components/ScoreCard';
import StatsOverview from '../components/StatsOverview';
import Charts from '../components/Charts';
import RepoList from '../components/RepoList';
import SuggestionsPanel from '../components/SuggestionsPanel';
import ProfileHeader from '../components/ProfileHeader';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import HeroEmpty from '../components/HeroEmpty';
import { Github, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { data, loading, error, username, analyze, reset } = useAnalyzer();

  return (
    <div className="min-h-screen bg-surface-900 bg-grid-pattern bg-grid text-white">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent-violet/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent-cyan/4 rounded-full blur-[80px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/6 backdrop-blur-sm bg-surface-900/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/40">
              <Github className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-base">DevScore</span>
            <span className="hidden sm:inline px-2 py-0.5 bg-brand-600/20 text-brand-400 text-xs rounded-md font-body border border-brand-500/20">
              Beta
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-violet/60" />
            <span className="font-body text-white/30 text-xs hidden sm:inline">
              AI-Powered Portfolio Analysis
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search */}
        <div className="mb-8">
          <SearchBar
            onSearch={analyze}
            loading={loading}
            onReset={reset}
            hasData={!!data}
          />
        </div>

        {/* States */}
        {loading && <LoadingState username={username} />}
        {!loading && error && <ErrorState error={error} onRetry={() => analyze(username)} />}
        {!loading && !error && !data && <HeroEmpty />}

        {/* Results */}
        {!loading && !error && data && (
          <div className="space-y-4 animate-fade-up">
            {/* Profile Header */}
            <ProfileHeader profile={data.profile} stats={data.stats} />

            {/* Score Card */}
            <ScoreCard score={data.score} profile={data.profile} />

            {/* Stats Overview */}
            <StatsOverview stats={data.stats} />

            {/* Charts */}
            <Charts languages={data.languages} monthlyActivity={data.monthlyActivity} />

            {/* Strengths / Weaknesses / Suggestions */}
            <SuggestionsPanel
              strengths={data.strengths}
              weaknesses={data.weaknesses}
              suggestions={data.suggestions}
            />

            {/* Top Repos */}
            <RepoList repos={data.topRepos} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-white/20 text-xs">
            DevScore — GitHub Portfolio Analyzer
          </p>
          <p className="font-body text-white/20 text-xs">
            Data sourced from GitHub API · Not affiliated with GitHub
          </p>
        </div>
      </footer>
    </div>
  );
}
