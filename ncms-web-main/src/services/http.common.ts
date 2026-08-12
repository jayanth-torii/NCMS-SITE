import axios from "axios";
import { BASE_URL } from "@/config/apiService";

// Single Axios instance for the public site. Runs in both Server Components
// and Client Components (browser), so the base URL resolves from the config.
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || BASE_URL).replace(/\/+$/, "");

const httpCommon = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 8000,
});

// Response interceptor unwraps to response.data, so every caller gets the
// parsed `{ success, data }` body directly.
httpCommon.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export const API_BASE_URL = API_BASE;
export default httpCommon;
