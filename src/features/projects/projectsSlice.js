import { createSlice } from '@reduxjs/toolkit';

const projectsSlice = createSlice({
  name: 'projects',
  initialState: { list: [], loading: false, error: null },
  reducers: {},
});

export default projectsSlice.reducer;