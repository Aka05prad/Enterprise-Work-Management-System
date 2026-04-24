import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip,
} from 'recharts';

const DATA = [
  { metric: 'On-time delivery', Alice: 88, Mark: 76, Eve: 92 },
  { metric: 'Task completion',  Alice: 95, Mark: 80, Eve: 86 },
  { metric: 'Code quality',     Alice: 72, Mark: 88, Eve: 79 },
  { metric: 'Collaboration',    Alice: 90, Mark: 95, Eve: 83 },
  { metric: 'Documentation',    Alice: 65, Mark: 70, Eve: 88 },
  { metric: 'Bug rate',         Alice: 80, Mark: 74, Eve: 91 },
];

const TeamPerformanceChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
    <div className="mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Team performance radar</h3>
      <p className="text-xs text-gray-400 mt-0.5">Multi-metric comparison across team leads</p>
    </div>
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={DATA}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#9ca3af' }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickCount={4} />
        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(v) => <span style={{ color: '#6b7280' }}>{v}</span>} />
        <Radar name="Alice" dataKey="Alice" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
        <Radar name="Mark"  dataKey="Mark"  stroke="#22c55e" fill="#22c55e" fillOpacity={0.1}  strokeWidth={2} />
        <Radar name="Eve"   dataKey="Eve"   stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1}  strokeWidth={2} />
      </RadarChart>
    </ResponsiveContainer>
  </div>
);

export default TeamPerformanceChart;