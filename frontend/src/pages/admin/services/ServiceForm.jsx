import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Alert,
  Breadcrumbs,
  Link,
  Container,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  MiscellaneousServices as ServicesIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import api from "../../../services/api";

// Enum Options
const SERVICE_CATEGORIES = [
  { value: "WATER", label: "💧 Nước", color: "#0f766e" },
  { value: "ELECTRICITY", label: "⚡ Điện", color: "#f59e0b" },
  { value: "GARBAGE", label: "🗑️ Rác", color: "#10b981" },
  { value: "INTERNET", label: "📡 Internet", color: "#3b82f6" },
  { value: "SECURITY", label: "🔒 An ninh", color: "#8b5cf6" },
  { value: "CLEANING", label: "🧹 Vệ sinh", color: "#ec4898" },
  { value: "MAINTENANCE", label: "🔧 Bảo trì", color: "#ef4444" },
  { value: "OTHER", label: "📝 Khác", color: "#94a3b8" },
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
    if (!form.name.trim()) {
      toast.error("Tên dịch vụ không được để trống");
      return;
    }
    if (!form.price || Number(form.price) < 0) {
      toast.error("Giá không hợp lệ");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category || null,
        unit: form.unit || null,
        frequency: form.frequency || null,
        description: form.description?.trim() || "",
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
      const msg = error.response?.data?.error || error.response?.data?.message || "Không thể lưu dịch vụ";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const selectedCategory = SERVICE_CATEGORIES.find((c) => c.value === form.category);

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/admin/services" underline="hover" color="inherit">
            Dịch vụ
          </Link>
          <Typography color="text.primary">{isEdit ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}</Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: "#0f766e", width: 48, height: 48 }}>
              <ServicesIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                {isEdit ? "✏️ Chỉnh sửa dịch vụ" : "➕ Thêm dịch vụ mới"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dịch vụ phụ như điện, nước, internet, rác, trông xe...
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Tên dịch vụ"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ví dụ: Tiền rác, WiFi, Trông xe..."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Đơn giá (VNĐ)"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  helperText="Nhập giá cố định. Riêng điện/nước tính theo chỉ số."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Loại dịch vụ</InputLabel>
                  <Select name="category" value={form.category} label="Loại dịch vụ" onChange={handleChange}>
                    <MenuItem value="">-- Chọn loại --</MenuItem>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: cat.color }} />
                          {cat.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Đơn vị tính</InputLabel>
                  <Select name="unit" value={form.unit} label="Đơn vị tính" onChange={handleChange}>
                    <MenuItem value="">-- Chọn đơn vị --</MenuItem>
                    {SERVICE_UNITS.map((unit) => (
                      <MenuItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Tần suất</InputLabel>
                  <Select name="frequency" value={form.frequency} label="Tần suất" onChange={handleChange}>
                    <MenuItem value="">-- Chọn tần suất --</MenuItem>
                    {SERVICE_FREQUENCIES.map((freq) => (
                      <MenuItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Mô tả"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả chi tiết về dịch vụ..."
                />
              </Grid>

              {isEdit && (
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.active}
                        onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
                        color="success"
                      />
                    }
                    label={form.active ? "🟢 Đang hoạt động" : "🔴 Đã ngưng cung cấp"}
                  />
                </Grid>
              )}
            </Grid>

            {/* Alert Info */}
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={500}>💡 Lưu ý:</Typography>
              <Typography variant="caption" color="text.secondary">
                • Dịch vụ sau khi tạo có thể được gán cho từng phòng riêng biệt<br />
                • Giá dịch vụ có thể thay đổi theo thời gian<br />
                • Ngưng dịch vụ sẽ không ảnh hưởng đến lịch sử hóa đơn cũ
              </Typography>
            </Alert>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={() => navigate("/admin/services")}
                disabled={saving}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />}
                sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
              >
                {saving ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ServiceForm;