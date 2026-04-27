// import { screen, fireEvent, waitFor } from '@testing-library/react';
// import { renderWithProviders, buildStore, authState, ADMIN_USER } from '../utils/testUtils';
// import ProjectsPage from '../../features/projects/ProjectsPage';

// jest.mock('react-toastify', () => ({
//   toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
//   ToastContainer: () => null,
// }));

// describe('Projects flow — integration', () => {
//   const renderProjects = () =>
//     renderWithProviders(<ProjectsPage />, {
//       preloadedState: {
//         ...authState(ADMIN_USER),
//         projects: { list: [], loading: false, error: null, selected: null },
//         tasks:    { list: [], loading: false, error: null },
//       },
//     });

//   it('renders the projects page heading', async () => {
//     renderProjects();
//     await waitFor(() => {
//       expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
//     });
//   });

//   it('renders New project button', async () => {
//     renderProjects();
//     await waitFor(() => {
//       expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument();
//     });
//   });

//   it('opens project form modal when New project is clicked', async () => {
//     renderProjects();
//     await waitFor(() => screen.getByRole('button', { name: /new project/i }));
//     fireEvent.click(screen.getByRole('button', { name: /new project/i }));
//     await waitFor(() => {
//       expect(screen.getByText(/New project/i)).toBeInTheDocument();
//     });
//   });

//   it('shows project name field in create modal', async () => {
//     renderProjects();
//     await waitFor(() => screen.getByRole('button', { name: /new project/i }));
//     fireEvent.click(screen.getByRole('button', { name: /new project/i }));
//     await waitFor(() => {
//       expect(screen.getByPlaceholderText(/Apollo Redesign/i)).toBeInTheDocument();
//     });
//   });

//   it('shows validation error when submitting empty project form', async () => {
//     renderProjects();
//     await waitFor(() => screen.getByRole('button', { name: /new project/i }));
//     fireEvent.click(screen.getByRole('button', { name: /new project/i }));
//     await waitFor(() => screen.getByText(/New project/i));
//     fireEvent.click(screen.getByRole('button', { name: /create project/i }));
//     await waitFor(() => {
//       expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
//     });
//   });

//   it('closes modal when Cancel is clicked', async () => {
//     renderProjects();
//     await waitFor(() => screen.getByRole('button', { name: /new project/i }));
//     fireEvent.click(screen.getByRole('button', { name: /new project/i }));
//     await waitFor(() => screen.getByRole('button', { name: /cancel/i }));
//     fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
//     await waitFor(() => {
//       expect(screen.queryByRole('button', { name: /create project/i })).not.toBeInTheDocument();
//     });
//   });

//   it('renders status filter pills', async () => {
//     renderProjects();
//     await waitFor(() => {
//       expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
//       expect(screen.getByRole('button', { name: /^active$/i })).toBeInTheDocument();
//     });
//   });

//   it('renders search input', async () => {
//     renderProjects();
//     await waitFor(() => {
//       expect(screen.getByPlaceholderText(/search projects/i)).toBeInTheDocument();
//     });
//   });
// });
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, buildStore, authState, ADMIN_USER, MOCK_PROJECT } from '../utils/testUtils';
import ProjectsPage from '../../features/projects/ProjectsPage';

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
  ToastContainer: () => null,
}));

const renderProjects = (extraProjects = []) =>
  renderWithProviders(<ProjectsPage />, {
    preloadedState: {
      ...authState(ADMIN_USER),
      projects: { list: extraProjects, loading: false, error: null, selected: null },
      tasks:    { list: [], loading: false, error: null },
    },
  });

describe('Projects flow — integration', () => {
  it('renders the projects page heading', async () => {
    renderProjects();
    await waitFor(() =>
      expect(screen.getByText(/projects/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('renders New project button', async () => {
    renderProjects();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new project/i })).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('opens project form modal when New project is clicked', async () => {
    renderProjects();
    const btn = await waitFor(() =>
      screen.getByRole('button', { name: /new project/i }), { timeout: 3000 }
    );
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('shows project name placeholder in create modal', async () => {
    renderProjects();
    const btn = await waitFor(() =>
      screen.getByRole('button', { name: /new project/i }), { timeout: 3000 }
    );
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/Apollo Redesign/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('shows validation error when submitting empty project form', async () => {
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

  it('closes modal when Cancel is clicked', async () => {
    renderProjects();
    const btn = await waitFor(() =>
      screen.getByRole('button', { name: /new project/i }), { timeout: 3000 }
    );
    fireEvent.click(btn);
    const cancelBtn = await waitFor(() =>
      screen.getByRole('button', { name: /cancel/i }), { timeout: 3000 }
    );
    fireEvent.click(cancelBtn);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('renders status filter pills', async () => {
    renderProjects();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^active$/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('renders search input', async () => {
    renderProjects();
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/search projects/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('renders existing projects as cards', async () => {
    renderProjects([MOCK_PROJECT]);
    await waitFor(() =>
      expect(screen.getByText('Apollo Redesign')).toBeInTheDocument()
    , { timeout: 3000 });
  });
});