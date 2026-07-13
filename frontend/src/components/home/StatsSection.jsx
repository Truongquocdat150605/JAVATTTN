/**
 * @file StatsSection.jsx
 * @description Phần hiển thị các con số thống kê ấn tượng của hệ thống (Ví dụ: 1000+ Phòng trọ, 98% Hài lòng...).
 * @module components/home
 */
import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Handshake, Restaurant, Home, EmojiEvents } from "@mui/icons-material";
import FadeIn from "./FadeIn";

const StatsSection = () => {
  const stats = [
    { icon: <Handshake sx={{ fontSize: 40, color: "#8B5A2B" }} />, value: "1,000+", label: "Phòng trọ" },
    { icon: <Restaurant sx={{ fontSize: 40, color: "#8B5A2B" }} />, value: "500+", label: "Khách hàng" },
    { icon: <Home sx={{ fontSize: 40, color: "#8B5A2B" }} />, value: "98%", label: "Hài lòng" },
    { icon: <EmojiEvents sx={{ fontSize: 40, color: "#8B5A2B" }} />, value: "4.9", label: "Đánh giá" },
  ];

  return (
    <Box sx={{ py: 6, bgcolor: "#FDFBF7" }}>
      <Container maxWidth="md">
        <Stack direction="row" justifyContent="space-between" flexWrap="wrap" gap={4}>
          {stats.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <Box textAlign="center" sx={{ 
                width: 140, height: 140, borderRadius: "50%", 
                border: "4px solid #E6D5C3", bgcolor: "#fff", 
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                boxShadow: "inset 0 4px 10px rgba(139, 90, 43, 0.1), 0 8px 20px rgba(139, 90, 43, 0.08)",
                transition: "transform 0.3s", "&:hover": { transform: "translateY(-5px)" }
              }}>
                {s.icon}
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#3E2A1A", mt: 1 }}>{s.value}</Typography>
                <Typography variant="body2" sx={{ color: "#6E5C4F", fontWeight: 700 }}>{s.label}</Typography>
              </Box>
            </FadeIn>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default StatsSection;
