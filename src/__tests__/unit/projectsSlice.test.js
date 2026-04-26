import { configureStore } from '@reduxjs/toolkit';
import projectsReducer, { setSelected } from '../../features/projects/projectsSlice';

const buildStore = (preloaded = {}) =>
  configureStore({
    reducer: { projects: projectsReducer },
    preloadedState: {
      projects: {
        list: [], loading: false, error: null, selected: null, ...preloaded,
      },
    },
  });

const PROJ = {
  id: 'p1', name: 'Apollo', description: 'desc', status: 'active',
  priority: 'high', progress: 50, startDate: '2025-01-01', dueDate: '2025-12-31',
  manager: { id: '1', name: 'Alice' }, members: [], tags: [], color: '#6366f1',
  taskCount: 5, completedTasks: 2, createdAt: new Date().toISOString(),
};

describe('projectsSlice', () => {
  it('has correct initial state shape', () => {
    const store = buildStore();
    const state = store.getState().projects;
    expect(state.list).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setSelected stores the selected project', () => {
    const store = buildStore();
    store.dispatch(setSelected(PROJ));
    expect(store.getState().projects.selected).toEqual(PROJ);
  });

  it('setSelected can be set to null', () => {
    const store = buildStore({ selected: PROJ });
    store.dispatch(setSelected(null));
    expect(store.getState().projects.selected).toBeNull();
  });

  it('fetchProjects.pending sets loading to true', async () => {
    const { fetchProjects } = await import('../../features/projects/projectsSlice');
    const store = buildStore();
    store.dispatch(fetchProjects.pending('', undefined));
    expect(store.getState().projects.loading).toBe(true);
  });

  it('fetchProjects.fulfilled populates list and stops loading', async () => {
    const { fetchProjects } = await import('../../features/projects/projectsSlice');
    const store = buildStore();
    store.dispatch(fetchProjects.fulfilled([PROJ], '', undefined));
    const state = store.getState().projects;
    expect(state.loading).toBe(false);
    expect(state.list).toHaveLength(1);
    expect(state.list[0].name).toBe('Apollo');
  });
});