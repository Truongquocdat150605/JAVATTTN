export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    return null;
  }
};

export const getRole = () => {
  const user = getCurrentUser();
  return localStorage.getItem("role") || user?.role || "";
};

export const hasRole = (requiredRole) => {
  if (!requiredRole) return true;
  return getRole() === requiredRole;
};
