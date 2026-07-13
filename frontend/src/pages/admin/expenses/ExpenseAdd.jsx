/**
 * @file ExpenseAdd.jsx
 * @description Trang thêm mới chi phí.
 * @module pages/admin/expenses
 */
import React, { useState } from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import ExpenseForm from "./ExpenseForm";

const ExpenseAdd = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "OTHER",
    expenseDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name?.trim()) {
        toast.error("Vui lòng nhập nội dung chi phí");
        return;
      }
      if (formData.price === "" || Number(formData.price) <= 0) {
        toast.error("Vui lòng nhập số tiền hợp lệ");
        return;
      }

      setSaving(true);
      await api.post("/finance/expenses", {
        description: formData.name,
        amount: Number(formData.price),
        expenseDate: formData.expenseDate,
        category: formData.category,
      });
      toast.success("Thêm chi phí mới thành công");
      navigate("/admin/expenses");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu dữ liệu");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#fff7f8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/admin/expenses")} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Thêm chi phí mới
          </Typography>
        </Box>
        <ExpenseForm 
          isEdit={false}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          saving={saving}
        />
      </Container>
    </Box>
  );
};

export default ExpenseAdd;
