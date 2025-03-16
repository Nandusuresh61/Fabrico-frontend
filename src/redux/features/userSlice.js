import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resendOtpApi, userLoginApi, userLogoutApi, userRegApi, verifyOtpApi } from '../../api/userApi';


const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userRegApi(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userLoginApi(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const verifyOtp = createAsyncThunk(
    'user/verifyotp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await verifyOtpApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
        }
    }
);

export const resendOtp = createAsyncThunk(
    'user/resendotp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await resendOtpApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
        }
    }
)

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {

            await userLogoutApi();;
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //Verify Otp
            .addCase(verifyOtp.pending, (state)=>{
                state.loading = true;
                state.error = null;
                state.verificationSuccess = false;
            })
            .addCase(verifyOtp.fulfilled,(state)=>{
                state.loading = false;
                state.verificationSuccess = true;
            })
            .addCase(verifyOtp.rejected,(state,action)=>{
                state.loading = false;
                state.error = action.payload;
            })
            //resendotp
            .addCase(resendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpResent = false;
            })
            .addCase(resendOtp.fulfilled, (state) => {
                state.loading = false;
                state.otpResent = true;
            })
            .addCase(resendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
