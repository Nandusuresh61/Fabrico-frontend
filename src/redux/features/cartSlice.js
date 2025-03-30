import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCartApi, addToCartApi, removeFromCartApi, updateCartQuantityApi } from '../../api/cartApi';

export const getCart = createAsyncThunk(
    'cart/getCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCartApi();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await addToCartApi(productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await removeFromCartApi(productId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

export const updateCartQuantity = createAsyncThunk(
    'cart/updateQuantity',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const response = await updateCartQuantityApi(itemId, quantity);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalAmount: 0,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(getCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.items = action.payload.items;
                state.totalAmount = action.payload.totalAmount;
            });
    }
});

export default cartSlice.reducer;
