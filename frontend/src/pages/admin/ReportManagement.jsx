import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,

  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  CalendarToday as CalendarIcon,
  Print as PrintIcon,
  Email as EmailIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { addCustomFont } from "../../utils/pdfFont";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ReportManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  const [reportData, setReportData] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    totalRevenue: 0,
    completionRate: 0,
    pendingAmount: 0,
    unpaidInvoices: 0,
    avgInvoiceValue: 0,
    monthlyData: [],
    categoryData: [],
  });

const fetchReportData = async () => {
    try {
      setLoading(true);
      const start = dateRange.startDate.toISOString().split(".")[0];
      const end = dateRange.endDate.toISOString().split(".")[0];

      const res = await api.get(`/admin/dashboard/report-range?start=${start}&end=${end}`);

      if (res?.success && res?.data) {
        const d = res.data;
        setReportData({
          totalInvoices: d.totalOrders || 0,
          paidInvoices: d.completedOrders || 0,
          totalRevenue: d.totalRevenue || 0,
          completionRate: d.totalOrders > 0 ? (d.completedOrders / d.totalOrders) * 100 : 0,
          pendingAmount: d.totalRevenue - (d.completedAmount || 0),
          unpaidInvoices: (d.totalOrders || 0) - (d.completedOrders || 0),
          avgInvoiceValue: d.totalOrders > 0 ? (d.totalRevenue / d.totalOrders) : 0,
          monthlyData: d.monthlyData || [],
          categoryData: d.categoryData || [],
        });
      }
    } catch (error) {
      console.error("❌ Lỗi tải báo cáo:", error);
      toast.error("Không thể tải dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0) + "₫";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Áp dụng font tiếng Việt
    addCustomFont(doc);
    doc.setFont("Roboto");
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(6, 78, 59);
    doc.text("BÁO CÁO DOANH THU PHÒNG TRỌ", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Thời gian: ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`, 105, 30, { align: "center" });
    doc.text(`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`, 105, 37, { align: "center" });
    
    doc.setDrawColor(200);
    doc.line(20, 45, 190, 45);

    // Statistics
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`📊 Tổng số hóa đơn: ${reportData.totalInvoices}`, 20, 60);
    doc.text(`✅ Hóa đơn đã thanh toán: ${reportData.paidInvoices}`, 20, 70);
    doc.text(`⏳ Hóa đơn chưa thanh toán: ${reportData.unpaidInvoices}`, 20, 80);
    doc.text(`💰 Tổng doanh thu: ${formatCurrency(reportData.totalRevenue)}`, 20, 90);
    doc.text(`📈 Giá trị trung bình/hóa đơn: ${formatCurrency(reportData.avgInvoiceValue)}`, 20, 100);
    doc.text(`🎯 Tỷ lệ hoàn thành: ${reportData.completionRate.toFixed(1)}%`, 20, 110);

    // Table for monthly data
    if (reportData.monthlyData && reportData.monthlyData.length > 0) {
      autoTable(doc, {
        startY: 120,
        head: [["Tháng", "Số hóa đơn", "Doanh thu", "Tỷ lệ"]],
        body: reportData.monthlyData.map((item) => [
          `Tháng ${item.month}`,
          item.count,
          formatCurrency(item.revenue),
          `${((item.count / reportData.totalInvoices) * 100).toFixed(1)}%`,
        ]),
        headStyles: { fillColor: [6, 78, 59] },
        theme: "striped",
        styles: { font: "Roboto" },
      });
    }

    // Footer
    const finalY = doc.lastAutoTable?.finalY + 20 || 180;
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Smart Phòng Trọ - Hệ thống quản lý nhà trọ thông minh", 105, finalY, { align: "center" });
    
    doc.save(`bao-cao-doanh-thu-${new Date().getTime()}.pdf`);
    toast.success("Đã xuất file PDF!");
  };

  const handleExportExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // ---- Sheet 1: Tổng quan ----
      const overviewData = [
        ["BÁO CÁO DOANH THU - SMART PHÒNG TRỌ"],
        [`Từ ngày: ${formatDate(dateRange.startDate)} → Đến ngày: ${formatDate(dateRange.endDate)}`],
        [`Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}`],
        [],
        ["Chỉ số", "Giá trị"],
        ["Tổng doanh thu", reportData.totalRevenue],
        ["Tổng số hóa đơn", reportData.totalInvoices],
        ["Đã thanh toán", reportData.paidInvoices],
        ["Chưa thanh toán", reportData.unpaidInvoices],
        ["Số tiền chưa thu", reportData.pendingAmount],
        ["Giá trị TB/hóa đơn", reportData.avgInvoiceValue],
        ["Tỷ lệ hoàn thành (%)", parseFloat(reportData.completionRate.toFixed(1))],
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(overviewData);
      ws1["!cols"] = [{ wch: 30 }, { wch: 20 }];
      // Style tiêu đề
      ws1["A1"] = { v: "BÁO CÁO DOANH THU - SMART PHÒNG TRỌ", t: "s", s: { font: { bold: true, sz: 14 } } };
      XLSX.utils.book_append_sheet(wb, ws1, "Tổng quan");

      // ---- Sheet 2: Thống kê tháng ----
      if (reportData.monthlyData.length > 0) {
        const monthlyHeaders = ["Tháng", "Số hóa đơn", "Doanh thu (VNĐ)", "Tỷ lệ (%)"];
        const monthlyRows = reportData.monthlyData.map(item => [
          `Tháng ${item.month}`,
          item.count,
          item.revenue,
          reportData.totalInvoices > 0
            ? parseFloat(((item.count / reportData.totalInvoices) * 100).toFixed(1))
            : 0,
        ]);
        const ws2 = XLSX.utils.aoa_to_sheet([monthlyHeaders, ...monthlyRows]);
        ws2["!cols"] = [{ wch: 12 }, { wch: 14 }, { wch: 20 }, { wch: 12 }];
        XLSX.utils.book_append_sheet(wb, ws2, "Thống kê tháng");
      }

      XLSX.writeFile(wb, `bao-cao-doanh-thu-${Date.now()}.xlsx`);
      toast.success("✅ Đã xuất file Excel thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Xuất Excel thất bại. Vui lòng thử lại.");
    }
  };

  const handleCloseExportMenu = () => {
    setExportAnchorEl(null);
  };

  // Chart data for revenue trend
  const revenueChartData = {
    labels: reportData.monthlyData.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: reportData.monthlyData.map((item) => item.revenue),
        backgroundColor: "rgba(15, 118, 110, 0.6)",
        borderColor: "#0f766e",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  // Chart data for invoice status
  const statusChartData = {
    labels: ["Đã thanh toán", "Chưa thanh toán"],
    datasets: [
      {
        data: [reportData.paidInvoices, reportData.unpaidInvoices],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => formatCurrency(value),
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw;
            return `${label}: ${value} hóa đơn`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
        <Typography textAlign="center" sx={{ mt: 2, color: "#64748b" }}>
          Đang tải dữ liệu báo cáo...
        </Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TrendingUpIcon sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h4" fontWeight={800}>
                    Báo Cáo Doanh Thu
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Tổng hợp và phân tích dữ liệu tài chính
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Tooltip title="Xuất báo cáo">
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={(e) => setExportAnchorEl(e.currentTarget)}
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
                  >
                    Xuất báo cáo
                  </Button>
                </Tooltip>
                <Menu anchorEl={exportAnchorEl} open={Boolean(exportAnchorEl)} onClose={handleCloseExportMenu}>
                  <MenuItem onClick={handleExportPDF}>
                    <PdfIcon sx={{ mr: 1, color: "#ef4444" }} /> Xuất PDF
                  </MenuItem>
                  <MenuItem onClick={handleExportExcel}>
                    <DownloadIcon sx={{ mr: 1, color: "#10b981" }} /> Xuất Excel
                  </MenuItem>
                </Menu>
                <Tooltip title="Làm mới">
                  <IconButton onClick={fetchReportData} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>

          {/* Date Range Filter */}
          <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={5}>
                <DatePicker
                  label="📅 Từ ngày"
                  value={dateRange.startDate}
                  onChange={(newValue) => setDateRange((prev) => ({ ...prev, startDate: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <DatePicker
                  label="📅 Đến ngày"
                  value={dateRange.endDate}
                  onChange={(newValue) => setDateRange((prev) => ({ ...prev, endDate: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={fetchReportData}
                  startIcon={<RefreshIcon />}
                  sx={{ height: 56, bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
                >
                  Áp dụng
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, bgcolor: "#0f766e", color: "white" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Tổng doanh thu</Typography>
                  <Typography variant="h4" fontWeight={900}>{formatCurrency(reportData.totalRevenue)}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption">+12.5% so với tháng trước</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, bgcolor: "#10b981", color: "white" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Đã thanh toán</Typography>
                  <Typography variant="h4" fontWeight={900}>{reportData.paidInvoices}</Typography>
                  <Typography variant="caption">{formatCurrency(reportData.totalRevenue - reportData.pendingAmount)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, bgcolor: "#f59e0b", color: "white" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Chưa thanh toán</Typography>
                  <Typography variant="h4" fontWeight={900}>{reportData.unpaidInvoices}</Typography>
                  <Typography variant="caption">{formatCurrency(reportData.pendingAmount)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, bgcolor: "#8b5cf6", color: "white" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>Tỷ lệ hoàn thành</Typography>
                  <Typography variant="h4" fontWeight={900}>{reportData.completionRate.toFixed(1)}%</Typography>
                  <Box sx={{ width: "100%", mt: 1 }}>
                    <LinearProgress variant="determinate" value={reportData.completionRate} sx={{ bgcolor: "rgba(255,255,255,0.3)", "& .MuiLinearProgress-bar": { bgcolor: "white" } }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="📊 Tổng quan" />
              <Tab label="📈 Biểu đồ doanh thu" />
              <Tab label="📋 Chi tiết hóa đơn" />
            </Tabs>
          </Box>

          {/* Tab 1: Overview */}
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUpIcon sx={{ color: "#0f766e" }} /> Xu hướng doanh thu
                  </Typography>
                  <Box sx={{ height: 320 }}>
                    <Bar data={revenueChartData} options={chartOptions} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <ReceiptIcon sx={{ color: "#0f766e" }} /> Phân bố hóa đơn
                  </Typography>
                  <Box sx={{ height: 320 }}>
                    <Pie data={statusChartData} options={pieOptions} />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 4 }}>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>📅 Thống kê theo tháng</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f1f5f9" }}>
                          <TableCell sx={{ fontWeight: 700 }}>Tháng</TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">Số hóa đơn</TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">Doanh thu</TableCell>
                          <TableCell sx={{ fontWeight: 700 }} align="right">Tỷ lệ</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reportData.monthlyData.map((item, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>Tháng {item.month}</TableCell>
                            <TableCell align="right">{item.count}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: "#0f766e" }}>{formatCurrency(item.revenue)}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={`${((item.count / reportData.totalInvoices) * 100).toFixed(1)}%`}
                                size="small"
                                sx={{ bgcolor: "#e0f2fe", color: "#0284c7" }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Tab 2: Revenue Chart Full */}
          {tabValue === 1 && (
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>📈 Biểu đồ doanh thu chi tiết</Typography>
              <Box sx={{ height: 500 }}>
                <Bar data={revenueChartData} options={chartOptions} />
              </Box>
            </Paper>
          )}

          {/* Tab 3: Detailed Invoices */}
          {tabValue === 2 && (
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>📋 Danh sách hóa đơn trong kỳ</Typography>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Hiển thị {reportData.totalInvoices} hóa đơn trong khoảng thời gian đã chọn
              </Alert>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#0f766e" }}>
                      <TableCell sx={{ color: "white", fontWeight: 700 }}>Mã HD</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 700 }}>Phòng</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 700 }}>Khách thuê</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 700 }} align="right">Tổng tiền</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">Vui lòng chọn khoảng thời gian để xem chi tiết</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportManagement;