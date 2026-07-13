/**
 * @file ContractForm.jsx
 * @description Biểu mẫu nhập liệu (Form) dùng chung cho tính năng Thêm mới và Chỉnh sửa hợp đồng.
 * @module pages/admin/contracts
 */
import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Box, Paper, Button, CircularProgress, Divider } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../../../utils/formatVND";

const HEADER_BG = "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)";

const ContractForm = ({ isEdit, formData, editFormData, newTenantForm, handleChange, handleEditChange, handleNewTenantChange, handleSubmit, saving, rooms, users }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
      {isEdit ? (
        // ========== FORM CHỈNH SỬA HỢP ĐỒNG ==========
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Khách thuê</InputLabel>
              <Select name="tenantId" value={editFormData.tenantId} label="Khách thuê" onChange={handleEditChange}>
                <MenuItem value="">-- Chọn khách thuê --</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fullName} ({user.username})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Phòng</InputLabel>
              <Select name="roomId" value={editFormData.roomId} label="Phòng" onChange={handleEditChange}>
                <MenuItem value="">-- Chọn phòng --</MenuItem>
                {rooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    Phòng {room.roomNumber} - {formatVND(room.price)}/tháng
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ngày bắt đầu"
              name="startDate"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editFormData.startDate}
              onChange={handleEditChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ngày kết thúc"
              name="endDate"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={editFormData.endDate}
              onChange={handleEditChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Giá thuê (VNĐ/tháng)"
              name="rentPrice"
              type="number"
              fullWidth
              value={editFormData.rentPrice}
              onChange={handleEditChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Tiền cọc (VNĐ)"
              name="deposit"
              type="number"
              fullWidth
              value={editFormData.deposit}
              onChange={handleEditChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái hợp đồng</InputLabel>
              <Select name="status" value={editFormData.status} label="Trạng thái hợp đồng" onChange={handleEditChange}>
                <MenuItem value="ACTIVE">Hiệu lực</MenuItem>
                <MenuItem value="PENDING">Chờ duyệt</MenuItem>
                <MenuItem value="EXPIRED">Hết hạn</MenuItem>
                <MenuItem value="TERMINATED">Đã chấm dứt</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ) : (
        // ========== FORM TẠO HỢP ĐỒNG MỚI (Có nhập thông tin khách thuê) ==========
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#0f766e" }}>
            📝 Thông tin khách thuê mới
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hệ thống sẽ tự động tạo tài khoản nếu số điện thoại chưa tồn tại (mật khẩu mặc định: 123456)
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Họ và tên *" name="fullName" value={newTenantForm.fullName} onChange={handleNewTenantChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Số điện thoại *" name="phone" value={newTenantForm.phone} onChange={handleNewTenantChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth required label="Email *" name="email" type="email" value={newTenantForm.email} onChange={handleNewTenantChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="CCCD/CMND" name="identityNumber" value={newTenantForm.identityNumber} onChange={handleNewTenantChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Địa chỉ" name="address" value={newTenantForm.address} onChange={handleNewTenantChange} />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 4 }} />

          <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: "#0f766e" }}>
            📄 Chi tiết hợp đồng
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Chọn phòng trống *</InputLabel>
                <Select name="roomId" value={formData.roomId} label="Chọn phòng trống *" onChange={handleChange}>
                  <MenuItem value="">-- Chọn phòng --</MenuItem>
                  {rooms.map((room) => (
                    <MenuItem key={room.id} value={room.id}>
                      Phòng {room.roomNumber} - {formatVND(room.price)}/tháng
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ngày bắt đầu *" name="startDate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.startDate} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Ngày kết thúc" name="endDate" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.endDate} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Giá thuê (VNĐ/tháng) *" name="rentPrice" type="number" fullWidth value={formData.rentPrice} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Tiền cọc (VNĐ)" name="deposit" type="number" fullWidth value={formData.deposit} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái khởi tạo</InputLabel>
                <Select name="status" value={formData.status} label="Trạng thái khởi tạo" onChange={handleChange}>
                  <MenuItem value="ACTIVE">Hiệu lực</MenuItem>
                  <MenuItem value="PENDING">Chờ duyệt</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/admin/contracts")} disabled={saving}>
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          sx={{ background: HEADER_BG, fontWeight: 700, minWidth: 150 }}
        >
          {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo hợp đồng"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ContractForm;
