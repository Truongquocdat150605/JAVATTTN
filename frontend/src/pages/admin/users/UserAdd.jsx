/**
 * @file UserAdd.jsx
 * @description Trang thêm người dùng mới.
 * @module pages/admin/users
 */
import React, { useState } from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import UserForm from "./UserForm";

const EMPTY_FORM = {
  username: "",
  password: "",
  fullName: "",
  email: "",
  phone: "",
  identityNumber: "",
  address: "",
  role: "TENANT",
  active: true,
};

const UserAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) return toast.error("Họ tên không được để trống");
    if (!formData.username.trim()) return toast.error("Username không được để trống");
    if (!formData.email.trim()) return toast.error("Email không được để trống");
    if (!formData.password.trim()) return toast.error("Mật khẩu không được để trống khi tạo mới");

    setSaving(true);
    try {
      await api.post("/admin/users", formData);
      toast.success("Tạo người dùng thành công!");
      navigate("/admin/users");
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data || "Có lỗi xảy ra khi tạo người dùng");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/admin/users")} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Thêm người dùng mới
          </Typography>
        </Box>
        <UserForm 
          formData={formData} 
          handleChange={handleChange} 
          handleSubmit={handleSubmit} 
          saving={saving} 
          isEdit={false} 
        />
      </Container>
    </Box>
  );
};

export default UserAdd;
