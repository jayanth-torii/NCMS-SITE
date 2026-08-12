import axios from "axios";

// Single Axios instance for the admin — mirrors NCET's http.common.js.
// baseURL comes from the env (REACT_APP_BACKENDURL), defaulting to localhost.
const API_BASE = (process.env.REACT_APP_BACKENDURL || "http://localhost:4001").replace(/\/+$/, "");

const httpCommon = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT when present.
httpCommon.interceptors.request.use((config) => {
  const token = localStorage.getItem("authUser")
    ? (() => {
        try {
          return JSON.parse(localStorage.getItem("authUser")).token;
        } catch (e) {
          return localStorage.getItem("authUser");
        }
      })()
    : null;
  if (token) config.headers.Authorization = token;
  return config;
});

// Response interceptor unwraps to response.data, so every caller gets the
// parsed `{ success, data }` body directly.
httpCommon.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const API_BASE_URL = API_BASE;
export default httpCommon;
