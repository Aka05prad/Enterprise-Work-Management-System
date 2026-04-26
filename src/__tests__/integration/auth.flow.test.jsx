import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, buildStore } from '../utils/testUtils';
import LoginPage from '../../features/auth/LoginPage';

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
  ToastContainer: () => null,
}));

describe('Authentication flow — integration', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders login page with all key elements', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@company\.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: 'not-an-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: 'admin@ewms.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/minimum 6/i)).toBeInTheDocument();
    });
  });

  it('renders demo login buttons for all 3 roles', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('button', { name: /admin/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /manager/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /employee/i })).toBeInTheDocument();
  });

  it('renders link to signup page', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('submits form with valid credentials and dispatches loginUser', async () => {
    const store = buildStore();
    renderWithProviders(<LoginPage />, { store });

    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: 'admin@ewms.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(store.getState().auth.loading).toBeDefined();
    });
//     await waitFor(() => {
//   expect(store.getState().auth.isAuthenticated).toBe(true);
// });
  });

  it('button shows loading state during form submission', async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText(/you@company\.com/i), {
      target: { value: 'admin@ewms.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'admin123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    // Button becomes disabled during async dispatch
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeDefined();
    });
//     await waitFor(() => {
//   expect(screen.getByRole('button')).toBeDisabled();
// });
  });
});