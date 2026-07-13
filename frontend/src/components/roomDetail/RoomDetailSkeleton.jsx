/**
 * @file RoomDetailSkeleton.jsx
 * @description Component hiển thị giao diện chờ (Loading Skeleton) với các khối xám mờ trong lúc chờ dữ liệu API của phòng tải về.
 * @module components/roomDetail
 */
import React from "react";
import { Box, Skeleton, Grid } from "@mui/material";

const RoomDetailSkeleton = () => (
  <Box sx={{ maxWidth: 1120, mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>
    <Skeleton width={160} height={36} sx={{ mb: 3 }} />
    <Skeleton width="60%" height={48} sx={{ mb: 1 }} />
    <Skeleton width="30%" height={28} sx={{ mb: 4 }} />
    <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 4, mb: 4 }} />
    <Grid container spacing={6}>
      <Grid item xs={12} md={8}>
        {[1, 2, 3].map(i => <Skeleton key={i} height={24} sx={{ mb: 1 }} />)}
      </Grid>
      <Grid item xs={12} md={4}>
        <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 4 }} />
      </Grid>
    </Grid>
  </Box>
);

export default RoomDetailSkeleton;
