import { combineReducers } from "redux"

// Layout (Skote theme)
import Layout from "./layout/reducer"

// Breadcrumb
import Breadcrumb from "./Breadcrumb/reducer"

// Role-based auth (Redux Toolkit slices)
import auth from "./slices/authSlice"

const rootReducer = combineReducers({
  Layout,
  Breadcrumb,
  auth,
})

export default rootReducer
