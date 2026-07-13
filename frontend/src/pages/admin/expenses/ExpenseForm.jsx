/**
 * @file ExpenseForm.jsx
 * @description Biểu mẫu nhập liệu chung cho tính năng Thêm/Sửa chi phí.
 * @module pages/admin/expenses
 */
import React from "react";
import { Stack, TextField, FormControl, InputLabel, Select, MenuItem, Button, Box, Paper, CircularProgress, Alert } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ExpenseForm = ({ isEdit, formData, handleChange, handleSubmit, saving }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", maxWidth: 600, mx: "auto" }}>
      <Stack spacing={3}>
        <TextField
          label="Nội dung chi"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          required
        />

        <TextField
          label="Số tiền (VNĐ)"
          name="price"
          type="number"
          fullWidth
          value={formData.price}
          onChange={handleChange}
          required
        />

        <TextField
          label="Ngày chi"
          name="expenseDate"
          type="date"
          fullWidth
          value={formData.expenseDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <FormControl fullWidth>
          <InputLabel>Phân loại</InputLabel>
          <Select name="category" value={formData.category} label="Phân loại" onChange={handleChange}>
            <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
            <MenuItem value="SALARY">Lương nhân viên</MenuItem>
            <MenuItem value="UTILITY">Điện nước</MenuItem>
            <MenuItem value="TAX">Thuế</MenuItem>
            <MenuItem value="OTHER">Khác</MenuItem>
          </Select>
        </FormControl>

        <Alert severity="info" variant="outlined">
          Lưu ý: Số tiền được lưu ở trường <b>amount</b> và nội dung ở trường <b>description</b>.
        </Alert>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/admin/expenses")} disabled={saving}>
            Hủy bỏ
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
            sx={{ bgcolor: "#ef4444", fontWeight: 700, minWidth: 150, "&:hover": { bgcolor: "#f97316" } }}
          >
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ExpenseForm;
