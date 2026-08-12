import React from "react";
import { Navigate } from "react-router-dom";

// Profile
import Profile from "../pages/Profile";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

// 404 (catch-all)
import PageNotFound from "../pages/Utility/PageNotFound";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import ChangePassword from "../pages/Authentication/ChangePassword";

// User management (role-based access control)
import Users from "../pages/Users";

// Blog posts (collection content editor)
import BlogsList from "../pages/Blogs/BlogsList";
import BlogEdit from "../pages/Blogs/BlogEdit";

// Form submissions inbox
import SubmissionsInbox from "../pages/Submissions/SubmissionsInbox";

// Generic singleton content editor (44 content areas)
import ContentEditor from "../pages/ContentEditor/ContentEditor";

import { ADMIN_PAGES, PAGE_ROUTE_BY_KEY } from "../config/adminPages";

// Root entry: logged-in users land on the dashboard, everyone else on login.
const RootRedirect = () => (
  <Navigate to={localStorage.getItem("authUser") ? "/dashboard" : "/login"} replace />
);

// The single generic content-editor route covers all 44 singleton areas.
const contentRoutes = ADMIN_PAGES.filter((p) => PAGE_ROUTE_BY_KEY[p.key]).map((p) => ({
  path: p.path,
  component: (
    <ContentEditor
      key={p.key}
      title={p.label}
      route={PAGE_ROUTE_BY_KEY[p.key]}
      pageKey={p.key}
    />
  ),
}));

const userRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/profile", component: <Profile /> },
  { path: "/users", component: <Users /> },
  { path: "/blogs", component: <BlogsList /> },
  { path: "/blogs/new", component: <BlogEdit /> },
  { path: "/blogs/:postId", component: <BlogEdit /> },
  { path: "/submissions/apply-now", component: <SubmissionsInbox kind="apply-now" /> },
  { path: "/submissions/contact-us", component: <SubmissionsInbox kind="contact-us" /> },
  { path: "/site-settings", component: <ContentEditor title="Site Settings" route="/api/home" pageKey="site" /> },
  ...contentRoutes,
  { path: "*", component: <PageNotFound /> },
];

const authRoutes = [
  // Root: send logged-in users to the dashboard, everyone else to login.
  { path: "/", exact: true, component: <RootRedirect /> },
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/changepassword", component: <ChangePassword /> },
  { path: "*", component: <PageNotFound /> },
];

export { userRoutes, authRoutes };
