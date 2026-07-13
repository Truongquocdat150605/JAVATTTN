/**
 * @file InvoiceForm.jsx
 * @description Biểu mẫu nhập liệu (Form) dùng chung cho tính năng Chỉnh sửa hóa đơn.
 * @module pages/admin/invoices
 */
import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Box, Paper, Button, CircularProgress, Divider, Stack, Alert } from "@mui/material";
import { Save as SaveIcon, ElectricBolt as ElectricIcon, WaterDrop as WaterIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../../../utils/formatVND";

const HEADER_BG = "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)";

const InvoiceForm = ({ formData, handleChange, handleSubmit, saving, calculateElectricityAmount, calculateWaterAmount, calculateTotal }) => {
  const navigate = useNavigate();
  const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };
  const electricityUsage = Math.max(0, toNumber(formData.electricityEnd) - toNumber(formData.electricityStart));
  const waterUsage = Math.max(0, toNumber(formData.waterEnd) - toNumber(formData.waterStart));

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: "#f59e0b" }}>
            <ElectricIcon /> Tiền điện
          </Typography>
          <Stack spacing={2}>
            <TextField label="Chỉ số cũ" name="electricityStart" type="number" fullWidth value={formData.electricityStart} onChange={handleChange} />
            <TextField label="Chỉ số mới" name="electricityEnd" type="number" fullWidth value={formData.electricityEnd} onChange={handleChange} />
            <TextField label="Đơn giá (VNĐ/kWh)" name="electricityPrice" type="number" fullWidth value={formData.electricityPrice} onChange={handleChange} />
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Đã dùng {electricityUsage} kWh - Tiền điện: {formatVND(calculateElectricityAmount())}
            </Alert>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: "#0f766e" }}>
            <WaterIcon /> Tiền nước
          </Typography>
          <Stack spacing={2}>
            <TextField label="Chỉ số cũ" name="waterStart" type="number" fullWidth value={formData.waterStart} onChange={handleChange} />
            <TextField label="Chỉ số mới" name="waterEnd" type="number" fullWidth value={formData.waterEnd} onChange={handleChange} />
            <TextField label="Đơn giá (VNĐ/m³)" name="waterPrice" type="number" fullWidth value={formData.waterPrice} onChange={handleChange} />
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Đã dùng {waterUsage} m3 - Tiền nước: {formatVND(calculateWaterAmount())}
            </Alert>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            💰 Tiền phòng & Dịch vụ
          </Typography>
          <Stack spacing={2}>
            <TextField label="Tiền phòng (VNĐ)" name="rentalAmount" type="number" fullWidth value={formData.rentalAmount} onChange={handleChange} />
            <TextField label="Phí dịch vụ (VNĐ)" name="serviceAmount" type="number" fullWidth value={formData.serviceAmount} onChange={handleChange} />
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select name="status" value={formData.status} label="Trạng thái" onChange={handleChange}>
                <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                <MenuItem value="PAID">Đã thanh toán</MenuItem>
                <MenuItem value="OVERDUE">Quá hạn</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, bgcolor: "#f0fdf9", borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#0f766e" }}>
              Tổng kết hóa đơn
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Tiền điện:</Typography>
              <Typography fontWeight={600}>{formatVND(calculateElectricityAmount())}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography>Tiền nước:</Typography>
              <Typography fontWeight={600}>{formatVND(calculateWaterAmount())}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography>Tiền phòng + Dịch vụ:</Typography>
              <Typography fontWeight={600}>{formatVND(toNumber(formData.rentalAmount) + toNumber(formData.serviceAmount))}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5" fontWeight={800}>Tổng cộng:</Typography>
              <Typography variant="h5" fontWeight={800} color="#0f766e">
                {formatVND(calculateTotal())}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TextField label="Ghi chú" name="notes" multiline rows={2} fullWidth value={formData.notes} onChange={handleChange} />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={() => navigate("/admin/invoices")} disabled={saving}>
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
          sx={{ background: HEADER_BG, fontWeight: 700, minWidth: 150 }}
        >
          {saving ? "Đang lưu..." : "Cập nhật Hóa Đơn"}
        </Button>
      </Box>
    </Paper>
  );
};

export default InvoiceForm;
