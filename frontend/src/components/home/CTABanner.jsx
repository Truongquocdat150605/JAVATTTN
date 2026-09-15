// /**
//  * @file CTABanner.jsx
//  * @description Phần biểu ngữ kêu gọi hành động (Call to Action) ở cuối trang, mời khách hàng xem phòng hoặc đăng ký.
//  * @module components/home
//  */
import React from "react";
import { Box, Container, Grid, Typography, Stack, Button } from "@mui/material";
import { Link } from "react-router-dom";
import FadeIn from "./FadeIn";

const CTABanner = () => (
  <Box sx={{ py: { xs: 8, md: 12 }, background: "linear-gradient(135deg, #0f766e 0%, #0f172a 100%)", position: "relative", overflow: "hidden" }}>
    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <FadeIn>
            <Typography variant="h2" sx={{ color: "#ffffff", mb: 3, fontWeight: 700 }}>
              Tìm Không Gian Sống Ưu Ý
            </Typography>
            <Typography variant="body1" sx={{ color: "#94a3b8", mb: 5, fontSize: "1.1rem", lineHeight: 1.8 }}>
              Đừng ngần ngại liên hệ hoặc đăng ký ngay hôm nay để nhận được những ưu đãi tốt nhất cho căn hộ của bạn.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button component={Link} to="/rooms" variant="contained" size="large"
                sx={{ borderRadius: "10px", px: 4, py: 1.5, fontSize: "0.95rem", fontWeight: 600, textTransform: "none", bgcolor: "#14b8a6", color: "#0f172a", "&:hover": { bgcolor: "#2dd4bf" } }}>
                Xem danh sách phòng
              </Button>
              <Button component={Link} to="/register" variant="outlined" size="large"
                sx={{ borderRadius: "10px", px: 4, py: 1.5, fontSize: "0.95rem", fontWeight: 600, textTransform: "none", borderColor: "#94a3b8", color: "#ffffff", "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)", borderColor: "#ffffff" } }}>
                Đăng ký tài khoản
              </Button>
            </Stack>
          </FadeIn>
        </Grid>
        <Grid item xs={12} md={6}>
          <FadeIn delay={0.3}>
            <Box sx={{ borderRadius: "30px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
              <img src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80" alt="Cabin" style={{ width: "100%", height: "auto", display: "block" }} />
            </Box>
          </FadeIn>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default CTABanner;
