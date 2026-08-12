import httpCommon from "./http.common";

// Global HTTP wrapper functions — same convention as NCET's httpServices.js.
export const getRequest = async (url, config = {}) => {
  return await httpCommon.get(url, config);
};

export const postRequest = async (url, data, config = {}) => {
  return await httpCommon.post(url, data, config);
};

export const putRequest = async (url, data, config = {}) => {
  return await httpCommon.put(url, data, config);
};

export const deleteRequest = async (url, config = {}) => {
  return await httpCommon.delete(url, config);
};
