import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Grid,
  Card,
  Tooltip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  TablePagination,
  } from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MeetingRoom as MeetingRoomIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Construction as MaintenanceIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { formatVND } from "../../../utils/formatVND";
import { paginateRows, sortNewestFirst } from "../../../utils/adminListUtils";

const IMAGE_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/uploads/";

const STATUS_CONFIG = {
  AVAILABLE: { label: "Trống", color: "#10b981", bgColor: "#d1fae5", icon: <CheckCircleIcon /> },
  OCCUPIED: { label: "Đã thuê", color: "#ef4444", bgColor: "#fee2e2", icon: <CancelIcon /> },
  RENTED: { label: "Đã thuê", color: "#ef4444", bgColor: "#fee2e2", icon: <CancelIcon /> },
  MAINTENANCE: { label: "Bảo trì", color: "#f59e0b", bgColor: "#fef3c7", icon: <MaintenanceIcon /> },
};

const getStatusChip = (status) => {
  const config = STATUS_CONFIG[status?.toUpperCase()] || STATUS_CONFIG.AVAILABLE;
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

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
      const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await api.get("/rooms");
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (roomId, roomNumber) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phòng ${roomNumber}?`)) return;

    try {
      await api.delete(`/rooms/${roomId}`);
      toast.success("Xóa phòng thành công");
      fetchRooms();
    } catch (error) {
      const serverMsg = error.response?.data?.error || "Không thể xóa phòng";
      toast.error(serverMsg);
    }
  };

  
  
  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      !searchKeyword ||
      room.roomNumber?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      room.type?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchKeyword.toLowerCase());

    if (tabValue === 0) return matchSearch;
    if (tabValue === 1) return matchSearch && room.status === "AVAILABLE";
    if (tabValue === 2) return matchSearch && (room.status === "OCCUPIED" || room.status === "RENTED");
    if (tabValue === 3) return matchSearch && room.status === "MAINTENANCE";
    return matchSearch;
  });
  const sortedRooms = sortNewestFirst(filteredRooms, ["updatedAt", "lastModifiedDate", "createdAt", "id"]);
  const paginatedRooms = paginateRows(sortedRooms, page, rowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [searchKeyword, tabValue]);

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === "AVAILABLE").length,
    occupied: rooms.filter((r) => r.status === "OCCUPIED" || r.status === "RENTED").length,
    maintenance: rooms.filter((r) => r.status === "MAINTENANCE").length,
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
              <MeetingRoomIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Quản Lý Phòng Trọ
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Quản lý thông tin, trạng thái và hình ảnh các phòng trọ
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Tooltip title="Làm mới">
                <IconButton onClick={fetchRooms} sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/admin/rooms/add")}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
              >
                Thêm phòng mới
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#0f766e">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">Tổng phòng</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#d1fae5" }}>
              <Typography variant="h4" fontWeight={900} color="#10b981">
                {stats.available}
              </Typography>
              <Typography variant="body2" color="text.secondary">Phòng trống</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fee2e2" }}>
              <Typography variant="h4" fontWeight={900} color="#ef4444">
                {stats.occupied}
              </Typography>
              <Typography variant="body2" color="text.secondary">Đã cho thuê</Typography>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fef3c7" }}>
              <Typography variant="h4" fontWeight={900} color="#f59e0b">
                {stats.maintenance}
              </Typography>
              <Typography variant="body2" color="text.secondary">Đang bảo trì</Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="🔍 Tìm kiếm theo số phòng, loại phòng..."
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
                <Tab label="Phòng trống" sx={{ minHeight: 36 }} />
                <Tab label="Đã cho thuê" sx={{ minHeight: 36 }} />
                <Tab label="Bảo trì" sx={{ minHeight: 36 }} />
              </Tabs>
            </Grid>
          </Grid>
        </Paper>

        {/* Rooms Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto", overflowY: "visible", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#0f766e" }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Hình ảnh</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Số phòng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Loại phòng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Diện tích</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Giá thuê</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Mô tả</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              )}

              {!loading && sortedRooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <MeetingRoomIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                    <Typography color="text.secondary">Không tìm thấy phòng nào</Typography>
                    <Button variant="text" startIcon={<AddIcon />} onClick={() => navigate("/admin/rooms/add")} sx={{ mt: 1 }}>
                      Thêm phòng mới
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                paginatedRooms.map((room) => (
                  <TableRow key={room.id} hover>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={room.image ? `${IMAGE_BASE_URL}${room.image}` : ""}
                        sx={{ width: 70, height: 52, borderRadius: 2 }}
                      >
                        {!room.image && <ImageIcon sx={{ fontSize: 24, color: "#94a3b8" }} />}
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight={700}>
                        Phòng {room.roomNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{room.type || "—"}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {room.area} m²
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: "#0f766e" }}>{formatVND(room.price)}</Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(room.status)}</TableCell>
                    <TableCell>
                      <Tooltip title={room.description || "Chưa có mô tả"}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 250,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: room.description ? "inherit" : "#94a3b8",
                          }}
                        >
                          {room.description || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="primary" onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton size="small" color="error" onClick={() => handleDelete(room.id, room.roomNumber)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedRooms.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage="Dòng/trang"
          />
        </TableContainer>
      </Container>
    </Box>
  );
};

export default RoomList;
