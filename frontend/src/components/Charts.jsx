import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const LANG_COLORS = [
  '#0c8eff', '#a78bfa', '#34d399', '#fbbf24', '#fb7185',
  '#22d3ee', '#f97316', '#84cc16', '#e879f9', '#38bdf8',
];

function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="font-body text-white/50 text-xs mb-1">{label}</p>
      <p className="font-display font-bold text-brand-400 text-sm">{payload[0].value} commits</p>
    </div>
  );
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="font-body text-white text-sm font-medium">{payload[0].name}</p>
      <p className="font-body text-white/50 text-xs">{payload[0].value} repos</p>
    </div>
  );
}

function formatMonth(ym) {
  const [y, m] = ym.split('-');
  const d = new Date(Number(y), Number(m) - 1);
  return d.toLocaleString('default', { month: 'short' });
}

export default function Charts({ languages, monthlyActivity }) {
  const langData = Object.entries(languages)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  const activityData = (monthlyActivity || []).map((d) => ({
    ...d,
    label: formatMonth(d.month),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Activity Chart */}
      <div className="rounded-2xl bg-surface-600/60 border border-white/8 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Commit Activity</h3>
            <p className="font-body text-white/40 text-xs mt-0.5">Last 12 months</p>
          </div>
          <span className="px-2.5 py-1 bg-brand-600/20 text-brand-400 text-xs font-mono rounded-lg border border-brand-500/20">
            {activityData.reduce((a, b) => a + b.commits, 0)} total
          </span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={activityData} barCategoryGap="30%">
            <XAxis
              dataKey="label"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="commits" radius={[4, 4, 0, 0]}>
              {activityData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.commits > 0 ? '#0c8eff' : 'rgba(255,255,255,0.06)'}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Language Chart */}
      <div className="rounded-2xl bg-surface-600/60 border border-white/8 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-semibold text-white text-base">Language Distribution</h3>
            <p className="font-body text-white/40 text-xs mt-0.5">By repository count</p>
          </div>
          <span className="px-2.5 py-1 bg-accent-violet/20 text-accent-violet text-xs font-mono rounded-lg border border-accent-violet/20">
            {langData.length} languages
          </span>
        </div>
        {langData.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={langData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {langData.map((_, i) => (
                  <Cell key={i} fill={LANG_COLORS[i % LANG_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                iconType="circle"
                iconSize={7}
                formatter={(val) => (
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontFamily: 'DM Sans' }}>
                    {val}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[180px] flex items-center justify-center text-white/30 font-body text-sm">
            No language data available
          </div>
        )}
      </div>
    </div>
  );
}
