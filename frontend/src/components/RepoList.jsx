import { Star, GitFork, ExternalLink, GitBranch, Tag } from 'lucide-react';

const LANG_COLORS = {
  JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516',
  PHP: '#4F5D95', 'C++': '#f34b7d', C: '#555555', Swift: '#FA7343',
  Kotlin: '#A97BFF', Dart: '#00B4AB', HTML: '#e34c26', CSS: '#563d7c',
  Shell: '#89e051', Vue: '#41b883', Svelte: '#ff3e00', Default: '#8b949e',
};

function langColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS.Default;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}yr ago`;
}

export default function RepoList({ repos }) {
  if (!repos?.length) return null;

  return (
    <div className="rounded-2xl bg-surface-600/60 border border-white/8 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-white text-base">Top Repositories</h3>
          <p className="font-body text-white/40 text-xs mt-0.5">Ranked by stars</p>
        </div>
        <span className="px-2.5 py-1 bg-white/5 text-white/40 text-xs font-mono rounded-lg">
          {repos.length} repos
        </span>
      </div>

      <div className="divide-y divide-white/5">
        {repos.map((repo, i) => (
          <div
            key={repo.name}
            className="group px-5 py-4 hover:bg-white/3 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-white/20 flex-shrink-0">
                    #{String(i + 1).padStart(2, '0')}
                  </span>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-semibold text-white text-sm hover:text-brand-400 transition-colors duration-150 truncate flex items-center gap-1.5 group/link"
                  >
                    {repo.isFork && (
                      <GitBranch className="w-3 h-3 text-white/30 flex-shrink-0" />
                    )}
                    <span className="truncate">{repo.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-70 transition-opacity flex-shrink-0" />
                  </a>
                </div>

                {repo.description && (
                  <p className="font-body text-white/40 text-xs ml-8 mb-2 line-clamp-1">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-3 ml-8 flex-wrap">
                  {repo.language && (
                    <span className="flex items-center gap-1.5 text-xs font-body text-white/50">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: langColor(repo.language) }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.topics?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 px-1.5 py-0.5 bg-brand-600/15 text-brand-400/70 text-xs rounded-md font-body"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {t}
                    </span>
                  ))}
                  <span className="font-body text-white/25 text-xs ml-auto">
                    {timeAgo(repo.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-body text-xs text-white/50">
                    <Star className="w-3 h-3 text-amber-400/70" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 font-body text-xs text-white/50">
                    <GitFork className="w-3 h-3 text-cyan-400/70" />
                    {repo.forks}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
