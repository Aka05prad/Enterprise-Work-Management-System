import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useSelector } from 'react-redux';

const COLORS = ['#6366f1','#22c55e','#f59e0b','#ec4899','#3b82f6','#ef4444','#8b5cf6','#14b8a6'];

const DepartmentChart = () => {
  const users = useSelector((s) => s.users.list);

  const deptMap = {};
  users.forEach((u) => {
    deptMap[u.department] = (deptMap[u.department] || 0) + 1;
  });

  const data = Object.entries(deptMap).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Team by department</h3>
        <p className="text-xs text-gray-400 mt-0.5">{users.length} total members</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value" labelLine={false}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
          </Pie>
          <Tooltip formatter={(v, n) => [`${v} members`, n]} contentStyle={{ fontSize: 12 }} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} formatter={(v) => <span style={{ color: '#6b7280' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentChart;