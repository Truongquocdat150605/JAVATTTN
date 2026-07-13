/**
 * @file RoomHeader.jsx
 * @description Phần Tiêu đề chính của phòng, bao gồm số phòng, diện tích, trạng thái, nút Like và nút Share.
 * @module components/roomDetail
 */
import React from "react";
import { Box, Typography, Stack, Chip, Tooltip, IconButton } from "@mui/material";
import { LocationOn as LocationOnIcon, Share as ShareIcon, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, StarRate as StarRateIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const RoomHeader = ({ room, status, liked, setLiked }) => (
  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} mb={3}>
      <Box>
        <Typography variant="h4" fontWeight={900} sx={{ color: "#0f172a", lineHeight: 1.2, mb: 1.5 }}>
          Phòng Trọ Số {room.roomNumber} — {room.area}m²
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
          <Chip
            label={status.label}
            size="small"
            sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: "0.82rem" }}
          />
          <Stack direction="row" alignItems="center" spacing={0.4}>
            <StarRateIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
            <Typography fontWeight={700} fontSize="0.9rem">4.9</Typography>
            <Typography color="text.secondary" fontSize="0.85rem">(12 đánh giá)</Typography>
          </Stack>
          {room.address && (
            <Stack direction="row" alignItems="center" spacing={0.4}>
              <LocationOnIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>{room.address}</Typography>
            </Stack>
          )}
        </Stack>
      </Box>

      <Stack direction="row" spacing={1}>
        <Tooltip title="Chia sẻ">
          <IconButton sx={{ border: "1px solid #e2e8f0", borderRadius: "50%", "&:hover": { bgcolor: "#f8fafc" } }}>
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={liked ? "Bỏ lưu" : "Lưu phòng"}>
          <IconButton
            onClick={() => setLiked(!liked)}
            sx={{ border: "1px solid #e2e8f0", borderRadius: "50%", "&:hover": { bgcolor: "#fff0f0" } }}
          >
            {liked ? <FavoriteIcon fontSize="small" sx={{ color: "#ef4444" }} /> : <FavoriteBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  </motion.div>
);

export default RoomHeader;
