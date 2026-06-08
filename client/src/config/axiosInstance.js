import axios from "axios";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:6600") + "/api/";

const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;