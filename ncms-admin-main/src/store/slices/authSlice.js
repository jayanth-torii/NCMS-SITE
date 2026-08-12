import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, verifyLogin, getMe } from "../../services/data.service";

// STEP 1: validate credentials -> returns preAuthToken + otp
export const login = createAsyncThunk("auth/login", async (payload) => {
  return await loginUser(payload);
});

// STEP 2: verify OTP -> returns { token, user }
export const completeLogin = createAsyncThunk("auth/completeLogin", async (payload) => {
  return await verifyLogin(payload);
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async () => {
  const res = await getMe();
  return res.user;
});

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("authUser") || "null");
  } catch (e) {
    return null;
  }
})();

const initialState = {
  user: storedUser?.user || null,
  token: storedUser?.token || null,
  preAuthToken: null,
  otpRequired: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.preAuthToken = null;
      localStorage.removeItem("authUser");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.preAuthToken = action.payload.preAuthToken;
        state.otpRequired = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Login failed";
      })
      .addCase(completeLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.otpRequired = false;
        localStorage.setItem("authUser", JSON.stringify(action.payload));
      })
      .addCase(completeLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "OTP verification failed";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          try {
            const cur = JSON.parse(localStorage.getItem("authUser") || "{}");
            localStorage.setItem("authUser", JSON.stringify({ ...cur, user: action.payload }));
          } catch (e) {
            /* noop */
          }
        }
      });
  },
});

// Selector helpers — accept EITHER the redux state ({ auth: { user } }) or a
// plain user object (used by the sidebar which reads localStorage directly),
// exactly like NCET's authSlice.
const getUser = (arg) => (arg && arg.auth && arg.auth.user ? arg.auth.user : arg);

const isAdmin = (u) => !!u && u.role === "admin";

const findPerm = (u, key) => (u && Array.isArray(u.permissions) ? u.permissions.find((p) => p.page === key) : null);

export const canReadPage = (user, key) => {
  const u = getUser(user);
  if (!u) return false;
  if (isAdmin(u)) return true;
  // Dashboard is the safe landing page — always readable for any logged-in user.
  if (key === "dashboard") return true;
  const perm = findPerm(u, key);
  return !!(perm && perm.read);
};

export const canWritePage = (user, key) => {
  const u = getUser(user);
  if (!u) return false;
  if (isAdmin(u)) return true;
  const perm = findPerm(u, key);
  return !!(perm && perm.write);
};

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
