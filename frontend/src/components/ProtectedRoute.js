import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasRole } from "../utils/authUtils";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ message: "Vui lòng đăng nhập hoặc đăng ký để tiếp tục thao tác này!", from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
