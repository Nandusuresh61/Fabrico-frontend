import API from './api';


export const adminLoginApi = (data) => API.post('/admin/login', data);


export const adminLogoutApi = () => API.post('/admin/logout');


export const toggleUserStatusApi = (userId) =>
    API.put(`/admin/${userId}/toggle-status`);


export const getUserByIdApi = (userId) =>
    API.get(`/admin/${userId}`);


export const updateUserByIdApi = (userId, data) =>
    API.put(`/admin/${userId}`, data);

export const deleteUserByIdApi = (userId) =>
    API.delete(`/admin/${userId}`);


export const getAllUsersApi = () => API.get('/admin/users');
