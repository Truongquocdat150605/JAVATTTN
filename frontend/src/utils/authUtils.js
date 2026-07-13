export const getCurrentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch (error) {
    return null;
  }
};

export const normalizeRole = (role) => {
  return String(role || "").replace(/^ROLE_/i, "").toUpperCase();
};

export const getRole = () => {
  const user = getCurrentUser();
  return normalizeRole(sessionStorage.getItem("role") || user?.role || "");
};

export const hasRole = (requiredRole) => {
  if (!requiredRole) return true;
  return getRole() === normalizeRole(requiredRole);
};
