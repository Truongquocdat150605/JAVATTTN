/**
 * @file InvoiceEdit.jsx
 * @description Trang chỉnh sửa hóa đơn.
 * @module pages/admin/invoices
 */
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import InvoiceForm from "./InvoiceForm";

const InvoiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const [formData, setFormData] = useState({
    rentalAmount: 0,
    electricityStart: 0,
    electricityEnd: 0,
    electricityPrice: 3500,
    waterStart: 0,
    waterEnd: 0,
    waterPrice: 15000,
    serviceAmount: 0,
    status: "UNPAID",
    notes: "",
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/invoices`);
        const allInvoices = Array.isArray(res) ? res : (res?.data || res?.content || []);
        
        // Find the invoice since there might not be a specific GET /invoices/{id} endpoint based on standard patterns
        const invoice = allInvoices.find(inv => String(inv.id) === String(id));
        
        if (!invoice) {
          toast.error("Không tìm thấy hóa đơn");
          navigate("/admin/invoices");
          return;
        }

        setEditingInvoice(invoice);
        setFormData({
          rentalAmount: invoice.rentalAmount || 0,
          electricityStart: invoice.electricityStart || 0,
          electricityEnd: invoice.electricityEnd || 0,
          electricityPrice: invoice.electricityPrice || 3500,
          waterStart: invoice.waterStart || 0,
          waterEnd: invoice.waterEnd || 0,
          waterPrice: invoice.waterPrice || 15000,
          serviceAmount: invoice.serviceAmount || 0,
          status: invoice.status || "UNPAID",
          notes: invoice.notes || "",
        });

      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu hóa đơn");
        navigate("/admin/invoices");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchInvoice();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const calculateElectricityAmount = () => {
    const used = Math.max(0, toNumber(formData.electricityEnd) - toNumber(formData.electricityStart));
    return used * toNumber(formData.electricityPrice);
  };

  const calculateWaterAmount = () => {
    const used = Math.max(0, toNumber(formData.waterEnd) - toNumber(formData.waterStart));
    return used * toNumber(formData.waterPrice);
  };

  const calculateTotal = () => {
    return toNumber(formData.rentalAmount) + calculateElectricityAmount() + calculateWaterAmount() + toNumber(formData.serviceAmount);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const payload = {
        ...formData,
        rentalAmount: toNumber(formData.rentalAmount),
        electricityStart: toNumber(formData.electricityStart),
        electricityEnd: toNumber(formData.electricityEnd),
        electricityPrice: toNumber(formData.electricityPrice),
        electricityAmount: calculateElectricityAmount(),
        waterStart: toNumber(formData.waterStart),
        waterEnd: toNumber(formData.waterEnd),
        waterPrice: toNumber(formData.waterPrice),
        waterAmount: calculateWaterAmount(),
        serviceAmount: toNumber(formData.serviceAmount),
        totalAmount: calculateTotal(),
      };

      await api.put(`/invoices/${id}`, payload);
      toast.success("Cập nhật hóa đơn thành công");
      navigate("/admin/invoices");
    } catch (error) {
      toast.error("Lỗi khi lưu hóa đơn");
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
          <IconButton onClick={() => navigate("/admin/invoices")} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#1e293b">
              Chỉnh sửa hóa đơn #{id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phòng {editingInvoice?.contract?.room?.roomNumber} - Khách thuê: {editingInvoice?.contract?.tenant?.fullName}
            </Typography>
          </Box>
        </Box>
        <InvoiceForm 
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          saving={saving}
          calculateElectricityAmount={calculateElectricityAmount}
          calculateWaterAmount={calculateWaterAmount}
          calculateTotal={calculateTotal}
        />
      </Container>
    </Box>
  );
};

export default InvoiceEdit;
