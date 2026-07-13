import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { normalizeRole } from "../utils/authUtils";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load persisted session
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");
      setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const role = useMemo(() => {
    try {
      return normalizeRole(sessionStorage.getItem("role") || user?.role || null);
    } catch {
      return null;
    }
  }, [user]);

  const isAdmin = role === "ADMIN";
  const isTenant = role === "TENANT";

  const value = useMemo(
    () => ({
      user,
      logout,
      isAdmin,
      isTenant,
      role,
    }),
    [user, logout, isAdmin, isTenant, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

