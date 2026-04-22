const STEPS = [
  'Fetching GitHub profile...',
  'Scanning repositories...',
  'Analyzing commit history...',
  'Computing language diversity...',
  'Generating developer score...',
];

import { useEffect, useState } from 'react';

export default function LoadingState({ username }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-8">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
        <div className="absolute inset-0 rounded-full border-2 border-t-brand-500 border-r-brand-500/50 border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full border-2 border-t-accent-violet/70 border-r-transparent border-b-transparent border-l-accent-violet/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        <div className="absolute inset-6 rounded-full bg-brand-500/20 animate-pulse-slow" />
      </div>

      <div className="text-center space-y-2">
        <p className="font-display font-semibold text-white text-lg">
          Analyzing <span className="text-brand-400">@{username}</span>
        </p>
        <div className="h-5">
          <p className="font-body text-white/40 text-sm animate-fade-in" key={step}>
            {STEPS[step]}
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-500"
            style={{
              width: i === step ? '24px' : '6px',
              height: '6px',
              backgroundColor: i <= step ? '#0c8eff' : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
