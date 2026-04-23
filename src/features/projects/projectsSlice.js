import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PROJECTS = [
  {
    id: 'p1', name: 'Apollo Redesign', description: 'Full redesign of the Apollo platform UI/UX with new design system.',
    status: 'active', priority: 'high', progress: 72,
    startDate: '2025-05-01', dueDate: '2025-08-15',
    manager: { id: '2', name: 'Mark Manager' },
    members: [{ id: '1', name: 'Alice Admin' }, { id: '2', name: 'Mark Manager' }, { id: '3', name: 'Eve Employee' }],
    tags: ['design', 'frontend'], color: '#6366f1', taskCount: 18, completedTasks: 13,
    createdAt: '2025-05-01T09:00:00Z',
  },
  {
    id: 'p2', name: 'Auth Refactor', description: 'Refactor authentication system to use JWT + refresh tokens.',
    status: 'active', priority: 'critical', progress: 45,
    startDate: '2025-06-01', dueDate: '2025-07-30',
    manager: { id: '2', name: 'Mark Manager' },
    members: [{ id: '2', name: 'Mark Manager' }, { id: '3', name: 'Eve Employee' }],
    tags: ['backend', 'security'], color: '#3b82f6', taskCount: 11, completedTasks: 5,
    createdAt: '2025-06-01T09:00:00Z',
  },
  {
    id: 'p3', name: 'Mobile App v2', description: 'Second major version of the mobile application with offline support.',
    status: 'active', priority: 'high', progress: 91,
    startDate: '2025-04-01', dueDate: '2025-07-10',
    manager: { id: '1', name: 'Alice Admin' },
    members: [{ id: '1', name: 'Alice Admin' }, { id: '3', name: 'Eve Employee' }],
    tags: ['mobile', 'react-native'], color: '#22c55e', taskCount: 24, completedTasks: 22,
    createdAt: '2025-04-01T09:00:00Z',
  },
  {
    id: 'p4', name: 'Data Pipeline', description: 'Build ETL pipeline for analytics data ingestion and transformation.',
    status: 'on_hold', priority: 'medium', progress: 20,
    startDate: '2025-07-01', dueDate: '2025-09-01',
    manager: { id: '2', name: 'Mark Manager' },
    members: [{ id: '2', name: 'Mark Manager' }],
    tags: ['backend', 'data'], color: '#f59e0b', taskCount: 9, completedTasks: 2,
    createdAt: '2025-07-01T09:00:00Z',
  },
  {
    id: 'p5', name: 'Marketing Portal', description: 'Internal portal for the marketing team to manage campaigns.',
    status: 'active', priority: 'low', progress: 60,
    startDate: '2025-05-15', dueDate: '2025-08-01',
    manager: { id: '3', name: 'Eve Employee' },
    members: [{ id: '3', name: 'Eve Employee' }],
    tags: ['frontend', 'cms'], color: '#ec4899', taskCount: 6, completedTasks: 4,
    createdAt: '2025-05-15T09:00:00Z',
  },
];

// ─── Thunks (mock async) ──────────────────────────────────────────────────────
export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  await new Promise((r) => setTimeout(r, 500));
  return MOCK_PROJECTS;
});

export const createProject = createAsyncThunk('projects/create', async (data) => {
  await new Promise((r) => setTimeout(r, 400));
  return {
    ...data,
    id: `p${Date.now()}`,
    progress: 0,
    taskCount: 0,
    completedTasks: 0,
    createdAt: new Date().toISOString(),
  };
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, changes }) => {
  await new Promise((r) => setTimeout(r, 300));
  return { id, changes };
});

export const deleteProject = createAsyncThunk('projects/delete', async (id) => {
  await new Promise((r) => setTimeout(r, 300));
  return id;
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const projectsSlice = createSlice({
  name: 'projects',
  initialState: { list: [], loading: false, error: null, selected: null },
  reducers: {
    setSelected(state, action) { state.selected = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchProjects.rejected,  (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(createProject.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(updateProject.fulfilled, (s, a) => {
        const idx = s.list.findIndex((p) => p.id === a.payload.id);
        if (idx !== -1) s.list[idx] = { ...s.list[idx], ...a.payload.changes };
      })
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.list = s.list.filter((p) => p.id !== a.payload);
      });
  },
});

export const { setSelected } = projectsSlice.actions;
export default projectsSlice.reducer;