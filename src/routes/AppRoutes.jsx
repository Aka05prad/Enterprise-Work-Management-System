import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState } from 'react';
import { ProtectedRoute, RoleGuard } from './ProtectedRoute';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';

// Lazy-loaded pages (code splitting for performance)
const LoginPage    = lazy(() => import('../features/auth/LoginPage'));
const SignupPage   = lazy(() => import('../features/auth/SignupPage'));
const Dashboard    = lazy(() => import('../features/dashboard/DashboardPage'));
const ProjectsPage = lazy(() => import('../features/projects/ProjectsPage'));
const TasksPage    = lazy(() => import('../features/tasks/TasksPage'));
const UsersPage    = lazy(() => import('../features/users/UsersPage'));
const AnalyticsPage = lazy(() => import('../features/analytics/AnalyticsPage'));
const SettingsPage = lazy(() => import('../features/settings/SettingsPage'));

// Full layout wrapper (Sidebar + Navbar)
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Suspense fallback={<Spinner size="lg" className="h-64" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

// Import Outlet for the AppLayout
import { Outlet } from 'react-router-dom';

const AppRoutes = () => (
  <Suspense fallback={<Spinner size="lg" className="h-screen" />}>
    <Routes>
      {/* Public routes */}
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected routes — all roles */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects"  element={<ProjectsPage />} />
          <Route path="/tasks"     element={<TasksPage />} />
          <Route path="/settings"  element={<SettingsPage />} />

          {/* Manager + Admin only */}
          <Route element={<RoleGuard allowedRoles={['admin','manager']} />}>
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          {/* Admin only */}
          <Route element={<RoleGuard allowedRoles={['admin']} />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/"  element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;