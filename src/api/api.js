import axios from "axios";
import { setupCsrfToken } from "../utils/csrf";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});


API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.csrf === false) {
      
      await setupCsrfToken();
     
      return API(error.config);
    }
    return Promise.reject(error);
  }
);


API.interceptors.request.use(
  (config) => {
    
    if (config.data instanceof FormData) {
      
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;