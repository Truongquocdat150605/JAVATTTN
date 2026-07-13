import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  QrCode as QrCodeIcon,
  Visibility as VisibilityIcon} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";
import paymentService from "../../features/payment/paymentService";
import { formatVND } from "../../utils/formatVND";


const getStatusChip = (status) => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return <Chip icon={<CheckCircleIcon />} label="Thành công" color="success" size="small" />;
    case "PENDING":
      return <Chip icon={<PendingIcon />} label="Chờ xác nhận" color="warning" size="small" />;
    case "CANCELLED":
      return <Chip icon={<CancelIcon />} label="Đã huỷ" color="error" size="small" />;
    default:
      return <Chip label={status || "-"} size="small" />;
  }
};

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openQR, setOpenQR] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await paymentService.getMyPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Không thể tải lịch sử thanh toán");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

// MyPayments.jsx - Sửa handleConfirmPayment
const handleConfirmPayment = async (id) => {
  try {
    // Đúng theo Swagger: PUT /api/payments/{paymentId}/confirm
    await api.put(`/payments/${id}/confirm`);
    toast.success("Đã xác nhận thanh toán! Vui lòng chờ admin kiểm tra.");
    loadPayments();
  } catch (error) {
    toast.error("Xác nhận thất bại. Vui lòng thử lại.");
  }
};
  const handleViewQR = (payment) => {
    setSelectedPayment(payment);
    setOpenQR(true);
  };

  const stats = {
    total: payments.length,
    success: payments.filter(p => p.status === "COMPLETED").length,
    pending: payments.filter(p => p.status === "PENDING").length,
    totalAmount: payments.filter(p => p.status === "COMPLETED").reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
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
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 4, 
        background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
        color: "white"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PaymentIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Lịch Sử Thanh Toán
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Quản lý tất cả giao dịch thanh toán của bạn
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#0f766e">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">Tổng giao dịch</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#10b981">
              {stats.success}
            </Typography>
            <Typography variant="body2" color="text.secondary">Thành công</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#f59e0b">
              {formatVND(stats.totalAmount)}
            </Typography>
            <Typography variant="body2" color="text.secondary">Tổng tiền đã thanh toán</Typography>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error}
        </Alert>
      )}

      {/* Payments Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#0f766e" }}>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Mã GD</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Hóa đơn</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Số tiền</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Phương thức</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày tạo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Chưa có giao dịch thanh toán nào</Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>#{payment.id}</TableCell>
                  <TableCell>#{payment.invoice?.id || payment.invoiceId}</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#0f766e" }}>
                    {formatVND(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={payment.method || "Chuyển khoản"} 
                      size="small" 
                      variant="outlined"
                      icon={<QrCodeIcon />}
                    />
                  </TableCell>
                  <TableCell>
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString("vi-VN") : "-"}
                  </TableCell>
                  <TableCell>{getStatusChip(payment.status)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {payment.qrUrl && (
                        <Tooltip title="Xem mã QR">
                          <IconButton size="small" onClick={() => handleViewQR(payment)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {payment.status === "PENDING" && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleConfirmPayment(payment.id)}
                          sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
                        >
                          Xác nhận
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* QR Dialog */}
      <Dialog open={openQR} onClose={() => setOpenQR(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Mã QR thanh toán</DialogTitle>
        <DialogContent dividers>
          {selectedPayment && (
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Hóa đơn #{selectedPayment.invoice?.id || selectedPayment.invoiceId}
              </Typography>
              <Typography variant="h6" sx={{ color: "#0f766e", fontWeight: 700, mb: 2 }}>
                {formatVND(selectedPayment.amount)}
              </Typography>
              <Box
                component="img"
                src={selectedPayment.qrUrl}
                alt="QR Code"
                sx={{ width: "100%", maxWidth: 250, borderRadius: 2, border: "1px solid #e2e8f0" }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                Quét mã QR để thanh toán
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenQR(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyPayments;