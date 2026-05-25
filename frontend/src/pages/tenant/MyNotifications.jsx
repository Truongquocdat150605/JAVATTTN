import React, { useEffect, useState } from "react";
import {
  Alert, Box, Chip, CircularProgress, Container,
  Divider, Paper, Stack, Typography, Button
} from "@mui/material";
import { Notifications, NotificationsNone, CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const MyNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch {
      toast.error("Không thể đánh dấu đã đọc");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" gap={1.5} mb={3}>
        <Notifications color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h5" fontWeight={700}>Thông báo của tôi</Typography>
          {unreadCount > 0 && (
            <Typography variant="body2" color="error">
              Bạn có {unreadCount} thông báo chưa đọc
            </Typography>
          )}
        </Box>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Alert severity="info" icon={<NotificationsNone />}>
          Chưa có thông báo nào. Khi có thông báo từ chủ trọ, chúng sẽ hiện ở đây.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {notifications.map((n) => (
            <Paper
              key={n.id}
              sx={{
                p: 2.5,
                borderRadius: 2,
                borderLeft: "4px solid",
                borderColor: n.isRead ? "grey.300" : "primary.main",
                bgcolor: n.isRead ? "grey.50" : "primary.50",
                opacity: n.isRead ? 0.75 : 1,
                transition: "all 0.2s",
              }}
            >
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                    <Typography fontWeight={700} color={n.isRead ? "text.secondary" : "text.primary"}>
                      {n.title}
                    </Typography>
                    {!n.isRead && (
                      <Chip label="Mới" color="error" size="small" sx={{ height: 20, fontSize: 11 }} />
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                    {n.content}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" display="block" mt={1}>
                    🕐 {n.createdAt ? new Date(n.createdAt).toLocaleString("vi-VN") : ""}
                  </Typography>
                </Box>

                {!n.isRead && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<CheckCircle />}
                    onClick={() => handleMarkRead(n.id)}
                    sx={{ flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    Đã đọc
                  </Button>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default MyNotifications;
