import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProjects } from '../projects/projectsSlice';
import { fetchTasks }    from '../tasks/tasksSlice';
import { fetchUsers }    from '../users/usersSlice';
import PageWrapper       from '../../components/layout/PageWrapper';
import AnalyticsKPIs     from './AnalyticsKPIs';
import BurndownChart     from './BurndownChart';
import TeamPerformanceChart from './TeamPerformanceChart';
import ProjectStatusChart   from './ProjectStatusChart';
import MonthlyTrendChart    from './MonthlyTrendChart';
import DepartmentChart      from './DepartmentChart';
import ReportGenerator      from './ReportGenerator';

const AnalyticsPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, []);

  return (
    <PageWrapper
      title="Analytics & reports"
      subtitle="Workspace insights, team performance, and exportable reports"
    >
      {/* KPI row */}
      <AnalyticsKPIs />

      {/* Row 1: burndown + radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BurndownChart />
        <TeamPerformanceChart />
      </div>

      {/* Row 2: monthly trend full width */}
      <MonthlyTrendChart />

      {/* Row 3: project status + department */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProjectStatusChart />
        <DepartmentChart />
      </div>

      {/* Row 4: report generator */}
      <ReportGenerator />
    </PageWrapper>
  );
};

export default AnalyticsPage;