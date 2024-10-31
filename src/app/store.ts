import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export type AppDispatch = typeof store.dispatch;

export interface RootState {
  counter: {
    value: number
  };
}

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
