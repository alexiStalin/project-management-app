import { configureStore } from '@reduxjs/toolkit';
import authorization from './autorizationSlice';

const store = configureStore({
  reducer: { authorization },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
