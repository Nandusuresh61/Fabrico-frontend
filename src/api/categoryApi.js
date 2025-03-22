import API from "./api";

export const getAllCategoryApi = (params) => API.get('/categories', { params });
export const addCategoryApi = (data) => API.post('/categories', data);
export const editCategoryApi = (categoryId, data) => API.put(`/categories/${categoryId}`, data);
export const deleteCategoryApi = (categoryId) => API.put(`/categories/${categoryId}/toggle-status`);

// export const getAllCategoryApi = ({ search = '', page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' }) => 
//     API.get('/categories', { 
//         params: { search, page, limit, sortBy, order }
//     });