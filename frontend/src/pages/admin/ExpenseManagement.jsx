import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  LinearProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  Close as CloseIcon2,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";
import { formatVND } from "../../utils/formatVND";

const ExpenseManagement = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  // Chỉ còn chi phí
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "OTHER",
    expenseDate: new Date().toISOString().split("T")[0],
  });

  const [expenses, setExpenses] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const expensesRes = await api.get("/finance/expenses");

      const unwrapList = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.content)) return payload.content;
        return [];
      };

      setExpenses(unwrapList(expensesRes));
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = (item = null) => {
    setEditingExpense(item);

    if (item) {
      setFormData({
        name: item.description || "",
        price: item.amount ?? "",
        description: "",
        category: item.category || "OTHER",
        expenseDate: item.expenseDate || new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "OTHER",
        expenseDate: new Date().toISOString().split("T")[0],
      });
    }

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingExpense(null);
  };

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

      if (editingExpense) {
        await api.put(`/finance/expenses/${editingExpense.id}`, {
          description: formData.name,
          amount: Number(formData.price),
          expenseDate: formData.expenseDate,
          category: formData.category,
        });
        toast.success("Cập nhật chi phí thành công");
      } else {
        await api.post("/finance/expenses", {
          description: formData.name,
          amount: Number(formData.price),
          expenseDate: formData.expenseDate,
          category: formData.category,
        });
        toast.success("Thêm chi phí mới thành công");
      }

      fetchData();
      handleCloseDialog();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu dữ liệu");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;

    try {
      await api.delete(`/finance/expenses/${id}`);
      toast.success("Đã xóa chi phí");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa");
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Theo yêu cầu: chỉ giữ thống kê chi phí. netCashFlow không còn cần thiết vì đã xóa phần dịch vụ/thu.
  const netCashFlow = -totalExpenses;

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ReceiptIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Quản Lý Chi Phí Vận Hành
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Theo dõi chi phí vận hành của tòa nhà
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog(null)}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              Thêm Chi Phí
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Tổng chi phí
              </Typography>
              <Typography variant="h5" fontWeight={900} color="#ef4444">
                {formatVND(totalExpenses)}
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                borderRadius: 3,
                textAlign: "center",
                p: 2,
                bgcolor: netCashFlow >= 0 ? "#22c55e10" : "#ef444410",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Công nợ (ước tính)
              </Typography>
              <Typography
                variant="h5"
                fontWeight={900}
                color={netCashFlow >= 0 ? "#22c55e" : "#ef4444"}
              >
                {formatVND(netCashFlow)}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Expenses Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#ef4444" }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Nội dung chi</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Phân loại</TableCell>
                <TableCell
                  sx={{ color: "white", fontWeight: 700 }}
                  align="right"
                >
                  Số tiền (VNĐ)
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">Chưa có chi phí nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id} hover>
                    <TableCell>{expense.expenseDate}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{expense.description}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={expense.category || "Khác"} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#ef4444" }}>
                      -{formatVND(expense.amount ?? 0)}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="primary" onClick={() => handleOpenDialog(expense)}>
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
        </TableContainer>

        {/* Create/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{
              bgcolor: "#ef4444",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 800,
            }}
          >
            {editingExpense ? "Chỉnh sửa chi phí" : "Thêm chi phí mới"}
            <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Nội dung chi"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                required
              />

              <TextField
                label="Số tiền (VNĐ)"
                name="price"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleChange}
                required
              />

              <TextField
                label="Ngày chi"
                name="expenseDate"
                type="date"
                fullWidth
                value={formData.expenseDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth>
                <InputLabel>Phân loại</InputLabel>
                <Select name="category" value={formData.category} label="Phân loại" onChange={handleChange}>
                  <MenuItem value="MAINTENANCE">Bảo trì</MenuItem>
                  <MenuItem value="SALARY">Lương nhân viên</MenuItem>
                  <MenuItem value="UTILITY">Điện nước</MenuItem>
                  <MenuItem value="TAX">Thuế</MenuItem>
                  <MenuItem value="OTHER">Khác</MenuItem>
                </Select>
              </FormControl>

              <Alert severity="info" variant="outlined">
                Lưu ý: Số tiền được lưu ở trường <b>amount</b> và nội dung ở trường <b>description</b>.
              </Alert>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#f97316" } }}
            >
              {editingExpense ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ExpenseManagement;
