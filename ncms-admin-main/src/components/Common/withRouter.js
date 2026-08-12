import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// RRD v6 HOC wrapper — same helper as NCET's components/Common/withRouter.js
const withRouter = (Component) => (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  return <Component {...props} router={{ location, navigate, params }} />;
};

export default withRouter;
