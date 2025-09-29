import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gistsReducer from './slices/gistsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gists: gistsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable state check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;