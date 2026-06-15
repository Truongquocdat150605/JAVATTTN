import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { hasRole } from "../utils/authUtils";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
