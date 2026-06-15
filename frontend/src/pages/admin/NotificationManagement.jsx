import React, { useEffect, useState } from "react";
import {
  Box, Button, Chip, CircularProgress, Container, Divider,
  FormControl, InputLabel, MenuItem, Paper, Select, Stack,
  TextField, Typography, Alert, Avatar, Grid, IconButton,
  Tooltip, Tabs, Tab, Badge, LinearProgress
} from "@mui/material";
import {
  NotificationsActive, Send, Delete, Person, Group,
  CheckCircle, Schedule, Close, Refresh, NotificationImportant
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [form, setForm] = useState({ title: "", content: "", targetUserId: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [notifRes, userRes] = await Promise.all([
        api.get("/notifications/admin/all"),
        api.get("/admin/users")
      ]);
      setNotifications(Array.isArray(notifRes) ? notifRes : []);
      setUsers((Array.isArray(userRes) ? userRes : []).filter(u => u.role === "TENANT"));
    } catch { toast.error("Lỗi tải dữ liệu"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim())
      return toast.error("Vui lòng nhập đủ tiêu đề và nội dung");
    setSending(true);
    try {
      await api.post("/notifications/admin/send", {
        title: form.title,
        content: form.content,
        targetUserId: form.targetUserId || null
      });
      toast.success(form.targetUserId ? "Đã gửi riêng" : "Đã gửi tất cả");
      setForm({ title: "", content: "", targetUserId: "" });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || "Gửi thất bại");
    } finally { setSending(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa thông báo?")) return;
    try {
      await api.delete(`/notifications/admin/${id}`);
      toast.success("Đã xóa");
      fetchData();
    } catch { toast.error("Xóa thất bại"); }
  };

  const filtered = notifications.filter(n => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return n.broadcast;
    if (tabValue === 2) return !n.broadcast;
    return false;
  });

  const stats = {
    total: notifications.length,
    allUsers: notifications.filter(n => n.broadcast).length,
    specific: notifications.filter(n => !n.broadcast).length
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString("vi-VN") : "—";

  if (loading && !notifications.length) return <LinearProgress />;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: "linear-gradient(135deg,#0f766e,#0d9488)", color: "white" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <NotificationsActive sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>Quản Lý Thông Báo</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Gửi thông báo đến khách thuê</Typography>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<Refresh />} onClick={fetchData} sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>Làm mới</Button>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "Tổng thông báo", value: stats.total, color: "#0f766e" },
            { label: "Gửi tất cả", value: stats.allUsers, color: "#3b82f6" },
            { label: "Gửi riêng", value: stats.specific, color: "#10b981" }
          ].map((item, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Paper sx={{ p: 2, textAlign: "center", borderRadius: 3, bgcolor: idx === 1 ? "#dbeafe" : idx === 2 ? "#d1fae5" : "white" }}>
                <Typography variant="h4" fontWeight={900} color={item.color}>{item.value}</Typography>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} lg={5}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Avatar sx={{ bgcolor: "#0f766e" }}><Send /></Avatar>
                <Typography variant="h6" fontWeight={800}>Soạn thông báo mới</Typography>
              </Box>
              <form onSubmit={handleSend}>
                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel>Gửi đến</InputLabel>
                    <Select value={form.targetUserId} onChange={e => setForm({ ...form, targetUserId: e.target.value })}>
                      <MenuItem value=""><Group fontSize="small" /> Tất cả người thuê</MenuItem>
                      {users.map(u => <MenuItem key={u.id} value={u.id}><Person fontSize="small" /> {u.fullName || u.username}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField fullWidth required label="Tiêu đề" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  <TextField fullWidth required multiline rows={5} label="Nội dung" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                  <Alert severity="info">Thông báo sẽ được gửi đến tất cả khách thuê đang hoạt động</Alert>
                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => setForm({ title: "", content: "", targetUserId: "" })}>Xóa form</Button>
                    <Button type="submit" variant="contained" disabled={sending} startIcon={sending ? <CircularProgress size={18} /> : <Send />} sx={{ bgcolor: "#0f766e" }}>
                      {sending ? "Đang gửi..." : "Gửi thông báo"}
                    </Button>
                  </Box>
                </Stack>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={7}>
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={800}>Lịch sử thông báo</Typography>
                <Badge badgeContent={stats.total} color="primary" />
              </Box>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Tất cả" /><Tab label="Gửi tất cả" /><Tab label="Gửi riêng" />
              </Tabs>
              {filtered.length === 0 ? (
                <Alert severity="info">Chưa có thông báo nào</Alert>
              ) : (
                <Stack spacing={2} sx={{ maxHeight: 500, overflow: "auto" }}>
                  {filtered.map(n => (
                    <Paper key={n.id} sx={{ p: 3, borderLeft: `4px solid ${n.broadcast ? "#0f766e" : "#f59e0b"}`, transition: "0.2s", "&:hover": { boxShadow: 2 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Typography variant="subtitle1" fontWeight={800}>{n.title}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap", my: 1 }}>{n.content}</Typography>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Chip size="small" icon={n.broadcast ? <Group /> : <Person />} label={n.broadcast ? "Tất cả" : `Riêng: ${users.find(u => u.id === n.targetUserId)?.fullName || n.targetUserId}`} />
                            <Box display="flex" alignItems="center" gap={0.5}><Schedule fontSize="small" />{formatDate(n.createdAt)}</Box>
                            <Chip size="small" icon={<CheckCircle />} label="Đã gửi" sx={{ bgcolor: "#e8f5e9", color: "#4caf50" }} />
                          </Stack>
                        </Box>
                        <Tooltip title="Xóa"><IconButton color="error" onClick={() => handleDelete(n.id)}><Delete /></IconButton></Tooltip>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default NotificationManagement;