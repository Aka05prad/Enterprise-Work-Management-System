import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
// import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer      from '../../features/auth/authSlice';
import projectsReducer  from '../../features/projects/projectsSlice';
import tasksReducer     from '../../features/tasks/tasksSlice';
import usersReducer     from '../../features/users/usersSlice';
import dashboardReducer from '../../features/dashboard/dashboardSlice';

// ─── Build a fresh store for every test ──────────────────────────────────────
export const buildStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      auth:      authReducer,
      projects:  projectsReducer,
      tasks:     tasksReducer,
      users:     usersReducer,
      dashboard: dashboardReducer,
    },
    preloadedState,
  });

// ─── Default preloaded states ─────────────────────────────────────────────────
export const ADMIN_USER = {
  id: '1', name: 'Alice Admin', email: 'admin@ewms.com',
  role: 'admin', department: 'Management', status: 'active',
};

export const MANAGER_USER = {
  id: '2', name: 'Mark Manager', email: 'manager@ewms.com',
  role: 'manager', department: 'Engineering', status: 'active',
};

export const EMPLOYEE_USER = {
  id: '3', name: 'Eve Employee', email: 'employee@ewms.com',
  role: 'employee', department: 'Design', status: 'active',
};

export const authState = (user = ADMIN_USER) => ({
  auth: {
    user,
    token: `mock-token-${user.id}`,
    isAuthenticated: true,
    loading: false,
    error: null,
  },
});

export const MOCK_PROJECT = {
  id: 'p1', name: 'Apollo Redesign',
  description: 'Full redesign of the Apollo platform.',
  status: 'active', priority: 'high', progress: 72,
  startDate: '2025-05-01', dueDate: '2025-08-15',
  manager: { id: '2', name: 'Mark Manager' },
  members: [{ id: '1', name: 'Alice Admin' }],
  tags: ['design', 'frontend'], color: '#6366f1',
  taskCount: 18, completedTasks: 13,
  createdAt: '2025-05-01T09:00:00Z',
};

export const MOCK_TASK = {
  id: 't1', projectId: 'p1',
  title: 'Fix login redirect bug',
  description: 'Redirect fails on Safari.',
  type: 'bug', status: 'todo', priority: 'high',
  assignee: { id: '3', name: 'Eve Employee' },
  reporter: { id: '2', name: 'Mark Manager' },
  dueDate: '2025-07-30',
  tags: ['frontend', 'bug'],
  comments: [
    { id: 'c1', author: 'Mark Manager', text: 'Reproduced on iOS.', createdAt: '2025-07-01T10:00:00Z' },
  ],
  attachments: [],
  createdAt: '2025-06-01T09:00:00Z',
};

export const MOCK_USER = {
  id: 'u1', name: 'Sam Support', email: 'sam@ewms.com',
  role: 'employee', department: 'Operations', status: 'active',
  lastActive: new Date().toISOString(),
  joinedAt: '2024-04-05T09:00:00Z',
  tasksCompleted: 8, tasksAssigned: 10, projectsCount: 2, phone: '+91 99999 88888',
};

// ─── Custom render with all providers ────────────────────────────────────────
export const renderWithProviders = (
  ui,
  { preloadedState = {}, store = buildStore(preloadedState), ...options } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
      {/* <MemoryRouter>
  {children}
</MemoryRouter> */}
    </Provider>
  );


// const Wrapper = ({ children }) => (
//   <Provider store={store}>
//     <MemoryRouter initialEntries={['/']}>
//       {children}
//     </MemoryRouter>
//   </Provider>
// );
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
};

describe('testUtils', () => {
  it('exports renderWithProviders', () => {
    expect(typeof renderWithProviders).toBe('function');
  });
});