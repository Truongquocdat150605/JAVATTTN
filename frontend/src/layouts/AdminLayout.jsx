import React, { useMemo, useState, useCallback, memo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
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
  Menu as MenuIcon,
  ChevronLeft,
} from "@mui/icons-material";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

// Menu items data
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

// Memoized menu item component
const MenuItemComponent = memo(({ item, collapsed }) => (
  <Tooltip key={item.to} title={collapsed ? item.label : ""} placement="right">
    <Box
      component={NavLink}
      to={item.to}
      end={item.to === "/admin/dashboard"}
      sx={{
        color: "#cbd5e1",
        textDecoration: "none",
        borderRadius: 2,
        px: collapsed ? 1 : 1.5,
        py: 1.2,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: collapsed ? 0 : 1.5,
        fontWeight: 800,
        fontSize: 14,
        transition: "all 0.2s ease",
        "& svg": { fontSize: 21 },
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.08)",
          color: "#ffffff",
          transform: "translateX(4px)",
        },
        "&.active": {
          bgcolor: "#0f766e",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(15,118,110,0.3)",
        },
      }}
    >
      {item.icon}
      {!collapsed && item.label}
    </Box>
  </Tooltip>
));

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

  // Chỉ gọi API unread count khi hover hoặc click vào icon
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
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "#ffffff",
          color: "#1e293b",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important", px: 3 }}>
          <IconButton 
            onClick={() => setCollapsed(!collapsed)}
            sx={{ mr: 2, color: "inherit" }}
          >
            {collapsed ? <MenuIcon /> : <ChevronLeft />}
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 45,
                height: 45,
                borderRadius: 2,
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                color: "white",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 4px 12px rgba(15,118,110,0.3)",
              }}
            >
              <AdminPanelSettings />
            </Box>
            {!collapsed && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                  Smart Phòng Trọ
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Bảng điều khiển quản trị
                </Typography>
              </Box>
            )}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip title="Xem website">
              <Button 
                startIcon={<Home />} 
                onClick={() => navigate("/")} 
                sx={{ 
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none"
                }}
              >
                {!collapsed && "Xem website"}
              </Button>
            </Tooltip>

            <Tooltip title={unreadCount > 0 ? `Có ${unreadCount} thông báo chưa đọc` : "Không có thông báo mới"}>
              <IconButton 
                sx={{ color: "inherit" }} 
                onClick={() => navigate("/my-notifications")}
                onMouseEnter={handleNotificationHover}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar 
                sx={{ 
                  bgcolor: "#0f766e", 
                  width: 40, 
                  height: 40,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 }
                }}
                onClick={handleMenuOpen}
              >
                {username.charAt(0).toUpperCase()}
              </Avatar>
              {!collapsed && (
                <Box>
                  <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>{username}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    ADMIN
                  </Typography>
                </Box>
              )}
            </Stack>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/profile"); }}>
                <Typography>Hồ sơ cá nhân</Typography>
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate("/change-password"); }}>
                <Typography>Đổi mật khẩu</Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { handleMenuClose(); logout(); }} sx={{ color: "#ef4444" }}>
                <Typography>Đăng xuất</Typography>
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid #e2e8f0",
            bgcolor: "#0f172a",
            color: "white",
            transition: "width 0.3s ease",
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar sx={{ minHeight: "70px !important" }} />
        <Box sx={{ p: 2 }}>
          {!collapsed && (
            <Typography variant="overline" sx={{ color: "#94a3b8", fontWeight: 900, px: 1.5 }}>
              Chức năng quản trị
            </Typography>
          )}
          <Stack spacing={1} sx={{ mt: 1 }}>
            {adminMenu.map((item) => (
              <MenuItemComponent key={item.to} item={item} collapsed={collapsed} />
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", mb: 2 }} />
          {!collapsed && (
            <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: 12 }}>
              Quản lý phòng, hợp đồng, hóa đơn và khách thuê trong một hệ thống.
            </Typography>
          )}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          ml: collapsed ? `${COLLAPSED_WIDTH}px` : `${DRAWER_WIDTH}px`,
          pt: "70px",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
        {!collapsed && (
          <Box
            component="footer"
            sx={{
              px: 3,
              py: 2,
              bgcolor: "#ffffff",
              borderTop: "1px solid #e2e8f0",
              color: "#64748b",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            © 2026 Smart Phòng Trọ - Admin Console
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminLayout;