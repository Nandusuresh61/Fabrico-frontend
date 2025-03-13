import API from './api';

// Admin Login
export const adminLoginApi = (data) => API.post('/admin/login', data);

// Admin Logout
export const adminLogoutApi = () => API.post('/admin/logout');

// Toggle User Status (Block/Unblock)
export const toggleUserStatusApi = (userId) =>
    API.put(`/admin/${userId}/toggle-status`);

// Get User by ID
export const getUserByIdApi = (userId) =>
    API.get(`/admin/${userId}`);

// Update User by ID
export const updateUserByIdApi = (userId, data) =>
    API.put(`/admin/${userId}`, data);

// Delete User by ID
export const deleteUserByIdApi = (userId) =>
    API.delete(`/admin/${userId}`);

//GET all users
export const getAllUsersApi = () => API.get('/admin/users');
