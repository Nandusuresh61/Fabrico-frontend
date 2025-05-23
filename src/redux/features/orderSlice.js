import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createOrderApi, 
  getOrdersApi, 
  getOrderByIdApi, 
  updateOrderStatusApi, 
  cancelOrderApi,
  verifyReturnRequestApi,
  getUserOrdersApi,
  cancelOrderForUserApi,
  submitReturnRequestApi
} from '../../api/orderApi';

// Create Order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await createOrderApi(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get Orders with pagination, search, sort and filter
export const getOrders = createAsyncThunk(
  'order/getOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get Order by ID
export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getOrderByIdApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatusApi(id, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Verify Return Request
export const verifyReturnRequest = createAsyncThunk(
  'order/verifyReturn',
  async ({ orderId, itemId, status }, { rejectWithValue }) => {
    try {
      const response = await verifyReturnRequestApi(orderId, itemId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get User Orders
export const getUserOrders = createAsyncThunk(
  'order/getUserOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getUserOrdersApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Cancel Order for User
export const cancelOrderForUser = createAsyncThunk(
  'order/cancelOrderForUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await cancelOrderForUserApi(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Submit Return Request
export const submitReturnRequest = createAsyncThunk(
  'order/submitReturnRequest',
  async ({ orderId, itemId, data }, { rejectWithValue }) => {
    try {
      const response = await submitReturnRequestApi(orderId, itemId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  },
  filters: {
    search: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create order';
      })
      // Get Orders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.pages,
          totalOrders: action.payload.total
        };
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch orders';
      })
      // Get Order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch order';
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update order in the list if it exists
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update order status';
      })
      // Verify Return Request
      .addCase(verifyReturnRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyReturnRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update order in the list if it exists
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(verifyReturnRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to verify return request';
      })
      // Get User Orders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = {
          currentPage: action.payload.page,
          totalPages: action.payload.pages,
          totalOrders: action.payload.total
        };
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch your orders';
      })
      // Cancel Order for User
      .addCase(cancelOrderForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrderForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update order in the list if it exists
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrderForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to cancel order';
      })
      // Submit Return Request
      .addCase(submitReturnRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReturnRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update order in the list if it exists
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.currentOrder?._id === action.payload._id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(submitReturnRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to submit return request';
      });
  },
});

export const { 
  clearOrderError, 
  resetOrderSuccess, 
  setFilters, 
  resetFilters,
  setCurrentPage 
} = orderSlice.actions;

export default orderSlice.reducer;
