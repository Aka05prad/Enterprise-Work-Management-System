import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { TOKEN_KEY, USER_KEY } from '../../utils/constants';

// ─── Mock data (remove when real backend is ready) ───────────────────────────
const MOCK_USERS = [
  {
    id: '1',
    name: 'Alice Admin',
    email: 'admin@ewms.com',
    password: 'admin123',
    role: 'admin',
    avatar: null,
    department: 'Management',
    lastActive: new Date().toISOString(),
    status: 'active',
  },
  {
    id: '2',
    name: 'Mark Manager',
    email: 'manager@ewms.com',
    password: 'manager123',
    role: 'manager',
    avatar: null,
    department: 'Engineering',
    lastActive: new Date().toISOString(),
    status: 'active',
  },
  {
    id: '3',
    name: 'Eve Employee',
    email: 'employee@ewms.com',
    password: 'employee123',
    role: 'employee',
    avatar: null,
    department: 'Design',
    lastActive: new Date().toISOString(),
    status: 'active',
  },
];

const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        const { password: _, ...safeUser } = user;
        resolve({
          user: safeUser,
          token: `mock-jwt-token-${safeUser.id}-${Date.now()}`,
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
};

const mockSignup = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exists = MOCK_USERS.find((u) => u.email === data.email);
      if (exists) {
        reject(new Error('Email already registered'));
      } else {
        const newUser = {
          id: String(MOCK_USERS.length + 1),
          name: data.name,
          email: data.email,
          role: 'employee',
          avatar: null,
          department: data.department || 'General',
          lastActive: new Date().toISOString(),
          status: 'active',
        };
        MOCK_USERS.push({ ...newUser, password: data.password });
        resolve({
          user: newUser,
          token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
        });
      }
    }, 800);
  });
};
// ─────────────────────────────────────────────────────────────────────────────

// ─── Thunks ──────────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Swap mockLogin for real API call when backend is ready:
      // const { data } = await axiosInstance.post('/auth/login', { email, password });
      const data = await mockLogin(email, password);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      // const { data } = await axiosInstance.post('/auth/signup', formData);
      const data = await mockSignup(formData);
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Signup failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // const { data } = await axiosInstance.put('/auth/profile', profileData);
      // Mock update
      const currentUser = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
      const updated = { ...currentUser, ...profileData };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || 'Update failed');
    }
  }
);
// ─────────────────────────────────────────────────────────────────────────────

// ─── Slice ───────────────────────────────────────────────────────────────────
const savedUser = localStorage.getItem(USER_KEY);
const savedToken = localStorage.getItem(TOKEN_KEY);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update profile
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;