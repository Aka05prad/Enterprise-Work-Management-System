import { useSelector } from 'react-redux';
import { TrendingUp, CheckSquare, Clock, AlertTriangle } from 'lucide-react';

const AnalyticsKPIs = () => {
  const projects = useSelector((s) => s.projects.list);
  const tasks    = useSelector((s) => s.tasks.list);
  const users    = useSelector((s) => s.users.list);

  const totalTasks     = tasks.length;
  const doneTasks      = tasks.filter((t) => t.status === 'done').length;
  const overdueTasks   = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const avgProgress    = projects.length > 0
    ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
    : 0;
  const activeUsers    = users.filter((u) => u.status === 'active').length;

  const kpis = [
    {
      label: 'Overall completion',
      value: `${completionRate}%`,
      sub: `${doneTasks} of ${totalTasks} tasks`,
      icon: TrendingUp,
      color: 'bg-violet-500',
      trend: completionRate > 50 ? '↑ On track' : '↓ Behind',
      trendColor: completionRate > 50 ? 'text-green-600' : 'text-red-500',
    },
    {
      label: 'Avg project progress',
      value: `${avgProgress}%`,
      sub: `${projects.filter((p) => p.status === 'active').length} active projects`,
      icon: CheckSquare,
      color: 'bg-blue-500',
      trend: '→ Steady',
      trendColor: 'text-blue-600',
    },
    {
      label: 'Overdue tasks',
      value: overdueTasks,
      sub: 'Needs immediate attention',
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: overdueTasks > 0 ? '↑ Action needed' : '✓ All clear',
      trendColor: overdueTasks > 0 ? 'text-red-500' : 'text-green-600',
    },
    {
      label: 'Active team members',
      value: activeUsers,
      sub: `of ${users.length} total members`,
      icon: Clock,
      color: 'bg-green-500',
      trend: '→ Stable',
      trendColor: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map(({ label, value, sub, icon: Icon, color, trend, trendColor }) => (
        <div key={label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className={`p-2.5 rounded-xl ${color}`}>
              <Icon size={18} className="text-white" />
            </div>
            <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsKPIs;