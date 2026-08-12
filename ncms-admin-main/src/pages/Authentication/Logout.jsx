import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../../store/slices/authSlice";

const Logout = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    history("/login");
  }, [dispatch, history]);

  return <></>;
};

export default Logout;
