import API from "./api"

export const createOrderApi = (data) => API.post("/orders", data)
export const getOrdersApi = () => API.get("/orders")
export const getOrderByIdApi = (id) => API.get(`/orders/${id}`)
export const updateOrderStatusApi = (id, data) => API.put(`/orders/${id}/status`, data)
export const cancelOrderApi = (id) => API.put(`/orders/${id}/cancel`)
