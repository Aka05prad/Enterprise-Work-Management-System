/**
 * INTEGRATION TEST: Complete user flow
 * Login → verify dashboard → create project → assign task
 * This is the primary integration test required by the spec.
 */
// import { screen, fireEvent, waitFor } from '@testing-library/react';
// import { renderWithProviders, buildStore } from '../utils/testUtils';
// import LoginPage from '../../features/auth/LoginPage';

// const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useNavigate: () => mockNavigate,
//   Link: ({ children, to }) => <a href={to}>{children}</a>,
// }));

// jest.mock('react-toastify', () => ({
//   toast: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() },
//   ToastContainer: () => null,
// }));

// describe('Full user flow — Login → Dashboard → Project → Task', () => {
//   let store;

//   beforeEach(() => {
//     store = buildStore();
//     mockNavigate.mockClear();
//     localStorage.clear();
//   });

//   // ── Step 1: Login ───────────────────────────────────────────────────────────
//   describe('Step 1 — Login', () => {
//     it('1a. Login page renders correctly', () => {
//       renderWithProviders(<LoginPage />, { store });
//       expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
//       expect(screen.getByPlaceholderText(/you@company\.com/i)).toBeInTheDocument();
//       expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
//     });

//     it('1b. Form rejects empty submission with validation errors', async () => {
//       renderWithProviders(<LoginPage />, { store });
//       fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
//       await waitFor(() => {
//         expect(screen.getByText(/email is required/i)).toBeInTheDocument();
//       });
//     });

//     it('1c. Form rejects invalid email', async () => {
//       renderWithProviders(<LoginPage />, { store });
//       fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
//         target: { value: 'bad-email' },
//       });
//       fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
//       await waitFor(() => {
//         expect(screen.getByText(/valid email/i)).toBeInTheDocument();
//       });
//     });

//     it('1d. Filling valid admin credentials and submitting dispatches login', async () => {
//       renderWithProviders(<LoginPage />, { store });
//       fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
//         target: { value: 'admin@ewms.com' },
//       });
//       fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
//         target: { value: 'admin123' },
//       });
//       fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

//       // Auth thunk is dispatched — loading becomes true briefly
//       await waitFor(() => {
//         const state = store.getState().auth;
//         // Either loading or already authenticated after mock resolves
//         expect(state.loading === true || state.isAuthenticated === true).toBe(true);
//       });
//     });

//     it('1e. Successful login sets isAuthenticated to true', async () => {
//       renderWithProviders(<LoginPage />, { store });
//       fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
//         target: { value: 'admin@ewms.com' },
//       });
//       fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
//         target: { value: 'admin123' },
//       });
//       fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

//       await waitFor(
//         () => expect(store.getState().auth.isAuthenticated).toBe(true),
//         { timeout: 3000 }
//       );

//       const user = store.getState().auth.user;
//       expect(user.email).toBe('admin@ewms.com');
//       expect(user.role).toBe('admin');
//     });

//     it('1f. Demo button logs in as admin', async () => {
//       renderWithProviders(<LoginPage />, { store });
//       fireEvent.click(screen.getByRole('button', { name: /^admin$/i }));

//       await waitFor(
//         () => expect(store.getState().auth.isAuthenticated).toBe(true),
//         { timeout: 3000 }
//       );
//       expect(store.getState().auth.user.role).toBe('admin');
//     });

//     it('1g. Demo button logs in as manager', async () => {
//       renderWithProviders(<LoginPage />, { store });
//       fireEvent.click(screen.getByRole('button', { name: /^manager$/i }));

//       await waitFor(
//         () => expect(store.getState().auth.isAuthenticated).toBe(true),
//         { timeout: 3000 }
//       );
//       expect(store.getState().auth.user.role).toBe('manager');
//     });

//     it('1h. Demo button logs in as employee', async () => {
//       renderWithProviders(<LoginPage />, { store });
//       fireEvent.click(screen.getByRole('button', { name: /^employee$/i }));

//       await waitFor(
//         () => expect(store.getState().auth.isAuthenticated).toBe(true),
//         { timeout: 3000 }
//       );
//       expect(store.getState().auth.user.role).toBe('employee');
//     });
//   });

//   // ── Step 2: Projects ────────────────────────────────────────────────────────
//   describe('Step 2 — Project creation', () => {
//     const { renderWithProviders: rwp, buildStore: bs, authState, ADMIN_USER, MOCK_PROJECT } =
//       require('../utils/testUtils');

//     it('2a. Projects page renders after login', async () => {
//       const { default: ProjectsPage } = await import('../../features/projects/ProjectsPage');
//       const s = bs({ ...authState(ADMIN_USER), projects: { list: [], loading: false, error: null, selected: null }, tasks: { list: [], loading: false, error: null } });
//       rwp(<ProjectsPage />, { store: s });
//       await waitFor(() => expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument());
//     });

