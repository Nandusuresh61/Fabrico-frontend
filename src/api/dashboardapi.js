import API from "./api";

export const getDashboardStats = () => API.get("/dashboard/stats");

export const getSalesData = (params) => API.get("/dashboard/sales", { params });

export const getTopProducts = () => API.get("/dashboard/top-products");

export const getTopCategories = () => API.get("/dashboard/top-categories");

export const getTopBrands = () => API.get("/dashboard/top-brands");

export const getLedgerBook = (params) => API.get("/dashboard/ledger", { params });