import React, { useState } from "react";
import api from "../../services/api";
import { Alert, Box, Button, Card, CircularProgress, Container, Grid, TextField, Typography, Divider, Chip, Stack } from "@mui/material";
import { Phone, Email, AccessTime, LocationOn, Send, CheckCircle } from "@mui/icons-material";

const ContactPage = () => {
  const [form, setForm] = useState({ fullName: "", phone: "", message: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 3) e.fullName = "Họ tên tối thiểu 3 ký tự";
    if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(form.phone)) e.phone = "Số điện thoại không hợp lệ";
    if (form.message.trim().length < 10) e.message = "Nội dung tối thiểu 10 ký tự";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus({ loading: true, error: "", success: "" });
    try {
      await api.post("/public/contacts", form);
      setStatus({ loading: false, error: "", success: "Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm." });
      setForm({ fullName: "", phone: "", message: "" });
      setErrors({});
    } catch (err) {
      setStatus({ loading: false, error: err.response?.data?.message || "Lỗi gửi tin nhắn.", success: "" });
    }
  };

  const info = [
    { icon: <Phone />, label: "HOTLINE", val: "0123 456 789" },
    { icon: <Email />, label: "EMAIL", val: "contact@smartphongtro.com" },
    { icon: <AccessTime />, label: "GIỜ LÀM VIỆC", val: "Thứ 2 - Thứ 7 (08:00 - 17:30)" },
    { icon: <LocationOn />, label: "ĐỊA CHỈ", val: "41 Đường số 5, Tăng Nhơn Phú B, TP. Thủ Đức, TP.HCM" }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h3" textAlign="center" fontWeight={900} sx={{ color: "#0f766e", mb: 5 }}>
        Liên hệ chúng tôi
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, borderRadius: 4, bgcolor: "#f8fafc", height: "100%" }}>
            <Typography variant="h5" fontWeight={900} color="#0f766e" mb={3}>
              Thông tin
            </Typography>
            <Stack spacing={3}>
              {info.map((item, i) => (
                <Box key={i} display="flex" alignItems="center" gap={2}>
                  <Box sx={{ p: 1.5, bgcolor: "rgba(15,118,110,0.1)", borderRadius: 2, color: "#0f766e" }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                    <Typography fontWeight={700}>{item.val}</Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
            <Divider sx={{ my: 3 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {["Thuê phòng", "Bảo trì", "Hợp đồng", "Thanh toán"].map((s) => (
                <Chip key={s} label={s} size="small" sx={{ bgcolor: "#e2e8f0" }} />
              ))}
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 4, borderRadius: 4 }}>
            <form onSubmit={handleSend}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={form.fullName}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={form.phone}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Nội dung"
                  value={form.message}
                  error={!!errors.message}
                  helperText={errors.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                {status.error && <Alert severity="error">{status.error}</Alert>}
                {status.success && <Alert severity="success" icon={<CheckCircle />}>{status.success}</Alert>}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={status.loading}
                  startIcon={status.loading ? <CircularProgress size={20} /> : <Send />}
                  sx={{ bgcolor: "#0f766e", py: 1.5, fontWeight: 700, "&:hover": { bgcolor: "#0d9488" } }}
                >
                  Gửi liên hệ
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactPage;