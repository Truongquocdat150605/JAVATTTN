import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  PictureAsPdf as PdfIcon,
  TrendingUp as TrendingUpIcon,
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
import { toast } from "react-toastify";
import api from "../../../services/api";
import { handleExportPDF, handleExportExcel } from "./reportExport";
import TabOverview from "./TabOverview";
import TabDetailedChart from "./TabDetailedChart";
import TabInvoices from "./TabInvoices";

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

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount || 0) + "₫";

const ReportMain = () => {
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

  const fetchReportData = useCallback(async () => {
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
          avgInvoiceValue: d.totalOrders > 0 ? d.totalRevenue / d.totalOrders : 0,
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
  }, [dateRange]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

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
      legend: { position: "bottom" },
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
        ticks: { callback: (value) => formatCurrency(value) },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
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
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                    }}
                  >
                    Xuất báo cáo
                  </Button>
                </Tooltip>
                <Menu
                  anchorEl={exportAnchorEl}
                  open={Boolean(exportAnchorEl)}
                  onClose={handleCloseExportMenu}
                >
                  <MenuItem
                    onClick={() => {
                      handleExportPDF(reportData, dateRange);
                      handleCloseExportMenu();
                    }}
                  >
                    <PdfIcon sx={{ mr: 1, color: "#ef4444" }} /> Xuất PDF
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleExportExcel(reportData, dateRange);
                      handleCloseExportMenu();
                    }}
                  >
                    <DownloadIcon sx={{ mr: 1, color: "#10b981" }} /> Xuất Excel
                  </MenuItem>
                </Menu>
                <Tooltip title="Làm mới">
                  <IconButton
                    onClick={fetchReportData}
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
                  >
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
                  onChange={(newValue) =>
                    setDateRange((prev) => ({ ...prev, startDate: newValue }))
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <DatePicker
                  label="📅 Đến ngày"
                  value={dateRange.endDate}
                  onChange={(newValue) =>
                    setDateRange((prev) => ({ ...prev, endDate: newValue }))
                  }
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
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    Tổng doanh thu
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {formatCurrency(reportData.totalRevenue)}
                  </Typography>
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
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    Đã thanh toán
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {reportData.paidInvoices}
                  </Typography>
                  <Typography variant="caption">
                    {formatCurrency(reportData.totalRevenue - reportData.pendingAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, bgcolor: "#f59e0b", color: "white" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    Chưa thanh toán
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {reportData.unpaidInvoices}
                  </Typography>
                  <Typography variant="caption">
                    {formatCurrency(reportData.pendingAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, bgcolor: "#8b5cf6", color: "white" }}>
                <CardContent>
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    Tỷ lệ hoàn thành
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {reportData.completionRate.toFixed(1)}%
                  </Typography>
                  <Box sx={{ width: "100%", mt: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={reportData.completionRate}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.3)",
                        "& .MuiLinearProgress-bar": { bgcolor: "white" },
                      }}
                    />
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

          {/* Tab Content */}
          {tabValue === 0 && (
            <TabOverview
              reportData={reportData}
              revenueChartData={revenueChartData}
              statusChartData={statusChartData}
              chartOptions={chartOptions}
              pieOptions={pieOptions}
            />
          )}
          {tabValue === 1 && (
            <TabDetailedChart
              revenueChartData={revenueChartData}
              chartOptions={chartOptions}
            />
          )}
          {tabValue === 2 && <TabInvoices reportData={reportData} />}
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default ReportMain;
