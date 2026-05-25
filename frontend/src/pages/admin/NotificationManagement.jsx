import React, { useEffect, useState } from "react";
import {
  Box, Button, Chip, CircularProgress, Container, Divider,
  FormControl, InputLabel, MenuItem, Paper, Select, Stack,
  TextField, Typography, Alert
} from "@mui/material";
import { NotificationsActive, Send, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", targetUserId: "" });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.get("/notifications/admin/all");
      setNotifications(Array.isArray(data) ? data : data?.data || []);
    } catch {
      toast.error("Không thể tải danh sách thông báo");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.get("/admin/users");
      const tenants = (Array.isArray(data) ? data : data?.data || []).filter(
        (u) => u.role === "TENANT"
      );
      setUsers(tenants);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Nhập tiêu đề thông báo"); return; }
    if (!form.content.trim()) { toast.error("Nhập nội dung thông báo"); return; }

    try {
      setSending(true);
      await api.post("/notifications/admin/send", {
        title: form.title,
        content: form.content,
        targetUserId: form.targetUserId || null,
      });
      toast.success(
        form.targetUserId
          ? "Đã gửi thông báo đến người thuê được chọn"
          : "Đã gửi thông báo đến tất cả người thuê"
      );
      setForm({ title: "", content: "", targetUserId: "" });
      fetchNotifications();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gửi thất bại");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thông báo này?")) return;
    try {
      await api.delete(`/notifications/admin/${id}`);
      toast.success("Đã xóa thông báo");
      fetchNotifications();
    } catch {
      toast.error("Không thể xóa");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={800} display="flex" alignItems="center" gap={1} mb={1}>
        <NotificationsActive color="primary" />
        Gửi Thông Báo
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Gửi thông báo đến toàn bộ người thuê hoặc một người thuê cụ thể (nhắc đóng tiền, lịch bảo trì, v.v...)
      </Typography>

      {/* Form gửi thông báo */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>📢 Soạn thông báo mới</Typography>
        <Box component="form" onSubmit={handleSend}>
          <Stack spacing={2.5}>
            <FormControl fullWidth>
              <InputLabel>Gửi đến</InputLabel>
              <Select
                value={form.targetUserId}
                label="Gửi đến"
                onChange={(e) => setForm((p) => ({ ...p, targetUserId: e.target.value }))}
              >
                <MenuItem value=""><em>📣 Tất cả người thuê</em></MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    👤 {u.fullName || u.username} ({u.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth required label="Tiêu đề thông báo"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ví dụ: Nhắc thanh toán tiền tháng 6"
            />

            <TextField
              fullWidth required multiline minRows={4} label="Nội dung"
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder="Nhập nội dung chi tiết..."
            />

            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit" variant="contained" size="large"
                startIcon={sending ? <CircularProgress size={18} color="inherit" /> : <Send />}
                disabled={sending}
                sx={{ px: 4 }}
              >
                {sending ? "Đang gửi..." : "Gửi thông báo"}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Danh sách thông báo đã gửi */}
      <Typography variant="h6" fontWeight={700} mb={2}>📋 Lịch sử thông báo đã gửi</Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
      ) : notifications.length === 0 ? (
        <Alert severity="info">Chưa có thông báo nào được gửi.</Alert>
      ) : (
        <Stack spacing={2}>
          {notifications.map((n) => (
            <Paper key={n.id} sx={{ p: 2.5, borderRadius: 2, borderLeft: "4px solid", borderColor: "primary.main" }}>
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                    <Typography fontWeight={700}>{n.title}</Typography>
                    <Chip
                      size="small"
                      label={n.targetUserId ? `Riêng - ID: ${n.targetUserId}` : "Tất cả"}
                      color={n.targetUserId ? "secondary" : "primary"}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                    {n.content}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" mt={0.5} display="block">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString("vi-VN") : ""}
                  </Typography>
                </Box>
                <Button
                  size="small" color="error" startIcon={<Delete />}
                  onClick={() => handleDelete(n.id)}
                  sx={{ ml: 2, flexShrink: 0 }}
                >
                  Xóa
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default NotificationManagement;
