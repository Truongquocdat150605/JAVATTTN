/**
 * @file StatsSection.jsx
 * @description Phần hiển thị các con số thống kê ấn tượng của hệ thống (Ví dụ: 1000+ Phòng trọ, 98% Hài lòng...).
 * @module components/home
 */
import React, { useEffect, useState } from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { MeetingRoom, RoomService, ThumbUp, Star } from "@mui/icons-material";
import FadeIn from "./FadeIn";
import api from "../../services/api";

const StatsSection = () => {
  const [statsData, setStatsData] = useState({ rooms: 0, services: 0 });

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get("/rooms/available").catch(() => []),
      api.get("/services").catch(() => []),
    ]).then(([roomsRes, servicesRes]) => {
      if (!isMounted) return;
      const roomsCount = Array.isArray(roomsRes) ? roomsRes.length : (Array.isArray(roomsRes?.data) ? roomsRes.data.length : 0);
      const servicesCount = Array.isArray(servicesRes) ? servicesRes.length : (Array.isArray(servicesRes?.data) ? servicesRes.data.length : 0);
      setStatsData({ rooms: roomsCount, services: servicesCount });
    });
    return () => { isMounted = false; };
  }, []);

  const stats = [
    { icon: <MeetingRoom sx={{ fontSize: 36, color: "#8B5A2B" }} />, value: statsData.rooms > 0 ? `${statsData.rooms}+` : "10+", label: "Phòng trống" },
    { icon: <RoomService sx={{ fontSize: 36, color: "#8B5A2B" }} />, value: statsData.services > 0 ? `${statsData.services}+` : "8+", label: "Dịch vụ" },
    { icon: <ThumbUp sx={{ fontSize: 36, color: "#8B5A2B" }} />, value: "99%", label: "Hài lòng" },
    { icon: <Star sx={{ fontSize: 36, color: "#8B5A2B" }} />, value: "4.9/5", label: "Đánh giá" },
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
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#3E2A1A", mt: 0.5 }}>{s.value}</Typography>
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
