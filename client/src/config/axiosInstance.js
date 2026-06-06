import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/`
  : "import.meta.env.VITE_API_URL || "http://localhost:6600"/api/";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = BASE_URL;
export default axiosInstance;