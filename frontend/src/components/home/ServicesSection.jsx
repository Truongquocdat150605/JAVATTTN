/**
 * @file ServicesSection.jsx
 * @description Phần giới thiệu 4 dịch vụ cốt lõi (Hỗ trợ tận tâm, Khu bếp, Không gian sạch sẽ, Chất lượng).
 * @module components/home
 */
import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Handshake, Restaurant, Home, EmojiEvents, ElectricBolt, WaterDrop, Wifi, CleaningServices, LocalParking } from "@mui/icons-material";
import FadeIn from "./FadeIn";
import api from "../../services/api";

const ICON_MAP = {
  ELECTRICITY: <ElectricBolt sx={{ fontSize: 44, color: "#8B5A2B" }} />,
  WATER: <WaterDrop sx={{ fontSize: 44, color: "#8B5A2B" }} />,
  INTERNET: <Wifi sx={{ fontSize: 44, color: "#8B5A2B" }} />,
  CLEANING: <CleaningServices sx={{ fontSize: 44, color: "#8B5A2B" }} />,
  PARKING: <LocalParking sx={{ fontSize: 44, color: "#8B5A2B" }} />,
};

const DEFAULT_SERVICES = [
  { name: "Hỗ trợ tận tâm", icon: <Handshake sx={{ fontSize: 44, color: "#8B5A2B" }} />, description: "Phục vụ 24/7" },
  { name: "Khu bếp tiện nghi", icon: <Restaurant sx={{ fontSize: 44, color: "#8B5A2B" }} />, description: "Trang thiết bị hiện đại" },
  { name: "Không gian sạch sẽ", icon: <Home sx={{ fontSize: 44, color: "#8B5A2B" }} />, description: "Vệ sinh định kỳ" },
  { name: "Chất lượng hàng đầu", icon: <EmojiEvents sx={{ fontSize: 44, color: "#8B5A2B" }} />, description: "Đảm bảo trải nghiệm" },
];

const ServicesSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    let mounted = true;
    api.get("/services")
      .then(res => {
        if (!mounted) return;
        const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
        if (data.length > 0) setServices(data.filter(s => s.active !== false));
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const displayList = services.length > 0
    ? services.map(s => ({
        name: s.name,
        description: s.price ? `${new Intl.NumberFormat("vi-VN").format(s.price)}đ / ${s.unit || "tháng"}` : (s.description || "Dịch vụ tiện ích"),
        icon: ICON_MAP[s.category] || <EmojiEvents sx={{ fontSize: 44, color: "#8B5A2B" }} />
      }))
    : DEFAULT_SERVICES;

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#8B5A2B", color: "#FDFBF7", mt: 5 }}>
      <Container maxWidth="lg">
        <FadeIn>
          <Box textAlign="center" mb={6}>
            <Typography variant="h2" sx={{ color: "#FDFBF7", mb: 2 }}>Dịch Vụ Tiện Ích</Typography>
            <Typography variant="body1" sx={{ color: "#E6D5C3", fontSize: "1.1rem" }}>Trải nghiệm dịch vụ tuyệt vời cho không gian sống của bạn</Typography>
          </Box>
        </FadeIn>
        <Grid container spacing={3} justifyContent="center">
          {displayList.slice(0, 8).map((srv, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <FadeIn delay={i * 0.08}>
                <Box sx={{ 
                  bgcolor: "#FDFBF7", borderRadius: "24px", p: 3, textAlign: "center", height: "100%",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s", "&:hover": { transform: "translateY(-8px)" }
                }}>
                  {srv.icon}
                  <Typography variant="h6" sx={{ color: "#3E2A1A", mt: 1.5, fontWeight: 700, fontSize: "1.05rem" }}>{srv.name}</Typography>
                  <Typography variant="body2" sx={{ color: "#8B5A2B", mt: 0.5, fontWeight: 600, fontSize: "0.85rem" }}>{srv.description}</Typography>
                </Box>
              </FadeIn>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default ServicesSection;
