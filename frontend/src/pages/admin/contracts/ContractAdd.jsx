/**
 * @file ContractAdd.jsx
 * @description Trang thêm mới hợp đồng.
 * @module pages/admin/contracts
 */
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import ContractForm from "./ContractForm";

const ContractAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    roomId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    rentPrice: "",
    deposit: "",
    status: "ACTIVE",
  });

  const [newTenantForm, setNewTenantForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    identityNumber: "",
    address: "",
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/rooms/available");
        const data = Array.isArray(res) ? res : (res?.data || res?.content || []);
        setRooms(data);
      } catch (error) {
        toast.error("Không thể tải danh sách phòng trống");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewTenantChange = (e) => {
    setNewTenantForm({ ...newTenantForm, [e.target.name]: e.target.value });
  };

  const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));

  const handleSubmit = async () => {
    if (!newTenantForm.fullName.trim()) return toast.error("Vui lòng nhập họ tên khách thuê");
    if (!newTenantForm.phone.trim()) return toast.error("Vui lòng nhập số điện thoại khách thuê");
    if (!newTenantForm.email.trim()) return toast.error("Vui lòng nhập email khách thuê");
    if (!formData.roomId) return toast.error("Vui lòng chọn phòng");
    if (!isValidDate(formData.startDate)) return toast.error("Ngày bắt đầu phải đúng định dạng YYYY-MM-DD");
    if (!formData.rentPrice || Number(formData.rentPrice) <= 0) return toast.error("Vui lòng nhập giá thuê hợp lệ");

    setSaving(true);
    try {
      await api.post("/contracts/create-with-tenant", null, {
        params: {
          roomId: formData.roomId,
          tenantFullName: newTenantForm.fullName,
          tenantEmail: newTenantForm.email,
          tenantPhone: newTenantForm.phone,
          tenantIdentity: newTenantForm.identityNumber || null,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          rentPrice: Number(formData.rentPrice),
          deposit: Number(formData.deposit) || 0,
        }
      });
      toast.success("Tạo hợp đồng thành công!");
      navigate("/admin/contracts");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.response?.data?.error || "Lỗi khi tạo hợp đồng");
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
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/admin/contracts")} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Tạo hợp đồng mới
          </Typography>
        </Box>
        <ContractForm 
          isEdit={false}
          formData={formData}
          newTenantForm={newTenantForm}
          handleChange={handleChange}
          handleNewTenantChange={handleNewTenantChange}
          handleSubmit={handleSubmit}
          saving={saving}
          rooms={rooms}
        />
      </Container>
    </Box>
  );
};

export default ContractAdd;
