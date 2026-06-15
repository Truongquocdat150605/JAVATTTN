import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box, Button, Typography, Chip, Stack, IconButton,
} from "@mui/material";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
const IMAGE_BASE = "http://localhost:8082/uploads/";

const getRoomImageUrl = (img) => (img ? `${IMAGE_BASE}${img}` : PLACEHOLDER_IMG);

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
      style={{ height: "100%" }}
    >
      <Box
        onClick={onViewDetail}
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          height: "100%",
          minHeight: variant === "horizontal" ? 220 : undefined,
          display: "flex",
          flexDirection: variant === "horizontal" ? "row" : "column",
          bgcolor: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          cursor: "pointer",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 24px 48px rgba(15,118,110,0.14)",
            "& .room-img": { transform: "scale(1.07)" },
            "& .hover-overlay": { opacity: 1 },
          },
        }}
      >
        {/* ── Image ── */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            aspectRatio: variant === "horizontal" ? undefined : "4/3",
            width: variant === "horizontal" ? "38%" : undefined,
            height: variant === "horizontal" ? "100%" : undefined,
            flexShrink: 0,
            background: "#f1f5f9",
          }}
        >
          <img
            className="room-img"
            src={getRoomImageUrl(room.image)}
            alt={`Phòng ${room.roomNumber}`}
            loading="lazy"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", display: "block",
              transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
            }}
            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
          />

          {/* Bottom gradient */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: variant === "horizontal" ? "45%" : "55%",
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Top row: badge + favorite */}
          <Stack
            direction="row" justifyContent="space-between" alignItems="center"
            sx={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 3 }}
          >
            <Chip
              label="✅ Còn phòng"
              size="small"
              sx={{
                bgcolor: "#10b981", color: "#fff",
                fontWeight: 700, fontSize: "0.72rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
              sx={{
                bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(6px)",
                width: 34, height: 34, boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                "&:hover": { bgcolor: "#fff", transform: "scale(1.15)" },
                transition: "all 0.2s",
              }}
            >
              <FavoriteIcon sx={{ fontSize: 17, color: liked ? "#ef4444" : "#cbd5e1" }} />
            </IconButton>
          </Stack>

          {/* Price bottom-left */}
          <Box sx={{ position: "absolute", bottom: 12, left: 14, zIndex: 3 }}>
            <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: "1.15rem", lineHeight: 1 }}>
              {room.price
                ? new Intl.NumberFormat("vi-VN").format(room.price) + "đ"
                : "Liên hệ"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.72rem", fontWeight: 600 }}>
              / tháng
            </Typography>
          </Box>

          {/* Hover overlay CTA */}
          <Box
            className="hover-overlay"
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.18)",
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <Box sx={{
              bgcolor: "rgba(255,255,255,0.96)", color: "#0f766e",
              fontWeight: 800, fontSize: "0.9rem",
              px: 3, py: 1, borderRadius: "50px",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}>
              Xem chi tiết →
            </Box>
          </Box>
        </Box>

        {/* ── Content ── */}
        <Box
          sx={{
            p: variant === "horizontal" ? 2 : 2.5,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#0f172a" }}>
              Phòng {room.roomNumber}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <StarIcon sx={{ fontSize: 14, color: "#f59e0b" }} />
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#78716c" }}>
                4.9
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} mb={2.5}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <SquareFootIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                {room.area}m²
              </Typography>
            </Box>
            {room.address && (
              <Box display="flex" alignItems="center" gap={0.5} minWidth={0}>
                <LocationOnIcon sx={{ fontSize: 15, color: "#94a3b8", flexShrink: 0 }} />
                <Typography
                  variant="body2" fontWeight={600} color="text.secondary"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {room.address}
                </Typography>
              </Box>
            )}
          </Stack>

          {room.description && (
            <Typography
              variant="body2" color="text.secondary"
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
              borderRadius: "12px",
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
              boxShadow: "0 4px 14px rgba(15,118,110,0.28)",
              "&:hover": {
                background: "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
                boxShadow: "0 8px 24px rgba(15,118,110,0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.25s",
            }}
          >
            Đăng ký thuê ngay
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
});

export default RoomCard;
