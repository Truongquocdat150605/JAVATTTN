import React from "react";
import { hasRole } from "../utils/authUtils";

const RoleBasedGuard = ({ requiredRole, children, fallback = null }) => {
  if (!hasRole(requiredRole)) {
    return fallback;
  }

  return children;
};

export default RoleBasedGuard;
