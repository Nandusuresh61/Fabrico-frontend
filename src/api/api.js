import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
  });

export default API;


export const userRegApi = (data) => API.post("/users/register", data)
export const userLoginApi = (data) => API.post("/users/login", data)