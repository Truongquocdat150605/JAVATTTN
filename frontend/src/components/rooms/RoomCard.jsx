import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box, Button, Typography, Chip, Stack, IconButton,
} from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { motion } from "framer-motion";

import { UPLOADS_URL as IMAGE_BASE } from "../../config";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";

const getRoomImageUrl = (img) => {
  if (!img) return PLACEHOLDER_IMG;
  if (img.startsWith("http")) return img.replace("http://", "https://");
  return `${IMAGE_BASE}${img}`;
};

const RoomCard = React.memo(function RoomCard({
  room,
  onViewDetail,
  onRentClick,
  index = 0,
  variant = "vertical",
}) {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: (index % 9) * 0.07 }}
      style={{ height: "100%", width: "100%" }}
    >
      <Box
        onClick={onViewDetail}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          height: "100%",
          minHeight: variant === "horizontal" ? 220 : undefined,
          display: "flex",
          flexDirection: variant === "horizontal" ? "row" : "column",
          bgcolor: "#ffffff",
          boxShadow: "0 2px 12px rgba(15, 118, 110, 0.06)",
          cursor: "pointer",
          border: "1px solid #e2e8f0",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(15, 118, 110, 0.12)",
            borderColor: "#cbd5e1",
            "& .room-img": { transform: "scale(1.04)" },
            "& .hover-overlay": { opacity: 1 },
          },
        }}
      >
        {/* ── Image ── */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            width: variant === "horizontal" ? "38%" : "100%",
            height: variant === "horizontal" ? "100%" : { xs: 220, sm: 240, md: 260 },
            flexShrink: 0,
            borderRadius: variant === "horizontal" ? "16px 0 0 16px" : "16px 16px 0 0",
          }}
        >
          <img
            className="room-img"
            src={getRoomImageUrl(room.image)}
            alt={`Phòng ${room.roomNumber}`}
            loading="lazy"
            onError={(e) => {
              console.error("[RoomCard Image Failed to Load] Room ID:", room?.id, "Attempted src:", e.target.src, "Raw DB image:", room?.image);
              e.currentTarget.src = PLACEHOLDER_IMG;
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.4s ease",
            }}
          />

          {/* Bottom gradient */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: variant === "horizontal" ? "45%" : "40%",
              background: "linear-gradient(to top, rgba(15, 23, 42, 0.6) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Top row: badge + favorite */}
          <Stack
            direction="row" justifyContent="space-between" alignItems="center"
            sx={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 3 }}
          >
            {(() => {
              const st = room?.status?.toUpperCase();
              let label = "Đang trống", bgcolor = "#f0fdf4", color = "#166534", border = "1px solid #bbf7d0";
              if (st === "OCCUPIED" || st === "DANG_THUE" || st === "RENTED") {
                label = "Đã thuê"; bgcolor = "#fef2f2"; color = "#991b1b"; border = "1px solid #fecaca";
              } else if (st === "MAINTENANCE" || st === "BAO_TRI") {
                label = "Bảo trì"; bgcolor = "#fffbe8"; color = "#854d0e"; border = "1px solid #fef08a";
              }
              return (
                <Chip
                  label={label}
                  size="small"
                  sx={{
                    bgcolor, color, border,
                    fontWeight: 600, fontSize: "0.75rem", borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                  }}
                />
              );
            })()}
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(6px)",
                width: 32, height: 32, boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                "&:hover": { bgcolor: "#fff", transform: "scale(1.08)" },
                transition: "all 0.2s",
              }}
            >
              {liked ? <FavoriteIcon sx={{ fontSize: 16, color: "#0f766e" }} /> : <FavoriteBorderIcon sx={{ fontSize: 16, color: "#64748b" }} />}
            </IconButton>
          </Stack>
        </Box>

        {/* ── Content ── */}
        <Box
          sx={{
            p: variant === "horizontal" ? 2.5 : 2.5,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#0f172a", fontFamily: "inherit" }}>
              Phòng {room.roomNumber}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <StarIcon sx={{ fontSize: 16, color: "#eab308" }} />
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>
                4.9
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "#0f766e", fontWeight: 800, fontSize: "1.2rem", lineHeight: 1.2 }}>
              {room.price ? new Intl.NumberFormat("vi-VN").format(room.price) : "Liên hệ"}
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500 }}>
              VNĐ / tháng
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} mb={2.5}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <SquareFootIcon sx={{ fontSize: 16, color: "#64748b" }} />
              <Typography variant="caption" fontWeight={600} color="#475569">
                {room.area}m²
              </Typography>
            </Box>
            {room.address && (
              <Box display="flex" alignItems="center" gap={0.5} minWidth={0}>
                <LocationOnIcon sx={{ fontSize: 16, color: "#64748b", flexShrink: 0 }} />
                <Typography
                  variant="caption" fontWeight={600} color="#475569"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {room.address}
                </Typography>
              </Box>
            )}
          </Stack>

          {room.description && (
            <Typography
              variant="body2" color="#64748b"
              sx={{
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
                lineHeight: 1.6, mb: 2, flexGrow: 1,
              }}
            >
              {room.description}
            </Typography>
          )}

          <Button
            variant="contained"
            fullWidth
            component={Link}
            to="/booking-form"
            state={{ roomId: room.id }}
            onClick={(e) => {
              e.stopPropagation();
              onRentClick?.();
            }}
            sx={{
              mt: "auto",
              borderRadius: "10px",
              py: 1.2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.875rem",
              bgcolor: "#0f766e",
              color: "#ffffff",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#115e59",
                boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
              },
              transition: "all 0.2s",
            }}
          >
            Đăng ký thuê
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
});

export default RoomCard;
