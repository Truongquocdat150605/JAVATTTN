/**
 * @file UserForm.jsx
 * @description Biểu mẫu nhập liệu (Form) dùng chung cho tính năng Thêm mới và Chỉnh sửa người dùng.
 * @module pages/admin/users
 */
import React, { useState } from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Switch, Typography, Box, InputAdornment, IconButton, Paper, Button, CircularProgress } from "@mui/material";
import { Visibility as EyeIcon, VisibilityOff as EyeOffIcon, Save as SaveIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const HEADER_BG = "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)";

const UserForm = ({ formData, handleChange, handleSubmit, saving, isEdit }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField label="Họ và tên *" name="fullName" value={formData.fullName} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Username *" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            fullWidth 
            disabled={isEdit} 
            helperText={isEdit ? "Không thể đổi username" : ""} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={isEdit ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="CCCD / CMND" name="identityNumber" value={formData.identityNumber} onChange={handleChange} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} fullWidth />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select name="role" value={formData.role} label="Vai trò" onChange={handleChange}>
              <MenuItem value="TENANT">Khách thuê</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, height: "100%", p: 1, border: "1px solid #e2e8f0", borderRadius: 1 }}>
            <Typography>Trạng thái tài khoản:</Typography>
            <Switch
              name="active"
              checked={formData.active}
              onChange={(e) => handleChange({ target: { name: 'active', value: e.target.checked, type: 'checkbox', checked: e.target.checked }})}
              color="success"
            />
            <Typography color={formData.active ? "success.main" : "text.disabled"} fontWeight={600}>
              {formData.active ? "Hoạt động" : "Vô hiệu hóa"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate("/admin/users")} disabled={saving}>
              Hủy bỏ
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{ background: HEADER_BG, fontWeight: 700, minWidth: 150 }}
            >
              {saving ? "Đang lưu..." : "Lưu dữ liệu"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserForm;
