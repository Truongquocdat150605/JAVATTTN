import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Avatar,
  Grid,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MiscellaneousServices as ServicesIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  WaterDrop as WaterIcon,
  ElectricalServices as ElecIcon,
  Wifi as WifiIcon,
  CleaningServices as CleanIcon,
  Security as SecurityIcon,
  DeleteSweep as GarbageIcon,
  Build as BuildIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { formatVND } from "../../../utils/formatVND";

// Helper để convert enum sang tiếng Việt và lấy icon
const CATEGORY_CONFIG = {
  WATER: { label: "💧 Nước", icon: <WaterIcon />, color: "#0f766e" },
  ELECTRICITY: { label: "⚡ Điện", icon: <ElecIcon />, color: "#f59e0b" },
  GARBAGE: { label: "🗑️ Rác", icon: <GarbageIcon />, color: "#10b981" },
  INTERNET: { label: "📡 Internet", icon: <WifiIcon />, color: "#3b82f6" },
  SECURITY: { label: "🔒 An ninh", icon: <SecurityIcon />, color: "#8b5cf6" },
  CLEANING: { label: "🧹 Vệ sinh", icon: <CleanIcon />, color: "#ec4898" },
  MAINTENANCE: { label: "🔧 Bảo trì", icon: <BuildIcon />, color: "#ef4444" },
  OTHER: { label: "📝 Khác", icon: <CategoryIcon />, color: "#94a3b8" },
};

const UNIT_LABELS = {
  UNIT: "Bộ",
  PERSON: "Người",
  MONTH: "Tháng",
  WEEK: "Tuần",
  DAY: "Ngày",
  KWH: "kWh",
  CUBIC_METER: "m³",
  LITER: "Lít",
  HOUR: "Giờ",
  TIME: "Lần",
};

const FREQUENCY_LABELS = {
  MONTHLY: "Hàng tháng",
  WEEKLY: "Hàng tuần",
  DAILY: "Hàng ngày",
  ONE_TIME: "Một lần",
  QUARTERLY: "Quý",
  ANNUAL: "Năm",
};

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.get("/services");
      setServices(Array.isArray(data) ? data : data?.data || []);
    } catch {
      toast.error("Không thể tải danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa dịch vụ "${name}"? Nếu dịch vụ đang được dùng bởi phòng, hệ thống sẽ từ chối.`)) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success("Xóa dịch vụ thành công");
      fetchServices();
    } catch (error) {
      const msg = error.response?.data?.error || "Không thể xóa dịch vụ";
      toast.error(msg);
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await api.patch(`/services/${service.id}/toggle-active`);
      toast.success(service.active ? "Đã ngưng dịch vụ" : "Đã kích hoạt dịch vụ");
      fetchServices();
    } catch {
      toast.error("Không thể thay đổi trạng thái");
    }
  };

  // Filter services
  const filteredServices = services.filter((svc) => {
    const matchSearch = !searchKeyword || 
      svc.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      svc.description?.toLowerCase().includes(searchKeyword.toLowerCase());
    
    if (tabValue === 0) return matchSearch;
    if (tabValue === 1) return matchSearch && svc.active;
    if (tabValue === 2) return matchSearch && !svc.active;
    return matchSearch;
  });

  const stats = {
    total: services.length,
    active: services.filter((s) => s.active).length,
    inactive: services.filter((s) => !s.active).length,
    totalRevenue: services.reduce((sum, s) => sum + (s.price || 0), 0),
  };

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
              <ServicesIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Quản Lý Dịch Vụ
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Quản lý các dịch vụ phụ như điện, nước, internet, vệ sinh...
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Làm mới">
                <IconButton onClick={fetchServices} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/admin/services/add")}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
              >
                Thêm dịch vụ
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <AdminServiceCard sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#0f766e">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">Tổng dịch vụ</Typography>
            </AdminServiceCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AdminServiceCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#d1fae5" }}>
              <Typography variant="h4" fontWeight={900} color="#10b981">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">Đang hoạt động</Typography>
            </AdminServiceCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <AdminServiceCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fee2e2" }}>
              <Typography variant="h4" fontWeight={900} color="#ef4444">
                {stats.inactive}
              </Typography>
              <Typography variant="body2" color="text.secondary">Đã ngưng</Typography>
            </AdminServiceCard>
          </Grid>
        </Grid>

        {/* Search and Tabs */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="🔍 Tìm kiếm dịch vụ..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ minHeight: 36 }}>
                <Tab label="Tất cả" sx={{ minHeight: 36 }} />
                <Tab label="Đang hoạt động" sx={{ minHeight: 36 }} />
                <Tab label="Đã ngưng" sx={{ minHeight: 36 }} />
              </Tabs>
            </Grid>
          </Grid>
        </Paper>

        {/* Services Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#0f766e" }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Dịch vụ</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Đơn giá</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Loại</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Đơn vị</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Tần suất</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              {!loading && filteredServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <ServicesIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                    <Typography color="text.secondary">Chưa có dịch vụ nào</Typography>
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={() => navigate("/admin/services/add")}
                      sx={{ mt: 1 }}
                    >
                      Thêm dịch vụ đầu tiên
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                filteredServices.map((svc) => {
                  const categoryConfig = CATEGORY_CONFIG[svc.category] || CATEGORY_CONFIG.OTHER;
                  return (
                    <TableRow key={svc.id} hover sx={{ opacity: svc.active ? 1 : 0.6 }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: `${categoryConfig.color}20`,
                              color: categoryConfig.color,
                            }}
                          >
                            {categoryConfig.icon}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {svc.name}
                            </Typography>
                            {svc.description && (
                              <Typography variant="caption" color="text.secondary">
                                {svc.description.length > 50 ? svc.description.slice(0, 50) + "..." : svc.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, color: "#0f766e" }}>
                          {formatVND(svc.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={categoryConfig.label} size="small" sx={{ bgcolor: `${categoryConfig.color}20`, color: categoryConfig.color, fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>{UNIT_LABELS[svc.unit] || svc.unit || "—"}</TableCell>
                      <TableCell>
                        {svc.frequency ? (
                          <Chip label={FREQUENCY_LABELS[svc.frequency] || svc.frequency} size="small" variant="outlined" />
                        ) : "—"}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={svc.active ? "Click để ngưng" : "Click để kích hoạt"}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Switch size="small" checked={svc.active} onChange={() => handleToggleActive(svc)} color="success" />
                            <Chip label={svc.active ? "Hoạt động" : "Ngưng"} color={svc.active ? "success" : "default"} size="small" />
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" color="primary" onClick={() => navigate(`/admin/services/edit/${svc.id}`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton size="small" color="error" onClick={() => handleDelete(svc.id, svc.name)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

// Card component wrapper (rename để tránh đụng tên Card của MUI)
const AdminServiceCard = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}>
    {children}
  </Paper>
);

export default ServiceList;