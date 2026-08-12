import React from "react";
import { useSelector } from "react-redux";
import { canReadPage, canWritePage } from "../../store/slices/authSlice";

// Wraps a page and gates it by the user's read/write permission for a page key.
// Admins pass everything.
const PermissionGate = ({ pageKey, write = false, children, fallback = null }) => {
  const allowed = useSelector((state) =>
    write ? canWritePage(state, pageKey) : canReadPage(state, pageKey)
  );
  if (!allowed) return fallback;
  return <>{children}</>;
};

export default PermissionGate;
