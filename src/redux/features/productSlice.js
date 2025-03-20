import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addProductApi,
  editProductApi,
  deleteProductApi,
  getAllProductsApi,
} from '../../api/productApi';

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

// Edit Product Variant
export const editProduct = createAsyncThunk(
  'product/editProduct',
  async ({ productId, variantId, data }, { rejectWithValue }) => {
    try {
      const response = await editProductApi(productId, variantId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to edit product variant');
    }
  }
);

// Toggle Product Variant Status
export const toggleProductStatus = createAsyncThunk(
  'product/toggleProductStatus',
  async ({ productId, variantId }, { rejectWithValue }) => {
    try {
      const response = await deleteProductApi(productId, variantId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update variant status');
    }
  }
);

// Add Product
export const addProduct = createAsyncThunk(
  'product/addProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await addProductApi(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    loading: false,
    error: null,
    totalProducts: 0,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Edit Product Variant
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, variantId, variant } = action.payload;
        state.products = state.products.map((product) => {
          if (product._id === productId) {
            return {
              ...product,
              variants: product.variants.map((v) =>
                v._id === variantId ? variant : v
              ),
            };
          }
          return product;
        });
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle Product Variant Status
      .addCase(toggleProductStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { productId, variantId, variant } = action.payload;
        state.products = state.products.map((product) => {
          if (product._id === productId) {
            return {
              ...product,
              variants: product.variants.map((v) =>
                v._id === variantId ? variant : v
              ),
            };
          }
          return product;
        });
      })
      .addCase(toggleProductStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Check if product already exists before adding
        const exists = state.products.some(p => p._id === action.payload.product._id);
        if (!exists) {
          state.products.unshift(action.payload.product);
          state.totalProducts += 1;
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
