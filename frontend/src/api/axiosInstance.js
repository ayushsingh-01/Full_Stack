import axios from "axios";
import { errorToast } from "../utils/toast";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

// Request interceptor - Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't show error toast for expected 401s on /auth/me
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/me')) {
      errorToast("Unauthorized request")
      localStorage.removeItem('token');
      window.location.href = '/login';
      console.log("Unauthorized request");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;