import React from "react";
import { Box, Skeleton } from "@mui/material";

const SkeletonCard = ({ variant = "vertical" }) => {
  if (variant === "horizontal") {
    return (
      <Box
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          bgcolor: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          minHeight: 220,
          display: "flex",
          width: "100%",
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
  }

  // vertical (mặc định)
  return (
    <Card sx={{ borderRadius: "20px", height: "100%" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden" }}>
        <Skeleton variant="rectangular" animation="wave" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="40%" height={28} sx={{ mt: 0.5 }} />
        <Skeleton variant="text" width="90%" sx={{ mt: 1 }} />
        <Skeleton variant="text" width="80%" />
      </CardContent>
    </Card>
  );
};

export default React.memo(SkeletonCard);