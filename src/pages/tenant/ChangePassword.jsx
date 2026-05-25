import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../services/api";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length <= 6) {
      toast.error("Mật khẩu mới phải dài hơn 6 ký tự");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp");
      return;
    }

    await api.put("/tenant/change-password", {
      currentPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

    localStorage.clear();
    toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại");
    navigate("/login");
  };

  return (
    <div className="container">
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Đổi mật khẩu
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 420 }}>
        <TextField
          fullWidth
          required
          margin="normal"
          type="password"
          label="Mật khẩu cũ"
          value={form.oldPassword}
          onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
        />
        <TextField
          fullWidth
          required
          margin="normal"
          type="password"
          label="Mật khẩu mới"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />
        <TextField
          fullWidth
          required
          margin="normal"
          type="password"
          label="Xác nhận mật khẩu mới"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Lưu
        </Button>
      </Box>
    </div>
  );
};

export default ChangePassword;
