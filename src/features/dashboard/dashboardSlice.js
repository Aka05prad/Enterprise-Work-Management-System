import { createSlice } from '@reduxjs/toolkit';
import { TASK_STATUS, PRIORITY } from '../../utils/constants';

// ─── Rich mock data ───────────────────────────────────────────────────────────
export const MOCK_ACTIVITY = [
  { id: 'a1', user: 'Alice Admin',    action: 'created project',   target: 'Apollo Redesign',      time: new Date(Date.now() - 1000 * 60 * 4).toISOString(),  avatar: 'A', color: 'bg-purple-500' },
  { id: 'a2', user: 'Mark Manager',   action: 'assigned task',     target: 'Fix login redirect',   time: new Date(Date.now() - 1000 * 60 * 18).toISOString(), avatar: 'M', color: 'bg-blue-500' },
  { id: 'a3', user: 'Eve Employee',   action: 'completed task',    target: 'Update API docs',      time: new Date(Date.now() - 1000 * 60 * 45).toISOString(), avatar: 'E', color: 'bg-green-500' },
  { id: 'a4', user: 'Alice Admin',    action: 'commented on',      target: 'Dashboard metrics',    time: new Date(Date.now() - 1000 * 60 * 92).toISOString(), avatar: 'A', color: 'bg-purple-500' },
  { id: 'a5', user: 'Mark Manager',   action: 'moved task to Done','target': 'Mobile nav bug',     time: new Date(Date.now() - 1000 * 60 * 140).toISOString(), avatar: 'M', color: 'bg-blue-500' },
  { id: 'a6', user: 'Eve Employee',   action: 'uploaded file to',  target: 'Sprint planning doc',  time: new Date(Date.now() - 1000 * 60 * 200).toISOString(), avatar: 'E', color: 'bg-green-500' },
  { id: 'a7', user: 'Alice Admin',    action: 'invited',           target: 'Sara to Engineering',  time: new Date(Date.now() - 1000 * 60 * 320).toISOString(), avatar: 'A', color: 'bg-purple-500' },
  { id: 'a8', user: 'Mark Manager',   action: 'updated priority of','target': 'Auth refactor',     time: new Date(Date.now() - 1000 * 60 * 480).toISOString(), avatar: 'M', color: 'bg-blue-500' },
];

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'mention',   message: 'Alice mentioned you in Apollo Redesign',      time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),  read: false },
  { id: 'n2', type: 'task',      message: 'Task "Fix login redirect" is due tomorrow',   time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: 'n3', type: 'project',   message: 'Apollo Redesign moved to In Review',          time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: false },
  { id: 'n4', type: 'comment',   message: 'Mark commented on your task',                 time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), read: true },
  { id: 'n5', type: 'task',      message: 'You were assigned "Write unit tests"',        time: new Date(Date.now() - 1000 * 60 * 200).toISOString(), read: true },
  { id: 'n6', type: 'system',    message: 'System maintenance scheduled for Sunday',     time: new Date(Date.now() - 1000 * 60 * 400).toISOString(), read: true },
];

export const MOCK_CHART_WEEKLY = [
  { day: 'Mon', completed: 4,  created: 6  },
  { day: 'Tue', completed: 7,  created: 5  },
  { day: 'Wed', completed: 3,  created: 8  },
  { day: 'Thu', completed: 9,  created: 7  },
  { day: 'Fri', completed: 6,  created: 4  },
  { day: 'Sat', completed: 2,  created: 3  },
  { day: 'Sun', completed: 1,  created: 2  },
];

export const MOCK_CHART_STATUS = [
  { name: 'To Do',       value: 18, color: '#94a3b8' },
  { name: 'In Progress', value: 12, color: '#6366f1' },
  { name: 'In Review',   value: 7,  color: '#f59e0b' },
  { name: 'Done',        value: 31, color: '#22c55e' },
];

export const MOCK_PRIORITY_DATA = [
  { name: 'Critical', value: 5,  color: '#ef4444' },
  { name: 'High',     value: 14, color: '#f97316' },
  { name: 'Medium',   value: 23, color: '#eab308' },
  { name: 'Low',      value: 26, color: '#22c55e' },
];

export const MOCK_PROJECTS_SUMMARY = [
  { id: 'p1', name: 'Apollo Redesign',    progress: 72, status: 'active',    tasks: 18, due: '2025-08-15', color: 'bg-purple-500' },
  { id: 'p2', name: 'Auth Refactor',      progress: 45, status: 'active',    tasks: 11, due: '2025-07-30', color: 'bg-blue-500'   },
  { id: 'p3', name: 'Mobile App v2',      progress: 91, status: 'active',    tasks: 24, due: '2025-07-10', color: 'bg-green-500'  },
  { id: 'p4', name: 'Data Pipeline',      progress: 20, status: 'on_hold',   tasks: 9,  due: '2025-09-01', color: 'bg-yellow-500' },
  { id: 'p5', name: 'Marketing Portal',   progress: 60, status: 'active',    tasks: 6,  due: '2025-08-01', color: 'bg-pink-500'   },
];
// ─────────────────────────────────────────────────────────────────────────────

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    metrics: {
      totalProjects: 12,
      activeProjects: 8,
      totalTasks: 68,
      completedTasks: 31,
      pendingTasks: 25,
      overdueTasks: 4,
      teamMembers: 9,
      completionRate: 46,
    },
    activity: MOCK_ACTIVITY,
    notifications: MOCK_NOTIFICATIONS,
    weeklyChart: MOCK_CHART_WEEKLY,
    statusChart: MOCK_CHART_STATUS,
    priorityChart: MOCK_PRIORITY_DATA,
    projectsSummary: MOCK_PROJECTS_SUMMARY,
  },
  reducers: {
    markNotificationRead(state, action) {
      const n = state.notifications.find((n) => n.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state) {
      state.notifications.forEach((n) => (n.read = true));
    },
    dismissNotification(state, action) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
  },
});

export const { markNotificationRead, markAllRead, dismissNotification } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;