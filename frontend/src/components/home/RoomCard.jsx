/**
 * @file RoomCard.jsx
 * @description Component thẻ (Card) dùng để hiển thị thông tin tóm tắt của một phòng trọ (hình ảnh, giá, địa chỉ, lượt thích...).
 * @module components/home
 */
import React, { useState, memo } from "react";
import { Box, Chip, Stack, Typography, IconButton, Button } from "@mui/material";
import { Favorite, FavoriteBorder, Star, SquareFoot, LocationOn } from "@mui/icons-material";
import { motion } from "framer-motion";

import { UPLOADS_URL as IMAGE_BASE } from "../../config";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
export const getRoomImageUrl = (img) => {
  if (!img) return PLACEHOLDER_IMG;
  if (img.startsWith("http")) return img.replace("http://", "https://");
  return `${IMAGE_BASE}${img}`;
};

const RoomCard = memo(({ room, onViewDetail, index }) => {
  const [liked, setLiked] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
      <Box onClick={() => onViewDetail(room.id)} sx={{
        width: 300, flexShrink: 0, borderRadius: "16px", overflow: "hidden",
        bgcolor: "#ffffff", boxShadow: "0 2px 12px rgba(15, 118, 110, 0.06)", cursor: "pointer",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(15, 118, 110, 0.12)",
          borderColor: "#cbd5e1",
          "& .ri": { transform: "scale(1.04)" }
        },
      }}>
        {/* Ảnh */}
        <Box sx={{ position: "relative", overflow: "hidden", height: 200, borderRadius: "16px 16px 0 0" }}>
          <img className="ri" src={getRoomImageUrl(room.image)} alt={`Phòng ${room.roomNumber}`} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
            onError={(e) => {
              console.error("[Home RoomCard Image Failed to Load] Room ID:", room?.id, "Attempted src:", e.target.src, "Raw DB image:", room?.image);
              e.currentTarget.src = PLACEHOLDER_IMG;
            }} />
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to top, rgba(15, 23, 42, 0.6), transparent)", pointerEvents: "none" }} />
          {/* Badge + Like */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 2 }}>
            {(() => {
              const st = room?.status?.toUpperCase();
              let label = "Đang trống", bgcolor = "#f0fdf4", color = "#166534", border = "1px solid #bbf7d0";
              if (st === "OCCUPIED" || st === "DANG_THUE" || st === "RENTED") {
                label = "Đã thuê"; bgcolor = "#fef2f2"; color = "#991b1b"; border = "1px solid #fecaca";
              } else if (st === "MAINTENANCE" || st === "BAO_TRI") {
                label = "Bảo trì"; bgcolor = "#fffbe8"; color = "#854d0e"; border = "1px solid #fef08a";
              }
              return <Chip label={label} size="small" sx={{ bgcolor, color, border, fontWeight: 600, fontSize: "0.75rem", borderRadius: "12px" }} />;
            })()}
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              sx={{ bgcolor: "rgba(255, 255, 255, 0.9)", width: 32, height: 32, "&:hover": { bgcolor: "#fff", transform: "scale(1.08)" }, transition: "all 0.2s" }}>
              {liked ? <Favorite sx={{ fontSize: 16, color: "#0f766e" }} /> : <FavoriteBorder sx={{ fontSize: 16, color: "#64748b" }} />}
            </IconButton>
          </Stack>
        </Box>
        {/* Nội dung */}
        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", fontFamily: "inherit" }}>
              Phòng {room.roomNumber}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <Star sx={{ fontSize: 16, color: "#eab308" }} />
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>4.9</Typography>
            </Stack>
          </Stack>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "#0f766e", fontWeight: 800, fontSize: "1.2rem", lineHeight: 1.2 }}>
              {room.price ? new Intl.NumberFormat("vi-VN").format(room.price) : "Liên hệ"}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>VNĐ / tháng</Typography>
          </Box>
          <Stack direction="row" spacing={2} mb={2.5}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <SquareFoot sx={{ fontSize: 16, color: "#64748b" }} />
              <Typography variant="caption" fontWeight={600} color="#475569">{room.area}m²</Typography>
            </Box>
            {room.address && (
              <Box display="flex" alignItems="center" gap={0.5} minWidth={0}>
                <LocationOn sx={{ fontSize: 16, color: "#64748b", flexShrink: 0 }} />
                <Typography variant="caption" fontWeight={600} color="#475569" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.address}</Typography>
              </Box>
            )}
          </Stack>
          <Button variant="contained" fullWidth onClick={(e) => { e.stopPropagation(); onViewDetail(room.id); }}
            sx={{
              borderRadius: "10px", py: 1.2, fontWeight: 600, fontSize: "0.875rem", textTransform: "none",
              bgcolor: "#0f766e", color: "#ffffff", boxShadow: "none",
              "&:hover": { bgcolor: "#115e59", boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)" }
            }}>
            Xem chi tiết
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
});

export default RoomCard;
