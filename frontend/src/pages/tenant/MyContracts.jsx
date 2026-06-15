import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Container,

  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  MeetingRoom as MeetingRoomIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import api from "../../services/api";
import { formatVND } from "../../utils/formatVND";
import { connectContractSocket, disconnectContractSocket } from "../../services/contractSocket";
import ContractSignDialog from "../../components/contracts/ContractSignDialog";

const MyContracts = () => {

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [signDialog, setSignDialog] = useState({ open: false, contract: null });

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/contracts/my");
        setContracts(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching contracts:", error);
        setErrorMsg("Không thể tải danh sách hợp đồng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();

    const socketClient = connectContractSocket({
      onMessage: (msg) => {
        // msg chỉ là trigger; dữ liệu luôn lấy lại từ REST để đảm bảo phân quyền
        const type = msg?.type;
        const message = msg?.message;
        toast.info(message || "Hợp đồng đã thay đổi. Đang đồng bộ...");
        fetchContracts();
      },
    });

    return () => {
      disconnectContractSocket(socketClient);
    };
  }, []);


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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorMsg) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>{errorMsg}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Header */}
      <Paper sx={{
        p: 4,
        mb: 4,
        borderRadius: 4,
        background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
        color: "white"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <DescriptionIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Hợp Đồng Của Tôi
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Quản lý tất cả hợp đồng thuê phòng của bạn
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h3" fontWeight={900} color="#0f766e">
              {contracts.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Tổng hợp đồng</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h3" fontWeight={900} color="#10b981">
              {contracts.filter(c => c.status === "ACTIVE").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Đang hiệu lực</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h3" fontWeight={900} color="#f59e0b">
              {contracts.filter(c => c.status === "PENDING").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Chờ duyệt</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h3" fontWeight={900} color="#94a3b8">
              {contracts.filter(c => c.status === "EXPIRED").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">Đã kết thúc</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Contracts List */}
      {contracts.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
          <DescriptionIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có hợp đồng nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bạn chưa có hợp đồng thuê phòng nào. Hãy liên hệ với chủ nhà để tạo hợp đồng.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {contracts.map((contract) => (
            <Grid item xs={12} key={contract.id}>
              <Card sx={{
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": { transform: "translateY(-4px)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }
              }}>
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
      )}

      {/* E-Signature & PDF Dialog */}
      <ContractSignDialog
        open={signDialog.open}
        contract={signDialog.contract}
        onClose={() => setSignDialog({ open: false, contract: null })}
      />
    </Container>
  );
};

export default MyContracts;