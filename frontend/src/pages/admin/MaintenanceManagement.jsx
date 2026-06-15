import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card as MuiCard,
  CardContent,

  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Stack,
  Tooltip,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
} from "@mui/material";
import {
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Engineering as EngineeringIcon,
  Cancel as CancelIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  MeetingRoom as RoomIcon,
  Schedule as ScheduleIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const statusConfig = {
  PENDING: {
    label: "Chờ xử lý",
    color: "#f59e0b",
    bgColor: "#fef3c7",
    icon: <PendingIcon />,
    action: "Đang chờ xử lý",
  },
  IN_PROGRESS: {
    label: "Đang sửa chữa",
    color: "#3b82f6",
    bgColor: "#dbeafe",
    icon: <EngineeringIcon />,
    action: "Đang tiến hành sửa chữa",
  },
  RESOLVED: {
    label: "Đã hoàn thành",
    color: "#10b981",
    bgColor: "#d1fae5",
    icon: <CheckCircleIcon />,
    action: "Đã sửa xong",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "#ef4444",
    bgColor: "#fee2e2",
    icon: <CancelIcon />,
    action: "Đã hủy bỏ",
  },
};

const getStatusChip = (status) => {
  const config = statusConfig[status] || statusConfig.PENDING;
  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        "& .MuiChip-icon": { color: config.color },
      }}
    />
  );
};

const MaintenanceManagement = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [status, setStatus] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await api.get("/maintenance");
      setIssues(Array.isArray(res) ? res : []);
    } catch (error) {
      toast.error("Lỗi tải danh sách sự cố");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleOpenStatusDialog = (issue) => {
    setSelectedIssue(issue);
    setStatus(issue.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIssue(null);
  };

  const handleUpdateStatus = async () => {
    try {
      await api.put(`/maintenance/${selectedIssue.id}/status?status=${status}`);
      toast.success(`Đã cập nhật trạng thái thành "${statusConfig[status]?.label}"`);
      fetchIssues();
      handleCloseDialog();
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const getStatusIcon = (status) => {
    const config = statusConfig[status] || statusConfig.PENDING;
    return config.icon;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter issues by tab
  const filteredIssues = issues.filter((issue) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return issue.status === "PENDING";
    if (tabValue === 2) return issue.status === "IN_PROGRESS";
    if (tabValue === 3) return issue.status === "RESOLVED";
    return true;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "PENDING").length,
    inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
    resolved: issues.filter((i) => i.status === "RESOLVED").length,
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BuildIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Quản Lý Bảo Trì & Sự Cố
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Theo dõi và xử lý các yêu cầu sửa chữa từ khách thuê
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchIssues}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
            >
              Làm mới
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <MuiCard sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#0f766e">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">Tổng yêu cầu</Typography>
            </MuiCard>

          </Grid>
          <Grid item xs={6} sm={3}>
            <MuiCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fef3c7" }}>
              <Typography variant="h4" fontWeight={900} color="#f59e0b">
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">Chờ xử lý</Typography>
            </MuiCard>

          </Grid>
          <Grid item xs={6} sm={3}>
            <MuiCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#dbeafe" }}>
              <Typography variant="h4" fontWeight={900} color="#3b82f6">
                {stats.inProgress}
              </Typography>
              <Typography variant="body2" color="text.secondary">Đang xử lý</Typography>
            </MuiCard>

          </Grid>
          <Grid item xs={6} sm={3}>
            <MuiCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#d1fae5" }}>

              <Typography variant="h4" fontWeight={900} color="#10b981">
                {stats.resolved}
              </Typography>
              <Typography variant="body2" color="text.secondary">Hoàn thành</Typography>
            </MuiCard>

          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Tất cả" />
            <Tab label={`Chờ xử lý (${stats.pending})`} />
            <Tab label={`Đang xử lý (${stats.inProgress})`} />
            <Tab label={`Hoàn thành (${stats.resolved})`} />
          </Tabs>
        </Box>

        {/* Issues Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#0f766e" }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Mã</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày báo</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Phòng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Khách hàng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Nội dung sự cố</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIssues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <BuildIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                    <Typography color="text.secondary">Không có yêu cầu bảo trì nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues.map((issue) => (
                  <TableRow key={issue.id} hover>
                    <TableCell>#{issue.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ScheduleIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                        <Typography variant="body2">{formatDate(issue.createdAt)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <RoomIcon sx={{ fontSize: 16, color: "#0f766e" }} />
                        <Typography fontWeight={600}>Phòng {issue.room?.roomNumber}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: "#0f766e", fontSize: "0.875rem" }}>
                          {issue.tenant?.fullName?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {issue.tenant?.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {issue.tenant?.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300, whiteSpace: "normal" }}>
                        {issue.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(issue.status)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Cập nhật trạng thái">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<UpdateIcon />}
                          onClick={() => handleOpenStatusDialog(issue)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            borderColor: "#0f766e",
                            color: "#0f766e",
                            "&:hover": { bgcolor: "rgba(15,118,110,0.08)", borderColor: "#0d9488" },
                          }}
                        >
                          Cập nhật
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Update Status Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle sx={{ bgcolor: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Cập nhật trạng thái bảo trì
            <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedIssue && (
              <Stack spacing={3}>
                {/* Issue Info */}
                <Paper sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                    <BuildIcon fontSize="small" color="primary" />
                    Thông tin yêu cầu
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Phòng</Typography>
                      <Typography variant="body2" fontWeight={600}>Phòng {selectedIssue.room?.roomNumber}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Khách hàng</Typography>
                      <Typography variant="body2" fontWeight={600}>{selectedIssue.tenant?.fullName}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Nội dung</Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedIssue.description}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Status Select */}
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select value={status} label="Trạng thái" onChange={(e) => setStatus(e.target.value)}>
                    <MenuItem value="PENDING">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PendingIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                        <span>Chờ xử lý</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="IN_PROGRESS">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <EngineeringIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                        <span>Đang sửa chữa</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="RESOLVED">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: "#10b981" }} />
                        <span>Đã hoàn thành</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value="CANCELLED">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CancelIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                        <span>Hủy bỏ</span>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <Typography variant="caption" display="block">
                    💡 Sau khi cập nhật trạng thái, hệ thống sẽ thông báo đến khách hàng
                  </Typography>
                </Alert>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button
              variant="contained"
              onClick={handleUpdateStatus}
              startIcon={<DoneAllIcon />}
              sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
            >
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

// Card component wrapper
const CardWrapper = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}>
    {children}
  </Paper>
);


export default MaintenanceManagement;