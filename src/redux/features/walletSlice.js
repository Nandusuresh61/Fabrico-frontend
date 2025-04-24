import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getWalletApi, getWalletTransactionsApi } from '../../api/walletApi';

// Get Wallet Details
export const getWallet = createAsyncThunk(
  'wallet/getWallet',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getWalletApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get Wallet Transactions
export const getWalletTransactions = createAsyncThunk(
  'wallet/getTransactions',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await getWalletTransactionsApi(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  wallet: null,
  transactions: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTransactions: 0
  }
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Wallet
      .addCase(getWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload;
      })
      .addCase(getWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch wallet details';
      })
      // Get Transactions
      .addCase(getWalletTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWalletTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.pagination = action.payload.pagination;
      })
      .addCase(getWalletTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch transactions';
      });
  },
});

export const { clearWalletError } = walletSlice.actions;

export default walletSlice.reducer;
