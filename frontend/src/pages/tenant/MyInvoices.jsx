import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  WarningAmber as WarningIcon,
  Schedule as ScheduleIcon,
  CreditCard as CardIcon,
  AccountBalanceWallet as BankIcon,
} from "@mui/icons-material";
import api from "../../services/api";
import paymentService from "../../features/payment/paymentService";
import { formatVND } from "../../utils/formatVND";
import { toast } from "react-toastify";

const HEADER_BG = "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)";

const formatMonth = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${m}/${y}`;
};

const asNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const getStatusChip = (status) => {
  if (status === "PAID") return <Chip icon={<CheckCircleIcon />} label="Đã thanh toán" color="success" size="small" />;
  if (status === "UNPAID") return <Chip icon={<ScheduleIcon />} label="Chưa thanh toán" color="warning" size="small" />;
  if (status === "OVERDUE") return <Chip icon={<WarningIcon />} label="Quá hạn" color="error" size="small" />;
  return <Chip label={status || "-"} size="small" />;
};

const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openPay, setOpenPay] = useState(false);
  const [qrSrc, setQrSrc] = useState("");
  const [qrLoading, setQrLoading] = useState(false);

  const fetchMyInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/invoices/my");
      setInvoices(Array.isArray(res) ? res : []);
    } catch (e1) {
      try {
        const res2 = await api.get("/tenant/invoices");
        setInvoices(Array.isArray(res2) ? res2 : []);
      } catch (e2) {
        setError("Không thể tải danh sách hóa đơn.");
        setInvoices([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");
      const paymentId = params.get("paymentId");

      if (status === "PAID" && paymentId) {
        try {
          await paymentService.confirmPayment(paymentId);
          toast.success("🎉 Thanh toán hóa đơn thành công!");
          fetchMyInvoices();
        } catch (err) {
          console.error(err);
          toast.error("Lỗi xác nhận thanh toán. Vui lòng liên hệ Admin.");
        } finally {
          window.history.replaceState({}, "", "/my-invoices");
        }
      } else if (status === "CANCELED") {
        toast.error("❌ Giao dịch thanh toán đã bị hủy.");
        window.history.replaceState({}, "", "/my-invoices");
      }
    };

    handlePaymentCallback();
  }, []);

  // Filter invoices by tab
  const filteredInvoices = useMemo(() => {
    if (tabValue === 0) return invoices;
    if (tabValue === 1) return invoices.filter(i => i.status === "UNPAID");
    if (tabValue === 2) return invoices.filter(i => i.status === "PAID");
    return invoices;
  }, [invoices, tabValue]);

  const stats = useMemo(() => {
    const total = invoices.length;
    const unpaid = invoices.filter(i => i.status === "UNPAID").length;
    const paid = invoices.filter(i => i.status === "PAID").length;
    const overdue = invoices.filter(i => i.status === "OVERDUE").length;
    const totalAmount = invoices.reduce((sum, i) => sum + asNumber(i.totalAmount), 0);
    const unpaidAmount = invoices
      .filter(i => i.status === "UNPAID")
      .reduce((sum, i) => sum + asNumber(i.totalAmount), 0);
    
    return { total, unpaid, paid, overdue, totalAmount, unpaidAmount };
  }, [invoices]);

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenDetail(true);
  };

  const [payLoading, setPayLoading] = useState(false);

  const handleOpenPay = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenPay(true);
  };

  const handleClosePay = () => {
    setOpenPay(false);
    setSelectedInvoice(null);
  };

  const handlePay = async (method) => {
    if (!selectedInvoice) return;
    setPayLoading(true);
    try {
      let res;
      if (method === "stripe") {
        res = await paymentService.payWithStripe(selectedInvoice.id);
      } else if (method === "payos") {
        res = await paymentService.payWithPayOS(selectedInvoice.id);
      }
      if (res && res.payUrl) {
        toast.success("Đang chuyển hướng đến cổng thanh toán...");
        window.location.href = res.payUrl;
      } else {
        toast.error("Không thể tạo liên kết thanh toán.");
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || "Có lỗi xảy ra khi tạo thanh toán.");
    } finally {
      setPayLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedInvoice(null);
  };

  const handleDownload = (invoice) => {
    // Implement download invoice PDF
    toast.info("Đang tải hóa đơn...");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 4, 
        background: HEADER_BG,
        color: "white"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ReceiptIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Hóa Đơn Của Tôi
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Quản lý tất cả hóa đơn tiền điện, nước, dịch vụ
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={`Tổng cộng: ${formatVND(stats.totalAmount)}`}
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700 }}
          />
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#0f766e">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">Tổng hóa đơn</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#f59e0b">
              {stats.unpaid}
            </Typography>
            <Typography variant="body2" color="text.secondary">Chưa thanh toán</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#10b981">
              {stats.paid}
            </Typography>
            <Typography variant="body2" color="text.secondary">Đã thanh toán</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#ef4444">
              {formatVND(stats.unpaidAmount)}
            </Typography>
            <Typography variant="body2" color="text.secondary">Còn nợ</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Tất cả" />
          <Tab label="Chưa thanh toán" />
          <Tab label="Đã thanh toán" />
        </Tabs>
      </Box>

      {/* Invoices Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: HEADER_BG }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Mã HD</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tháng</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Điện (kWh)</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Nước (m³)</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tiền phòng</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tổng tiền</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {error && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            )}

            {!error && filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">Không có hóa đơn nào.</Typography>
                </TableCell>
              </TableRow>
            )}

            {!error &&
              filteredInvoices.map((invoice) => {
                const eStart = asNumber(invoice.electricityStart);
                const eEnd = asNumber(invoice.electricityEnd);
                const wStart = asNumber(invoice.waterStart);
                const wEnd = asNumber(invoice.waterEnd);
                const eUsed = Math.max(0, eEnd - eStart);
                const wUsed = Math.max(0, wEnd - wStart);

                return (
                  <TableRow key={invoice.id} hover>
                    <TableCell>#{invoice.id}</TableCell>
                    <TableCell>{formatMonth(invoice.billingDate)}</TableCell>
                    <TableCell>{eUsed}</TableCell>
                    <TableCell>{wUsed}</TableCell>
                    <TableCell>{formatVND(invoice.rentalAmount)}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0f766e" }}>
                      {formatVND(invoice.totalAmount)}
                    </TableCell>
                    <TableCell>{getStatusChip(invoice.status)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" onClick={() => handleViewDetail(invoice)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Tải xuống">
                          <IconButton size="small" onClick={() => handleDownload(invoice)}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {invoice.status !== "PAID" && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleOpenPay(invoice)}
                            sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
                          >
                            Thanh toán
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invoice Detail Dialog */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Chi tiết hóa đơn #{selectedInvoice?.id}
          <IconButton onClick={handleCloseDetail} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tháng</Typography>
                  <Typography fontWeight={600}>{formatMonth(selectedInvoice.billingDate)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Trạng thái</Typography>
                  <Box>{getStatusChip(selectedInvoice.status)}</Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Điện (chỉ số cũ → mới)</Typography>
                  <Typography fontWeight={600}>{selectedInvoice.electricityStart} → {selectedInvoice.electricityEnd}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Nước (chỉ số cũ → mới)</Typography>
                  <Typography fontWeight={600}>{selectedInvoice.waterStart} → {selectedInvoice.waterEnd}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tiền điện</Typography>
                  <Typography fontWeight={600}>{formatVND(selectedInvoice.electricityAmount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tiền nước</Typography>
                  <Typography fontWeight={600}>{formatVND(selectedInvoice.waterAmount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tiền phòng</Typography>
                  <Typography fontWeight={600}>{formatVND(selectedInvoice.rentalAmount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Phí dịch vụ</Typography>
                  <Typography fontWeight={600}>{formatVND(selectedInvoice.serviceAmount)}</Typography>
                </Grid>
                <Divider sx={{ my: 2, width: "100%" }} />
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Tổng cộng:</span>
                    <span style={{ color: "#0f766e", fontWeight: 900 }}>{formatVND(selectedInvoice.totalAmount)}</span>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Đóng</Button>
          {selectedInvoice?.status !== "PAID" && (
            <Button variant="contained" onClick={() => { handleCloseDetail(); handleOpenPay(selectedInvoice); }}>
              Thanh toán ngay
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Payment Selection Dialog */}
      <Dialog open={openPay} onClose={handleClosePay} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 800, color: "#0f766e" }}>
          Chọn Phương Thức Thanh Toán
        </DialogTitle>
        <DialogContent dividers>
          <Box textAlign="center" sx={{ py: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Hóa đơn #{selectedInvoice?.id}
            </Typography>
            <Typography variant="h5" sx={{ color: "#0f766e", fontWeight: 800, mb: 3 }}>
              {formatVND(selectedInvoice?.totalAmount)}
            </Typography>

            {payLoading ? (
              <Box sx={{ py: 3 }}>
                <CircularProgress color="inherit" sx={{ color: "#0f766e" }} />
                <Typography sx={{ mt: 2, color: "text.secondary" }}>
                  Đang khởi tạo giao dịch thanh toán...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Stripe Button */}
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handlePay("stripe")}
                  startIcon={<CardIcon />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    borderColor: "#635bff",
                    color: "#635bff",
                    fontWeight: 700,
                    textTransform: "none",
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "#4a3df5",
                      bgcolor: "rgba(99, 91, 255, 0.04)",
                      transform: "translateY(-2px)",
                      transition: "all 0.2s"
                    }
                  }}
                >
                  Thanh toán qua Stripe (Visa/Master)
                </Button>

                {/* PayOS Button */}
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handlePay("payos")}
                  startIcon={<BankIcon />}
                  sx={{
                    py: 2,
                    borderRadius: 3,
                    borderColor: "#0d9488",
                    color: "#0d9488",
                    fontWeight: 700,
                    textTransform: "none",
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      borderColor: "#0f766e",
                      bgcolor: "rgba(13, 148, 136, 0.04)",
                      transform: "translateY(-2px)",
                      transition: "all 0.2s"
                    }
                  }}
                >
                  Thanh toán qua PayOS (VietQR)
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePay} disabled={payLoading}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyInvoices;