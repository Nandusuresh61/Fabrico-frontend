import axios from "axios";
import { setupCsrfToken } from "../utils/csrf";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle CSRF token expiry
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 && error.response?.data?.csrf === false) {
      // CSRF token expired or invalid
      await setupCsrfToken();
      // Retry the original request
      return API(error.config);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to handle multipart form data
API.interceptors.request.use(
  (config) => {
    // Check if the request data is FormData
    if (config.data instanceof FormData) {
      // Remove the Content-Type header to let the browser set it with the boundary
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;