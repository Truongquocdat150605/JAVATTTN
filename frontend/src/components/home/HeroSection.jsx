/**
 * @file HeroSection.jsx
 * @description Phần Banner lớn nhất ở đầu trang HomePage, chứa hình nền đẹp, tiêu đề giới thiệu và thanh tìm kiếm khu vực.
 * @module components/home
 */
import React from "react";
import { Box, Container, Typography, Stack, Chip, Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";

const HeroSection = ({ searchKeyword, setSearchKeyword, onSearch }) => (
  <Box sx={{ position: "relative", minHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", bgcolor: "#FDFBF7" }}>
    <Box sx={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=85)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.15 }} />
    <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, textAlign: "center", px: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Typography variant="body2" sx={{ color: "#8B5A2B", fontWeight: 700, letterSpacing: 2, mb: 2, textTransform: "uppercase" }}>
          Mở rộng không gian sống
        </Typography>
        <Typography variant="h1" sx={{ color: "#3E2A1A", mb: 3, textShadow: "0 4px 20px rgba(255,255,255,0.8)" }}>
          Tìm Nhà.<br /> Gặp Bạn.<br /> Sống Ấm.
        </Typography>
        <Typography variant="body1" sx={{ color: "#6E5C4F", mb: 5, fontWeight: 500, maxWidth: 600, mx: "auto", fontSize: { xs: "1rem", md: "1.1rem" } }}>
          Hơn 14,000+ phòng trọ thiết kế đẹp, tiện nghi và ấm cúng đang chờ đón bạn.
        </Typography>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#fff", borderRadius: "50px", p: "8px 8px 8px 24px", boxShadow: "0 10px 40px rgba(139, 90, 43, 0.15)", border: "1px solid rgba(139, 90, 43, 0.1)", maxWidth: 600, mx: "auto" }}>
          <Search sx={{ color: "#8B5A2B", mr: 1.5 }} />
          <input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Bạn đang muốn tìm phòng ở khu vực nào?..."
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: "1rem", color: "#3E2A1A", fontFamily: "'Nunito', sans-serif" }} />
          <Button onClick={onSearch} variant="contained"
            sx={{ borderRadius: "40px", px: 4, py: 1.5, fontSize: "1rem", background: "#8B5A2B", "&:hover": { background: "#6A411B" } }}>
            Tìm kiếm
          </Button>
        </Box>
        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" sx={{ mt: 3, gap: 1 }}>
          {["Gần trung tâm", "Có ban công", "Nuôi thú cưng", "Giờ giấc tự do"].map((tag) => (
            <Chip key={tag} label={tag} sx={{ bgcolor: "#F3E8DF", color: "#6A411B", fontWeight: 600, transition: "0.2s", "&:hover": { bgcolor: "#E6D5C3" } }} />
          ))}
        </Stack>
      </motion.div>
    </Container>
  </Box>
);

export default HeroSection;
