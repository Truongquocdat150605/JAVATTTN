import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import { TrendingUp as TrendingUpIcon, Receipt as ReceiptIcon } from "@mui/icons-material";
import { Bar, Pie } from "react-chartjs-2";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN").format(amount || 0) + "₫";

const TabOverview = ({ reportData, revenueChartData, statusChartData, chartOptions, pieOptions }) => {
  return (
    <Grid container spacing={3}>
      {/* Bar Chart */}
      <Grid item xs={12} lg={6}>
        <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <TrendingUpIcon sx={{ color: "#0f766e" }} /> Xu hướng doanh thu
          </Typography>
          <Box sx={{ height: 320 }}>
            <Bar data={revenueChartData} options={chartOptions} />
          </Box>
        </Paper>
      </Grid>

      {/* Pie Chart */}
      <Grid item xs={12} lg={6}>
        <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <ReceiptIcon sx={{ color: "#0f766e" }} /> Phân bố hóa đơn
          </Typography>
          <Box sx={{ height: 320 }}>
            <Pie data={statusChartData} options={pieOptions} />
          </Box>
        </Paper>
      </Grid>

      {/* Monthly Table */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            📅 Thống kê theo tháng
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f1f5f9" }}>
                  <TableCell sx={{ fontWeight: 700 }}>Tháng</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Số hóa đơn
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Doanh thu
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Tỷ lệ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.monthlyData.map((item, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>Tháng {item.month}</TableCell>
                    <TableCell align="right">{item.count}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: "#0f766e" }}>
                      {formatCurrency(item.revenue)}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${((item.count / (reportData.totalInvoices || 1)) * 100).toFixed(1)}%`}
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
  );
};

export default TabOverview;
