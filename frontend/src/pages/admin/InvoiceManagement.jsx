import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Grid,
  Divider,
  Avatar,
  Tooltip,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  Warning as WarningIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Send as SendIcon,
  Close as CloseIcon,
  ElectricBolt as ElectricIcon,
  WaterDrop as WaterIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";
import { formatVND } from "../../utils/formatVND";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getStatusChip = (status) => {
  switch (status) {
    case "PAID":
      return <Chip icon={<CheckCircleIcon />} label="Đã thanh toán" color="success" size="small" sx={{ fontWeight: 600 }} />;
    case "UNPAID":
      return <Chip icon={<PendingIcon />} label="Chưa thanh toán" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    case "OVERDUE":
      return <Chip icon={<WarningIcon />} label="Quá hạn" color="error" size="small" sx={{ fontWeight: 600 }} />;
    default:
      return <Chip label={status} size="small" />;
  }
};

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
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

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/invoices");

      const unwrapList = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.content)) return payload.content;
        return [];
      };

      setInvoices(unwrapList(res));
    } catch (error) {
      console.error("fetchInvoices InvoiceManagement error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Lỗi khi tải danh sách hóa đơn";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleOpenDialog = (invoice) => {
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
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingInvoice(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateElectricityAmount = () => {
    const used = Math.max(0, formData.electricityEnd - formData.electricityStart);
    return used * formData.electricityPrice;
  };

  const calculateWaterAmount = () => {
    const used = Math.max(0, formData.waterEnd - formData.waterStart);
    return used * formData.waterPrice;
  };

  const calculateTotal = () => {
    return Number(formData.rentalAmount) + calculateElectricityAmount() + calculateWaterAmount() + Number(formData.serviceAmount);
  };

  const generatePDF = (invoiceData) => {
    const doc = new jsPDF();
    
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
      headStyles: { fillColor: [6, 78, 59] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(16);
    doc.text(`TỔNG CỘNG: ${formatVND(invoiceData.totalAmount)}`, 190, finalY, { align: "right" });
    
    doc.setFontSize(11);
    doc.setTextColor(invoiceData.status === "PAID" ? [46, 125, 50] : [211, 47, 47]);
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

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        electricityAmount: calculateElectricityAmount(),
        waterAmount: calculateWaterAmount(),
        totalAmount: calculateTotal(),
      };

      await api.put(`/invoices/${editingInvoice.id}`, payload);
      toast.success("Cập nhật hóa đơn thành công");
      fetchInvoices();
      handleCloseDialog();
    } catch (error) {
      toast.error("Lỗi khi lưu hóa đơn");
    }
  };

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

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "PAID").length,
    unpaid: invoices.filter((i) => i.status === "UNPAID").length,
    overdue: invoices.filter((i) => i.status === "OVERDUE").length,
    totalAmount: invoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0),
    unpaidAmount: invoices.filter((i) => i.status !== "PAID").reduce((sum, i) => sum + (i.totalAmount || 0), 0),
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
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <ReceiptIcon sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Quản Lý Hóa Đơn
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Quản lý hóa đơn tiền phòng, điện, nước, dịch vụ
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#0f766e">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">Tổng hóa đơn</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#10b981">
                {stats.paid}
              </Typography>
              <Typography variant="body2" color="text.secondary">Đã thanh toán</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#f59e0b">
                {stats.unpaid}
              </Typography>
              <Typography variant="body2" color="text.secondary">Chưa thanh toán</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#ef4444">
                {formatVND(stats.unpaidAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">Công nợ</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Invoices Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Table>
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
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Không có hóa đơn nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
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
                        <Tooltip title="Xuất PDF">
                          <IconButton size="small" color="secondary" onClick={() => handleExportPDF(invoice)}>
                            <PdfIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="primary" onClick={() => handleOpenDialog(invoice)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
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
        </TableContainer>

        {/* Edit Invoice Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle sx={{ bgcolor: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Chỉnh sửa hóa đơn - Phòng {editingInvoice?.contract?.room?.roomNumber}
            <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: "#f59e0b" }}>
                  <ElectricIcon /> Tiền điện
                </Typography>
                <Stack spacing={2}>
                  <TextField label="Chỉ số cũ" name="electricityStart" type="number" fullWidth value={formData.electricityStart} onChange={handleChange} />
                  <TextField label="Chỉ số mới" name="electricityEnd" type="number" fullWidth value={formData.electricityEnd} onChange={handleChange} />
                  <TextField label="Đơn giá (VNĐ/kWh)" name="electricityPrice" type="number" fullWidth value={formData.electricityPrice} onChange={handleChange} />
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Tiền điện: {formatVND(calculateElectricityAmount())}
                  </Alert>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: "#0f766e" }}>
                  <WaterIcon /> Tiền nước
                </Typography>
                <Stack spacing={2}>
                  <TextField label="Chỉ số cũ" name="waterStart" type="number" fullWidth value={formData.waterStart} onChange={handleChange} />
                  <TextField label="Chỉ số mới" name="waterEnd" type="number" fullWidth value={formData.waterEnd} onChange={handleChange} />
                  <TextField label="Đơn giá (VNĐ/m³)" name="waterPrice" type="number" fullWidth value={formData.waterPrice} onChange={handleChange} />
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Tiền nước: {formatVND(calculateWaterAmount())}
                  </Alert>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                  💰 Tiền phòng & Dịch vụ
                </Typography>
                <Stack spacing={2}>
                  <TextField label="Tiền phòng (VNĐ)" name="rentalAmount" type="number" fullWidth value={formData.rentalAmount} onChange={handleChange} />
                  <TextField label="Phí dịch vụ (VNĐ)" name="serviceAmount" type="number" fullWidth value={formData.serviceAmount} onChange={handleChange} />
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select name="status" value={formData.status} label="Trạng thái" onChange={handleChange}>
                      <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                      <MenuItem value="PAID">Đã thanh toán</MenuItem>
                      <MenuItem value="OVERDUE">Quá hạn</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, bgcolor: "#f0fdf9", borderRadius: 3, height: "100%" }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#0f766e" }}>
                    Tổng kết hóa đơn
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Tiền điện:</Typography>
                    <Typography fontWeight={600}>{formatVND(calculateElectricityAmount())}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography>Tiền nước:</Typography>
                    <Typography fontWeight={600}>{formatVND(calculateWaterAmount())}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography>Tiền phòng + Dịch vụ:</Typography>
                    <Typography fontWeight={600}>{formatVND(Number(formData.rentalAmount) + Number(formData.serviceAmount))}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h5" fontWeight={800}>Tổng cộng:</Typography>
                    <Typography variant="h5" fontWeight={800} color="#0f766e">
                      {formatVND(calculateTotal())}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <TextField label="Ghi chú" name="notes" multiline rows={2} fullWidth value={formData.notes} onChange={handleChange} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Đóng</Button>
            <Button variant="outlined" startIcon={<DownloadIcon />} color="secondary" onClick={() => handleExportPDF({ ...editingInvoice, ...formData, totalAmount: calculateTotal() })}>
              Xuất PDF
            </Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}>
              Lưu hóa đơn
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

// Missing Card component
const Card = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}>
    {children}
  </Paper>
);

export default InvoiceManagement;