import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addCategoryApi, editCategoryApi, deleteCategoryApi, getAllCategoryApi } from '../../api/categoryApi';


export const getAllCategories = createAsyncThunk(
  'category/getAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCategoryApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load categories');
    }
  }
);


export const addCategory = createAsyncThunk(
  'category/addCategory',
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
  'category/editCategory',
  async ({ categoryId, data }, { rejectWithValue }) => {
    try {
      const response = await editCategoryApi(categoryId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to edit category');
    }
  }
);


export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await deleteCategoryApi(categoryId);
      return { categoryId, status: response.data.status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload.category);
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
          category._id === action.payload.category._id ? action.payload.category : category
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
            ? { ...category, status: action.payload.status }
            : category
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
