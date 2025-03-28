import API from "./api"

// Get all addresses
export const getAllAddressesApi = () => API.get("/addresses");

// Add new address
export const addAddressApi = (data) => API.post("/addresses", data);

// Update address
export const updateAddressApi = (id, data) => API.put(`/addresses/${id}`, data);

// Delete address
export const deleteAddressApi = (id) => API.delete(`/addresses/${id}`);

// Set default address
export const setDefaultAddressApi = (id) => API.put(`/addresses/${id}/default`);
