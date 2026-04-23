import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_TASKS = [
  // Apollo Redesign (p1)
  { id: 't1',  projectId: 'p1', title: 'Design new color system',     description: 'Define primary, secondary, accent palette with dark mode variants.', type: 'feature',     status: 'done',        priority: 'high',     assignee: { id: '3', name: 'Eve Employee'  }, reporter: { id: '2', name: 'Mark Manager' }, dueDate: '2025-07-10', tags: ['design'],    comments: [{ id: 'c1', author: 'Mark Manager', text: 'Looking great! Ship it.', createdAt: '2025-07-01T10:00:00Z' }], createdAt: '2025-05-10T09:00:00Z', attachments: [] },
  { id: 't2',  projectId: 'p1', title: 'Rebuild navigation component', description: 'Responsive sidebar + topbar with role-based visibility.', type: 'improvement', status: 'done',        priority: 'high',     assignee: { id: '3', name: 'Eve Employee'  }, reporter: { id: '2', name: 'Mark Manager' }, dueDate: '2025-07-15', tags: ['frontend'],  comments: [], createdAt: '2025-05-12T09:00:00Z', attachments: [] },
  { id: 't3',  projectId: 'p1', title: 'Fix modal backdrop z-index',   description: 'Modals appear behind sidebar on mobile screens.', type: 'bug',         status: 'in_review',   priority: 'medium',   assignee: { id: '3', name: 'Eve Employee'  }, reporter: { id: '1', name: 'Alice Admin'  }, dueDate: '2025-07-22', tags: ['bug'],       comments: [{ id: 'c2', author: 'Alice Admin', text: 'Reproduced on Safari too.', createdAt: '2025-07-05T14:00:00Z' }], createdAt: '2025-06-01T09:00:00Z', attachments: [] },
  { id: 't4',  projectId: 'p1', title: 'Dashboard metrics redesign',   description: 'New card layout with trend indicators and sparklines.', type: 'feature',     status: 'in_progress', priority: 'high',     assignee: { id: '3', name: 'Eve Employee'  }, reporter: { id: '2', name: 'Mark Manager' }, dueDate: '2025-08-01', tags: ['design'],    comments: [], createdAt: '2025-06-15T09:00:00Z', attachments: [] },
  { id: 't5',  projectId: 'p1', title: 'Write component storybook',    description: 'Document all reusable UI components with examples.',     type: 'improvement', status: 'todo',        priority: 'low',      assignee: { id: '3', name: 'Eve Employee'  }, reporter: { id: '2', name: 'Mark Manager' }, dueDate: '2025-08-10', tags: ['docs'],      comments: [], createdAt: '2025-06-20T09:00:00Z', attachments: [] },

  // Auth Refactor (p2)
  { id: 't6',  projectId: 'p2', title: 'JWT refresh token endpoint',   description: 'POST /auth/refresh — validate refresh token, issue new access token.', type: 'feature',     status: 'done',        priority: 'critical', assignee: { id: '2', name: 'Mark Manager'  }, reporter: { id: '1', name: 'Alice Admin'  }, dueDate: '2025-07-05', tags: ['backend'],   comments: [], createdAt: '2025-06-05T09:00:00Z', attachments: [] },
  { id: 't7',  projectId: 'p2', title: 'Blacklist revoked tokens',      description: 'Redis-based token blacklist for instant revocation on logout.', type: 'feature',     status: 'in_progress', priority: 'critical', assignee: { id: '2', name: 'Mark Manager'  }, reporter: { id: '1', name: 'Alice Admin'  }, dueDate: '2025-07-18', tags: ['backend'],   comments: [{ id: 'c3', author: 'Alice Admin', text: 'Use TTL equal to token expiry.', createdAt: '2025-07-10T09:00:00Z' }], createdAt: '2025-06-10T09:00:00Z', attachments: [] },
  { id: 't8',  projectId: 'p2', title: 'Rate limit login endpoint',     description: 'Max 5 failed attempts per IP per 15 minutes.', type: 'improvement', status: 'todo',        priority: 'high',     assignee: { id: '3', name: 'Eve Employee'  }, reporter: { id: '2', name: 'Mark Manager' }, dueDate: '2025-07-25', tags: ['security'],  comments: [], createdAt: '2025-06-15T09:00:00Z', attachments: [] },

  // Mobile App v2 (p3)
  { id: 't9',  projectId: 'p3', title: 'Offline mode with sync queue', description: 'Queue mutations locally, sync on reconnect.', type: 'feature',     status: 'done',        priority: 'critical', assignee: { id: '3', name: 'Eve Employee'  }, reporter: { id: '1', name: 'Alice Admin'  }, dueDate: '2025-06-30', tags: ['mobile'],    comments: [], createdAt: '2025-04-10T09:00:00Z', attachments: [] },
  { id: 't10', projectId: 'p3', title: 'Push notification service',    description: 'Firebase FCM integration for task reminders.', type: 'feature',     status: 'in_review',   priority: 'high',     assignee: { id: '3', name: 'Eve Employee'  }, reporter: { id: '1', name: 'Alice Admin'  }, dueDate: '2025-07-05', tags: ['mobile'],    comments: [], createdAt: '2025-04-15T09:00:00Z', attachments: [] },
];

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_TASKS;
});

export const createTask = createAsyncThunk('tasks/create', async (data) => {
  await new Promise((r) => setTimeout(r, 300));
  return { ...data, id: `t${Date.now()}`, comments: [], attachments: [], createdAt: new Date().toISOString() };
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, changes }) => {
  await new Promise((r) => setTimeout(r, 300));
  return { id, changes };
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id) => {
  await new Promise((r) => setTimeout(r, 300));
  return id;
});

export const moveTask = createAsyncThunk('tasks/move', async ({ id, status }) => {
  await new Promise((r) => setTimeout(r, 200));
  return { id, status };
});

export const addComment = createAsyncThunk('tasks/addComment', async ({ taskId, text, author }) => {
  await new Promise((r) => setTimeout(r, 200));
  return { taskId, comment: { id: `c${Date.now()}`, author, text, createdAt: new Date().toISOString() } };
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], loading: false, error: null },
  reducers: {
    reorderTask(state, action) {
      // local optimistic reorder for drag-and-drop
      const { id, newStatus } = action.payload;
      const task = state.list.find((t) => t.id === id);
      if (task) task.status = newStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending,   (s) => { s.loading = true; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchTasks.rejected,  (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(createTask.fulfilled, (s, a) => { s.list.unshift(a.payload); })
      .addCase(updateTask.fulfilled, (s, a) => {
        const idx = s.list.findIndex((t) => t.id === a.payload.id);
        if (idx !== -1) s.list[idx] = { ...s.list[idx], ...a.payload.changes };
      })
      .addCase(deleteTask.fulfilled, (s, a) => { s.list = s.list.filter((t) => t.id !== a.payload); })
      .addCase(moveTask.fulfilled,   (s, a) => {
        const t = s.list.find((t) => t.id === a.payload.id);
        if (t) t.status = a.payload.status;
      })
      .addCase(addComment.fulfilled, (s, a) => {
        const t = s.list.find((t) => t.id === a.payload.taskId);
        if (t) t.comments.push(a.payload.comment);
      });
  },
});

export const { reorderTask } = tasksSlice.actions;
export default tasksSlice.reducer;