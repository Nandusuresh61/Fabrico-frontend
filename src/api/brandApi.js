import API from './api';

export const getAllBrandsApi = () => API.get('/brands');
export const createBrandApi = (data) => API.post('/brands', data);
export const updateBrandApi = (id, data) => API.put(`/brands/${id}`, data);
export const toggleBrandStatusApi = (id) => API.put(`/brands/${id}/toggle-status`);
