/**
 * @file MaintenanceList.jsx
 * @description Danh sách các yêu cầu bảo trì/sửa chữa của khách thuê.
 * @module components/tenant
 */
import React from "react";
import { Grid, Card, CardContent, Box, Typography, Chip, Paper } from "@mui/material";
import { CheckCircle as CheckCircleIcon, Pending as PendingIcon, Cancel as CancelIcon, Engineering as EngineeringIcon, Build as BuildIcon } from "@mui/icons-material";

const getStatusChip = (status) => {
  switch (status?.toUpperCase()) {
    case "RESOLVED":
      return <Chip icon={<CheckCircleIcon />} label="Hoàn thành" color="success" size="small" />;
    case "IN_PROGRESS":
      return <Chip icon={<EngineeringIcon />} label="Đang xử lý" color="info" size="small" />;
    case "PENDING":
      return <Chip icon={<PendingIcon />} label="Chờ xử lý" color="warning" size="small" />;
    case "CANCELLED":
      return <Chip icon={<CancelIcon />} label="Đã huỷ" color="error" size="small" />;
    default:
      return <Chip label={status || "-"} size="small" />;
  }
};

const MaintenanceList = ({ requests }) => {
  if (requests.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
        <BuildIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Chưa có yêu cầu bảo trì nào
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hãy tạo yêu cầu nếu bạn cần sửa chữa hoặc bảo trì phòng
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {requests.map((req) => (
        <Grid item xs={12} key={req.id}>
          <Card sx={{ borderRadius: 3, transition: "all 0.3s", "&:hover": { boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800}>Phòng {req.room?.roomNumber}</Typography>
                  <Typography variant="caption" color="text.secondary">Mã yêu cầu: #{req.id}</Typography>
                </Box>
                {getStatusChip(req.status)}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
                {req.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  🕐 Ngày tạo: {req.createdAt ? new Date(req.createdAt).toLocaleString("vi-VN") : "-"}
                </Typography>
                {req.status === "RESOLVED" && req.updatedAt && (
                  <Typography variant="caption" color="text.secondary">
                    ✅ Hoàn thành: {new Date(req.updatedAt).toLocaleString("vi-VN")}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MaintenanceList;
