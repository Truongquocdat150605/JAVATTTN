import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Avatar,
  Stack,
  Tooltip,
  Card,
  CardContent as MuiCardContent,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  HistoryEdu,
  PictureAsPdf,
  CheckCircle,
  Pending,
  Cancel,
  Refresh,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";
import { formatVND } from "../../utils/formatVND";
import ContractSignDialog from "../../components/contracts/ContractSignDialog";
import { Draw as DrawIcon } from "@mui/icons-material";

const getStatusChip = (status) => {
  switch (status) {
    case "ACTIVE":
      return <Chip icon={<CheckCircle />} label="Hiệu lực" color="success" size="small" sx={{ fontWeight: 600 }} />;
    case "PENDING":
      return <Chip icon={<Pending />} label="Chờ duyệt" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    case "EXPIRED":
      return <Chip icon={<Cancel />} label="Hết hạn" color="error" size="small" sx={{ fontWeight: 600 }} />;
    case "TERMINATED":
      return <Chip icon={<Cancel />} label="Đã chấm dứt" color="default" size="small" />;
    default:
      return <Chip label={status} size="small" />;
  }
};

const ContractManagement = () => {
  const [contracts, setContracts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [signDialog, setSignDialog] = useState({ open: false, contract: null });
  
  // State cho form tạo hợp đồng với thông tin khách thuê mới
  const [formData, setFormData] = useState({
    roomId: "",
    startDate: "",
    endDate: "",
    rentPrice: "",
    deposit: "",
    status: "ACTIVE",
  });

  // State cho thông tin khách thuê mới (khi tạo hợp đồng mới)
  const [newTenantForm, setNewTenantForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    identityNumber: "",
    address: "",
  });

  // State cho editing (khi sửa hợp đồng)
  const [editFormData, setEditFormData] = useState({
    tenantId: "",
    roomId: "",
    startDate: "",
    endDate: "",
    rentPrice: "",
    deposit: "",
    status: "ACTIVE",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [contractsRes, roomsRes, usersRes] = await Promise.all([
        api.get("/contracts"),
        api.get("/rooms/available"),
        api.get("/admin/users"),
      ]);

      const unwrapList = (res) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.content)) return res.content;
        return [];
      };

      setContracts(unwrapList(contractsRes));
      setRooms(unwrapList(roomsRes));
      setUsers(unwrapList(usersRes));
    } catch (error) {
      console.error("fetchData ContractManagement error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Lỗi khi tải dữ liệu";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredContracts = contracts.filter((contract) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return contract.status === "ACTIVE";
    if (tabValue === 2) return contract.status === "PENDING";
    if (tabValue === 3) return contract.status === "EXPIRED";
    return true;
  });

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "ACTIVE").length,
    pending: contracts.filter((c) => c.status === "PENDING").length,
    expired: contracts.filter((c) => c.status === "EXPIRED").length,
  };

  const handleOpenDialog = (contract = null) => {
    if (contract) {
      // Chỉnh sửa hợp đồng
      setEditingContract(contract);
      setEditFormData({
        tenantId: contract.tenant?.id || "",
        roomId: contract.room?.id || "",
        startDate: contract.startDate || "",
        endDate: contract.endDate || "",
        rentPrice: contract.rentPrice || "",
        deposit: contract.deposit || "",
        status: contract.status || "ACTIVE",
      });
    } else {
      // Tạo hợp đồng mới
      setEditingContract(null);
      setFormData({
        roomId: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        rentPrice: "",
        deposit: "",
        status: "ACTIVE",
      });
      setNewTenantForm({
        fullName: "",
        email: "",
        phone: "",
        identityNumber: "",
        address: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContract(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleNewTenantChange = (e) => {
    setNewTenantForm({ ...newTenantForm, [e.target.name]: e.target.value });
  };

  const isValidDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));

  // ========== TẠO HỢP ĐỒNG MỚI (Gọi API create-with-tenant) ==========
  const handleCreateContract = async () => {
    // Validate thông tin khách thuê
    if (!newTenantForm.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên khách thuê");
      return;
    }
    if (!newTenantForm.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại khách thuê");
      return;
    }
    if (!newTenantForm.email.trim()) {
      toast.error("Vui lòng nhập email khách thuê");
      return;
    }

    // Validate thông tin hợp đồng
    if (!formData.roomId) {
      toast.error("Vui lòng chọn phòng");
      return;
    }
    if (!isValidDate(formData.startDate)) {
      toast.error("Ngày bắt đầu phải đúng định dạng YYYY-MM-DD");
      return;
    }
    if (!formData.rentPrice || Number(formData.rentPrice) <= 0) {
      toast.error("Vui lòng nhập giá thuê hợp lệ");
      return;
    }

    try {
      // Gọi API tạo hợp đồng + tự động tạo tenant
      await api.post("/contracts/create-with-tenant", null, {
        params: {
          roomId: formData.roomId,
          tenantFullName: newTenantForm.fullName,
          tenantEmail: newTenantForm.email,
          tenantPhone: newTenantForm.phone,
          tenantIdentity: newTenantForm.identityNumber || null,
          startDate: formData.startDate,
          endDate: formData.endDate || null,
          rentPrice: Number(formData.rentPrice),
          deposit: Number(formData.deposit) || 0,
        }
      });
      toast.success("Tạo hợp đồng thành công!");
      handleCloseDialog();
      fetchData();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Lỗi khi tạo hợp đồng";
      toast.error(msg);
    }
  };

  // ========== CẬP NHẬT HỢP ĐỒNG (Gọi API PUT) ==========
  const handleUpdateContract = async () => {
    if (!editFormData.tenantId) {
      toast.error("Vui lòng chọn khách thuê");
      return;
    }
    if (!editFormData.roomId) {
      toast.error("Vui lòng chọn phòng");
      return;
    }
    if (!isValidDate(editFormData.startDate)) {
      toast.error("Ngày bắt đầu phải đúng định dạng YYYY-MM-DD");
      return;
    }

    const payload = {
      tenant: { id: editFormData.tenantId },
      room: { id: editFormData.roomId },
      startDate: editFormData.startDate,
      endDate: editFormData.endDate || null,
      rentPrice: Number(editFormData.rentPrice),
      deposit: Number(editFormData.deposit) || 0,
      status: editFormData.status,
      active: true,
    };

    try {
      await api.put(`/contracts/${editingContract.id}`, payload);
      toast.success("Cập nhật hợp đồng thành công");
      handleCloseDialog();
      fetchData();
    } catch (error) {
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Lỗi khi cập nhật hợp đồng";
      toast.error(msg);
    }
  };

  const handleSubmit = () => {
    if (editingContract) {
      handleUpdateContract();
    } else {
      handleCreateContract();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này?")) {
      try {
        await api.delete(`/contracts/${id}`);
        toast.success("Đã xóa hợp đồng");
        fetchData();
      } catch (error) {
        toast.error("Lỗi khi xóa hợp đồng");
      }
    }
  };

  const handleExportPDF = (contract) => {
    setSignDialog({ open: true, contract });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
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
              <HistoryEdu sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Quản Lý Hợp Đồng
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Quản lý tất cả hợp đồng thuê phòng
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
            >
              Tạo hợp đồng mới
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h3" fontWeight={900} color="#0f766e">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">Tổng hợp đồng</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#d1fae5" }}>

              <Typography variant="h3" fontWeight={900} color="#10b981">
                {stats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">Đang hiệu lực</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fef3c7" }}>

              <Typography variant="h3" fontWeight={900} color="#f59e0b">
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">Chờ duyệt</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fee2e2" }}>

              <Typography variant="h3" fontWeight={900} color="#ef4444">
                {stats.expired}
              </Typography>
              <Typography variant="body2" color="text.secondary">Hết hạn</Typography>
            </AdminCard>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Tất cả" />
            <Tab label="Đang hiệu lực" />
            <Tab label="Chờ duyệt" />
            <Tab label="Hết hạn" />
          </Tabs>
        </Box>

        {/* Contracts Table */}
        <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#0f766e" }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Mã HD</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Khách thuê</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Phòng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày bắt đầu</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày kết thúc</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Giá thuê</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Cọc</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">Không có hợp đồng nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract) => (
                  <TableRow key={contract.id} hover>
                    <TableCell>#{contract.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#0f766e" }}>
                          {contract.tenant?.fullName?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {contract.tenant?.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {contract.tenant?.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>Phòng {contract.room?.roomNumber}</TableCell>
                    <TableCell>{contract.startDate}</TableCell>
                    <TableCell>{contract.endDate || "Chưa xác định"}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0f766e" }}>{formatVND(contract.rentPrice)}</TableCell>
                    <TableCell>{formatVND(contract.deposit)}</TableCell>
                    <TableCell>{getStatusChip(contract.status)}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="primary" onClick={() => handleOpenDialog(contract)}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Ký hợp đồng & Xuất PDF">
                          <IconButton size="small" color="secondary" onClick={() => handleExportPDF(contract)}>
                            <DrawIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton size="small" color="error" onClick={() => handleDelete(contract.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Create/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle sx={{ bgcolor: "#0f766e", color: "white" }}>
            {editingContract ? "Chỉnh sửa hợp đồng" : "Tạo hợp đồng mới"}
          </DialogTitle>
          <DialogContent dividers>
            {editingContract ? (
              // ========== FORM CHỈNH SỬA HỢP ĐỒNG ==========
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Khách thuê</InputLabel>
                    <Select name="tenantId" value={editFormData.tenantId} label="Khách thuê" onChange={handleEditChange}>
                      <MenuItem value="">-- Chọn khách thuê --</MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.fullName} ({user.username})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Phòng</InputLabel>
                    <Select name="roomId" value={editFormData.roomId} label="Phòng" onChange={handleEditChange}>
                      <MenuItem value="">-- Chọn phòng --</MenuItem>
                      {rooms.map((room) => (
                        <MenuItem key={room.id} value={room.id}>
                          Phòng {room.roomNumber} - {formatVND(room.price)}/tháng
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ngày bắt đầu"
                    name="startDate"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={editFormData.startDate}
                    onChange={handleEditChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ngày kết thúc"
                    name="endDate"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={editFormData.endDate}
                    onChange={handleEditChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Giá thuê (VNĐ/tháng)"
                    name="rentPrice"
                    type="number"
                    fullWidth
                    value={editFormData.rentPrice}
                    onChange={handleEditChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tiền cọc (VNĐ)"
                    name="deposit"
                    type="number"
                    fullWidth
                    value={editFormData.deposit}
                    onChange={handleEditChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái hợp đồng</InputLabel>
                    <Select name="status" value={editFormData.status} label="Trạng thái hợp đồng" onChange={handleEditChange}>
                      <MenuItem value="ACTIVE">Hiệu lực</MenuItem>
                      <MenuItem value="PENDING">Chờ duyệt</MenuItem>
                      <MenuItem value="EXPIRED">Hết hạn</MenuItem>
                      <MenuItem value="TERMINATED">Đã chấm dứt</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            ) : (
              // ========== FORM TẠO HỢP ĐỒNG MỚI (Có nhập thông tin khách thuê) ==========
              <>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#0f766e" }}>
                  📝 Thông tin khách thuê mới
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                  Hệ thống sẽ tự động tạo tài khoản nếu số điện thoại chưa tồn tại (mật khẩu mặc định: 123456)
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Họ và tên *"
                      name="fullName"
                      value={newTenantForm.fullName}
                      onChange={handleNewTenantChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Số điện thoại *"
                      name="phone"
                      value={newTenantForm.phone}
                      onChange={handleNewTenantChange}
                      placeholder="0987654321"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Email *"
                      name="email"
                      type="email"
                      value={newTenantForm.email}
                      onChange={handleNewTenantChange}
                      placeholder="tenant@example.com"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số CCCD"
                      name="identityNumber"
                      value={newTenantForm.identityNumber}
                      onChange={handleNewTenantChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Địa chỉ"
                      name="address"
                      value={newTenantForm.address}
                      onChange={handleNewTenantChange}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, color: "#0f766e" }}>
                  🏠 Thông tin hợp đồng
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Chọn phòng *</InputLabel>
                      <Select name="roomId" value={formData.roomId} label="Chọn phòng *" onChange={handleChange}>
                        <MenuItem value="">-- Chọn phòng --</MenuItem>
                        {rooms.map((room) => (
                          <MenuItem key={room.id} value={room.id}>
                            Phòng {room.roomNumber} - {formatVND(room.price)}/tháng - {room.area}m²
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Ngày bắt đầu *"
                      name="startDate"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Ngày kết thúc (không bắt buộc)"
                      name="endDate"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Giá thuê (VNĐ/tháng) *"
                      name="rentPrice"
                      type="number"
                      fullWidth
                      value={formData.rentPrice}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Tiền cọc (VNĐ)"
                      name="deposit"
                      type="number"
                      fullWidth
                      value={formData.deposit}
                      onChange={handleChange}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>
              </>
            )}

            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
              <Typography variant="body2" fontWeight={600}>💡 Lưu ý:</Typography>
              <Typography variant="caption" color="text.secondary">
                • Hợp đồng sẽ có hiệu lực ngay sau khi tạo (trạng thái ACTIVE)
                • Hệ thống sẽ tự động tạo hóa đơn tháng đầu tiên
                • Khách thuê sẽ nhận được email thông báo (nếu có cấu hình email)
              </Typography>
            </Alert>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}>
              {editingContract ? "Cập nhật" : "Tạo hợp đồng"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      {/* E-Signature Dialog */}
      <ContractSignDialog
        open={signDialog.open}
        contract={signDialog.contract}
        onClose={() => setSignDialog({ open: false, contract: null })}
      />
    </Box>
  );
};

// Card component wrapper (rename để tránh đụng tên Card của MUI)
const AdminCard = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}>
    {children}
  </Paper>
);

export default ContractManagement;