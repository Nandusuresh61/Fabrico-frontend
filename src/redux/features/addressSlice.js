import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getAllAddressesApi, 
  addAddressApi, 
  updateAddressApi, 
  deleteAddressApi, 
  setDefaultAddressApi 
} from '../../api/addressApi';

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'address/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllAddressesApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addNewAddress = createAsyncThunk(
  'address/add',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addAddressApi(addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateExistingAddress = createAsyncThunk(
  'address/update',
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const response = await updateAddressApi(id, addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeAddress = createAsyncThunk(
  'address/remove',
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteAddressApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete address');
    }
  }
);

export const setAddressAsDefault = createAsyncThunk(
  'address/setDefault',
  async (id, { rejectWithValue }) => {
    try {
      const response = await setDefaultAddressApi(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch addresses
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add address
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
        state.error = null;
      })
      // Update address
      .addCase(updateExistingAddress.fulfilled, (state, action) => {
        const index = state.addresses.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        state.error = null;
      })
      // Delete address
      .addCase(removeAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter(
          (address) => address._id !== action.payload
        );
      })
      .addCase(removeAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set default address
      .addCase(setAddressAsDefault.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          isDefault: addr._id === action.payload._id
        }));
        state.error = null;
      });
  },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;
