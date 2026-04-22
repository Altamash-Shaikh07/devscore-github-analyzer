import { GitFork, Star, Activity, Users, BookOpen, Calendar } from 'lucide-react';

const STATS = [
  { key: 'totalRepos', label: 'Repositories', icon: BookOpen, color: '#0c8eff', suffix: '' },
  { key: 'totalStars', label: 'Total Stars', icon: Star, color: '#fbbf24', suffix: '' },
  { key: 'commitCountLast90Days', label: 'Commits (90d)', icon: Activity, color: '#34d399', suffix: '' },
  { key: 'followers', label: 'Followers', icon: Users, color: '#a78bfa', suffix: '' },
  { key: 'totalForks', label: 'Forks Received', icon: GitFork, color: '#22d3ee', suffix: '' },
  { key: 'accountAge', label: 'Years Active', icon: Calendar, color: '#fb7185', suffix: 'yr' },
];

function formatNumber(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function StatsOverview({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {STATS.map(({ key, label, icon: Icon, color, suffix }) => (
        <div
          key={key}
          className="group relative overflow-hidden rounded-2xl bg-surface-600/60 border border-white/8 p-4 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200"
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)` }}
          />
          <div className="relative z-10">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="font-display font-bold text-xl text-white leading-none mb-1">
              {formatNumber(stats[key])}{suffix}
            </div>
            <div className="font-body text-xs text-white/40">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
