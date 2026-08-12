import { getRequest, postRequest, putRequest, deleteRequest } from "./httpServices";
import { API_ROUTES } from "./route";

/* ---------------- Auth ---------------- */

// STEP 1: validate credentials. Returns { preAuthToken, user:{name,email}, otp }.
export const loginUser = async (data) => {
  const response = await postRequest(API_ROUTES.AUTH.LOGIN, data);
  return response;
};

// STEP 2: exchange the pre-auth token for the real session token once the OTP
// has been confirmed.
export const verifyLogin = async (data) => {
  const response = await postRequest(API_ROUTES.AUTH.LOGIN_VERIFY, data);
  return response;
};

export const updatePassword = async (data) => {
  const response = await postRequest(API_ROUTES.AUTH.UPDATE_PASSWORD, data);
  return response;
};

export const getMe = async () => {
  const response = await getRequest(API_ROUTES.AUTH.ME);
  return response;
};

/* ---------------- User management (admin-only) ---------------- */

export const getUsers = async () => {
  return await getRequest(API_ROUTES.USERS.GET);
};

export const createUser = async (data) => {
  return await postRequest(API_ROUTES.USERS.ADD, data);
};

export const updateUser = async (id, data) => {
  return await putRequest(`${API_ROUTES.USERS.BASE}/${id}`, data);
};

export const deleteUser = async (id) => {
  return await deleteRequest(`${API_ROUTES.USERS.BASE}/${id}`);
};

/* ---------------- Blogs ---------------- */

export const getBlogs = async () => {
  return await getRequest(API_ROUTES.BLOGS.GET);
};

export const getBlog = async (id) => {
  return await getRequest(`${API_ROUTES.BLOGS.BASE}/${id}`);
};

export const createBlog = async (data) => {
  return await postRequest(API_ROUTES.BLOGS.ADD, data);
};

export const updateBlog = async (id, data) => {
  return await putRequest(`${API_ROUTES.BLOGS.BASE}/${id}`, data);
};

export const deleteBlog = async (id) => {
  return await deleteRequest(`${API_ROUTES.BLOGS.BASE}/${id}`);
};

/* ---------------- Form submissions inbox ---------------- */

export const getApplyNowForms = async () => {
  return await getRequest(API_ROUTES.APPLY_NOW_FORMS.GET);
};

export const deleteApplyNowForm = async (id) => {
  return await deleteRequest(`${API_ROUTES.APPLY_NOW_FORMS.BASE}/${id}`);
};

export const getContactUsForms = async () => {
  return await getRequest(API_ROUTES.CONTACT_US_FORMS.GET);
};

export const deleteContactUsForm = async (id) => {
  return await deleteRequest(`${API_ROUTES.CONTACT_US_FORMS.BASE}/${id}`);
};

/* ---------------- Generic singleton content areas ---------------- */

// The backend stores each area's whole payload in a single doc's `data` field.
// getContent returns that payload object; updateContent PUTs it back.
export const getContent = async (route) => {
  const res = await getRequest(route);
  // res.data is the mongoose doc { _id, data: {...}, ... } — unwrap `.data`
  return res?.data?.data ?? res?.data ?? null;
};

export const updateContent = async (route, payload) => {
  return await putRequest(route, { data: payload });
};

/* ---------------- Upload ---------------- */

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await postRequest(API_ROUTES.UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
