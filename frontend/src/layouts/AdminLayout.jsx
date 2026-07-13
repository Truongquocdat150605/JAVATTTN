/**
 * @file AdminLayout.jsx
 * @description Bố cục chung cho toàn bộ phân hệ Admin (gồm Header và Sidebar).
 * @module layouts
 */
import React, { useMemo, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Dashboard, Assessment, MeetingRoom, LocalOffer, Build, ContactMail, Description, PeopleAlt, ReceiptLong, Payments, Notifications } from "@mui/icons-material";
import api from "../services/api";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

// Menu items grouped logically
const adminMenuGroups = [
  {
    title: "TỔNG QUAN",
    items: [
      { to: "/admin/dashboard", label: "Bảng điều khiển", icon: <Dashboard /> },
      { to: "/admin/reports", label: "Báo cáo thống kê", icon: <Assessment /> },
    ]
  },
  {
    title: "QUẢN LÝ TÀI SẢN",
    items: [
      { to: "/admin/rooms", label: "Danh sách Phòng", icon: <MeetingRoom /> },
      { to: "/admin/services", label: "Dịch vụ (Điện, Nước...)", icon: <LocalOffer /> },
      { to: "/admin/maintenance", label: "Bảo trì & Sửa chữa", icon: <Build /> },
    ]
  },
  {
    title: "KHÁCH & HỢP ĐỒNG",
    items: [
      { to: "/admin/requests", label: "Yêu cầu & Liên hệ", icon: <ContactMail /> },
      { to: "/admin/contracts", label: "Hợp đồng thuê", icon: <Description /> },
      { to: "/admin/users", label: "Danh sách Khách", icon: <PeopleAlt /> },
    ]
  },
  {
    title: "TÀI CHÍNH",
    items: [
      { to: "/admin/invoices", label: "Hóa đơn thu", icon: <ReceiptLong /> },
      { to: "/admin/expenses", label: "Chi phí vận hành", icon: <Payments /> },
    ]
  },
  {
    title: "HỆ THỐNG",
    items: [
      { to: "/admin/notifications", label: "Thông báo & Tin tức", icon: <Notifications /> },
    ]
  }
];

const getUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useMemo(() => getUser(), []);
  const username = user?.fullName || user?.username || "Admin";

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleNotificationHover = useCallback(async () => {
    try {
      const res = await api.get("/notifications/my/unread-count");
      setUnreadCount(res?.count || 0);
    } catch (error) {
      console.error("Lỗi lấy thông báo:", error);
    }
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <AdminHeader
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        unreadCount={unreadCount}
        handleNotificationHover={handleNotificationHover}
        username={username}
        handleMenuOpen={handleMenuOpen}
        anchorEl={anchorEl}
        handleMenuClose={handleMenuClose}
        logout={logout}
      />

      <AdminSidebar collapsed={collapsed} adminMenuGroups={adminMenuGroups} />

      <Box component="main" sx={{ ml: collapsed ? `${COLLAPSED_WIDTH}px` : `${DRAWER_WIDTH}px`, pt: "70px", minHeight: "100vh", display: "flex", flexDirection: "column", transition: "margin-left 0.3s ease" }}>
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
        {!collapsed && (
          <Box component="footer" sx={{ px: 3, py: 2, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0", color: "#64748b", textAlign: "center", fontSize: 13, fontWeight: 700 }}>
            © 2026 Smart Phòng Trọ - Admin Console
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminLayout;