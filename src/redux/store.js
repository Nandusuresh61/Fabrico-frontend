import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import adminReducer from './features/adminSlice';
import categoryReducer from './features/categorySlice'
import brandReducer from './features/brandSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    category: categoryReducer,
    brands: brandReducer,
  },
});

export default store;
