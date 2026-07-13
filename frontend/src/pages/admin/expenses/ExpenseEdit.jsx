/**
 * @file ExpenseEdit.jsx
 * @description Trang chỉnh sửa chi phí.
 * @module pages/admin/expenses
 */
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import ExpenseForm from "./ExpenseForm";

const ExpenseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "OTHER",
    expenseDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        setLoading(true);
        const res = await api.get("/finance/expenses");
        const allExpenses = Array.isArray(res) ? res : (res?.data || res?.content || []);
        
        const expense = allExpenses.find(e => String(e.id) === String(id));
        
        if (!expense) {
          toast.error("Không tìm thấy chi phí");
          navigate("/admin/expenses");
          return;
        }

        setFormData({
          name: expense.description || "",
          price: expense.amount ?? "",
          description: "",
          category: expense.category || "OTHER",
          expenseDate: expense.expenseDate || new Date().toISOString().split("T")[0],
        });
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu chi phí");
        navigate("/admin/expenses");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExpense();
  }, [id, navigate]);

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
      await api.put(`/finance/expenses/${id}`, {
        description: formData.name,
        amount: Number(formData.price),
        expenseDate: formData.expenseDate,
        category: formData.category,
      });
      toast.success("Cập nhật chi phí thành công");
      navigate("/admin/expenses");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu dữ liệu");
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
    <Box sx={{ bgcolor: "#fff7f8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/admin/expenses")} sx={{ mr: 2, bgcolor: "white", boxShadow: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Chỉnh sửa chi phí #{id}
          </Typography>
        </Box>
        <ExpenseForm 
          isEdit={true}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          saving={saving}
        />
      </Container>
    </Box>
  );
};

export default ExpenseEdit;
