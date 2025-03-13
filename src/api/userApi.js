import API from "./api"

export const userRegApi = (data) => API.post("/users/register", data)
export const userLoginApi = (data) => API.post("/users/login", data)