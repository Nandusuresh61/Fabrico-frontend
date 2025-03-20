import API from './api';

export const addProductApi = (data) => API.post('/products', data);
export const editProductApi = (productId, data) => API.put(`/products/${productId}`, data);
export const deleteProductApi = (productId) => API.put(`/products/${productId}/toggle-status`);
export const getAllProductsApi = ({ search, page, limit }) =>
  API.get(`/products?search=${search || ''}&page=${page || 1}&limit=${limit || 5}`);
