/**
 * @file AdminSidebar.jsx
 * @description Thanh menu điều hướng dọc bên trái của Admin Layout.
 * @module components/admin
 */
import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { Drawer, Box, Stack, Typography, Divider, Tooltip } from "@mui/material";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 80;

const MenuItemComponent = memo(({ item, collapsed }) => (
  <Tooltip key={item.to} title={collapsed ? item.label : ""} placement="right">
    <Box
      component={NavLink}
      to={item.to}
      end={item.to === "/admin/dashboard"}
      sx={{
        color: "#cbd5e1", textDecoration: "none", borderRadius: 2,
        px: collapsed ? 1 : 1.5, py: 1.2, display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start", gap: collapsed ? 0 : 1.5,
        fontWeight: 800, fontSize: 14, transition: "all 0.2s ease",
        "& svg": { fontSize: 21 },
        "&:hover": { bgcolor: "rgba(255,255,255,0.08)", color: "#ffffff", transform: "translateX(4px)" },
        "&.active": { bgcolor: "#0f766e", color: "#ffffff", boxShadow: "0 4px 12px rgba(15,118,110,0.3)" },
      }}
    >
      {item.icon}
      {!collapsed && item.label}
    </Box>
  </Tooltip>
));

const AdminSidebar = ({ collapsed, adminMenuGroups }) => (
  <Drawer
    variant="permanent"
    sx={{
      width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        width: collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
        boxSizing: "border-box", borderRight: "1px solid #e2e8f0",
        bgcolor: "#0f172a", color: "white", transition: "width 0.3s ease", overflowX: "hidden",
      },
    }}
  >
    <Box sx={{ minHeight: "70px !important" }} />
    <Box sx={{ p: 2, pb: 4 }}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {adminMenuGroups.map((group, gIdx) => (
          <Box key={gIdx}>
            {!collapsed && (
              <Typography variant="overline" sx={{ color: "#64748b", fontWeight: 900, px: 1.5, display: "block", mb: 0.5, letterSpacing: 1, fontSize: "0.7rem" }}>
                {group.title}
              </Typography>
            )}
            {collapsed && gIdx !== 0 && <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", my: 1, mx: 1 }} />}
            <Stack spacing={0.5}>
              {group.items.map((item) => (
                <MenuItemComponent key={item.to} item={item} collapsed={collapsed} />
              ))}
            </Stack>
          </Box>
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
);

export default AdminSidebar;
