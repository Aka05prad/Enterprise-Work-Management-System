import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const DATA = [
  { week: 'Wk 1', ideal: 68, actual: 68 },
  { week: 'Wk 2', ideal: 54, actual: 57 },
  { week: 'Wk 3', ideal: 40, actual: 44 },
  { week: 'Wk 4', ideal: 26, actual: 32 },
  { week: 'Wk 5', ideal: 12, actual: 25 },
  { week: 'Wk 6', ideal: 0,  actual: 18 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.stroke }} className="font-medium">
          {p.name}: {p.value} tasks
        </p>
      ))}
    </div>
  );
};

const BurndownChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
    <div className="mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Sprint burndown</h3>
      <p className="text-xs text-gray-400 mt-0.5">Remaining tasks — ideal vs actual</p>
    </div>
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={DATA}>
        <defs>
          <linearGradient id="idealGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}   />
          </linearGradient>
          <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(v) => <span style={{ color: '#6b7280' }}>{v}</span>} />
        <Area type="monotone" dataKey="ideal"  name="Ideal"  stroke="#94a3b8" strokeWidth={2} fill="url(#idealGrad)"  strokeDasharray="5 5" />
        <Area type="monotone" dataKey="actual" name="Actual" stroke="#6366f1" strokeWidth={2} fill="url(#actualGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default BurndownChart;