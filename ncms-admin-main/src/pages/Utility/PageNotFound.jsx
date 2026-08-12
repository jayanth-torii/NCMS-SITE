import React from "react";
import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import { Button } from "reactstrap";

const PageNotFound = () => (
  <div style={{ textAlign: "center", padding: "5rem 1rem" }}>
    <FiAlertTriangle size={48} style={{ color: "#f6872a", marginBottom: 16 }} />
    <h2 style={{ color: "#0e2455", fontWeight: 800 }}>404 — Page Not Found</h2>
    <p style={{ color: "#6b7192" }}>The page you're looking for doesn't exist.</p>
    <Link to="/dashboard">
      <Button color="primary" style={{ marginTop: 12 }}>Back to Dashboard</Button>
    </Link>
  </div>
);

export default PageNotFound;
