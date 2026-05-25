import React, { useState, useEffect } from "react";
import {
  Box, Button, Stack, TextField, Typography,
  CircularProgress, Paper, Divider, Switch, FormControlLabel,
  MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";

// Enum Options
const SERVICE_CATEGORIES = [
  { value: "WATER", label: "💧 Nước" },
  { value: "ELECTRICITY", label: "⚡ Điện" },
  { value: "GARBAGE", label: "🗑️ Rác" },
  { value: "INTERNET", label: "📡 Internet" },
  { value: "SECURITY", label: "🔒 An ninh" },
  { value: "CLEANING", label: "🧹 Vệ sinh" },
  { value: "MAINTENANCE", label: "🔧 Bảo trì" },
  { value: "OTHER", label: "📝 Khác" },
];

const SERVICE_UNITS = [
  { value: "UNIT", label: "Bộ" },
  { value: "PERSON", label: "Người" },
  { value: "MONTH", label: "Tháng" },
  { value: "WEEK", label: "Tuần" },
  { value: "DAY", label: "Ngày" },
  { value: "KWH", label: "kWh" },
  { value: "CUBIC_METER", label: "m³" },
  { value: "LITER", label: "Lít" },
  { value: "HOUR", label: "Giờ" },
  { value: "TIME", label: "Lần" },
];

const SERVICE_FREQUENCIES = [
  { value: "MONTHLY", label: "Hàng tháng" },
  { value: "WEEKLY", label: "Hàng tuần" },
  { value: "DAILY", label: "Hàng ngày" },
  { value: "ONE_TIME", label: "Một lần" },
  { value: "QUARTERLY", label: "Quý" },
  { value: "ANNUAL", label: "Năm" },
];

const ServiceForm = ({ initialData, isEdit, serviceId }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    unit: "",
    frequency: "",
    description: "",
    active: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        category: initialData.category || "",
        unit: initialData.unit || "",
        frequency: initialData.frequency || "",
        description: initialData.description || "",
        active: initialData.active !== undefined ? initialData.active : true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Tên dịch vụ không được để trống"); return; }
    if (!form.price || Number(form.price) < 0) { toast.error("Giá không hợp lệ"); return; }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category || null,
        unit: form.unit || null,
        frequency: form.frequency || null,
        description: form.description.trim(),
        active: form.active,
      };

      if (isEdit) {
        await api.put(`/services/${serviceId}`, payload);
        toast.success("Cập nhật dịch vụ thành công");
      } else {
        await api.post("/services", payload);
        toast.success("Thêm dịch vụ thành công");
      }
      navigate("/admin/services");
    } catch (error) {
      const msg = error.response?.data?.error || "Không thể lưu dịch vụ";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: "auto", mt: 4, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        {isEdit ? "✏️ Chỉnh sửa dịch vụ" : "➕ Thêm dịch vụ mới"}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Dịch vụ phụ như điện, nước, internet, rác, trông xe...
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth required label="Tên dịch vụ"
            name="name" value={form.name} onChange={handleChange}
            placeholder="Ví dụ: Tiền rác, WiFi, Trông xe..."
          />
          <TextField
            fullWidth required type="number" label="Đơn giá (VNĐ)"
            name="price" value={form.price} onChange={handleChange}
            inputProps={{ min: 0 }}
            helperText="Nhập giá cố định. Riêng điện/nước tính theo chỉ số."
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Loại dịch vụ (tùy chọn)</InputLabel>
              <Select
                name="category" value={form.category} onChange={handleChange}
                label="Loại dịch vụ (tùy chọn)"
              >
                <MenuItem value="">-- Chọn loại --</MenuItem>
                {SERVICE_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Đơn vị (tùy chọn)</InputLabel>
              <Select
                name="unit" value={form.unit} onChange={handleChange}
                label="Đơn vị (tùy chọn)"
              >
                <MenuItem value="">-- Chọn đơn vị --</MenuItem>
                {SERVICE_UNITS.map((unit) => (
                  <MenuItem key={unit.value} value={unit.value}>{unit.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <FormControl fullWidth>
            <InputLabel>Tần suất (tùy chọn)</InputLabel>
            <Select
              name="frequency" value={form.frequency} onChange={handleChange}
              label="Tần suất (tùy chọn)"
            >
              <MenuItem value="">-- Chọn tần suất --</MenuItem>
              {SERVICE_FREQUENCIES.map((freq) => (
                <MenuItem key={freq.value} value={freq.value}>{freq.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth multiline minRows={3} label="Mô tả (tùy chọn)"
            name="description" value={form.description} onChange={handleChange}
          />
          {isEdit && (
            <FormControlLabel
              control={
                <Switch
                  checked={form.active}
                  onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                  color="success"
                />
              }
              label={form.active ? "Đang hoạt động" : "Đã ngưng cung cấp"}
            />
          )}
        </Stack>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="text" onClick={() => navigate("/admin/services")} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={saving} startIcon={saving ? <CircularProgress size={18} /> : null}>
            {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ServiceForm;
