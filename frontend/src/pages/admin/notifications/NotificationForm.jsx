import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Send, Person, Group } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../../services/api";

const NotificationForm = ({ users, onSuccess }) => {
  const [form, setForm] = useState({ title: "", content: "", targetUserId: "" });
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim())
      return toast.error("Vui lòng nhập đủ tiêu đề và nội dung");
    setSending(true);
    try {
      await api.post("/notifications/admin/send", {
        title: form.title,
        content: form.content,
        targetUserId: form.targetUserId || null,
      });
      toast.success(form.targetUserId ? "Đã gửi riêng" : "Đã gửi tất cả");
      setForm({ title: "", content: "", targetUserId: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || "Gửi thất bại");
    } finally {
      setSending(false);
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4 }}>
      <Box display="flex" alignItems="center" gap={1.5} mb={3}>
        <Avatar sx={{ bgcolor: "#0f766e" }}>
          <Send />
        </Avatar>
        <Typography variant="h6" fontWeight={800}>
          Soạn thông báo mới
        </Typography>
      </Box>
      <form onSubmit={handleSend}>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Gửi đến</InputLabel>
            <Select
              value={form.targetUserId}
              label="Gửi đến"
              onChange={(e) => setForm({ ...form, targetUserId: e.target.value })}
            >
              <MenuItem value="">
                <Group fontSize="small" sx={{ mr: 1 }} /> Tất cả người thuê
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  <Person fontSize="small" sx={{ mr: 1 }} /> {u.fullName || u.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            required
            label="Tiêu đề"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            fullWidth
            required
            multiline
            rows={5}
            label="Nội dung"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <Alert severity="info">
            Thông báo sẽ được gửi đến tất cả khách thuê đang hoạt động
          </Alert>
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => setForm({ title: "", content: "", targetUserId: "" })}
            >
              Xóa form
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={sending}
              startIcon={sending ? <CircularProgress size={18} /> : <Send />}
              sx={{ bgcolor: "#0f766e" }}
            >
              {sending ? "Đang gửi..." : "Gửi thông báo"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default NotificationForm;
