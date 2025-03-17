import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import adminReducer from './features/adminSlice';
import categoryReducer from './features/categorySlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    category: categoryReducer, 
  },
});

export default store;
