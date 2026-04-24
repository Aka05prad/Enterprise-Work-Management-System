import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer, LabelList,
} from 'recharts';
import { useSelector } from 'react-redux';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-gray-800 dark:text-gray-200">{payload[0].payload.name}</p>
      <p className="text-primary-600">{payload[0].value}% complete</p>
    </div>
  );
};

const ProjectStatusChart = () => {
  const projects = useSelector((s) => s.projects.list);

  const data = projects.map((p) => ({
    name: p.name.length > 16 ? p.name.slice(0, 14) + '…' : p.name,
    progress: p.progress,
    color: p.color,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Project completion status</h3>
        <p className="text-xs text-gray-400 mt-0.5">Progress % per project</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={100} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
          <Bar dataKey="progress" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
            <LabelList dataKey="progress" position="right" formatter={(v) => `${v}%`} style={{ fontSize: 11, fill: '#9ca3af' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProjectStatusChart;