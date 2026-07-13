/**
 * @file RoomListSection.jsx
 * @description Phần danh sách hiển thị cuộn ngang (Carousel) các Phòng mới nhất và Phòng Hot nhất.
 * @module components/home
 */
import React from "react";
import { Box, Typography, Stack, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RoomCard from "./RoomCard";

const RoomListSection = ({ title, rooms, loading, icon }) => {
  const navigate = useNavigate();

  return (
    <Box mb={6}>
      <Typography variant="h4" sx={{ color: "#3E2A1A", mb: 1, pl: 2, borderLeft: "4px solid #8B5A2B" }}>
        {icon} {title}
      </Typography>
      <Stack direction="row" spacing={3} sx={{ overflowX: "auto", pb: 4, pt: 2, pl: 2, scrollSnapType: "x mandatory", "&::-webkit-scrollbar": { height: 8 }, "&::-webkit-scrollbar-thumb": { borderRadius: 4, bgcolor: "#E6D5C3" } }}>
        {(loading ? Array.from({ length: 5 }) : rooms).map((room, i) => (
          <Box key={room?.id ?? i} sx={{ scrollSnapAlign: "start" }}>
            {loading ? (
              <Box sx={{ width: 300, height: 380, bgcolor: "#fff", borderRadius: "24px", p: 2 }}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "16px" }} />
                <Skeleton width="60%" height={30} sx={{ mt: 2 }} />
                <Skeleton width="40%" sx={{ mt: 1 }} />
                <Skeleton variant="rectangular" height={45} sx={{ borderRadius: "30px", mt: 3 }} />
              </Box>
            ) : <RoomCard room={room} onViewDetail={(id) => navigate(`/rooms/${id}`)} index={i} />}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default RoomListSection;
