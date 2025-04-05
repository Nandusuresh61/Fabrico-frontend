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

export default API;