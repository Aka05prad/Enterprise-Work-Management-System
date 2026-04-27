import { screen, fireEvent, waitFor, render } from '@testing-library/react';
import { renderWithProviders, authState, ADMIN_USER, MOCK_TASK, MOCK_PROJECT } from '../utils/testUtils';
import TasksPage from '../../features/tasks/TasksPage';
import TaskCard  from '../../features/tasks/TaskCard';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { buildStore } from '../utils/testUtils';

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
  ToastContainer: () => null,
}));

const renderTasks = (tasks = [MOCK_TASK]) =>
  renderWithProviders(<TasksPage />, {
    preloadedState: {
      ...authState(ADMIN_USER),
      tasks:    { list: tasks, loading: false, error: null },
      projects: { list: [MOCK_PROJECT], loading: false, error: null, selected: null },
    },
  });

describe('Tasks flow — integration', () => {
  it('renders the tasks page heading', async () => {
    renderTasks();
    await waitFor(() =>
      expect(screen.getByText(/all tasks/i)).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('renders New task button', async () => {
    renderTasks();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /new task/i })).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('renders existing task card from preloaded state', async () => {
    renderTasks();
    await waitFor(() =>
      expect(screen.getByText('Fix login redirect bug')).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('renders status filter pills', async () => {
    renderTasks();
    await waitFor(() =>
      // expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^all$/i })[0]).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('renders type filter pills', async () => {
    renderTasks();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^bug$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^feature$/i })).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('filters tasks when search term does not match', async () => {
    renderTasks();
    await waitFor(() => screen.getByText('Fix login redirect bug'), { timeout: 3000 });
    fireEvent.change(screen.getByPlaceholderText(/search tasks/i), {
      target: { value: 'xyznonexistent' },
    });
    await waitFor(() =>
      expect(screen.queryByText('Fix login redirect bug')).not.toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('opens task form modal when New task is clicked', async () => {
    renderTasks();
    const btn = await waitFor(() =>
      screen.getByRole('button', { name: /new task/i }), { timeout: 3000 }
    );
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    , { timeout: 3000 });
  });

  it('shows task title validation error on empty submit', async () => {
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
});

describe('TaskCard — isolated render tests', () => {
  const wrap = (ui) => render(
    <Provider store={buildStore(authState(ADMIN_USER))}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );

  it('renders correctly with full mock task', () => {
    wrap(<TaskCard task={MOCK_TASK} onClick={() => {}} />);
    expect(screen.getByText('Fix login redirect bug')).toBeInTheDocument();
  });

  it('shows overdue styling for past due tasks', () => {
    const overdue = { ...MOCK_TASK, dueDate: '2020-01-01', status: 'todo' };
    const { container } = wrap(<TaskCard task={overdue} onClick={() => {}} />);
    expect(container.querySelector('.text-red-500')).toBeInTheDocument();
  });
});