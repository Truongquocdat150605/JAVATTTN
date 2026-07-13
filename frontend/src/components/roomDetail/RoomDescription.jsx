/**
 * @file RoomDescription.jsx
 * @description Phần bài viết mô tả chi tiết không gian, nội thất và các tiện ích xung quanh khu vực phòng trọ.
 * @module components/roomDetail
 */
import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import { MeetingRoom as MeetingRoomIcon, SquareFoot as SquareFootIcon, LocationOn as LocationOnIcon } from "@mui/icons-material";

const RoomDescription = ({ room }) => (
  <>
    {/* Quick stats bar */}
    <Stack direction="row" spacing={4} sx={{ pb: 4, mb: 4, borderBottom: "1px solid #f1f5f9" }} flexWrap="wrap">
      {[
        { icon: <MeetingRoomIcon sx={{ color: "#0f766e" }} />, label: `Phòng ${room.roomNumber}` },
        { icon: <SquareFootIcon sx={{ color: "#0f766e" }} />, label: `${room.area} m²` },
        { icon: <LocationOnIcon sx={{ color: "#0f766e" }} />, label: room.address || "Vị trí trung tâm" },
      ].map((s, i) => (
        <Box key={i} display="flex" alignItems="center" gap={1}>
          {s.icon}
          <Typography fontWeight={600} color="text.secondary">{s.label}</Typography>
        </Box>
      ))}
    </Stack>

    {/* Description text */}
    <Box sx={{ pb: 4, mb: 4, borderBottom: "1px solid #f1f5f9" }}>
      <Typography variant="h6" fontWeight={800} mb={2} color="#0f172a">
        Giới thiệu về phòng
      </Typography>
      <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.9, color: "#475569", fontSize: "0.97rem" }}>
        {room.description ||
          "Phòng trọ tiện nghi, sạch sẽ, thoáng mát với đầy đủ các tiện ích cơ bản. Khu vực an ninh, bảo vệ 24/7, camera giám sát toàn khu. Gần chợ, trường học, bệnh viện và các tiện ích công cộng. Phù hợp cho sinh viên và người đi làm."}
      </Typography>
    </Box>
  </>
);

export default RoomDescription;
