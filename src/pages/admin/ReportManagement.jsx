import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Container, Paper, Grid, Card, CardContent, Typography, Box,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, TextField, Chip, LinearProgress
} from '@mui/material';
import { Download, Refresh } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import jsPDF from 'jspdf';

const ReportManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });

  const [reportData, setReportData] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    totalRevenue: 0,
    completionRate: 0,
    pendingAmount: 0
  });

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const start = dateRange.startDate.toISOString().split('.')[0];
      const end = dateRange.endDate.toISOString().split('.')[0];

      const res = await api.get(`/admin/dashboard/report-range?start=${start}&end=${end}`);

      if (res?.success && res?.data) {
        const d = res.data;
        setReportData({
          totalInvoices: d.totalOrders || 0,
          paidInvoices: d.completedOrders || 0,
          totalRevenue: d.totalRevenue || 0,
          completionRate: d.totalOrders > 0 ? (d.completedOrders / d.totalOrders) * 100 : 0,
          pendingAmount: d.pendingOrders || 0
        });
      }
    } catch (error) {
      console.error("❌ Lỗi tải báo cáo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + '₫';
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('BAO CAO DOANH THU PHONG TRO', 105, 20, { align: 'center' });
    doc.text(`Thoi gian: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`, 20, 35);
    doc.text(`Tong hoa don: ${reportData.totalInvoices}`, 20, 50);
    doc.text(`Tong doanh thu: ${formatCurrency(reportData.totalRevenue)}`, 20, 60);
    doc.save(`bao-cao-phong-tro-${new Date().getTime()}.pdf`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <LinearProgress />
        <Typography textAlign="center" sx={{ mt: 2 }}>Đang kết xuất báo cáo tiền phòng...</Typography>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">📊 Báo Cáo Doanh Thu</Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" startIcon={<Download />} onClick={exportToPDF} color="success">Xuất PDF</Button>
            <Button variant="outlined" startIcon={<Refresh />} onClick={fetchReportData}>Làm Mới</Button>
          </Box>
        </Box>

        <Card sx={{ mb: 4, p: 2, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Từ ngày"
                value={dateRange.startDate}
                onChange={(newValue) => setDateRange(prev => ({ ...prev, startDate: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Đến ngày"
                value={dateRange.endDate}
                onChange={(newValue) => setDateRange(prev => ({ ...prev, endDate: newValue }))}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">Hóa đơn mới</Typography>
                <Typography variant="h4" fontWeight="bold">{reportData.totalInvoices}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.main', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">Doanh thu thu được</Typography>
                <Typography variant="h4" fontWeight="bold">{formatCurrency(reportData.totalRevenue)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.main', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">Đã thanh toán</Typography>
                <Typography variant="h4" fontWeight="bold">{reportData.paidInvoices}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.main', color: 'white', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6">Chưa thu (Số lượng)</Typography>
                <Typography variant="h4" fontWeight="bold">{reportData.pendingAmount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default ReportManagement;
