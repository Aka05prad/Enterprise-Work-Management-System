import { useSelector } from 'react-redux';
import {
  FolderKanban, CheckSquare, Clock,
  AlertCircle, Users, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/charts/StatsCard';
import TasksBarChart from './TasksBarChart';
import StatusDonutChart from './StatusDonutChart';
import ActivityFeed from './ActivityFeed';
import NotificationsPanel from './NotificationsPanel';
import ProjectsProgressCard from './ProjectsProgressCard';
import CompletionRing from './CompletionRing';

const DashboardPage = () => {
  const { user, isAdmin, isManager } = useAuth();
  const metrics = useSelector((s) => s.dashboard.metrics);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const cards = [
    {
      title: 'Total projects',
      value: metrics.totalProjects,
      subtitle: `${metrics.activeProjects} active`,
      icon: FolderKanban,
      iconColor: 'bg-violet-500',
      trend: 'up',
      trendValue: '+2 this month',
    },
    {
      title: 'Total tasks',
      value: metrics.totalTasks,
      subtitle: `${metrics.pendingTasks} in progress`,
      icon: CheckSquare,
      iconColor: 'bg-blue-500',
      trend: 'up',
      trendValue: '+8 this week',
    },
    {
      title: 'Completed tasks',
      value: metrics.completedTasks,
      subtitle: `${metrics.completionRate}% completion rate`,
      icon: TrendingUp,
      iconColor: 'bg-green-500',
      trend: 'up',
      trendValue: '+5 today',
    },
    {
      title: 'Pending tasks',
      value: metrics.pendingTasks,
      subtitle: `${metrics.overdueTasks} overdue`,
      icon: Clock,
      iconColor: 'bg-yellow-500',
      trend: metrics.overdueTasks > 0 ? 'down' : 'flat',
      trendValue: `${metrics.overdueTasks} overdue`,
    },
    {
      title: 'Overdue tasks',
      value: metrics.overdueTasks,
      subtitle: 'Needs attention',
      icon: AlertCircle,
      iconColor: 'bg-red-500',
      trend: 'down',
      trendValue: 'Action needed',
    },
    {
      title: 'Team members',
      value: metrics.teamMembers,
      subtitle: 'Across all projects',
      icon: Users,
      iconColor: 'bg-pink-500',
      trend: 'flat',
      trendValue: 'No change',
    },
  ];

  return (
    <PageWrapper
      title={`${greeting()}, ${user?.name?.split(' ')[0]} 👋`}
      subtitle="Here's what's happening across your workspace today."
    >
      {/* ── Metrics grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => (
          <StatsCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Charts row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart — takes 2 cols */}
        <div className="lg:col-span-2">
          <TasksBarChart />
        </div>
        {/* Completion ring */}
        <CompletionRing />
      </div>

      {/* ── Status donut + Projects progress ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusDonutChart />
        <ProjectsProgressCard />
      </div>

      {/* ── Activity + Notifications ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed />
        <NotificationsPanel />
      </div>
    </PageWrapper>
  );
};

export default DashboardPage;