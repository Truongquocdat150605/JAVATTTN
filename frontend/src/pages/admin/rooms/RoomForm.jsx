import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Grid,
  Avatar,
  Alert,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  MeetingRoom as RoomIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import api from "../../../services/api";

const IMAGE_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/uploads/";

const STATUS_OPTIONS = [
  { value: "AVAILABLE", label: "Trống", color: "#10b981" },
  { value: "OCCUPIED", label: "Đã thuê", color: "#ef4444" },
  { value: "MAINTENANCE", label: "Bảo trì", color: "#f59e0b" },
];

const RoomForm = ({ initialData, isEdit, roomId }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    roomNumber: "",
    type: "",
    price: "",
    area: "",
    description: "",
    status: "AVAILABLE",
    image: null,
    serviceIds: [],
  });
  const [services, setServices] = useState([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        roomNumber: initialData.roomNumber || "",
        type: initialData.type || "",
        price: initialData.price || "",
        area: initialData.area || "",
        description: initialData.description || "",
        status: initialData.status || "AVAILABLE",
        image: null,
        serviceIds: Array.isArray(initialData.services) ? initialData.services.map((svc) => svc.id) : [],
      });
      if (initialData.image && !imageError) {
        setPreviewUrl(`${IMAGE_BASE_URL}${initialData.image}`);
      }
    }
  }, [initialData, imageError]);

  useEffect(() => {
    api.get("/services")
      .then((data) => setServices(Array.isArray(data) ? data : data?.data || []))
      .catch(() => setServices([]));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
    }
    setForm((prev) => ({ ...prev, image: file }));
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
    setImageError(false);
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, image: null }));
    setPreviewUrl("");
    setImageError(false);
  };

  const validateForm = () => {
    if (!form.roomNumber.trim()) return "Vui lòng nhập số phòng";
    if (!form.type.trim()) return "Vui lòng nhập loại phòng";
    if (!form.price || Number(form.price) <= 0) return "Giá thuê phải lớn hơn 0";
    if (!form.area || Number(form.area) <= 0) return "Diện tích phải lớn hơn 0";
    return "";
  };

  const buildFormData = () => {
    const data = new FormData();
    data.append("roomNumber", String(form.roomNumber).trim());
    data.append("type", String(form.type).trim());
    data.append("price", String(form.price));
    data.append("area", String(form.area));
    data.append("description", String(form.description || "").trim());

    if (isEdit) {
      data.append("status", form.status);
    }

    if (form.image) {
      data.append("image", form.image);
    }

    form.serviceIds.forEach((id) => data.append("serviceIds", String(id)));

    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errorMessage = validateForm();
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      setSaving(true);
      const data = buildFormData();

      if (isEdit && roomId) {
        await api.put(`/rooms/${roomId}`, data);
        toast.success("Cập nhật phòng thành công");
      } else {
        await api.post("/rooms", data);
        toast.success("Thêm phòng thành công");
      }

      navigate("/admin/rooms");
    } catch (error) {
      const serverMsg = error.response?.data?.error || error.response?.data?.message;
      toast.error(serverMsg || "Không thể lưu thông tin phòng");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/admin/rooms" underline="hover" color="inherit">
            Quản lý phòng
          </Link>
          <Typography color="text.primary">{isEdit ? "Chỉnh sửa phòng" : "Thêm phòng mới"}</Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar sx={{ bgcolor: "#0f766e", width: 48, height: 48 }}>
              <RoomIcon />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={800}>
                {isEdit ? "✏️ Chỉnh sửa phòng" : "➕ Thêm phòng mới"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEdit ? "Cập nhật thông tin phòng trọ" : "Nhập thông tin phòng trọ mới"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Số phòng"
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  placeholder="Ví dụ: 101, 102, A101..."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Loại phòng"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  placeholder="Ví dụ: Phòng đơn, Phòng đôi, Studio..."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Giá thuê (VNĐ/tháng)"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  helperText="Nhập giá thuê theo tháng"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Diện tích (m²)"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: 0.1 }}
                  helperText="Ví dụ: 25.5"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Mô tả chi tiết"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Mô tả về phòng, tiện ích, vị trí..."
                />
              </Grid>

              {isEdit && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái phòng</InputLabel>
                    <Select name="status" value={form.status} label="Trạng thái phòng" onChange={handleChange}>
                      {STATUS_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: opt.color }} />
                            {opt.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Dich vu ap dung cho phong</InputLabel>
                  <Select
                    multiple
                    name="serviceIds"
                    value={form.serviceIds}
                    label="Dich vu ap dung cho phong"
                    onChange={(event) => setForm((prev) => ({ ...prev, serviceIds: event.target.value }))}
                    renderValue={(selected) =>
                      services
                        .filter((svc) => selected.includes(svc.id))
                        .map((svc) => svc.name)
                        .join(", ")
                    }
                  >
                    {services
                      .filter((svc) => svc.active && svc.category !== "ELECTRICITY" && svc.category !== "WATER")
                      .map((svc) => (
                        <MenuItem key={svc.id} value={svc.id}>
                          <Checkbox checked={form.serviceIds.includes(svc.id)} />
                          <ListItemText
                            primary={svc.name}
                            secondary={`${Number(svc.price || 0).toLocaleString("vi-VN")} VND / ${svc.unit || "MONTH"}`}
                          />
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary">
                  Dien va nuoc tinh rieng theo chi so, khong chon vao phi dich vu co dinh.
                </Typography>
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                  Hình ảnh phòng
                </Typography>
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "divider",
                    borderRadius: 3,
                    p: 3,
                    textAlign: "center",
                    bgcolor: "#f8fafc",
                  }}
                >
                  {previewUrl ? (
                    <Box>
                      <Box
                        component="img"
                        src={previewUrl}
                        alt="Ảnh phòng"
                        sx={{
                          width: "100%",
                          maxWidth: 300,
                          height: "auto",
                          borderRadius: 2,
                          mb: 2,
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                        onError={() => setImageError(true)}
                      />
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <Button variant="outlined" startIcon={<UploadIcon />} component="label">
                          Đổi ảnh
                          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>
                        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleRemoveImage}>
                          Xóa ảnh
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <UploadIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Kéo thả hoặc nhấp để chọn ảnh
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Hỗ trợ JPG, PNG, GIF. Tối đa 5MB
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Button variant="contained" component="label" startIcon={<UploadIcon />}>
                          Chọn ảnh
                          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Alert Info */}
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={500}>💡 Lưu ý:</Typography>
              <Typography variant="caption" color="text.secondary">
                • Số phòng là duy nhất và không thể trùng lặp<br />
                • Sau khi tạo phòng, bạn có thể gán hợp đồng cho khách thuê<br />
                • Ảnh phòng sẽ hiển thị trên trang chủ và trang chi tiết phòng
              </Typography>
            </Alert>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={() => navigate("/admin/rooms")} disabled={saving}>
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

export default RoomForm;
