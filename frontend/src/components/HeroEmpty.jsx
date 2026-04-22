import { Github, Zap, BarChart2, Star } from 'lucide-react';

const FEATURES = [
  { icon: Zap, color: '#fbbf24', label: 'Developer Score', desc: '0–100 comprehensive rating' },
  { icon: BarChart2, color: '#0c8eff', label: 'Deep Analytics', desc: 'Repos, stars & commits' },
  { icon: Star, color: '#a78bfa', label: 'AI Insights', desc: 'Strengths & suggestions' },
];

export default function HeroEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-10 text-center">
      {/* Icon */}
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-surface-500 border border-white/10 flex items-center justify-center shadow-2xl shadow-black/40">
          <Github className="w-12 h-12 text-white/60" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-brand-600 rounded-xl flex items-center justify-center border-2 border-surface-900 shadow-lg shadow-brand-600/40">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Copy */}
      <div className="space-y-3 max-w-lg">
        <h2 className="font-display font-bold text-white text-3xl leading-tight">
          Measure your developer{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-cyan">
            impact
          </span>
        </h2>
        <p className="font-body text-white/45 text-base leading-relaxed">
          Enter any GitHub username to generate an AI-powered portfolio score with detailed insights, strengths, and an actionable improvement plan.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg">
        {FEATURES.map(({ icon: Icon, color, label, desc }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-surface-600/50 border border-white/6"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-4.5 h-4.5" style={{ color }} />
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm">{label}</p>
              <p className="font-body text-white/35 text-xs">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Example usernames */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        <span className="font-body text-white/25 text-xs">Try:</span>
        {['torvalds', 'gaearon', 'sindresorhus', 'tj'].map((u) => (
          <span
            key={u}
            className="px-2.5 py-1 bg-surface-600/60 border border-white/8 text-white/40 text-xs font-mono rounded-lg"
          >
            {u}
          </span>
        ))}
      </div>
    </div>
  );
}
