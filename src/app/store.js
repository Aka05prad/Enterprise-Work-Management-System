import { configureStore } from '@reduxjs/toolkit';
import authReducer      from '../features/auth/authSlice';
import projectsReducer  from '../features/projects/projectsSlice';
import tasksReducer     from '../features/tasks/tasksSlice';
import usersReducer     from '../features/users/usersSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    projects:  projectsReducer,
    tasks:     tasksReducer,
    users:     usersReducer,
    dashboard: dashboardReducer,
  },
});

export default store;