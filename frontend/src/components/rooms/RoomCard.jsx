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

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
const IMAGE_BASE = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/uploads/";

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
      style={{ height: "100%", width: "100%" }}
    >
      <Box
        onClick={onViewDetail}
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          height: "100%",
          minHeight: variant === "horizontal" ? 220 : undefined,
          display: "flex",
          flexDirection: variant === "horizontal" ? "row" : "column",
          bgcolor: "#FDFBF7",
          boxShadow: "0 4px 20px rgba(139, 90, 43, 0.08)",
          cursor: "pointer",
          border: "1px solid rgba(139, 90, 43, 0.1)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 24px 48px rgba(139, 90, 43, 0.15)",
            "& .room-img": { transform: "scale(1.05)" },
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
            borderRadius: variant === "horizontal" ? "24px 0 0 24px" : "24px 24px 0 0",
          }}
        >
          <img
            className="room-img"
            src={getRoomImageUrl(room.image)}
            alt={`Phòng ${room.roomNumber}`}
            loading="lazy"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
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
              height: variant === "horizontal" ? "45%" : "40%",
              background: "linear-gradient(to top, rgba(62, 42, 26,0.5) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Top row: badge + favorite */}
          <Stack
            direction="row" justifyContent="space-between" alignItems="center"
            sx={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 3 }}
          >
            <Chip
              label="🌱 Đang trống"
              size="small"
              sx={{
                bgcolor: "#F3E8DF", color: "#6A411B",
                fontWeight: 700, fontSize: "0.75rem", borderRadius: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setLiked((l) => !l); }}
              sx={{
                bgcolor: "rgba(253, 251, 247, 0.9)", backdropFilter: "blur(6px)",
                width: 32, height: 32, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": { bgcolor: "#fff", transform: "scale(1.1)" },
                transition: "all 0.2s",
              }}
            >
              {liked ? <FavoriteIcon sx={{ fontSize: 16, color: "#8B5A2B" }} /> : <FavoriteBorderIcon sx={{ fontSize: 16, color: "#A06E41" }} />}
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
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#3E2A1A", fontFamily: "'Playfair Display', serif" }}>
              Phòng {room.roomNumber}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <StarIcon sx={{ fontSize: 16, color: "#8B5A2B" }} />
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#6E5C4F" }}>
                4.9
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: "#8B5A2B", fontWeight: 800, fontSize: "1.2rem", lineHeight: 1.2 }}>
              {room.price ? new Intl.NumberFormat("vi-VN").format(room.price) : "Liên hệ"}
            </Typography>
            <Typography sx={{ color: "#6E5C4F", fontSize: "0.8rem", fontWeight: 600 }}>
              VNĐ / tháng
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} mb={2.5}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <SquareFootIcon sx={{ fontSize: 16, color: "#A06E41" }} />
              <Typography variant="caption" fontWeight={700} color="#6E5C4F">
                {room.area}m²
              </Typography>
            </Box>
            {room.address && (
              <Box display="flex" alignItems="center" gap={0.5} minWidth={0}>
                <LocationOnIcon sx={{ fontSize: 16, color: "#A06E41", flexShrink: 0 }} />
                <Typography
                  variant="caption" fontWeight={700} color="#6E5C4F"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {room.address}
                </Typography>
              </Box>
            )}
          </Stack>

          {room.description && (
            <Typography
              variant="body2" color="#6E5C4F"
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
              borderRadius: "30px",
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              background: "linear-gradient(135deg,#A06E41,#8B5A2B)",
              boxShadow: "0 4px 15px rgba(139, 90, 43, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg,#8B5A2B,#6A411B)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.25s",
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
