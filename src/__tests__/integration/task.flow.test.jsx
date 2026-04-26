import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, authState, ADMIN_USER, MOCK_TASK, MOCK_PROJECT } from '../utils/testUtils';
import TasksPage from '../../features/tasks/TasksPage';
import TaskCard  from '../../features/tasks/TaskCard';

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
  ToastContainer: () => null,
}));

describe('Tasks flow — integration', () => {
  const renderTasks = (extraState = {}) =>
    renderWithProviders(<TasksPage />, {
      preloadedState: {
        ...authState(ADMIN_USER),
        tasks:    { list: [MOCK_TASK], loading: false, error: null },
        projects: { list: [MOCK_PROJECT], loading: false, error: null, selected: null },
        ...extraState,
      },
    });

  it('renders the tasks page heading', async () => {
    renderTasks();
    await waitFor(() => {
      expect(screen.getByText(/all tasks/i)).toBeInTheDocument();
    });
  });

  it('renders New task button', async () => {
    renderTasks();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument();
    });
  });

  it('renders existing task card from preloaded state', async () => {
    renderTasks();
    await waitFor(() => {
      expect(screen.getByText('Fix login redirect bug')).toBeInTheDocument();
    });
  });

  it('renders status filter pills', async () => {
    renderTasks();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument();
    });
  });

  it('renders type filter pills', async () => {
    renderTasks();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^bug$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^feature$/i })).toBeInTheDocument();
    });
  });

  it('filters tasks by search query', async () => {
    renderTasks();
    await waitFor(() => screen.getByText('Fix login redirect bug'));
    fireEvent.change(screen.getByPlaceholderText(/search tasks/i), {
      target: { value: 'nonexistent task xyz' },
    });
    await waitFor(() => {
      expect(screen.queryByText('Fix login redirect bug')).not.toBeInTheDocument();
    });
  });

  it('opens task form modal when New task is clicked', async () => {
    renderTasks();
    await waitFor(() => screen.getByRole('button', { name: /new task/i }));
    fireEvent.click(screen.getByRole('button', { name: /new task/i }));
    await waitFor(() => {
      expect(screen.getByText(/New task/i)).toBeInTheDocument();
    });
  });

  it('shows task validation error on empty submit', async () => {
    renderTasks();
    await waitFor(() => screen.getByRole('button', { name: /new task/i }));
    fireEvent.click(screen.getByRole('button', { name: /new task/i }));
    await waitFor(() => screen.getByRole('button', { name: /create task/i }));
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });
});

describe('TaskCard — isolated render tests', () => {
  it('renders correctly with full mock task', () => {
    render(<TaskCard task={MOCK_TASK} onClick={() => {}} />);
    expect(screen.getByText('Fix login redirect bug')).toBeInTheDocument();
  });

  it('shows overdue styling for past due tasks', () => {
    const overdue = { ...MOCK_TASK, dueDate: '2020-01-01', status: 'todo' };
    const { container } = render(<TaskCard task={overdue} onClick={() => {}} />);
    expect(container.querySelector('.text-red-500')).toBeInTheDocument();
  });
});

function render(ui, options) {
  return renderWithProviders(ui, options);
}