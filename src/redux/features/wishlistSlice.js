import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWishlistApi, addToWishlistApi, removeFromWishlistApi } from '../../api/wishlistApi';

export const getWishlist = createAsyncThunk(
    'wishlist/getWishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getWishlistApi();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
        }
    }
);

export const addToWishlist = createAsyncThunk(
    'wishlist/addToWishlist',
    async (data, { rejectWithValue }) => {
        try {
            const response = await addToWishlistApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
        }
    }
);

export const removeFromWishlist = createAsyncThunk(
    'wishlist/removeFromWishlist',
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await removeFromWishlistApi(itemId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    }
);

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items;
            })
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload.items;
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload.items;
            });
    }
});

export default wishlistSlice.reducer;
