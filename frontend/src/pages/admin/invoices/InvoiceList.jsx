/**
 * @file InvoiceList.jsx
 * @description Trang danh sách hóa đơn (thống kê, hiển thị, bộ lọc).
 * @module pages/admin/invoices
 */
import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Grid, Tooltip, LinearProgress, Stack, TablePagination, Tabs, Tab } from "@mui/material";
import { Receipt as ReceiptIcon, CheckCircle as CheckCircleIcon, PendingActions as PendingIcon, Warning as WarningIcon, PictureAsPdf as PdfIcon, Edit as EditIcon, Delete as DeleteIcon, Payments as CashIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import paymentService from "../../../features/payment/paymentService";
import { formatVND } from "../../../utils/formatVND";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RobotoBase64 } from "../../../utils/RobotoFont";
import InvoiceDetailModal from "../../../components/tenant/InvoiceDetailModal";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { paginateRows, sortNewestFirst } from "../../../utils/adminListUtils";

const getStatusChip = (status) => {
  switch (status) {
    case "PAID": return <Chip icon={<CheckCircleIcon />} label="Đã thanh toán" color="success" size="small" sx={{ fontWeight: 600 }} />;
    case "UNPAID": return <Chip icon={<PendingIcon />} label="Chưa thanh toán" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    case "OVERDUE": return <Chip icon={<WarningIcon />} label="Quá hạn" color="error" size="small" sx={{ fontWeight: 600 }} />;
    default: return <Chip label={status} size="small" />;
  }
};

