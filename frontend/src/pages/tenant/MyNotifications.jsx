import React, { useEffect, useState } from "react";
import {
  Alert, Box, Chip, CircularProgress, Container,
  Divider, Paper, Stack, Typography, Button, Tabs, Tab,
  IconButton, Tooltip, Badge
} from "@mui/material";
import { 
  Notifications, NotificationsNone, CheckCircle, 
  DeleteOutline, DoneAll, Circle, CircleOutlined 
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.get("/notifications/my");
      setNotifications(Array.isArray(data) ? data : data?.data || []);
    } catch {
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/my/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Đã đánh dấu đã đọc");
    } catch {
      toast.error("Không thể đánh dấu đã đọc");
    }
  };

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) {
      toast.info("Không có thông báo chưa đọc");
      return;
    }
    
    try {
      await api.patch("/notifications/my/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success(`Đã đánh dấu ${unreadIds.length} thông báo là đã đọc`);
    } catch {
      toast.error("Không thể đánh dấu tất cả");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notifications/my/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success("Đã xóa thông báo");
    } catch {
      toast.error("Không thể xóa thông báo");
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return !n.isRead;
    if (tabValue === 2) return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 4, 
        background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
        color: "white"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Badge badgeContent={unreadCount} color="error">
              <Notifications sx={{ fontSize: 48 }} />
            </Badge>
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Thông báo của tôi
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Cập nhật các thông báo từ chủ trọ và hệ thống
              </Typography>
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Button 
              variant="contained" 
              startIcon={<DoneAll />}
              onClick={handleMarkAllRead}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label={`Tất cả (${notifications.length})`} />
          <Tab label={`Chưa đọc (${unreadCount})`} />
          <Tab label={`Đã đọc (${notifications.length - unreadCount})`} />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : filteredNotifications.length === 0 ? (
        <Alert severity="info" icon={<NotificationsNone />} sx={{ borderRadius: 3 }}>
          {tabValue === 0 ? "Chưa có thông báo nào" : 
           tabValue === 1 ? "Không có thông báo chưa đọc" : 
           "Không có thông báo đã đọc"}
        </Alert>
      ) : (
        <Stack spacing={2}>
          {filteredNotifications.map((n, index) => (
            <Paper
              key={n.id}
              sx={{
                p: 3,
                borderRadius: 3,
                borderLeft: "4px solid",
                borderColor: n.isRead ? "#cbd5e1" : "#0f766e",
                bgcolor: n.isRead ? "#ffffff" : "#f0fdf9",
                transition: "all 0.3s ease",
                "&:hover": { boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }
              }}
            >
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" gap={1.5} mb={1}>
                    {n.isRead ? (
                      <CircleOutlined sx={{ fontSize: 12, color: "#94a3b8" }} />
                    ) : (
                      <Circle sx={{ fontSize: 12, color: "#0f766e" }} />
                    )}
                    <Typography fontWeight={700} color={n.isRead ? "text.secondary" : "text.primary"}>
                      {n.title}
                    </Typography>
                    {!n.isRead && (
                      <Chip label="Mới" color="error" size="small" sx={{ height: 20, fontSize: 11, fontWeight: 600 }} />
                    )}
                  </Stack>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {n.content}
                  </Typography>
                  
                  <Typography variant="caption" color="text.disabled" display="block" mt={1.5}>
                    🕐 {n.createdAt ? new Date(n.createdAt).toLocaleString("vi-VN") : "Vừa xong"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  {!n.isRead && (
                    <Tooltip title="Đánh dấu đã đọc">
                      <IconButton size="small" onClick={() => handleMarkRead(n.id)} sx={{ color: "#0f766e" }}>
                        <CheckCircle />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Xóa">
                    <IconButton size="small" onClick={() => handleDelete(n.id)} sx={{ color: "#ef4444" }}>
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default MyNotifications;