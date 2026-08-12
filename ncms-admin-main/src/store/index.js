import { createStore, applyMiddleware, compose } from "redux"
import thunk from "redux-thunk"

import rootReducer from "./reducers"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// RTK slices + plain reducers (layout/breadcrumb) in one store — same shape as
// NCET's store/index.js minus the sagas (NCMS uses RTK thunks only).
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
)

export default store
