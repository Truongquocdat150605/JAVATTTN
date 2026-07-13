/**
 * @file RoomGallery.jsx
 * @description Khu vực hiển thị bộ sưu tập hình ảnh của phòng dưới dạng lưới (Grid) trên Desktop và thanh cuộn ngang trên Mobile.
 * @module components/roomDetail
 */
import React from "react";
import { Box, Stack } from "@mui/material";
import { motion } from "framer-motion";

const RoomGallery = ({ allImages, activeImg, setActiveImg, setImageError, room }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
    <Box sx={{ mb: 6 }}>
      {/* Main + Side grid */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        gridTemplateRows: { md: "200px 200px" },
        gap: 1.5,
        borderRadius: "20px",
        overflow: "hidden",
        height: { xs: 260, sm: 340, md: 420 },
      }}>
        {/* Main Image */}
        <Box sx={{ gridRow: { md: "1 / 3" }, position: "relative", overflow: "hidden" }}>
          <img
            src={allImages[activeImg]}
            alt={`Phòng ${room.roomNumber}`}
            onError={() => setImageError(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transition: "transform 0.5s ease",
              cursor: "zoom-in",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          {/* Image count badge */}
          <Box sx={{
            position: "absolute", bottom: 16, right: 16,
            bgcolor: "rgba(0,0,0,0.6)", color: "#fff",
            px: 2, py: 0.5, borderRadius: "50px",
            fontSize: "0.8rem", fontWeight: 700, backdropFilter: "blur(4px)",
          }}>
            📷 {allImages.length} ảnh
          </Box>
        </Box>

        {/* Side Images (Desktop only) */}
        {allImages.slice(1, 3).map((img, i) => (
          <Box
            key={i}
            onClick={() => setActiveImg(i + 1)}
            sx={{
              display: { xs: "none", md: "block" },
              overflow: "hidden", cursor: "pointer", position: "relative",
              "&:hover img": { transform: "scale(1.06)" },
            }}
          >
            <img
              src={img}
              alt={`Chi tiết ${i + 1}`}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Thumbnail strip (Mobile) */}
      <Stack direction="row" spacing={1} mt={1.5} sx={{ display: { xs: "flex", md: "none" }, overflowX: "auto" }}>
        {allImages.map((img, i) => (
          <Box
            key={i}
            onClick={() => setActiveImg(i)}
            sx={{
              width: 64, height: 64, flexShrink: 0, borderRadius: 2,
              overflow: "hidden", cursor: "pointer",
              border: activeImg === i ? "2.5px solid #0f766e" : "2.5px solid transparent",
              transition: "border-color 0.2s",
            }}
          >
            <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Box>
        ))}
      </Stack>
    </Box>
  </motion.div>
);

export default RoomGallery;