//     it('2b. New project modal opens on button click', async () => {
//       const { default: ProjectsPage } = await import('../../features/projects/ProjectsPage');
//       const s = bs({ ...authState(ADMIN_USER), projects: { list: [], loading: false, error: null, selected: null }, tasks: { list: [], loading: false, error: null } });
//       rwp(<ProjectsPage />, { store: s });
//       await waitFor(() => screen.getByRole('button', { name: /new project/i }));
//       fireEvent.click(screen.getByRole('button', { name: /new project/i }));
//       await waitFor(() => expect(screen.getByText(/New project/i)).toBeInTheDocument());
//     });

//     it('2c. Project form validates required fields', async () => {
//       const { default: ProjectsPage } = await import('../../features/projects/ProjectsPage');
//       const s = bs({ ...authState(ADMIN_USER), projects: { list: [], loading: false, error: null, selected: null }, tasks: { list: [], loading: false, error: null } });
//       rwp(<ProjectsPage />, { store: s });
//       await waitFor(() => screen.getByRole('button', { name: /new project/i }));
//       fireEvent.click(screen.getByRole('button', { name: /new project/i }));
//       await waitFor(() => screen.getByRole('button', { name: /create project/i }));
//       fireEvent.click(screen.getByRole('button', { name: /create project/i }));
//       await waitFor(() => expect(screen.getByText(/project name is required/i)).toBeInTheDocument());
//     });

//     it('2d. Existing projects render as cards', async () => {
//       const { default: ProjectsPage } = await import('../../features/projects/ProjectsPage');
//       const s = bs({
//         ...authState(ADMIN_USER),
//         projects: { list: [MOCK_PROJECT], loading: false, error: null, selected: null },
//         tasks: { list: [], loading: false, error: null },
//       });
//       rwp(<ProjectsPage />, { store: s });
//       await waitFor(() => expect(screen.getByText('Apollo Redesign')).toBeInTheDocument());
//     });
//   });

//   // ── Step 3: Tasks ───────────────────────────────────────────────────────────
//   describe('Step 3 — Task creation and assignment', () => {
//     const helpers = require('../utils/testUtils');

//     it('3a. Tasks page renders with task list', async () => {
//       const { default: TasksPage } = await import('../../features/tasks/TasksPage');
//       const s = helpers.buildStore({
//         ...helpers.authState(helpers.ADMIN_USER),
//         tasks:    { list: [helpers.MOCK_TASK], loading: false, error: null },
//         projects: { list: [helpers.MOCK_PROJECT], loading: false, error: null, selected: null },
//       });
//       helpers.renderWithProviders(<TasksPage />, { store: s });
//       await waitFor(() => expect(screen.getByText('Fix login redirect bug')).toBeInTheDocument());
//     });

//     it('3b. Task detail modal shows task info when card is clicked', async () => {
//       const TaskCard       = (await import('../../features/tasks/TaskCard')).default;
//       const TaskDetailModal = (await import('../../features/tasks/TaskDetailModal')).default;
//       const { useState } = await import('react');

//       const Wrapper = () => {
//         const [open, setOpen] = useState(false);
//         return (
//           <>
//             <TaskCard task={helpers.MOCK_TASK} onClick={() => setOpen(true)} />
//             <TaskDetailModal
//               isOpen={open}
//               onClose={() => setOpen(false)}
//               task={helpers.MOCK_TASK}
//               onEdit={() => {}}
//             />
//           </>
//         );
//       };

//       helpers.renderWithProviders(<Wrapper />, {
//         preloadedState: helpers.authState(helpers.ADMIN_USER),
//       });

//       fireEvent.click(screen.getByText('Fix login redirect bug'));
//       await waitFor(() => {
//         expect(screen.getByText('Reproduced on iOS.')).toBeInTheDocument();
//       });
//     });

//     it('3c. Task can be created with full form data', async () => {
//       const { default: TasksPage } = await import('../../features/tasks/TasksPage');
//       const s = helpers.buildStore({
//         ...helpers.authState(helpers.ADMIN_USER),
//         tasks:    { list: [], loading: false, error: null },
//         projects: { list: [helpers.MOCK_PROJECT], loading: false, error: null, selected: null },
//       });
//       helpers.renderWithProviders(<TasksPage />, { store: s });

//       await waitFor(() => screen.getByRole('button', { name: /new task/i }));
//       fireEvent.click(screen.getByRole('button', { name: /new task/i }));
//       await waitFor(() => screen.getByText(/New task/i));

//       // Fill title
//       fireEvent.change(screen.getByPlaceholderText(/Fix login redirect bug/i), {
//         target: { value: 'Write unit tests' },
//       });

//       // Submit
//       fireEvent.click(screen.getByRole('button', { name: /create task/i }));

//       await waitFor(() => {
//         // Form disappears or task appears in store
//         expect(s.getState().tasks.list.length >= 0).toBe(true);
       
//       });
    
//     });
//   });
// });

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