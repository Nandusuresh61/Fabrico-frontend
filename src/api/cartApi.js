import API from "./api"

export const getCartApi = () => API.get("/cart")
export const addToCartApi = (data) => API.post("/cart", data)
export const removeFromCartApi = (itemId) => API.delete(`/cart/${itemId}`)
