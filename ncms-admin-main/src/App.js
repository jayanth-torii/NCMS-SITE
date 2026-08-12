import React from "react";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes";

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware";
import PermissionGate from "./components/Common/PermissionGate";
import { pageKeyForPath } from "./config/adminPages";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Global imperative modals (upload + confirm) used by every editor page
import { GlobalConfirmModal } from "./components/shared";

// Import scss (Skote theme — same as NCET)
import "./assets/scss/theme.scss";
// Global disabled-control cursor (loaded after theme so it wins)
import "./assets/css/permission.css";
// Unified "View" button styling (PDF/file open buttons across all pages)
import "./assets/css/view-button.css";
// Premium toast styling (overrides react-toastify defaults)
import "./assets/css/toast.css";

const App = () => {
  return (
    <React.Fragment>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Slide} />
      <GlobalConfirmModal />
      <Routes>
        {/* Non-authenticated routes */}
        {authRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          />
        ))}

        {/* Authenticated routes */}
        {userRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <Authmiddleware pageKey={pageKeyForPath(route.path)}>
                <VerticalLayout>
                  <PermissionGate pageKey={pageKeyForPath(route.path)}>{route.component}</PermissionGate>
                </VerticalLayout>
              </Authmiddleware>
            }
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

export default App;