const Card = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}>
    {children}
  </Paper>
);

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [schedulerStatus, setSchedulerStatus] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const handleViewDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedInvoice(null);
  };

  const fetchInvoices = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await api.get("/invoices");
      const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (res?.content || []));
      setInvoices(data);
      api.get("/invoices/scheduler-status")
        .then((status) => setSchedulerStatus(status?.data || status))
        .catch(() => setSchedulerStatus(null));
    } catch (error) {
      toast.error("Lỗi khi tải danh sách hóa đơn");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
    const intervalId = setInterval(() => fetchInvoices(true), 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
      try {
        await api.delete(`/invoices/${id}`);
        toast.success("Đã xóa hóa đơn");
        fetchInvoices();
      } catch (error) {
        toast.error("Lỗi khi xóa hóa đơn");
      }
    }
  };

  const generatePDF = (invoiceData) => {
    const doc = new jsPDF();
    
    // Thêm font tiếng Việt
    doc.addFileToVFS("Roboto-Regular.ttf", RobotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    
    doc.setFontSize(22);
    doc.setTextColor(6, 78, 59);
    doc.text("SMART PHÒNG TRỌ - HÓA ĐƠN", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`, 105, 30, { align: "center" });
    
    doc.setDrawColor(200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Phòng: ${invoiceData.contract?.room?.roomNumber || "N/A"}`, 20, 50);
    doc.text(`Khách thuê: ${invoiceData.contract?.tenant?.fullName || "N/A"}`, 20, 60);
    doc.text(`Kỳ thanh toán: ${invoiceData.billingDate ? new Date(invoiceData.billingDate).toLocaleDateString("vi-VN") : "Chưa xác định"}`, 20, 70);

    const columns = ["Nội dung", "Chỉ số", "Đơn giá", "Thành tiền"];
    const rows = [
      ["Tiền phòng", "-", "-", `${formatVND(invoiceData.rentalAmount)}`],
      ["Điện", `${invoiceData.electricityStart} → ${invoiceData.electricityEnd}`, `${formatVND(invoiceData.electricityPrice)}/kWh`, `${formatVND(invoiceData.electricityAmount)}`],
      ["Nước", `${invoiceData.waterStart} → ${invoiceData.waterEnd}`, `${formatVND(invoiceData.waterPrice)}/m³`, `${formatVND(invoiceData.waterAmount)}`],
      ["Dịch vụ khác", "-", "-", `${formatVND(invoiceData.serviceAmount)}`],
    ];

    autoTable(doc, {
      startY: 80,
      head: [columns],
      body: rows,
      theme: "striped",
      styles: { font: "Roboto" },
      headStyles: { fillColor: [6, 78, 59] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.text(`TỔNG CỘNG: ${formatVND(invoiceData.totalAmount)}`, 190, finalY, { align: "right" });
    
    doc.setFontSize(11);
    doc.setTextColor(invoiceData.status === "PAID" ? "#2e7d32" : "#d32f2f");
    doc.text(`Trạng thái: ${invoiceData.status === "PAID" ? "ĐÃ THANH TOÁN" : "CHƯA THANH TOÁN"}`, 190, finalY + 10, { align: "right" });

    return doc.output("blob");
  };

  const handleExportPDF = (invoice) => {
    const blob = generatePDF(invoice);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `HoaDon_Phong${invoice.contract?.room?.roomNumber}_${invoice.id}.pdf`;
    link.click();
    toast.success("Đã xuất file PDF!");
  };

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "PAID").length,
    unpaid: invoices.filter((i) => i.status === "UNPAID").length,
    overdue: invoices.filter((i) => i.status === "OVERDUE").length,
    totalAmount: invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0),
    unpaidAmount: invoices.filter((i) => i.status !== "PAID").reduce((sum, i) => sum + (i.totalAmount || 0), 0),
  };
  const sortedInvoices = sortNewestFirst(invoices, ["updatedAt", "lastModifiedDate", "billingDate", "paymentDate", "id"]);
  const filteredInvoices = sortedInvoices.filter(invoice => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return invoice.status !== "PAID";
    if (tabValue === 2) return invoice.status === "PAID";
    return true;
  });
  const paginatedInvoices = paginateRows(filteredInvoices, page, rowsPerPage);

  const handleGenerateMonthly = async () => {
    if (window.confirm("Chạy demo sinh hóa đơn cho tất cả phòng đang thuê? Chế độ demo sẽ tạo thêm hóa đơn mới ngay cả khi tháng này đã có hóa đơn.")) {
      try {
        setLoading(true);
        await api.post("/invoices/generate-monthly?force=true");
        toast.success("Đã sinh hóa đơn định kỳ thành công!");
        fetchInvoices();
      } catch (error) {
        toast.error("Lỗi khi sinh hóa đơn định kỳ");
        setLoading(false);
      }
    }
  };

  const handleConfirmCashPayment = async (invoice) => {
    if (!window.confirm(`Xac nhan da thu tien mat cho hoa don #${invoice.id}?`)) return;
    try {
      await paymentService.confirmCashPayment(invoice.id);
      toast.success("Da xac nhan thu tien mat va cap nhat hoa don.");
      fetchInvoices(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Loi khi xac nhan thanh toan tien mat");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ReceiptIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>Quản Lý Hóa Đơn</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý hóa đơn tiền phòng, điện, nước, dịch vụ</Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              color="warning" 
              onClick={handleGenerateMonthly}
              sx={{ fontWeight: "bold", borderRadius: 2, boxShadow: 3 }}
            >
              ⚡ Chạy Sinh Hóa Đơn (Demo)
            </Button>
          </Box>
        </Paper>

        {schedulerStatus && (
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: "1px solid #fde68a", bgcolor: "#fffbeb" }}>
              <Typography variant="body2" fontWeight={700} color="#92400e">
              Tự động sinh hóa đơn: cron {schedulerStatus.cron || "-"} {schedulerStatus.forceCreate ? "(demo tạo thật)" : "(chống trùng)"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Lần chạy gần nhất: {schedulerStatus.lastRunAt ? new Date(schedulerStatus.lastRunAt).toLocaleString("vi-VN") : "Chưa chạy"} |
              Tạo mới: {schedulerStatus.created ?? 0} |
              Bỏ qua: {schedulerStatus.skipped ?? 0} |
              Lỗi: {schedulerStatus.failed ?? 0}
            </Typography>
          </Paper>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#0f766e">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Tổng hóa đơn</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#10b981">{stats.paid}</Typography>
              <Typography variant="body2" color="text.secondary">Đã thanh toán</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#f59e0b">{stats.unpaid}</Typography>
              <Typography variant="body2" color="text.secondary">Chưa thanh toán</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#ef4444">{formatVND(stats.unpaidAmount)}</Typography>
              <Typography variant="body2" color="text.secondary">Công nợ</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs Filter */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => { setTabValue(v); setPage(0); }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Tất cả" />
            <Tab label="Chưa thanh toán" />
            <Tab label="Đã thanh toán" />
          </Tabs>
        </Box>

        {/* Invoices Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto", overflowY: "visible", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Table sx={{ minWidth: 1120 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#0f766e" }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Mã HD</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Phòng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Khách thuê</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày hóa đơn</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Điện</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Nước</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="right">Tổng tiền</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}><Typography color="text.secondary">Không có hóa đơn nào</Typography></TableCell>
                </TableRow>
              ) : (
                paginatedInvoices.map((invoice) => (
                  <TableRow key={invoice.id} hover>
                    <TableCell>#{invoice.id}</TableCell>
                    <TableCell>Phòng {invoice.contract?.room?.roomNumber}</TableCell>
                    <TableCell>{invoice.contract?.tenant?.fullName}</TableCell>
                    <TableCell>{invoice.billingDate ? new Date(invoice.billingDate).toLocaleDateString("vi-VN") : "-"}</TableCell>
                    <TableCell>{invoice.electricityAmount?.toLocaleString()}₫</TableCell>
                    <TableCell>{invoice.waterAmount?.toLocaleString()}₫</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#0f766e" }}>
                      {formatVND(invoice.totalAmount)}
                    </TableCell>
                    <TableCell>{getStatusChip(invoice.status)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" color="info" onClick={() => handleViewDetail(invoice)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xuất PDF">
                          <IconButton size="small" color="secondary" onClick={() => handleExportPDF(invoice)}>
                            <PdfIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <span>
                          {invoice.status !== "PAID" && (
                            <IconButton size="small" color="success" onClick={() => handleConfirmCashPayment(invoice)} title="Xac nhan thu tien mat">
                              <CashIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton size="small" color="primary" onClick={() => navigate(`/admin/invoices/edit/${invoice.id}`)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton size="small" color="error" onClick={() => handleDelete(invoice.id)}>
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
            count={filteredInvoices.length}
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

        {/* Detail Modal */}
        <InvoiceDetailModal 
          open={openDetail} 
          handleClose={handleCloseDetail} 
          selectedInvoice={selectedInvoice} 
        />
      </Container>
    </Box>
  );
};

export default InvoiceList;
