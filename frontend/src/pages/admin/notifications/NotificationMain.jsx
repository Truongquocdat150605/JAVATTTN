import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  LinearProgress,
} from "@mui/material";
import { NotificationsActive, Refresh } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../../services/api";

import NotificationForm from "./NotificationForm";
import NotificationHistory from "./NotificationHistory";

const NotificationMain = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifRes, userRes] = await Promise.all([
        api.get("/notifications/admin/all"),
        api.get("/admin/users"),
      ]);
      setNotifications(Array.isArray(notifRes) ? notifRes : []);
      setUsers((Array.isArray(userRes) ? userRes : []).filter((u) => u.role === "TENANT"));
    } catch {
      toast.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = {
    total: notifications.length,
    allUsers: notifications.filter((n) => n.broadcast).length,
    specific: notifications.filter((n) => !n.broadcast).length,
  };

  if (loading && !notifications.length) return <LinearProgress />;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f766e, #0d9488)",
            color: "white",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <NotificationsActive sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Quản Lý Thông Báo
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Gửi thông báo đến khách thuê
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchData}
              sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
            >
              Làm mới
            </Button>
          </Box>
        </Paper>

        {/* Stats Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "Tổng thông báo", value: stats.total, color: "#0f766e" },
            { label: "Gửi tất cả", value: stats.allUsers, color: "#3b82f6" },
            { label: "Gửi riêng", value: stats.specific, color: "#10b981" },
          ].map((item, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  bgcolor: idx === 1 ? "#dbeafe" : idx === 2 ? "#d1fae5" : "white",
                }}
              >
                <Typography variant="h4" fontWeight={900} color={item.color}>
                  {item.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Content Layout */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={5}>
            <NotificationForm users={users} onSuccess={fetchData} />
          </Grid>
          <Grid item xs={12} lg={7}>
            <NotificationHistory
              notifications={notifications}
              users={users}
              stats={stats}
              onDeleteSuccess={fetchData}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default NotificationMain;
