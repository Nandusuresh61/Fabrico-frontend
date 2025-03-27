import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { googleAuthApi, resendOtpApi, userLoginApi, userLogoutApi, userRegApi, verifyOtpApi, sendForgotPasswordEmailApi, verifyForgotOtpApi, resendForgotOtpApi, resetPasswordApi } from '../../api/userApi';
import Cookies from 'js-cookie'


const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    forgotOtpVerified: false,
};

//google auth login 
export const googleAuthUser = createAsyncThunk(
    "user/googleAuthUser",
    async (code, { rejectWithValue }) => {
        try {
            const response = await googleAuthApi(code);
            localStorage.setItem("user", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userRegApi(userData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            return rejectWithValue(errorMessage);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userLoginApi(userData);
            localStorage.setItem("user", JSON.stringify(response.data));
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

            await userLogoutApi();
            Cookies.remove("jwt")
            localStorage.removeItem("user");
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

export const sendForgotPasswordEmail = createAsyncThunk(
    'user/forgotPassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await sendForgotPasswordEmailApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
        }
    }
);

export const verifyForgotOtp = createAsyncThunk(
    'user/verifyForgotOtp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await verifyForgotOtpApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
        }
    }
);

export const resendForgotOtp = createAsyncThunk(
    'user/resendForgotOtp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await resendForgotOtpApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to resend OTP');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'user/resetPassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await resetPasswordApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
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
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.verificationSuccess = false;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.loading = false;
                state.verificationSuccess = true;
                // Update the user's verified status in localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    user.isVerified = true;
                    localStorage.setItem("user", JSON.stringify(user));
                }
            })
            .addCase(verifyOtp.rejected, (state, action) => {
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

            // Forgot password flow
            .addCase(sendForgotPasswordEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendForgotPasswordEmail.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendForgotPasswordEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(verifyForgotOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.forgotOtpVerified = false;
            })
            .addCase(verifyForgotOtp.fulfilled, (state) => {
                state.loading = false;
                state.forgotOtpVerified = true;
            })
            .addCase(verifyForgotOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(resendForgotOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendForgotOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resendForgotOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //user google login
            .addCase(googleAuthUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(googleAuthUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(googleAuthUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
