/**
 * @file ExpenseList.jsx
 * @description Trang danh sách chi phí.
 * @module pages/admin/expenses
 */
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, Chip, Tooltip, Stack, LinearProgress, TablePagination } from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Receipt as ReceiptIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { formatVND } from "../../../utils/formatVND";
import { paginateRows, sortNewestFirst } from "../../../utils/adminListUtils";

const Card = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}>
    {children}
  </Paper>
);

const ExpenseList = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    setLoading(true);
    try {
      const expensesRes = await api.get("/finance/expenses");
      const data = Array.isArray(expensesRes) ? expensesRes : (expensesRes?.data || expensesRes?.content || []);
      setExpenses(data);
    } catch (error) {
      toast.error("Không thể tải dữ liệu chi phí");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chi phí này?")) return;
    try {
      await api.delete(`/finance/expenses/${id}`);
      toast.success("Đã xóa chi phí");
      fetchData();
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netCashFlow = -totalExpenses;
  const sortedExpenses = sortNewestFirst(expenses, ["updatedAt", "lastModifiedDate", "expenseDate", "createdAt", "id"]);
  const paginatedExpenses = paginateRows(sortedExpenses, page, rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#fff7f8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ReceiptIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>Quản Lý Chi Phí Vận Hành</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Theo dõi chi phí vận hành của tòa nhà</Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/expenses/add")}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
            >
              Thêm Chi Phí
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="caption" color="text.secondary">Tổng chi phí</Typography>
              <Typography variant="h5" fontWeight={900} color="#ef4444">{formatVND(totalExpenses)}</Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: netCashFlow >= 0 ? "#22c55e10" : "#ef444410" }}>
              <Typography variant="caption" color="text.secondary">Công nợ (ước tính)</Typography>
              <Typography variant="h5" fontWeight={900} color={netCashFlow >= 0 ? "#22c55e" : "#ef4444"}>
                {formatVND(netCashFlow)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Expenses Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto", overflowY: "visible", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Table sx={{ minWidth: 820 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#ef4444" }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Nội dung chi</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Phân loại</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="right">Số tiền (VNĐ)</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">Chưa có chi phí nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedExpenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell>{expense.expenseDate}</TableCell>
                    <TableCell><Typography fontWeight={600}>{expense.description}</Typography></TableCell>
                    <TableCell>
                      <Chip label={expense.category || "Khác"} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#ef4444" }}>
                      -{formatVND(expense.amount ?? 0)}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="primary" onClick={() => navigate(`/admin/expenses/edit/${expense.id}`)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton size="small" color="error" onClick={() => handleDelete(expense.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedExpenses.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage="Dòng/trang"
          />
        </TableContainer>
      </Container>
    </Box>
  );
};

export default ExpenseList;
