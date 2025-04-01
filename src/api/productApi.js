import API from './api';

export const addProductApi = (data) => API.post('/products', data);
export const editProductApi = (productId, variantId, data) => API.put(`/products/${productId}/variants/${variantId}`, data);
export const deleteProductApi = (productId, variantId) => API.put(`/products/${productId}/variants/${variantId}/toggle-status`);
export const toggleProductMainStatusApi = (productId) => API.put(`/products/${productId}/toggle-status`);
export const getAllProductsApi = (params) => API.get('/products', { params });
export const getProductByIdApi = (id) => API.get(`/products/${id}`);
export const updateProductStockApi = (productId, variantId, quantity) => 
  API.put(`/products/${productId}/variants/${variantId}/update-stock`, { quantity });

export const getAllProductsForUsersApi = (params) => 
  API.get('/products/users', { 
    params: {
      ...params,
      minPrice: Number(params.minPrice),
      maxPrice: Number(params.maxPrice),
      page: Number(params.page),
      limit: Number(params.limit)
    }
  });

export const editProductNameApi = (productId, data) => 
  API.put(`/products/${productId}/edit-name`, data);
