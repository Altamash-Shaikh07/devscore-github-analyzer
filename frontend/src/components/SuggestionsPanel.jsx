import { CheckCircle2, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

function Section({ title, icon: Icon, color, bg, border, items, renderItem }) {
  return (
    <div className={`rounded-2xl ${bg} border ${border} p-5`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}25` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-white text-sm">{title}</h3>
          <p className="font-body text-white/30 text-xs">{items.length} items</p>
        </div>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, i) => renderItem(item, i))}
      </ul>
    </div>
  );
}

export default function SuggestionsPanel({ strengths, weaknesses, suggestions }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <Section
          title="Strengths"
          icon={CheckCircle2}
          color="#34d399"
          bg="bg-emerald-500/5"
          border="border-emerald-500/15"
          items={strengths}
          renderItem={(item, i) => (
            <li key={i} className="flex items-start gap-2.5 group">
              <CheckCircle2 className="w-4 h-4 text-emerald-400/70 mt-0.5 flex-shrink-0" />
              <span className="font-body text-white/70 text-sm leading-relaxed">{item}</span>
            </li>
          )}
        />

        {/* Weaknesses */}
        <Section
          title="Areas to Improve"
          icon={AlertTriangle}
          color="#fbbf24"
          bg="bg-amber-500/5"
          border="border-amber-500/15"
          items={weaknesses}
          renderItem={(item, i) => (
            <li key={i} className="flex items-start gap-2.5 group">
              <AlertTriangle className="w-4 h-4 text-amber-400/70 mt-0.5 flex-shrink-0" />
              <span className="font-body text-white/70 text-sm leading-relaxed">{item}</span>
            </li>
          )}
        />
      </div>

      {/* Suggestions */}
      <div className="rounded-2xl bg-surface-600/60 border border-white/8 p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-brand-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-sm">Action Plan</h3>
            <p className="font-body text-white/30 text-xs">Personalized improvement suggestions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="group flex items-start gap-3 p-3.5 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 hover:border-brand-500/25 transition-all duration-200"
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-0.5 bg-brand-600/20 text-brand-400 text-xs rounded-md font-body mb-1.5">
                  {s.category}
                </span>
                <p className="font-body text-white/65 text-sm leading-relaxed">{s.text}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 flex-shrink-0 mt-1 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
