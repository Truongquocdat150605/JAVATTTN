/**
 * @file AdminHeader.jsx
 * @description Thanh công cụ ngang bên trên của Admin Layout, chứa nút Toggle menu, thông báo, đăng xuất.
 * @module components/admin
 */
import React from "react";
import { AppBar, Toolbar, IconButton, Stack, Box, Typography, Tooltip, Button, Badge, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { Menu as MenuIcon, ChevronLeft, AdminPanelSettings, Home, Notifications } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ collapsed, setCollapsed, unreadCount, handleNotificationHover, username, handleMenuOpen, anchorEl, handleMenuClose, logout }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#ffffff", color: "#1e293b", borderBottom: "1px solid #e2e8f0" }}>
      <Toolbar sx={{ minHeight: "70px !important", px: 3 }}>
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ mr: 2, color: "inherit" }}>
          {collapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flex: 1 }}>
          <Box sx={{ width: 45, height: 45, borderRadius: 2, background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white", display: "grid", placeItems: "center", boxShadow: "0 4px 12px rgba(15,118,110,0.3)" }}>
            <AdminPanelSettings />
          </Box>
          {!collapsed && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.2 }}>Smart Phòng Trọ</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Bảng điều khiển quản trị</Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Tooltip title="Xem website">
            <Button startIcon={<Home />} onClick={() => navigate("/")} sx={{ fontWeight: 600, borderRadius: 2, textTransform: "none" }}>
              {!collapsed && "Xem website"}
            </Button>
          </Tooltip>

          <Tooltip title={unreadCount > 0 ? `Có ${unreadCount} thông báo chưa đọc` : "Không có thông báo mới"}>
            <IconButton sx={{ color: "inherit" }} onClick={() => navigate("/admin/notifications")} onMouseEnter={handleNotificationHover}>
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ bgcolor: "#0f766e", width: 40, height: 40, cursor: "pointer", "&:hover": { opacity: 0.8 } }} onClick={handleMenuOpen}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            {!collapsed && (
              <Box>
                <Typography sx={{ fontWeight: 800, lineHeight: 1 }}>{username}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ADMIN</Typography>
              </Box>
            )}
          </Stack>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/profile"); }}><Typography>Hồ sơ cá nhân</Typography></MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate("/admin/change-password"); }}><Typography>Đổi mật khẩu</Typography></MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleMenuClose(); logout(); }} sx={{ color: "#ef4444" }}><Typography>Đăng xuất</Typography></MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
