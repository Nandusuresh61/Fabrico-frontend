import axios from "axios";
import { setupCsrfToken } from "../utils/csrf";
import  store  from '../redux/store';
import { logoutUser } from "../redux/features/userSlice";
import { toast} from '../hooks/use-toast'


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
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.isBlocked) {
      store.dispatch(logoutUser());

      localStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      toast({
        title: "Account Blocked",
        description: "Your account has been blocked. Please contact support.",
        variant: "destructive"
      });

      setTimeout(() => {
        window.location.reload();
      }, 1500);
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