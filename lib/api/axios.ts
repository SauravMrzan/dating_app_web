import axios from "axios";
import { getAuthToken } from "../cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // future-proof (cookies/session)
  timeout: 15000,
});

/**
 * REQUEST INTERCEPTOR
 * Attach JWT token if available
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ❗ DO NOT manually set Content-Type here
    // Axios will auto-set it correctly for FormData
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * RESPONSE INTERCEPTOR (clean error handling)
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Server Error";

    return Promise.reject({
      ...error,
      message,
    });
  },
);

export default axiosInstance;
