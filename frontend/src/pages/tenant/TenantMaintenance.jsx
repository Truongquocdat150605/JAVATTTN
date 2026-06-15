import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Build as BuildIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Engineering as EngineeringIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

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

const TenantMaintenance = () => {
  const [requests, setRequests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ roomId: "", description: "" });
  const [errors, setErrors] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestsRes, roomsRes] = await Promise.all([
        api.get("/maintenance/my"),
        api.get("/tenant/my-rooms")
      ]);
      setRequests(Array.isArray(requestsRes) ? requestsRes : []);
      setRooms(Array.isArray(roomsRes) ? roomsRes : []);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!form.roomId) newErrors.roomId = "Vui lòng chọn phòng";
    if (!form.description.trim()) newErrors.description = "Vui lòng nhập mô tả sự cố";
    else if (form.description.trim().length < 10) newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// TenantMaintenance.jsx - Sửa handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setSubmitting(true);
  try {
    // Đúng theo Swagger: POST /api/maintenance
    // Query params: roomId, description
    await api.post("/maintenance", null, {
      params: {
        roomId: form.roomId,
        description: form.description,
      },
    });
    toast.success("Đã gửi yêu cầu bảo trì thành công!");
    setForm({ roomId: "", description: "" });
    setOpenDialog(false);
    loadData();
  } catch (error) {
    toast.error("Gửi yêu cầu thất bại. Vui lòng thử lại.");
  } finally {
    setSubmitting(false);
  }
};

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    inProgress: requests.filter((r) => r.status === "IN_PROGRESS").length,
    completed: requests.filter((r) => r.status === "RESOLVED").length,
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
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
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <BuildIcon sx={{ fontSize: 48 }} />
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Yêu Cầu Bảo Trì
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Quản lý và theo dõi các yêu cầu sửa chữa, bảo trì
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
        >
          Tạo yêu cầu mới
        </Button>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#0f766e">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">Tổng yêu cầu</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#f59e0b">
              {stats.pending}
            </Typography>
            <Typography variant="body2" color="text.secondary">Chờ xử lý</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#3b82f6">
              {stats.inProgress}
            </Typography>
            <Typography variant="body2" color="text.secondary">Đang xử lý</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={900} color="#10b981">
              {stats.completed}
            </Typography>
            <Typography variant="body2" color="text.secondary">Hoàn thành</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Requests List */}
      {requests.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
          <BuildIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có yêu cầu bảo trì nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hãy tạo yêu cầu nếu bạn cần sửa chữa hoặc bảo trì phòng
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {requests.map((req) => (
            <Grid item xs={12} key={req.id}>
              <Card sx={{ borderRadius: 3, transition: "all 0.3s", "&:hover": { boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" } }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>
                        Phòng {req.room?.roomNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Mã yêu cầu: #{req.id}
                      </Typography>
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
      )}

      {/* Create Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Tạo yêu cầu bảo trì mới
          <IconButton onClick={() => setOpenDialog(false)} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              fullWidth
              select
              label="Chọn phòng"
              required
              margin="normal"
              value={form.roomId}
              onChange={(e) => setForm({ ...form, roomId: e.target.value })}
              error={!!errors.roomId}
              helperText={errors.roomId}
            >
              <MenuItem value="">-- Chọn phòng --</MenuItem>
              {rooms.map((room) => (
                <MenuItem key={room.id} value={room.id}>
                  Phòng {room.roomNumber}{room.type ? ` - ${room.type}` : ""}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Mô tả sự cố"
              required
              multiline
              rows={4}
              margin="normal"
              placeholder="Vui lòng mô tả chi tiết sự cố cần sửa chữa..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description}
            />

            <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={500}>💡 Lưu ý:</Typography>
              <Typography variant="caption" color="text.secondary">
                • Vui lòng mô tả chi tiết để kỹ thuật viên xử lý nhanh chóng<br />
                • Bạn sẽ nhận được thông báo khi yêu cầu được tiếp nhận<br />
                • Thời gian xử lý dự kiến: 24-48 giờ
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={submitting}
              sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
            >
              {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default TenantMaintenance;