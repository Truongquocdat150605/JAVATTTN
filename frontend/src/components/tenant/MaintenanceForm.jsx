/**
 * @file MaintenanceForm.jsx
 * @description Dialog form cho phép khách thuê tạo yêu cầu bảo trì mới.
 * @module components/tenant
 */
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, TextField, MenuItem, Alert, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const MaintenanceForm = ({ open, handleClose, handleSubmit, form, setForm, errors, rooms, submitting }) => (
  <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ bgcolor: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      Tạo yêu cầu bảo trì mới
      <IconButton onClick={handleClose} sx={{ color: "white" }}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <form onSubmit={handleSubmit}>
      <DialogContent dividers>
        <TextField
          fullWidth
          select
          label="Chọn phòng"
          required
          margin="normal"
          value={form.roomId}
          onChange={(e) => setForm({ ...form, roomId: e.target.value })}
          error={!!errors.roomId}
          helperText={errors.roomId}
        >
          <MenuItem value="">-- Chọn phòng --</MenuItem>
          {rooms.map((room) => (
            <MenuItem key={room.id} value={room.id}>
              Phòng {room.roomNumber}{room.type ? ` - ${room.type}` : ""}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Mô tả sự cố"
          required
          multiline
          rows={4}
          margin="normal"
          placeholder="Vui lòng mô tả chi tiết sự cố cần sửa chữa..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          error={!!errors.description}
          helperText={errors.description}
        />

        <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500}>💡 Lưu ý:</Typography>
          <Typography variant="caption" color="text.secondary">
            • Vui lòng mô tả chi tiết để kỹ thuật viên xử lý nhanh chóng<br />
            • Bạn sẽ nhận được thông báo khi yêu cầu được tiếp nhận<br />
            • Thời gian xử lý dự kiến: 24-48 giờ
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose}>Hủy</Button>
        <Button type="submit" variant="contained" disabled={submitting} sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}>
          {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);

export default MaintenanceForm;
