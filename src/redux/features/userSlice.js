import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { googleAuthApi, resendOtpApi, userLoginApi, userLogoutApi, userRegApi, verifyOtpApi, sendForgotPasswordEmailApi, verifyForgotOtpApi, resendForgotOtpApi, resetPasswordApi, updateProfileApi, sendEmailUpdateOtpApi, verifyEmailUpdateOtpApi, changePasswordApi } from '../../api/userApi';
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
            // Store user data in localStorage only after successful verification
            localStorage.setItem("user", JSON.stringify(response.data));
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

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await updateProfileApi(userData);
            // Update localStorage
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const updatedUser = { ...currentUser, ...response.data.user };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return response.data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Update failed');
        }
    }
);

export const sendEmailUpdateOtp = createAsyncThunk(
    'user/sendEmailUpdateOtp',
    async (data, { rejectWithValue }) => {
        try {
            const response = await sendEmailUpdateOtpApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send verification code');
        }
    }
);

export const verifyEmailUpdate = createAsyncThunk(
    'user/verifyEmailUpdate',
    async (data, { rejectWithValue }) => {
        try {
            const response = await verifyEmailUpdateOtpApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Verification failed');
        }
    }
);

export const changePassword = createAsyncThunk(
    'user/changePassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await changePasswordApi(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to change password');
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
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.verificationSuccess = true;
                // Store user data in state only after successful verification
                state.user = action.payload;
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

            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(sendEmailUpdateOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendEmailUpdateOtp.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(sendEmailUpdateOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(verifyEmailUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyEmailUpdate.fulfilled, (state, action) => {
                state.loading = false;
                // Update the user's email in the state and localStorage
                if (action.payload.email) {
                    state.user.email = action.payload.email;
                    // Update localStorage
                    const currentUser = JSON.parse(localStorage.getItem("user"));
                    if (currentUser) {
                        currentUser.email = action.payload.email;
                        localStorage.setItem("user", JSON.stringify(currentUser));
                    }
                }
            })
            .addCase(verifyEmailUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(changePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export const { resetError } = userSlice.actions;
export default userSlice.reducer;
