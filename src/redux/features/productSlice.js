import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addProductApi,
  editProductApi,
  deleteProductApi,
  getAllProductsApi,
} from '../../api/productApi';

// Get All Products
// Get All Products with search and pagination
export const getAllProducts = createAsyncThunk(
  'product/getAllProducts',
  async ({ search = '', page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await getAllProductsApi({ search, page, limit });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load products');
    }
  }
);


// Edit Product
export const editProduct = createAsyncThunk(
  'product/editProduct',
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const response = await editProductApi(productId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to edit product');
    }
  }
);

// Toggle Product Status
export const toggleProductStatus = createAsyncThunk(
  'product/toggleProductStatus',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await deleteProductApi(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        state.products = state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
      });
  },
});

export default productSlice.reducer;
