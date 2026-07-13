/**
 * @file TenantMaintenance.jsx
 * @description Trang quản lý yêu cầu bảo trì của khách thuê. Cho phép tạo yêu cầu mới và xem trạng thái.
 * @module pages/tenant
 */
import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Grid, Button, CircularProgress } from "@mui/material";
import { Build as BuildIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

import MaintenanceList from "../../components/tenant/MaintenanceList";
import MaintenanceForm from "../../components/tenant/MaintenanceForm";

const TenantMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ roomId: "", description: "" });
  const [errors, setErrors] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsRes, roomsRes] = await Promise.all([
        api.get("/maintenance/my"),
        api.get("/tenant/my-rooms")
      ]);
      setRequests(Array.isArray(requestsRes) ? requestsRes : []);
      setRooms(Array.isArray(roomsRes) ? roomsRes : []);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.roomId) newErrors.roomId = "Vui lòng chọn phòng";
    if (!form.description.trim()) newErrors.description = "Vui lòng nhập mô tả sự cố";
    else if (form.description.trim().length < 10) newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await api.post("/maintenance", null, {
        params: {
          roomId: form.roomId,
          description: form.description,
        },
      });
      toast.success("Đã gửi yêu cầu bảo trì thành công!");
      setForm({ roomId: "", description: "" });
      setOpenDialog(false);
      loadData();
    } catch (error) {
      toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    inProgress: requests.filter((r) => r.status === "IN_PROGRESS").length,
    completed: requests.filter((r) => r.status === "RESOLVED").length,
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <BuildIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" fontWeight={800}>Yêu Cầu Bảo Trì</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý và theo dõi các yêu cầu sửa chữa, bảo trì</Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}>
          Tạo yêu cầu mới
        </Button>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#0f766e">{stats.total}</Typography>
            <Typography variant="body2" color="text.secondary">Tổng yêu cầu</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#f59e0b">{stats.pending}</Typography>
            <Typography variant="body2" color="text.secondary">Chờ xử lý</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#3b82f6">{stats.inProgress}</Typography>
            <Typography variant="body2" color="text.secondary">Đang xử lý</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#10b981">{stats.completed}</Typography>
            <Typography variant="body2" color="text.secondary">Hoàn thành</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Requests List */}
      <MaintenanceList requests={requests} />

      {/* Create Request Dialog */}
      <MaintenanceForm 
        open={openDialog} 
        handleClose={() => setOpenDialog(false)} 
        handleSubmit={handleSubmit} 
        form={form} 
        setForm={setForm} 
        errors={errors} 
        rooms={rooms} 
        submitting={submitting} 
      />
    </Container>
  );
};

export default TenantMaintenance;