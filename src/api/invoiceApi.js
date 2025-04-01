import API from "./api"

export const downloadInvoiceApi = (orderId) => {
    return API.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
    });
} 