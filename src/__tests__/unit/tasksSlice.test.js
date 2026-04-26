import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { reorderTask } from '../../features/tasks/tasksSlice';

const TASK = {
  id: 't1', projectId: 'p1', title: 'Fix bug', description: '',
  type: 'bug', status: 'todo', priority: 'high',
  assignee: null, reporter: null, dueDate: '', tags: [],
  comments: [], attachments: [], createdAt: new Date().toISOString(),
};

const buildStore = (preloaded = {}) =>
  configureStore({
    reducer: { tasks: tasksReducer },
    preloadedState: { tasks: { list: [], loading: false, error: null, ...preloaded } },
  });

describe('tasksSlice', () => {
  it('has correct initial state', () => {
    const store = buildStore();
    expect(store.getState().tasks.list).toEqual([]);
    expect(store.getState().tasks.loading).toBe(false);
  });

  it('reorderTask updates task status optimistically', () => {
    const store = buildStore({ list: [TASK] });
    store.dispatch(reorderTask({ id: 't1', newStatus: 'in_progress' }));
    expect(store.getState().tasks.list[0].status).toBe('in_progress');
  });

  it('reorderTask does nothing for unknown task id', () => {
    const store = buildStore({ list: [TASK] });
    store.dispatch(reorderTask({ id: 'unknown', newStatus: 'done' }));
    expect(store.getState().tasks.list[0].status).toBe('todo');
  });

  it('fetchTasks.pending sets loading to true', async () => {
    const { fetchTasks } = await import('../../features/tasks/tasksSlice');
    const store = buildStore();
    store.dispatch(fetchTasks.pending('', undefined));
    expect(store.getState().tasks.loading).toBe(true);
  });

  it('fetchTasks.fulfilled populates list', async () => {
    const { fetchTasks } = await import('../../features/tasks/tasksSlice');
    const store = buildStore();
    store.dispatch(fetchTasks.fulfilled([TASK], '', undefined));
    expect(store.getState().tasks.list).toHaveLength(1);
    expect(store.getState().tasks.list[0].title).toBe('Fix bug');
  });

  it('deleteTask.fulfilled removes task from list', async () => {
    const { deleteTask } = await import('../../features/tasks/tasksSlice');
    const store = buildStore({ list: [TASK] });
    store.dispatch(deleteTask.fulfilled('t1', '', 't1'));
    expect(store.getState().tasks.list).toHaveLength(0);
  });
});