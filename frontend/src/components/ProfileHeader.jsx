import { MapPin, Building2, Globe, Twitter, ExternalLink, Users, Calendar } from 'lucide-react';

export default function ProfileHeader({ profile, stats }) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-surface-600/60 border border-white/8">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={profile.avatar}
          alt={profile.login}
          className="w-20 h-20 rounded-2xl ring-2 ring-white/10 object-cover"
        />
        <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-emerald-400 rounded-full border-2 border-surface-800 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
          <h1 className="font-display font-bold text-xl text-white truncate">
            {profile.name || profile.login}
          </h1>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1 justify-center sm:justify-start"
          >
            @{profile.login}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {profile.bio && (
          <p className="font-body text-white/55 text-sm mb-3 line-clamp-2">{profile.bio}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 justify-center sm:justify-start">
          {profile.location && (
            <span className="flex items-center gap-1.5 font-body text-white/40 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              {profile.location}
            </span>
          )}
          {profile.company && (
            <span className="flex items-center gap-1.5 font-body text-white/40 text-xs">
              <Building2 className="w-3.5 h-3.5" />
              {profile.company}
            </span>
          )}
          {profile.blog && (
            <a
              href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-body text-brand-400/70 text-xs hover:text-brand-400 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              Website
            </a>
          )}
          {profile.twitterUsername && (
            <a
              href={`https://twitter.com/${profile.twitterUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-body text-sky-400/70 text-xs hover:text-sky-400 transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" />
              @{profile.twitterUsername}
            </a>
          )}
          <span className="flex items-center gap-1.5 font-body text-white/40 text-xs">
            <Users className="w-3.5 h-3.5" />
            {stats.followers} followers · {stats.following} following
          </span>
          <span className="flex items-center gap-1.5 font-body text-white/40 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            {stats.accountAge} yr{stats.accountAge !== 1 ? 's' : ''} on GitHub
          </span>
        </div>
      </div>
    </div>
  );
}
