export const getCurrentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch (error) {
    return null;
  }
};

export const getRole = () => {
  const user = getCurrentUser();
  return sessionStorage.getItem("role") || user?.role || "";
};

export const hasRole = (requiredRole) => {
  if (!requiredRole) return true;
  return getRole() === requiredRole;
};
