import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: '1', name: 'Alice Admin', email: 'admin@ewms.com', role: 'admin',
    department: 'Management', status: 'active', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    joinedAt: '2024-01-10T09:00:00Z',
    tasksCompleted: 34, tasksAssigned: 40, projectsCount: 5,
    phone: '+91 98765 43210',
  },
  {
    id: '2', name: 'Mark Manager', email: 'manager@ewms.com', role: 'manager',
    department: 'Engineering', status: 'active', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    joinedAt: '2024-02-14T09:00:00Z',
    tasksCompleted: 28, tasksAssigned: 35, projectsCount: 4,
    phone: '+91 91234 56789',
  },
  {
    id: '3', name: 'Eve Employee', email: 'employee@ewms.com', role: 'employee',
    department: 'Design', status: 'active', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    joinedAt: '2024-03-20T09:00:00Z',
    tasksCompleted: 19, tasksAssigned: 22, projectsCount: 3,
    phone: '+91 99887 76655',
  },
  {
    id: '4', name: 'Sam Support', email: 'sam@ewms.com', role: 'employee',
    department: 'Operations', status: 'inactive', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    joinedAt: '2024-04-05T09:00:00Z',
    tasksCompleted: 8, tasksAssigned: 10, projectsCount: 2,
    phone: '+91 88776 65544',
  },
  {
    id: '5', name: 'Priya Product', email: 'priya@ewms.com', role: 'manager',
    department: 'Product', status: 'active', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    joinedAt: '2024-05-11T09:00:00Z',
    tasksCompleted: 22, tasksAssigned: 27, projectsCount: 3,
    phone: '+91 77665 54433',
  },
  {
    id: '6', name: 'Raj DevOps', email: 'raj@ewms.com', role: 'employee',
    department: 'Engineering', status: 'active', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    joinedAt: '2024-06-01T09:00:00Z',
    tasksCompleted: 15, tasksAssigned: 18, projectsCount: 2,
    phone: '+91 66554 43322',
  },
  {
    id: '7', name: 'Nina HR', email: 'nina@ewms.com', role: 'employee',
    department: 'HR', status: 'suspended', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    joinedAt: '2024-07-15T09:00:00Z',
    tasksCompleted: 5, tasksAssigned: 8, projectsCount: 1,
    phone: '+91 55443 32211',
  },
  {
    id: '8', name: 'Leo Finance', email: 'leo@ewms.com', role: 'employee',
    department: 'Finance', status: 'active', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    joinedAt: '2024-08-20T09:00:00Z',
    tasksCompleted: 11, tasksAssigned: 14, projectsCount: 2,
    phone: '+91 44332 21100',
  },
  {
    id: '9', name: 'Zara Marketing', email: 'zara@ewms.com', role: 'employee',
    department: 'Marketing', status: 'active', avatar: null,
    lastActive: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    joinedAt: '2024-09-10T09:00:00Z',
    tasksCompleted: 17, tasksAssigned: 20, projectsCount: 2,
    phone: '+91 33221 10099',
  },
];

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  await new Promise((r) => setTimeout(r, 500));
  return MOCK_USERS;
});

export const createUser = createAsyncThunk('users/create', async (data) => {
  await new Promise((r) => setTimeout(r, 400));
  return {
    ...data,
    id: `u${Date.now()}`,
    avatar: null,
    lastActive: new Date().toISOString(),
    joinedAt: new Date().toISOString(),
    tasksCompleted: 0,
    tasksAssigned: 0,
    projectsCount: 0,
  };
});

export const updateUser = createAsyncThunk('users/update', async ({ id, changes }) => {
  await new Promise((r) => setTimeout(r, 300));
  return { id, changes };
});

export const deleteUser = createAsyncThunk('users/delete', async (id) => {
  await new Promise((r) => setTimeout(r, 300));
  return id;
});

export const changeUserStatus = createAsyncThunk('users/changeStatus', async ({ id, status }) => {
  await new Promise((r) => setTimeout(r, 200));
  return { id, status };
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchUsers.rejected,  (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(createUser.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(updateUser.fulfilled, (s, a) => {
        const i = s.list.findIndex((u) => u.id === a.payload.id);
        if (i !== -1) s.list[i] = { ...s.list[i], ...a.payload.changes };
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.list = s.list.filter((u) => u.id !== a.payload);
      })
      .addCase(changeUserStatus.fulfilled, (s, a) => {
        const u = s.list.find((u) => u.id === a.payload.id);
        if (u) u.status = a.payload.status;
      });
  },
});

export default usersSlice.reducer;