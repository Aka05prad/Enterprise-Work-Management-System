import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer, {
  markNotificationRead,
  markAllRead,
  dismissNotification,
} from '../../features/dashboard/dashboardSlice';

const buildStore = () =>
  configureStore({ reducer: { dashboard: dashboardReducer } });

describe('dashboardSlice', () => {
  it('has notifications in initial state', () => {
    const store = buildStore();
    const { notifications } = store.getState().dashboard;
    expect(Array.isArray(notifications)).toBe(true);
    expect(notifications.length).toBeGreaterThan(0);
  });

  it('markNotificationRead marks a notification as read', () => {
    const store = buildStore();
    const { notifications } = store.getState().dashboard;
    const unread = notifications.find((n) => !n.read);
    if (!unread) return; // skip if all already read
    store.dispatch(markNotificationRead(unread.id));
    const updated = store.getState().dashboard.notifications.find((n) => n.id === unread.id);
    expect(updated.read).toBe(true);
  });

  it('markAllRead marks every notification as read', () => {
    const store = buildStore();
    store.dispatch(markAllRead());
    const allRead = store.getState().dashboard.notifications.every((n) => n.read);
    expect(allRead).toBe(true);
  });

  it('dismissNotification removes the notification from list', () => {
    const store = buildStore();
    const first = store.getState().dashboard.notifications[0];
    store.dispatch(dismissNotification(first.id));
    const found = store.getState().dashboard.notifications.find((n) => n.id === first.id);
    expect(found).toBeUndefined();
  });

  it('metrics object has expected keys', () => {
    const store = buildStore();
    const { metrics } = store.getState().dashboard;
    expect(metrics).toHaveProperty('totalProjects');
    expect(metrics).toHaveProperty('totalTasks');
    expect(metrics).toHaveProperty('completedTasks');
    expect(metrics).toHaveProperty('teamMembers');
  });

  it('weeklyChart has 7 entries', () => {
    const store = buildStore();
    expect(store.getState().dashboard.weeklyChart).toHaveLength(7);
  });
});