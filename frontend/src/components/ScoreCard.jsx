import { useEffect, useRef, useState } from 'react';
import { TrendingUp } from 'lucide-react';

const SCORE_LABELS = [
  { min: 0, max: 30, label: 'Beginner', color: '#fb7185', bg: 'from-rose-500/20 to-rose-600/5' },
  { min: 30, max: 50, label: 'Developing', color: '#fbbf24', bg: 'from-amber-500/20 to-amber-600/5' },
  { min: 50, max: 70, label: 'Proficient', color: '#34d399', bg: 'from-emerald-500/20 to-emerald-600/5' },
  { min: 70, max: 85, label: 'Advanced', color: '#22d3ee', bg: 'from-cyan-500/20 to-cyan-600/5' },
  { min: 85, max: 101, label: 'Expert', color: '#a78bfa', bg: 'from-violet-500/20 to-violet-600/5' },
];

function getScoreInfo(score) {
  return SCORE_LABELS.find((s) => score >= s.min && score < s.max) || SCORE_LABELS[0];
}

const BREAKDOWN_LABELS = {
  repoCount: 'Repositories',
  stars: 'Stars',
  activity: 'Activity',
  languageDiversity: 'Languages',
  repoQuality: 'Quality',
};

const BREAKDOWN_COLORS = {
  repoCount: '#0c8eff',
  stars: '#fbbf24',
  activity: '#34d399',
  languageDiversity: '#a78bfa',
  repoQuality: '#22d3ee',
};

export default function ScoreCard({ score, profile }) {
  const [displayScore, setDisplayScore] = useState(0);
  const [animated, setAnimated] = useState(false);
  const circleRef = useRef(null);

  const info = getScoreInfo(score.total);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    setDisplayScore(0);
    setAnimated(false);
    const timeout = setTimeout(() => {
      setAnimated(true);
      let current = 0;
      const target = score.total;
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        setDisplayScore(current);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 300);
    return () => clearTimeout(timeout);
  }, [score.total]);

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${info.bg} border border-white/10 p-6 lg:p-8`}>
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 opacity-10 blur-3xl"
        style={{ background: `radial-gradient(circle at 30% 50%, ${info.color}, transparent 70%)` }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
        {/* Circular Score */}
        <div className="relative flex-shrink-0">
          <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
            {/* Track */}
            <circle
              cx="90" cy="90" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="10"
            />
            {/* Progress */}
            <circle
              ref={circleRef}
              cx="90" cy="90" r={radius}
              fill="none"
              stroke={info.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 8px ${info.color}80)` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-5xl text-white leading-none">{displayScore}</span>
            <span className="font-body text-xs text-white/40 mt-1 uppercase tracking-widest">/ 100</span>
          </div>
        </div>

        {/* Score Info */}
        <div className="flex-1 min-w-0 text-center lg:text-left">
          <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
            <TrendingUp className="w-4 h-4" style={{ color: info.color }} />
            <span className="font-body text-sm font-medium" style={{ color: info.color }}>
              {info.label} Developer
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-1 truncate">
            {profile.name || profile.login}
          </h2>
          <p className="font-body text-white/50 text-sm mb-6 truncate">@{profile.login}</p>

          {/* Breakdown bars */}
          <div className="space-y-2.5">
            {Object.entries(score.breakdown).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="font-body text-xs text-white/40 w-28 flex-shrink-0 text-right">
                  {BREAKDOWN_LABELS[key]}
                </span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: animated ? `${(val / 20) * 100}%` : '0%',
                      backgroundColor: BREAKDOWN_COLORS[key],
                      boxShadow: `0 0 8px ${BREAKDOWN_COLORS[key]}60`,
                      transitionDelay: '400ms',
                    }}
                  />
                </div>
                <span className="font-mono text-xs font-medium text-white/60 w-8 flex-shrink-0">
                  {val}/20
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
