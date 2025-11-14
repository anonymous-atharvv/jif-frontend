import axios from "axios";

export const BASE_URL = "https://anonymousananta-jif-backend.hf.space";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 50000
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jif_token");

  // Add header token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // If body exists and NOT FormData → attach token
  if (config.data && !(config.data instanceof FormData)) {
    config.data.token = config.data.token || token || null;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("jif_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default {
  get: (url, options) => api.get(url, options),
  post: (url, data, options) => api.post(url, data, options),
  put: (url, data, options) => api.put(url, data, options),
  delete: (url, options) => api.delete(url, options)
};
