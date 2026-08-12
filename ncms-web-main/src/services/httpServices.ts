import httpCommon from "./http.common";
import type { AxiosRequestConfig } from "axios";

// Global HTTP wrapper functions — same convention as the admin panel.
// getRequest returns null (instead of throwing) when the backend is
// unreachable, so pages can fall back to their static JSON seamlessly.
export const getRequest = async <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T | null> => {
  try {
    return (await httpCommon.get(url, config)) as unknown as T;
  } catch {
    return null;
  }
};

export const postRequest = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> => {
  return (await httpCommon.post(url, data, config)) as unknown as T;
};

export const putRequest = async <T = any>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> => {
  return (await httpCommon.put(url, data, config)) as unknown as T;
};

export const deleteRequest = async <T = any>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
  return (await httpCommon.delete(url, config)) as unknown as T;
};
