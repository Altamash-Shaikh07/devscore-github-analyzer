import { useState } from 'react';
import { Search, Github, Loader2, X } from 'lucide-react';

export default function SearchBar({ onSearch, loading, onReset, hasData }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) onSearch(input.trim());
  };

  const handleReset = () => {
    setInput('');
    onReset();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <Github className="absolute left-4 w-5 h-5 text-brand-400 z-10 pointer-events-none" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter GitHub username..."
            disabled={loading}
            className="w-full pl-12 pr-36 py-4 bg-surface-600/80 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-white/30 font-body text-base focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all duration-300 disabled:opacity-50"
          />
          <div className="absolute right-2 flex items-center gap-2">
            {(hasData || input) && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/10 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-display font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-brand-600/30 hover:shadow-brand-500/40 hover:-translate-y-px active:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
