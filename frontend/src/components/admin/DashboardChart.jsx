/**
 * @file DashboardChart.jsx
 * @description Biểu đồ tròn hiển thị tình trạng các phòng (Đã thuê, Còn trống, Bảo trì).
 * @module components/admin
 */
import React from "react";
import { Paper, Box, Typography, Chip } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";

const DashboardChart = ({ roomStatusData }) => (
  <Paper sx={{ p: 3, borderRadius: 4, height: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
      🏠 Tình trạng phòng
    </Typography>
    <Box sx={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={roomStatusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {roomStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>
    <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
      {roomStatusData.map((item, idx) => (
        <Chip key={idx} label={`${item.name}: ${item.value}`} size="small" sx={{ bgcolor: `${item.color}15`, color: item.color, fontWeight: 600 }} />
      ))}
    </Box>
  </Paper>
);

export default DashboardChart;
