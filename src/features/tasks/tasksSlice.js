import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
});

export default tasksSlice.reducer;