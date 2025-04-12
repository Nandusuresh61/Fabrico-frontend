import API from "./api";

export const getAllCoupons = (params) => API.get("/coupons", { params });

export const createCoupon = (data) => API.post("/coupons", data);

export const updateCoupon = (id, data) => API.put(`/coupons/${id}`, data);

export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);

export const toggleCouponStatus = (id) => API.put(`/coupons/${id}/toggle-status`);