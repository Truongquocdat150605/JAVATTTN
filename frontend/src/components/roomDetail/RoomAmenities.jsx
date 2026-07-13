/**
 * @file RoomAmenities.jsx
 * @description Phần danh sách liệt kê các tiện ích nổi bật của phòng (Wifi, Bếp, Chỗ để xe, Bảo vệ...).
 * @module components/roomDetail
 */
import React from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";

const RoomAmenities = ({ services, defaultAmenities }) => (
  <Box sx={{ pb: 4, mb: 4, borderBottom: "1px solid #f1f5f9" }}>
    <Typography variant="h6" fontWeight={800} mb={3} color="#0f172a">
      Tiện ích nổi bật
    </Typography>
    <Grid container spacing={2}>
      {(services && services.length > 0
        ? services.map((s) => ({ icon: <CheckCircleIcon sx={{ color: "#0f766e" }} />, label: s.name }))
        : defaultAmenities
      ).map((amenity, i) => (
        <Grid item xs={6} sm={4} key={i}>
          <Stack direction="row" alignItems="center" spacing={1.5}
            sx={{
              p: 1.5, borderRadius: 2, bgcolor: "#f8fafc",
              border: "1px solid #f1f5f9",
              transition: "all 0.2s",
              "&:hover": { bgcolor: "#f0fdf9", borderColor: "#99f6e4" },
            }}
          >
            <Box sx={{ color: "#0f766e", display: "flex", flexShrink: 0 }}>
              {React.cloneElement(amenity.icon, { sx: { fontSize: 20, color: "#0f766e" } })}
            </Box>
            <Typography variant="body2" fontWeight={600}>{amenity.label}</Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default RoomAmenities;
