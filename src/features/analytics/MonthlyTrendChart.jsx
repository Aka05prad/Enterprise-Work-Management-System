import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const DATA = [
  { month: 'Jan', tasksCreated: 22, tasksCompleted: 18, projectsLaunched: 1 },
  { month: 'Feb', tasksCreated: 31, tasksCompleted: 27, projectsLaunched: 2 },
  { month: 'Mar', tasksCreated: 28, tasksCompleted: 24, projectsLaunched: 1 },
  { month: 'Apr', tasksCreated: 45, tasksCompleted: 38, projectsLaunched: 3 },
  { month: 'May', tasksCreated: 39, tasksCompleted: 35, projectsLaunched: 2 },
  { month: 'Jun', tasksCreated: 52, tasksCompleted: 44, projectsLaunched: 2 },
  { month: 'Jul', tasksCreated: 48, tasksCompleted: 41, projectsLaunched: 1 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color || p.stroke || p.fill }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

const MonthlyTrendChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
    <div className="mb-4">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Monthly activity trend</h3>
      <p className="text-xs text-gray-400 mt-0.5">Tasks and projects over time</p>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={DATA}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="tasks"    tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
        <YAxis yAxisId="projects" orientation="right" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={28} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(v) => <span style={{ color: '#6b7280' }}>{v}</span>} />
        <Bar    yAxisId="tasks"    dataKey="tasksCreated"    name="Created"          fill="#c7d2fe" radius={[4,4,0,0]} barSize={14} />
        <Bar    yAxisId="tasks"    dataKey="tasksCompleted"  name="Completed"        fill="#6366f1" radius={[4,4,0,0]} barSize={14} />
        <Line   yAxisId="projects" dataKey="projectsLaunched" name="Projects launched" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} type="monotone" />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

export default MonthlyTrendChart;