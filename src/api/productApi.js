import API from './api';

export const addProductApi = (data) => API.post('/products', data);
export const editProductApi = (productId, variantId, data) => API.put(`/products/${productId}/variants/${variantId}`, data);
export const deleteProductApi = (productId, variantId) => API.put(`/products/${productId}/variants/${variantId}/toggle-status`);
export const toggleProductMainStatusApi = (productId) => API.put(`/products/${productId}/toggle-status`);
export const getAllProductsApi = ({ search, page, limit }) =>
  API.get(`/products?search=${search || ''}&page=${page || 1}&limit=${limit || 5}`);
export const getProductByIdApi = (id) => API.get(`/products/${id}`);
