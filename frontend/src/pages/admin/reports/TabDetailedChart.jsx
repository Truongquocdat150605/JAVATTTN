import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { Bar } from "react-chartjs-2";

const TabDetailedChart = ({ revenueChartData, chartOptions }) => {
  return (
    <Paper sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
        📈 Biểu đồ doanh thu chi tiết
      </Typography>
      <Box sx={{ height: 500 }}>
        <Bar data={revenueChartData} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default TabDetailedChart;
