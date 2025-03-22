import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    adminLoginApi,
    adminLogoutApi,
    toggleUserStatusApi,
    getUserByIdApi,
    updateUserByIdApi,
    deleteUserByIdApi,
    getAllUsersApi
} from '../../api/adminApi';
import Cookies from 'js-cookie';

// Initial state
const initialState = {
    admin: JSON.parse(localStorage.getItem("admin")) || null,
    users: [],
    pagination: {
        page: 1,
        totalPages: 1,
        totalDocs: 0,
        hasNextPage: false,
        hasPrevPage: false
    },
    loading: false,
    error: null,
};

// Admin Login
export const loginAdmin = createAsyncThunk(
    'admin/login',
    async (adminData, { rejectWithValue }) => {
        try {
            const response = await adminLoginApi(adminData);
            localStorage.setItem("admin", JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Admin Logout
export const logoutAdmin = createAsyncThunk(
    'admin/logout',
    async (_, { rejectWithValue }) => {
        try {
            await adminLogoutApi();
            Cookies.remove("jwt")
            localStorage.removeItem("admin");
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Toggle User Status
export const toggleUserStatus = createAsyncThunk(
    'admin/toggleUserStatus',
    async (userId, { rejectWithValue, getState }) => {
        try {
            const response = await toggleUserStatusApi(userId);
            return { userId, status: response.data.status };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Action failed');
        }
    }
);

// Get User by ID
export const getUserById = createAsyncThunk(
    'admin/getUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getUserByIdApi(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Fetching user failed');
        }
    }
);

// Update User by ID
export const updateUserById = createAsyncThunk(
    'admin/updateUserById',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await updateUserByIdApi(userId, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Update failed');
        }
    }
);

// Delete User by ID
export const deleteUserById = createAsyncThunk(
    'admin/deleteUserById',
    async (userId, { rejectWithValue }) => {
        try {
            await deleteUserByIdApi(userId);
            return userId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Delete failed');
        }
    }
);

// GET all user
export const getAllUsers = createAsyncThunk(
    'admin/getAllUsers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await getAllUsersApi(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// Slice Definition
const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        resetError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Admin Login
            .addCase(loginAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.admin = action.payload;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Admin Logout
            .addCase(logoutAdmin.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutAdmin.fulfilled, (state) => {
                state.loading = false;
                state.admin = null;
            })
            .addCase(logoutAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Toggle User Status
            .addCase(toggleUserStatus.pending, (state, action) => {
                state.error = null;
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                const userIndex = state.users.findIndex(user => user._id === action.payload.userId);
                if (userIndex !== -1) {
                    state.users[userIndex].status = action.payload.status;
                }
            })
            .addCase(toggleUserStatus.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Get User by ID
            .addCase(getUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update User by ID
            .addCase(updateUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.map(user =>
                    user._id === action.payload._id ? action.payload : user
                );
            })
            .addCase(updateUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete User by ID
            .addCase(deleteUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(
                    (user) => user._id !== action.payload
                );
            })
            .addCase(deleteUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET all users
            .addCase(getAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetError } = adminSlice.actions;
export default adminSlice.reducer;
