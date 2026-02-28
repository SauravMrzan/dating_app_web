import axios from "axios";
import { getAuthToken } from "../cookie";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // keep cookies/session if needed
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
    // Axios will auto-set it correctly for FormData or JSON
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * RESPONSE INTERCEPTOR
 * Normalize error messages for cleaner handling in UI
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Server Error";

    if (error.response) {
      const status = error.response.status;

      // Prefer backend-provided message
      message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.message ||
        message;

      // ✅ Friendly overrides for common cases
      if (status === 403) {
        message = "You can only chat with mutual matches.";
      } else if (status === 401) {
        message = "Your session has expired. Please log in again.";
      } else if (status === 404) {
        message = "Requested resource not found.";
      } else if (status >= 500) {
        message = "Something went wrong on the server.";
      }
    } else if (error.request) {
      message = "No response from server. Please check your connection.";
    } else {
      message = error.message || message;
    }

    return Promise.reject({
      ...error,
      message,
    });
  },
);

export default axiosInstance;
