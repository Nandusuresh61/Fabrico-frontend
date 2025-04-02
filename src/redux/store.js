import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import adminReducer from './features/adminSlice';
import categoryReducer from './features/categorySlice'
import brandReducer from './features/brandSlice';
import productReducer from './features/productSlice';
import addressReducer from './features/addressSlice'
import wishlistReducer from './features/wishlistSlice';
import cartReducer from './features/cartSlice';
import orderReducer from './features/orderSlice';
import walletReducer from './features/walletSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    category: categoryReducer,
    brands: brandReducer,
    product: productReducer,
    address: addressReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
    order: orderReducer,
    wallet: walletReducer,
  },
});

export default store;
