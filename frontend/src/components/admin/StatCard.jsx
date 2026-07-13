/**
 * @file StatCard.jsx
 * @description Thẻ hiển thị thống kê dạng số liệu với icon và chỉ số tăng/giảm.
 * @module components/admin
 */
import React from "react";
import { Card, CardContent, Box, Typography, Avatar } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const StatCard = ({ title, value, icon, color, trend, trendValue, onClick }) => (
  <Card
    sx={{
      borderRadius: 4,
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      "&:hover": onClick ? { transform: "translateY(-4px)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : {},
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, color: color }}>
            {typeof value === "number" && title.includes("doanh thu") ? `${value.toLocaleString("vi-VN")}₫` : value}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
              {trend === "up" ? <ArrowUpward sx={{ fontSize: 14, color: "#10b981" }} /> : <ArrowDownward sx={{ fontSize: 14, color: "#ef4444" }} />}
              <Typography variant="caption" color={trend === "up" ? "#10b981" : "#ef4444"} fontWeight={600}>
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}15`, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
