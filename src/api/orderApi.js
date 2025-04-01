import API from "./api"

export const createOrderApi = (data) => API.post("/orders", data)
export const getOrdersApi = (params) => {
    const { page = 1, limit = 10, search = '', status = '', sortBy = 'createdAt', sortOrder = 'desc' } = params;
    return API.get(`/orders?page=${page}&limit=${limit}&search=${search}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
}
export const getUserOrdersApi = (params) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    return API.get(`/orders/my-orders?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
}
export const getOrderByIdApi = (id) => API.get(`/orders/${id}`)
export const updateOrderStatusApi = (id, data) => API.put(`/orders/${id}/status`, data)
export const cancelOrderApi = (id) => API.put(`/orders/${id}/cancel`)
export const verifyReturnRequestApi = (orderId, itemId, status) => API.put(`/orders/${orderId}/return/${itemId}`, { status })
