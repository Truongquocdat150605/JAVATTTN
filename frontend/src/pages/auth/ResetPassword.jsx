import React, { useMemo, useEffect, useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stateEmail = location?.state?.email;
    const searchParams = new URLSearchParams(location?.search || "");
    const queryEmail = searchParams.get("email");

    const derivedEmail = (stateEmail || queryEmail || "").trim();
    if (derivedEmail) setEmail(derivedEmail);
  }, [location?.state?.email, location?.search]);

  const isTokenValid = useMemo(() => /^\d{6}$/.test(token.trim()), [token]);
  const isPasswordValid = useMemo(() => password.length >= 6, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isTokenValid) {
      toast.error("Token phải gồm đúng 6 chữ số");
      return;
    }
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    if (!isPasswordValid) {
      toast.error("Mật khẩu tối thiểu 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        token: token.trim(),
        email: email.trim(),
        newPassword: password,
      });

      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại!");
      navigate("/login");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Lỗi khi đặt lại mật khẩu";
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
            Đặt lại mật khẩu
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Nhập token (6 số), email và mật khẩu mới.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Token (6 số)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              fullWidth
              required
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              label="Mật khẩu mới"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              label="Xác nhận mật khẩu"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
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

export default ResetPassword;
