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
  <Box sx={{ py: { xs: 8, md: 12 }, background: "linear-gradient(135deg, #1C3620 0%, #2E4F32 100%)", position: "relative", overflow: "hidden" }}>
    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
      <Grid container spacing={6} alignItems="center">
        <Grid item xs={12} md={6}>
          <FadeIn>
            <Typography variant="h2" sx={{ color: "#FDFBF7", mb: 3 }}>
              Tìm Phòng Của Bạn
            </Typography>
            <Typography variant="body1" sx={{ color: "#E6D5C3", mb: 5, fontSize: "1.1rem", lineHeight: 1.8 }}>
              Đừng ngần ngại liên hệ hoặc đăng ký ngay hôm nay để nhận được những ưu đãi tốt nhất cho không gian sống của bạn.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button component={Link} to="/rooms" variant="contained" size="large"
                sx={{ borderRadius: "30px", px: 5, py: 1.8, fontSize: "1rem", background: "#A06E41", color: "#fff", "&:hover": { background: "#8B5A2B" } }}>
                Xem phòng ngay
              </Button>
              <Button component={Link} to="/register" variant="outlined" size="large"
                sx={{ borderRadius: "30px", px: 5, py: 1.8, fontSize: "1rem", borderColor: "#A06E41", color: "#FDFBF7", "&:hover": { bgcolor: "rgba(160, 110, 65, 0.1)", borderColor: "#A06E41" } }}>
                Đăng ký miễn phí
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
