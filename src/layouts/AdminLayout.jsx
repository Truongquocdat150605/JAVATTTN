import React, { useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings,
  Assessment,
  Build,
  ContactMail,
  Dashboard,
  Description,
  Home,
  LocalOffer,
  Logout,
  MeetingRoom,
  Notifications,
  Payments,
  PeopleAlt,
  ReceiptLong,
} from "@mui/icons-material";

const DRAWER_WIDTH = 270;

const adminMenu = [
  { to: "/admin/dashboard", label: "Tổng quan", icon: <Dashboard /> },
  { to: "/admin/reports", label: "Báo cáo", icon: <Assessment /> },
  { to: "/admin/rooms", label: "Quản lý phòng", icon: <MeetingRoom /> },
  { to: "/admin/contracts", label: "Hợp đồng", icon: <Description /> },
  { to: "/admin/invoices", label: "Hóa đơn", icon: <ReceiptLong /> },
  { to: "/admin/expenses", label: "Chi phí/Dịch vụ", icon: <Payments /> },
  { to: "/admin/services", label: "Dịch vụ phụ", icon: <LocalOffer /> },
  { to: "/admin/notifications", label: "Thông báo", icon: <Notifications /> },
  { to: "/admin/maintenance", label: "Bảo trì", icon: <Build /> },
  { to: "/admin/requests", label: "Yêu cầu thuê", icon: <ContactMail /> },
  { to: "/admin/users", label: "Khách thuê", icon: <PeopleAlt /> },
];

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = useMemo(() => getUser(), []);
  const username = user?.fullName || user?.username || "Admin";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f3f6fb" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#ffffff",
          color: "#0f172a",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar sx={{ minHeight: "68px !important", px: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                bgcolor: "#0f766e",
                color: "white",
                display: "grid",
                placeItems: "center",
              }}
            >
              <AdminPanelSettings />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Smart Phòng Trọ
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                Bảng điều khiển quản trị
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Button startIcon={<Home />} onClick={() => navigate("/")} sx={{ fontWeight: 800 }}>
              Xem website
            </Button>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ bgcolor: "#0f766e", width: 36, height: 36 }}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>{username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  ADMIN
                </Typography>
              </Box>
            </Stack>
            <Button color="error" startIcon={<Logout />} onClick={logout} sx={{ fontWeight: 800 }}>
              Đăng xuất
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
            bgcolor: "#0f172a",
            color: "white",
          },
        }}
      >
        <Toolbar sx={{ minHeight: "68px !important" }} />
        <Box sx={{ p: 2 }}>
          <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 900, px: 1.5 }}>
            Chức năng quản trị
          </Typography>
          <Stack spacing={0.75} sx={{ mt: 1 }}>
            {adminMenu.map((item) => (
              <Box
                key={item.to}
                component={NavLink}
                to={item.to}
                end={item.to === "/admin/dashboard"}
                sx={{
                  color: "#cbd5e1",
                  textDecoration: "none",
                  borderRadius: 2,
                  px: 1.5,
                  py: 1.2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  fontWeight: 800,
                  fontSize: 14,
                  "& svg": { fontSize: 21 },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                  },
                  "&.active": {
                    bgcolor: "#0f766e",
                    color: "#ffffff",
                    boxShadow: "0 12px 28px rgba(15,118,110,0.35)",
                  },
                }}
              >
                {item.icon}
                {item.label}
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />
          <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 700 }}>
            Quản lý phòng, hợp đồng, hóa đơn và khách thuê trong một hệ thống.
          </Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          ml: `${DRAWER_WIDTH}px`,
          pt: "68px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
        <Box
          component="footer"
          sx={{
            px: 3,
            py: 2,
            bgcolor: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            color: "#64748b",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          © 2026 Smart Phòng Trọ - Admin Console
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
