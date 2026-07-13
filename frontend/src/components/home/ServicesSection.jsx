/**
 * @file ServicesSection.jsx
 * @description Phần giới thiệu 4 dịch vụ cốt lõi (Hỗ trợ tận tâm, Khu bếp, Không gian sạch sẽ, Chất lượng).
 * @module components/home
 */
import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import { Handshake, Restaurant, Home, EmojiEvents } from "@mui/icons-material";
import FadeIn from "./FadeIn";

const ServicesSection = () => (
  <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#8B5A2B", color: "#FDFBF7", mt: 5 }}>
    <Container maxWidth="lg">
      <FadeIn>
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" sx={{ color: "#FDFBF7", mb: 2 }}>Dịch Vụ</Typography>
          <Typography variant="body1" sx={{ color: "#E6D5C3", fontSize: "1.1rem" }}>Trải nghiệm dịch vụ tuyệt vời cho không gian sống của bạn</Typography>
        </Box>
      </FadeIn>
      <Grid container spacing={4} justifyContent="center">
        {[
          { icon: <Handshake sx={{ fontSize: 50, color: "#8B5A2B" }} />, title: "Hỗ trợ tận tâm" },
          { icon: <Restaurant sx={{ fontSize: 50, color: "#8B5A2B" }} />, title: "Khu bếp tiện nghi" },
          { icon: <Home sx={{ fontSize: 50, color: "#8B5A2B" }} />, title: "Không gian sạch sẽ" },
          { icon: <EmojiEvents sx={{ fontSize: 50, color: "#8B5A2B" }} />, title: "Chất lượng hàng đầu" }
        ].map((srv, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <FadeIn delay={i * 0.1}>
              <Box sx={{ 
                bgcolor: "#FDFBF7", borderRadius: "24px", p: 4, textAlign: "center", 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                transition: "transform 0.3s", "&:hover": { transform: "translateY(-8px)" }
              }}>
                {srv.icon}
                <Typography variant="h6" sx={{ color: "#3E2A1A", mt: 2, fontWeight: 700 }}>{srv.title}</Typography>
              </Box>
            </FadeIn>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
);

export default ServicesSection;
