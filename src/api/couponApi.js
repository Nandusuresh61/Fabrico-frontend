import API from "./api";

export const getAllCoupons = (params) => API.get("/coupons", { params });

export const createCoupon = (data) => API.post("/coupons", data);

export const updateCoupon = (id, data) => API.put(`/coupons/${id}`, data);

export const deleteCoupon = (id) => API.delete(`/coupons/${id}`);

export const toggleCouponStatus = (id) => API.put(`/coupons/${id}/toggle-status`);

// User-side coupon APIs
export const getAvailableCoupons = () => API.get("/coupons/available");

export const validateCoupon = (data) => API.post("/coupons/validate", data);

export const markCouponAsUsed = (couponId) => API.post("/coupons/mark-used", { couponId });