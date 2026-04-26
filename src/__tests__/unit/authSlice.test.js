import { configureStore } from '@reduxjs/toolkit';
import authReducer, { logout, clearError } from '../../features/auth/authSlice';

const buildAuthStore = (preloaded = {}) =>
  configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { user: null, token: null, isAuthenticated: false, loading: false, error: null, ...preloaded } },
  });

describe('authSlice reducers', () => {
  it('returns correct initial state shape', () => {
    const store = buildAuthStore();
    const state = store.getState().auth;
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('token');
    expect(state).toHaveProperty('isAuthenticated');
    expect(state).toHaveProperty('loading');
    expect(state).toHaveProperty('error');
  });

  it('logout clears user, token and isAuthenticated', () => {
    const store = buildAuthStore({
      user: { id: '1', name: 'Alice' },
      token: 'mock-token',
      isAuthenticated: true,
    });
    store.dispatch(logout());
    const state = store.getState().auth;
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('clearError sets error to null', () => {
    const store = buildAuthStore({ error: 'Invalid credentials' });
    store.dispatch(clearError());
    expect(store.getState().auth.error).toBeNull();
  });

  it('isAuthenticated is false by default', () => {
    const store = buildAuthStore();
    expect(store.getState().auth.isAuthenticated).toBe(false);
  });

  it('loading is false by default', () => {
    const store = buildAuthStore();
    expect(store.getState().auth.loading).toBe(false);
  });
});