import axios from "axios";

const BASE_URL = "https://anonymousananta-jif-backend.hf.space";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token to headers + optionally to JSON body if required
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jif_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
    // if POST and json, backend also accepts token in body for some endpoints — we add only if missing
    if (config.method === "post" && config.data && !(config.data instanceof FormData)) {
      config.data = { token: token, ...config.data };
    }
  }
  return config;
}, (err) => Promise.reject(err));

export default {
  get: (url, opts) => instance.get(url, opts),
  post: (url, data, opts) => instance.post(url, data, opts),
  put: (url, data, opts) => instance.put(url, data, opts),
  delete: (url, opts) => instance.delete(url, opts),
  raw: instance
};
