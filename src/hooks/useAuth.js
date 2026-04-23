import { useSelector, useDispatch } from 'react-redux';
import { logout, clearError } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => dispatch(logout());
  const handleClearError = () => dispatch(clearError());

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isEmployee = !!user;

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isAdmin,
    isManager,
    isEmployee,
    logout: handleLogout,
    clearError: handleClearError,
  };
};