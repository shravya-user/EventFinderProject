import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // 🔧 change if your backend runs elsewhere
});

// ✅ Attach token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Auto-redirect on unauthorized (401)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // 🔐 Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
