/**
 * @file ContractList.jsx
 * @description Danh sách các hợp đồng thuê của khách.
 * @module components/tenant
 */
import React from "react";
import { Grid, Card, CardContent, Box, Typography, Chip, Divider, Button, Paper } from "@mui/material";
import { Description as DescriptionIcon, MeetingRoom as MeetingRoomIcon, CalendarToday as CalendarIcon, AttachMoney as MoneyIcon, CheckCircle as CheckCircleIcon, Pending as PendingIcon, Cancel as CancelIcon, PictureAsPdf as PdfIcon } from "@mui/icons-material";
import { formatVND } from "../../utils/formatVND";

const getStatusChip = (status) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
    case "ĐANG HIỆU LỰC":
      return <Chip icon={<CheckCircleIcon />} label="Đang hiệu lực" color="success" size="small" />;
    case "PENDING":
    case "CHỜ DUYỆT":
      return <Chip icon={<PendingIcon />} label="Chờ duyệt" color="warning" size="small" />;
    case "EXPIRED":
    case "HẾT HẠN":
      return <Chip icon={<CancelIcon />} label="Hết hạn" color="error" size="small" />;
    case "TERMINATED":
    case "ĐÃ HỦY":
      return <Chip icon={<CancelIcon />} label="Đã hủy" color="default" size="small" />;
    default:
      return <Chip label={status || "Chưa xác định"} size="small" />;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Chưa xác định";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const ContractList = ({ contracts, setSignDialog }) => {
  if (contracts.length === 0) {
    return (
      <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
        <DescriptionIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Chưa có hợp đồng nào
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bạn chưa có hợp đồng thuê phòng nào. Hãy liên hệ với chủ nhà để tạo hợp đồng.
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {contracts.map((contract) => (
        <Grid item xs={12} key={contract.id}>
          <Card sx={{ borderRadius: 3, transition: "all 0.3s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", mb: 2 }}>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                    Hợp đồng phòng {contract.room?.roomNumber}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <MeetingRoomIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    <Typography variant="body2" color="text.secondary">
                      Mã hợp đồng: {contract.contractCode || `CT${contract.id}`}
                    </Typography>
                  </Box>
                </Box>
                {getStatusChip(contract.status)}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 20, color: "#0f766e" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Ngày bắt đầu</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatDate(contract.startDate)}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarIcon sx={{ fontSize: 20, color: "#ef4444" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Ngày kết thúc</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatDate(contract.endDate) || "Chưa xác định"}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MoneyIcon sx={{ fontSize: 20, color: "#0f766e" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Giá thuê</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatVND(contract.rentPrice || contract.room?.price)}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MoneyIcon sx={{ fontSize: 20, color: "#f59e0b" }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Tiền cọc</Typography>
                      <Typography variant="body2" fontWeight={600}>{formatVND(contract.deposit)}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PdfIcon />}
                  sx={{ borderRadius: 2 }}
                  onClick={() => setSignDialog({ open: true, contract })}
                >
                  Ký / Xem PDF
                </Button>
                {contract.status === "ACTIVE" && (
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ borderRadius: 2, bgcolor: "#0f766e" }}
                  >
                    Gia hạn
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ContractList;
