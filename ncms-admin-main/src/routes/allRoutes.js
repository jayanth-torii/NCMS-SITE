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

// Custom NCET-style home-page editor (dedicated per-section UI)
import HomePageEditor from "../pages/HomePage/HomePageEditor";

// Custom NCET-style About NCMS editor (Content Studio)
import AboutNcmsEditor from "../pages/AboutNcms/AboutNcmsEditor";

// Custom Mandatory Disclosure editor (Document Library)
import MandatoryDisclosureEditor from "../pages/MandatoryDisclosure/MandatoryDisclosureEditor";

// Custom IQAC editor (Content Studio)
import IqacEditor from "../pages/Iqac/IqacEditor";

// Custom Library editor (Content Studio)
import LibraryEditor from "../pages/Library/LibraryEditor";

// Custom Departments Page Studio editor (overview landing page)
import DepartmentsPageEditor from "../pages/Departments/DepartmentsPageEditor";

// Custom Department Details Editor (programme selector + section tabs)
import DepartmentDetailsEditor from "../pages/Departments/DepartmentDetailsEditor";

// Custom media & news editors (Content Studio)
import SamashtiEditor from "../pages/Samashti/SamashtiEditor";
import NewsLetterEditor from "../pages/NewsLetter/NewsLetterEditor";
import NewsClippingsEditor from "../pages/NewsClippings/NewsClippingsEditor";
import EventsEditor from "../pages/Events/EventsEditor";
import GalleryEditor from "../pages/Gallery/GalleryEditor";

import { ADMIN_PAGES, PAGE_ROUTE_BY_KEY } from "../config/adminPages";

// Root entry: logged-in users land on the dashboard, everyone else on login.
const RootRedirect = () => (
  <Navigate to={localStorage.getItem("authUser") ? "/dashboard" : "/login"} replace />
);

// The single generic content-editor route covers all 44 singleton areas.
// The Home Page gets a dedicated NCET-style custom editor; everything else
// uses the generic auto-form editor.
const contentRoutes = ADMIN_PAGES.filter((p) => PAGE_ROUTE_BY_KEY[p.key]).map((p) => ({
  path: p.path,
  component:
    p.key === "home" ? (
      <HomePageEditor key={p.key} />
    ) : p.key === "about" ? (
      <AboutNcmsEditor key={p.key} />
    ) : p.key === "mandatoryDisclosure" ? (
      <MandatoryDisclosureEditor key={p.key} />
    ) : p.key === "iqac" ? (
      <IqacEditor key={p.key} />
    ) : p.key === "library" ? (
      <LibraryEditor key={p.key} />
    ) : p.key === "departmentsPage" ? (
      <DepartmentsPageEditor key={p.key} />
    ) : p.key === "samashti" ? (
      <SamashtiEditor key={p.key} />
    ) : p.key === "newsLetter" ? (
      <NewsLetterEditor key={p.key} />
    ) : p.key === "newsClippings" ? (
      <NewsClippingsEditor key={p.key} />
    ) : p.key === "event" ? (
      <EventsEditor key={p.key} />
    ) : p.key === "gallery" ? (
      <GalleryEditor key={p.key} />
    ) : (
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
  { path: "/department-details-editor", component: <DepartmentDetailsEditor /> },
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
