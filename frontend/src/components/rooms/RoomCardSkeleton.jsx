// src/components/rooms/RoomCardSkeleton.jsx
import { Box, Skeleton } from "@mui/material";

const RoomCardSkeleton = () => (
  <Box
    sx={{
      borderRadius: "20px",
      overflow: "hidden",
      bgcolor: "#fff",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      minHeight: 220,
      width: "100%", 
      height: 220,

      display: "flex",
    }}
  >
    <Box sx={{ width: "38%", flexShrink: 0, bgcolor: "#f1f5f9" }}>
      <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>
    <Box sx={{ p: 2.2, flex: 1 }}>
      <Skeleton width="65%" height={18} />
      <Box sx={{ display: "flex", gap: 1.2, mt: 1 }}>
        <Skeleton width="40%" height={14} />
        <Skeleton width="55%" height={14} />
      </Box>
      <Skeleton variant="text" height={40} sx={{ mt: 1.5, borderRadius: 1 }} />
      <Skeleton variant="rectangular" height={40} sx={{ mt: 1.5, borderRadius: 1 }} />
    </Box>
  </Box>
);

export default RoomCardSkeleton;