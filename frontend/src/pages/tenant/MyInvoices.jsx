/**
 * @file MyInvoices.jsx
 * @description Trang quản lý hóa đơn dành cho Khách thuê. Hiển thị danh sách, chi tiết hóa đơn và thanh toán online.
 * @module pages/tenant
 */
import React, { useEffect, useMemo, useState } from "react";
import { Box, Chip, CircularProgress, Container, Paper, Typography, Tabs, Tab, Grid } from "@mui/material";
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import api from "../../services/api";
import paymentService from "../../features/payment/paymentService";
import { formatVND } from "../../utils/formatVND";
import { toast } from "react-toastify";

import InvoiceTable from "../../components/tenant/InvoiceTable";
import InvoiceDetailModal from "../../components/tenant/InvoiceDetailModal";
import PaymentModal from "../../components/tenant/PaymentModal";

const HEADER_BG = "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)";

const asNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const [openPay, setOpenPay] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const fetchMyInvoices = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
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
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInvoices();
    const intervalId = setInterval(() => fetchMyInvoices(true), 30000);
    return () => clearInterval(intervalId);
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
    const totalAmount = invoices.reduce((sum, i) => sum + asNumber(i.totalAmount), 0);
    const unpaidAmount = invoices.filter(i => i.status === "UNPAID").reduce((sum, i) => sum + asNumber(i.totalAmount), 0);
    return { total, unpaid, paid, totalAmount, unpaidAmount };
  }, [invoices]);

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedInvoice(null);
  };

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
      } else if (method === "cash") {
        res = await paymentService.payWithCash(selectedInvoice.id);
        toast.success(res?.message || "Da ghi nhan thanh toan tien mat. Vui long cho admin xac nhan.");
        handleClosePay();
        fetchMyInvoices(true);
        return;
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

  const handleDownload = (invoice) => toast.info("Đang tải hóa đơn...");

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
      <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: HEADER_BG, color: "white" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ReceiptIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h4" fontWeight={800}>Hóa Đơn Của Tôi</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý tất cả hóa đơn tiền điện, nước, dịch vụ</Typography>
            </Box>
          </Box>
          <Chip label={`Tổng cộng: ${formatVND(stats.totalAmount)}`} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 700 }} />
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#0f766e">{stats.total}</Typography>
            <Typography variant="body2" color="text.secondary">Tổng hóa đơn</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#f59e0b">{stats.unpaid}</Typography>
            <Typography variant="body2" color="text.secondary">Chưa thanh toán</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#10b981">{stats.paid}</Typography>
            <Typography variant="body2" color="text.secondary">Đã thanh toán</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#ef4444">{formatVND(stats.unpaidAmount)}</Typography>
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
      <InvoiceTable 
        invoices={filteredInvoices} 
        error={error} 
        handleViewDetail={handleViewDetail} 
        handleDownload={handleDownload} 
        handleOpenPay={handleOpenPay} 
      />

      {/* Detail Modal */}
      <InvoiceDetailModal 
        open={openDetail} 
        handleClose={handleCloseDetail} 
        selectedInvoice={selectedInvoice} 
        handleOpenPay={handleOpenPay} 
      />

      {/* Payment Modal */}
      <PaymentModal 
        open={openPay} 
        handleClose={handleClosePay} 
        selectedInvoice={selectedInvoice} 
        payLoading={payLoading} 
        handlePay={handlePay} 
      />
    </Container>
  );
};

export default MyInvoices;
