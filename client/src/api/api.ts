import axios from "axios";
import { useError } from "../context/ErrorContext";

// Base URL from .env or fallback
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hook to inject global error handling
export const useApi = () => {
  const { setErrors } = useError();

  api.interceptors.response.use(
    (response) => {
      setErrors([]); // clear errors on success
      return response;
    },
    (error) => {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        if (Array.isArray(data.errors)) {
          setErrors(data.errors);
        } else if (typeof data.message === "string") {
          setErrors([data.message]);
        } else {
          setErrors(["An unexpected server error occurred."]);
        }
      } else {
        setErrors(["Network error. Please check your connection."]);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default api;
