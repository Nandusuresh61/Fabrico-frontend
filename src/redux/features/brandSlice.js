import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getAllBrandsApi, 
    createBrandApi, 
    updateBrandApi, 
    toggleBrandStatusApi 
} from '../../api/brandApi';

export const fetchBrands = createAsyncThunk(
    'brands/fetchBrands',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getAllBrandsApi();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch brands');
        }
    }
);

export const createBrand = createAsyncThunk(
    'brands/createBrand',
    async (brandData, { rejectWithValue }) => {
        try {
            const response = await createBrandApi(brandData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create brand');
        }
    }
);

export const updateBrand = createAsyncThunk(
    'brands/updateBrand',
    async ({ id, brandData }, { rejectWithValue }) => {
        try {
            const response = await updateBrandApi(id, brandData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update brand');
        }
    }
);

export const toggleBrandStatus = createAsyncThunk(
    'brands/toggleBrandStatus',
    async (id, { rejectWithValue }) => {
        try {
            const response = await toggleBrandStatusApi(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle brand status');
        }
    }
);

const initialState = {
    brands: [],
    loading: false,
    error: null,
};

const brandSlice = createSlice({
    name: 'brands',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Brands
            .addCase(fetchBrands.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.loading = false;
                state.brands = action.payload;
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Brand
            .addCase(createBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBrand.fulfilled, (state, action) => {
                state.loading = false;
                state.brands.push(action.payload);
            })
            .addCase(createBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Brand
            .addCase(updateBrand.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBrand.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.brands.findIndex(brand => brand._id === action.payload._id);
                if (index !== -1) {
                    state.brands[index] = action.payload;
                }
            })
            .addCase(updateBrand.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Toggle Brand Status
            .addCase(toggleBrandStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(toggleBrandStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.brands.findIndex(brand => brand._id === action.payload._id);
                if (index !== -1) {
                    state.brands[index] = action.payload;
                }
            })
            .addCase(toggleBrandStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = brandSlice.actions;
export default brandSlice.reducer;
