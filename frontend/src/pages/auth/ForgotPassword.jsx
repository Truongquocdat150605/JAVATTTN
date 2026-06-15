import React, { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", { email });

      toast.success("Đã gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email.");
      navigate("/reset-password", { state: { email: email.trim() } });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Lỗi khi gửi yêu cầu quên mật khẩu";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
            Quên mật khẩu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Nhập email để nhận hướng dẫn đặt lại mật khẩu.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>

            <Button fullWidth onClick={() => navigate("/login")} sx={{ mt: 2 }} color="inherit">
              Quay lại đăng nhập
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
