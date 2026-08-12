import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Redirects logged-out users to /login; everything else renders the children.
const Authmiddleware = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const stored = localStorage.getItem("authUser");

  if (!user && !stored) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default Authmiddleware;
