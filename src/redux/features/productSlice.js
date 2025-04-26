import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addProductApi,
  editProductApi,
  deleteProductApi,
  getAllProductsApi,
  toggleProductMainStatusApi,
  getProductByIdApi,
  getAllProductsForUsersApi,
  editProductNameApi,
} from '../../api/productApi';

// Get All Products with search and pagination
export const getAllProducts = createAsyncThunk(
  'product/getAllProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getAllProductsApi(params);
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

// Toggle Product Main Status
export const toggleProductMainStatus = createAsyncThunk(
  'product/toggleProductMainStatus',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await toggleProductMainStatusApi(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product status');
    }
  }
);

// Get Product by ID
export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getProductByIdApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load product');
    }
  }
);

// Get All Products for Users
export const getAllProductsForUsers = createAsyncThunk(
  'product/getAllProductsForUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getAllProductsForUsersApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load products');
    }
  }
);

// Edit Product Name
export const editProductName = createAsyncThunk(
  'product/editProductName',
  async ({ productId, data }, { rejectWithValue }) => {
    try {
      const response = await editProductNameApi(productId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product name');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
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
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.total = action.payload.total;
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
        const { productId, variantId, variant, product } = action.payload;
        state.products = state.products.map((p) => {
          if (p._id === productId) {
            return {
              ...p,
              brand: action.payload.product.brand,
              category: action.payload.product.category,
              variants: p.variants.map((v) =>
                v._id === variantId ? variant : v
              ),
            };
          }
          return p;
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
          state.total += 1;
        }
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle Product Main Status
      .addCase(toggleProductMainStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleProductMainStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload.product;
        state.products = state.products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
      })
      .addCase(toggleProductMainStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Product by ID
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get All Products for Users
      .addCase(getAllProductsForUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProductsForUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllProductsForUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Edit Product Name
      .addCase(editProductName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProductName.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload.product;
        state.products = state.products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        );
      })
      .addCase(editProductName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
