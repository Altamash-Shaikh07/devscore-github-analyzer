import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>
      <div className="space-y-2">
        <h3 className="font-display font-semibold text-white text-lg">Analysis Failed</h3>
        <p className="font-body text-white/50 text-sm max-w-sm leading-relaxed">{error}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-500 hover:bg-surface-400 border border-white/10 text-white/80 font-body text-sm rounded-xl transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
