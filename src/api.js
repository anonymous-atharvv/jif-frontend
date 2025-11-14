// src/api.js
import axios from "axios";

// 🔥 Your live backend URL
export const BASE_URL = "https://anonymousananta-jif-backend.hf.space";

// ------------------------------------------------------------
// Create axios instance
// ------------------------------------------------------------
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 sec
});

// ------------------------------------------------------------
// Auto-Inject Token for All Requests
// ------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jif_token");

    // For all normal JSON requests → use Authorization header
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------------------------
// Helper (POST with token in body for HF backend compatibility)
// ------------------------------------------------------------
export const postWithToken = (url, data = {}) => {
  const token = localStorage.getItem("jif_token");

  // Only attach token in body if NOT FormData
  if (!(data instanceof FormData)) {
    data.token = token;
  }

  return api.post(url, data);
};

// ------------------------------------------------------------
// File Upload Helper (Documents Upload)
// ------------------------------------------------------------
export const uploadFile = (url, file, extraFields = {}) => {
  const formData = new FormData();
  const token = localStorage.getItem("jif_token");

  // Required by backend
  formData.append("token", token);
  formData.append("file", file);

  Object.entries(extraFields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return api.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ------------------------------------------------------------
// Standard GET wrapper (auto appends ?token=)
// ------------------------------------------------------------
export const getWithToken = (url) => {
  const token = localStorage.getItem("jif_token");
  return api.get(`${url}?token=${token}`);
};

export default api;
