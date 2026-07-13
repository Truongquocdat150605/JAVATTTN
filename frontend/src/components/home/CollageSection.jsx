// /**
//  * @file CollageSection.jsx
//  * @description Phần hiển thị các hình ảnh ghép nghệ thuật (collage) với thông điệp "Kết nối và Sẻ chia".
//  * @module components/home
//  */
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import FadeIn from "./FadeIn";

const CollageSection = () => (
  <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#FDFBF7", textAlign: "center" }}>
    <Container maxWidth="md">
      <FadeIn>
        <Typography variant="h2" sx={{ mb: 2 }}>Kết nối và Sẻ chia</Typography>
        <Typography variant="h4" sx={{ color: "#A06E41", fontWeight: 500, fontFamily: "'Nunito', sans-serif" }}>Không gian Sống</Typography>
        <Box sx={{ mt: 5, position: "relative", height: { xs: 300, md: 400 }, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box sx={{ width: "30%", height: "80%", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", transform: "rotate(-5deg)", zIndex: 1 }}>
            <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80" alt="Room 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Box sx={{ width: "40%", height: "100%", borderRadius: "20px", overflow: "hidden", boxShadow: "0 15px 40px rgba(0,0,0,0.15)", zIndex: 3, mx: "-5%" }}>
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" alt="Friends" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
          <Box sx={{ width: "30%", height: "70%", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", transform: "rotate(5deg)", zIndex: 2 }}>
            <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80" alt="Cat" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
        </Box>
      </FadeIn>
    </Container>
  </Box>
);

export default CollageSection;
