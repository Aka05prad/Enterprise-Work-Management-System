/**
 * INTEGRATION TEST: Full user flow
 * Login → Project creation → Task assignment
 */
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, buildStore, authState, ADMIN_USER, MOCK_PROJECT, MOCK_TASK } from '../utils/testUtils';
import LoginPage from '../../features/auth/LoginPage';
import ProjectsPage from '../../features/projects/ProjectsPage';
import TasksPage from '../../features/tasks/TasksPage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() },
  ToastContainer: () => null,
}));

// ── Step 1: Login ─────────────────────────────────────────────────────────────
describe('Step 1 — Login flow', () => {
  let store;
  beforeEach(() => {
    store = buildStore();
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('1a. Login page renders key elements', () => {
    renderWithProviders(<LoginPage />, { store });
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@company\.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('1b. Empty form shows email validation error', async () => {
    renderWithProviders(<LoginPage />, { store });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() =>
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('1c. Invalid email shows format error', async () => {
    renderWithProviders(<LoginPage />, { store });
    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: 'not-an-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() =>
      expect(screen.getByText(/valid email/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('1d. Demo admin button triggers login thunk', async () => {
    renderWithProviders(<LoginPage />, { store });
    fireEvent.click(screen.getByRole('button', { name: /admin/i }));
    await waitFor(() =>
      expect(store.getState().auth.isAuthenticated).toBe(true)
    , { timeout: 3000 });
    expect(store.getState().auth.user.role).toBe('admin');
  });

  it('1e. Demo manager button triggers login thunk', async () => {
    renderWithProviders(<LoginPage />, { store });
    fireEvent.click(screen.getByRole('button', { name: /manager/i }));
    await waitFor(() =>
      expect(store.getState().auth.isAuthenticated).toBe(true)
    , { timeout: 3000 });
    expect(store.getState().auth.user.role).toBe('manager');
  });

  it('1f. Demo employee button triggers login thunk', async () => {
    renderWithProviders(<LoginPage />, { store });
    fireEvent.click(screen.getByRole('button', { name: /employee/i }));
    await waitFor(() =>
      expect(store.getState().auth.isAuthenticated).toBe(true)
    , { timeout: 3000 });
    expect(store.getState().auth.user.role).toBe('employee');
  });

  it('1g. Full credential login sets user in store', async () => {
    renderWithProviders(<LoginPage />, { store });
    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: 'admin@ewms.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() =>
      expect(store.getState().auth.isAuthenticated).toBe(true)
    , { timeout: 3000 });
    expect(store.getState().auth.user.email).toBe('admin@ewms.com');
  });
});

// ── Step 2: Project creation ───────────────────────────────────────────────────
describe('Step 2 — Project creation flow', () => {
  const renderProjects = (projects = []) =>
    renderWithProviders(<ProjectsPage />, {
      preloadedState: {
        ...authState(ADMIN_USER),
        projects: { list: projects, loading: false, error: null, selected: null },
        tasks:    { list: [], loading: false, error: null },
      },
    });

  it('2a. Projects page renders after login', async () => {
    renderProjects();
    await waitFor(() =>
      expect(screen.getByText(/projects/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('2b. New project button is visible', async () => {
    renderProjects();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('2c. New project modal opens on click', async () => {
    renderProjects();
    const btn = await waitFor(() =>
      screen.getByRole('button', { name: /new project/i }), { timeout: 3000 }
    );
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('2d. Empty project form shows validation', async () => {
    renderProjects();
    const btn = await waitFor(() =>
      screen.getByRole('button', { name: /new project/i }), { timeout: 3000 }
    );
    fireEvent.click(btn);
    const submitBtn = await waitFor(() =>
      screen.getByRole('button', { name: /create project/i }), { timeout: 3000 }
    );
    fireEvent.click(submitBtn);
    await waitFor(() =>
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('2e. Existing projects render as cards', async () => {
    renderProjects([MOCK_PROJECT]);
    await waitFor(() =>
      expect(screen.getByText('Apollo Redesign')).toBeInTheDocument()
    , { timeout: 3000 });
  });
});

// ── Step 3: Task assignment ────────────────────────────────────────────────────
describe('Step 3 — Task assignment flow', () => {
  const renderTasks = () =>
    renderWithProviders(<TasksPage />, {
      preloadedState: {
        ...authState(ADMIN_USER),
        tasks:    { list: [MOCK_TASK], loading: false, error: null },
        projects: { list: [MOCK_PROJECT], loading: false, error: null, selected: null },
      },
    });

  it('3a. Tasks page renders with existing task', async () => {
    renderTasks();
    await waitFor(() =>
      expect(screen.getByText('Fix login redirect bug')).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('3b. New task button is visible', async () => {
    renderTasks();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('3c. New task modal opens on click', async () => {
    renderTasks();
    const btn = await waitFor(() =>
      screen.getByRole('button', { name: /new task/i }), { timeout: 3000 }
    );
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('3d. Empty task form shows title validation', async () => {
    renderTasks();
    const btn = await waitFor(() =>
      screen.getByRole('button', { name: /new task/i }), { timeout: 3000 }
    );
    fireEvent.click(btn);
    const submitBtn = await waitFor(() =>
      screen.getByRole('button', { name: /create task/i }), { timeout: 3000 }
    );
    fireEvent.click(submitBtn);
    await waitFor(() =>
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('3e. Filtering hides non-matching tasks', async () => {
    renderTasks();
    await waitFor(() => screen.getByText('Fix login redirect bug'), { timeout: 3000 });
    fireEvent.change(screen.getByPlaceholderText(/search tasks/i), {
      target: { value: 'zzznomatch' },
    });
    await waitFor(() =>
      expect(screen.queryByText('Fix login redirect bug')).not.toBeInTheDocument()
    , { timeout: 3000 });
  });
});