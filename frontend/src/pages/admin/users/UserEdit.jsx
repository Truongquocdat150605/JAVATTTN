/**
 * @file UserEdit.jsx
 * @description Trang chỉnh sửa thông tin người dùng.
 * @module pages/admin/users
 */
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import UserForm from "./UserForm";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/admin/users/${id}`);
        const user = res?.data || res;
        if (user) {
          setFormData({
            username: user.username || "",
            password: "",
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            identityNumber: user.identityNumber || "",
            address: user.address || "",
            role: user.role || "TENANT",
            active: user.active !== undefined ? user.active : true,
          });
        }
      } catch (err) {
        toast.error("Không tìm thấy người dùng");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) return toast.error("Họ tên không được để trống");
    if (!formData.email.trim()) return toast.error("Email không được để trống");

    setSaving(true);
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;
      await api.put(`/admin/users/${id}`, payload);
      toast.success("Cập nhật người dùng thành công!");
      navigate("/admin/users");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data || "Có lỗi xảy ra khi lưu người dùng");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/admin/users")} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Chỉnh sửa người dùng
          </Typography>
        </Box>
        {formData && (
          <UserForm 
            formData={formData} 
            handleChange={handleChange} 
            handleSubmit={handleSubmit} 
            saving={saving} 
            isEdit={true} 
          />
        )}
      </Container>
    </Box>
  );
};

export default UserEdit;
