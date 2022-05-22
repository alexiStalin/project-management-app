import { configureStore } from '@reduxjs/toolkit';
import authorization from './autorizationSlice';
import boards from './boardsSlice';
import columns from './columnsSlice';
import tasks from './tasksSlice';
import modal from './modalSlice';

const store = configureStore({
  reducer: { authorization, boards, columns, tasks, modal },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
