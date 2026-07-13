/**
 * @file RoomCard.jsx
 * @description Component thẻ (Card) dùng để hiển thị thông tin tóm tắt của một phòng trọ (hình ảnh, giá, địa chỉ, lượt thích...).
 * @module components/home
 */
import React, { useState, memo } from "react";
import { Box, Chip, Stack, Typography, IconButton, Button } from "@mui/material";
import { Favorite, FavoriteBorder, Star, SquareFoot, LocationOn } from "@mui/icons-material";
import { motion } from "framer-motion";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
const IMAGE_BASE = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/uploads/";
export const getRoomImageUrl = (img) => (img ? `${IMAGE_BASE}${img}` : PLACEHOLDER_IMG);

const RoomCard = memo(({ room, onViewDetail, index }) => {
  const [liked, setLiked] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Box onClick={() => onViewDetail(room.id)} sx={{
        width: 300, flexShrink: 0, borderRadius: "24px", overflow: "hidden",
        bgcolor: "#FDFBF7", boxShadow: "0 4px 20px rgba(139, 90, 43, 0.08)", cursor: "pointer",
        border: "1px solid rgba(139, 90, 43, 0.1)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
          transform: "translateY(-8px)", boxShadow: "0 24px 48px rgba(139, 90, 43, 0.15)",
          "& .ri": { transform: "scale(1.05)" }
        },
      }}>
        {/* Ảnh */}
        <Box sx={{ position: "relative", overflow: "hidden", height: 200, borderRadius: "24px 24px 0 0" }}>
          <img className="ri" src={getRoomImageUrl(room.image)} alt={`Phòng ${room.roomNumber}`} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)" }}
            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} />
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(62, 42, 26,0.5), transparent)", pointerEvents: "none" }} />
          {/* Badge + Like */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 2 }}>
            <Chip label="✨ Đang trống" size="small" sx={{ bgcolor: "#F3E8DF", color: "#6A411B", fontWeight: 700, fontSize: "0.75rem", borderRadius: "20px" }} />
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              sx={{ bgcolor: "rgba(253, 251, 247, 0.9)", width: 32, height: 32, "&:hover": { bgcolor: "#fff", transform: "scale(1.1)" }, transition: "all 0.2s" }}>
              {liked ? <Favorite sx={{ fontSize: 16, color: "#8B5A2B" }} /> : <FavoriteBorder sx={{ fontSize: 16, color: "#A06E41" }} />}
            </IconButton>
          </Stack>
        </Box>
        {/* Nội dung */}
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#3E2A1A", fontFamily: "'Playfair Display', serif" }}>
              Phòng {room.roomNumber}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <Star sx={{ fontSize: 16, color: "#8B5A2B" }} />
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#6E5C4F" }}>4.9</Typography>
            </Stack>
          </Stack>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "#8B5A2B", fontWeight: 800, fontSize: "1.2rem", lineHeight: 1.2 }}>
              {room.price ? new Intl.NumberFormat("vi-VN").format(room.price) : "Liên hệ"}
            </Typography>
            <Typography sx={{ color: "#6E5C4F", fontSize: "0.8rem", fontWeight: 600 }}>VNĐ / tháng</Typography>
          </Box>
          <Stack direction="row" spacing={2} mb={2.5}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <SquareFoot sx={{ fontSize: 16, color: "#A06E41" }} />
              <Typography variant="caption" fontWeight={700} color="#6E5C4F">{room.area}m²</Typography>
            </Box>
            {room.address && (
              <Box display="flex" alignItems="center" gap={0.5} minWidth={0}>
                <LocationOn sx={{ fontSize: 16, color: "#A06E41", flexShrink: 0 }} />
                <Typography variant="caption" fontWeight={700} color="#6E5C4F" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.address}</Typography>
              </Box>
            )}
          </Stack>
          <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onViewDetail(room.id); }}
            sx={{
              borderRadius: "30px", py: 1.2, fontWeight: 700, fontSize: "0.9rem",
              background: "linear-gradient(135deg,#A06E41,#8B5A2B)", boxShadow: "0 4px 15px rgba(139, 90, 43, 0.3)",
              "&:hover": { background: "linear-gradient(135deg,#8B5A2B,#6A411B)", transform: "translateY(-2px)" }
            }}>
            Xem chi tiết
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
});

export default RoomCard;
