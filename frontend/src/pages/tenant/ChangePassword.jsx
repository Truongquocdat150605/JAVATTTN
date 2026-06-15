import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  VpnKey as VpnKeyIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Password strength calculator
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 1) return { label: "Rất yếu", color: "#ef4444", width: "20%" };
    if (score === 2) return { label: "Yếu", color: "#f59e0b", width: "40%" };
    if (score === 3) return { label: "Trung bình", color: "#fbbf24", width: "60%" };
    if (score === 4) return { label: "Mạnh", color: "#10b981", width: "80%" };
    return { label: "Rất mạnh", color: "#059669", width: "100%" };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.oldPassword) {
      newErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    }
    
    if (!form.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (form.newPassword === form.oldPassword) {
      newErrors.newPassword = "Mật khẩu mới không được trùng mật khẩu cũ";
    }
    
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// ChangePassword.jsx - Sửa handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setLoading(true);
  try {
    // Đúng endpoint yêu cầu: PUT /api/auth/change-password
    // Body: { currentPassword, newPassword }
    await api.put("/auth/change-password", {
      currentPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
    
    toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
    sessionStorage.clear();
    setTimeout(() => navigate("/login"), 1500);
  } catch (error) {
    const responseData = error.response?.data;
    const message = responseData?.error || responseData?.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};  const passwordStrength = getPasswordStrength(form.newPassword);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 40px rgba(15,23,42,0.08)" }}>
        {/* Header */}
        <Box sx={{ bgcolor: "#0f766e", color: "white", p: 4, textAlign: "center" }}>
          <VpnKeyIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
          <Typography variant="h4" fontWeight={800}>
            Đổi Mật Khẩu
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Bảo mật tài khoản của bạn với mật khẩu mới
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              margin="normal"
              type={showOldPassword ? "text" : "password"}
              label="Mật khẩu cũ"
              value={form.oldPassword}
              onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                      {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              Mật khẩu mới
            </Typography>

            <TextField
              fullWidth
              required
              type={showNewPassword ? "text" : "password"}
              label="Mật khẩu mới"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Indicator */}
            {form.newPassword && (
              <Box sx={{ mt: 1.5, mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Độ mạnh mật khẩu:
                  </Typography>
                  <Typography variant="caption" sx={{ color: passwordStrength.color, fontWeight: 600 }}>
                    {passwordStrength.label}
                  </Typography>
                </Box>
                <Box sx={{ height: 4, bgcolor: "#e2e8f0", borderRadius: 2, overflow: "hidden" }}>
                  <Box sx={{ width: passwordStrength.width, height: "100%", bgcolor: passwordStrength.color, transition: "width 0.3s" }} />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                  {form.newPassword.length < 6 ? "⚠️ Mật khẩu phải có ít nhất 6 ký tự" : "✓ Mật khẩu hợp lệ"}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              required
              margin="normal"
              type={showConfirmPassword ? "text" : "password"}
              label="Xác nhận mật khẩu mới"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 2, mb: 3 }}
            />

            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={500}>
                🔐 Lưu ý bảo mật:
              </Typography>
              <Typography variant="caption" color="text.secondary">
                • Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                • Không sử lại mật khẩu cũ
                • Đăng xuất sau khi đổi mật khẩu thành công
              </Typography>
            </Alert>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loading}
                sx={{ borderRadius: 2, px: 4 }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  bgcolor: "#0f766e",
                  "&:hover": { bgcolor: "#0d9488" },
                }}
              >
                {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
