import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    addCategoryApi, 
    editCategoryApi, 
    deleteCategoryApi, 
    getAllCategoryApi 
} from '../../api/categoryApi';

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async (params, { rejectWithValue }) => {
        try {
            const response = await getAllCategoryApi(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load categories');
        }
    }
);


export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async (data, { rejectWithValue }) => {
        try {
            const response = await addCategoryApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add category');
        }
    }
);


export const editCategory = createAsyncThunk(
    'categories/editCategory',
    async ({ categoryId, data }, { rejectWithValue }) => {
        try {
            const response = await editCategoryApi(categoryId, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update category');
        }
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await deleteCategoryApi(categoryId);
            return { categoryId, message: response.data.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
        }
    }
);

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
        currentPage: 1,
        totalPages: 1,
        totalCategories: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.categories;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.totalCategories = action.payload.totalCategories;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            
            .addCase(addCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.unshift(action.payload.category); // Add to the top of the list
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

           
            .addCase(editCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(editCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.map((category) =>
                    category._id === action.payload.category._id
                        ? action.payload.category
                        : category
                );
            })
            .addCase(editCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

          
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = state.categories.map((category) =>
                    category._id === action.payload.categoryId
                        ? { ...category, status: category.status === 'active' ? 'inactive' : 'active' }
                        : category
                );
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default categorySlice.reducer;
