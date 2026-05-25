import React, { useState, useEffect } from "react";
import { Box, Button, Stack, TextField, Typography, CircularProgress, Paper, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";

const IMAGE_BASE_URL = "http://localhost:8082/uploads/";

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
  });
  const [previewUrl, setPreviewUrl] = useState("");

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
      });
      setPreviewUrl(initialData.image ? `${IMAGE_BASE_URL}${initialData.image}` : "");
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, image: file }));
    setPreviewUrl(file ? URL.createObjectURL(file) : "");
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
    <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {isEdit ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            required
            label="Số phòng"
            name="roomNumber"
            value={form.roomNumber}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            label="Loại phòng"
            name="type"
            value={form.type}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            required
            type="number"
            label="Giá thuê"
            name="price"
            value={form.price}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
          <TextField
            fullWidth
            required
            type="number"
            label="Diện tích (m2)"
            name="area"
            value={form.area}
            onChange={handleChange}
            inputProps={{ min: 0, step: 0.1 }}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Mô tả"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <Box>
            <Button variant="outlined" component="label">
              Chọn ảnh
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {form.image && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {form.image.name}
              </Typography>
            )}
            {previewUrl && (
              <Box
                component="img"
                src={previewUrl}
                alt="Ảnh phòng"
                sx={{
                  display: "block",
                  width: 180,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 1,
                  mt: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            )}
          </Box>
        </Stack>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="text" onClick={() => navigate("/admin/rooms")} disabled={saving}>
            Hủy
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default RoomForm;
