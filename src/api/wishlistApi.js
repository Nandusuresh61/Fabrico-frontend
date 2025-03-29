import API from "./api";

export const getWishlistApi = () => API.get("/wishlist");
export const addToWishlistApi = (data) => API.post("/wishlist", data);
export const removeFromWishlistApi = (itemId) => API.delete(`/wishlist/${itemId}`);
