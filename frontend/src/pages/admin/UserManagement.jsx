import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Avatar,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const HEADER_BG = "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)";

const getRoleChip = (role) => {
  if (role === "ADMIN")
    return (
      <Chip
        icon={<AdminIcon />}
        label="Admin"
        size="small"
        sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 700 }}
      />
    );
  return (
    <Chip
      icon={<PersonIcon />}
      label="Khách thuê"
      size="small"
      sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 700 }}
    />
  );
};

const getStatusChip = (active) =>
  active ? (
    <Chip label="Hoạt động" color="success" size="small" sx={{ fontWeight: 600 }} />
  ) : (
    <Chip label="Vô hiệu hóa" color="default" size="small" sx={{ fontWeight: 600 }} />
  );

const EMPTY_FORM = {
  username: "",
  password: "",
  fullName: "",
  email: "",
  phone: "",
  identityNumber: "",
  address: "",
  role: "TENANT",
  active: true,
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");

      const unwrapList = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.content)) return payload.content;
        return [];
      };

      setUsers(unwrapList(res));
    } catch (error) {
      console.error("fetchUsers UserManagement error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Không thể tải danh sách người dùng";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search);
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "ADMIN").length;
    const tenants = users.filter((u) => u.role === "TENANT").length;
    const inactive = users.filter((u) => !u.active).length;
    return { total, admins, tenants, inactive };
  }, [users]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setShowPassword(false);
    setOpenDialog(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || "",
      password: "",
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      identityNumber: user.identityNumber || "",
      address: user.address || "",
      role: user.role || "TENANT",
      active: user.active !== undefined ? user.active : true,
    });
    setShowPassword(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) return toast.error("Họ tên không được để trống");
    if (!formData.email.trim()) return toast.error("Email không được để trống");
    if (!editingUser && !formData.password.trim()) return toast.error("Mật khẩu không được để trống khi tạo mới");

    setSaving(true);
    try {
      if (editingUser) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await api.put(`/admin/users/${editingUser.id}`, payload);
        toast.success("Cập nhật người dùng thành công!");
      } else {
        await api.post("/admin/users", formData);
        toast.success("Tạo người dùng thành công!");
      }
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      toast.error(err?.response?.data || "Có lỗi xảy ra khi lưu người dùng");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const res = await api.put(`/admin/users/${user.id}`, { ...user, active: !user.active });

      const msg =
        res?.message ||
        res?.data?.message ||
        (res === true ? null : null) ||
        null;

      toast.success(msg || (user.active ? "Đã vô hiệu hóa tài khoản" : "Đã kích hoạt tài khoản"));
      fetchUsers();
    } catch (error) {
      console.error("handleToggleActive error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Không thể thay đổi trạng thái tài khoản";
      toast.error(msg);
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.fullName}"?`)) return;
    try {
      const res = await api.delete(`/admin/users/${user.id}`);

      const msg =
        res?.message ||
        res?.data?.message ||
        null;

      toast.success(msg || "Đã xóa người dùng");
      fetchUsers();
    } catch (error) {
      console.error("handleDelete error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Không thể xóa người dùng (có thể đang được sử dụng)";
      toast.error(msg);
    }
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: HEADER_BG,
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PeopleIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Quản Lý Người Dùng
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Quản lý tài khoản Admin và Khách thuê
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                fontWeight: 700,
                "&:hover": { bgcolor: "rgba(255,255,255,0.35)" },
                borderRadius: 2,
              }}
            >
              Thêm người dùng
            </Button>
          </Box>
        </Paper>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "Tổng người dùng", value: stats.total, color: "#1e40af" },
            { label: "Admin", value: stats.admins, color: "#7c3aed" },
            { label: "Khách thuê", value: stats.tenants, color: "#16a34a" },
            { label: "Vô hiệu hóa", value: stats.inactive, color: "#dc2626" },
          ].map((s) => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Paper sx={{ p: 3, textAlign: "center", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                <Typography variant="h4" fontWeight={900} color={s.color}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Tìm kiếm theo tên, username, email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ minWidth: 280, flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select value={roleFilter} label="Vai trò" onChange={(e) => setRoleFilter(e.target.value)}>
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="TENANT">Khách thuê</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary">
            Hiển thị {filteredUsers.length}/{users.length} người dùng
          </Typography>
        </Paper>

        {/* Table */}
        {loading ? (
          <LinearProgress sx={{ borderRadius: 2 }} />
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: HEADER_BG }}>
                  {["#", "Người dùng", "Email / Điện thoại", "CCCD", "Vai trò", "Trạng thái", "Thao tác"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}>
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">Không tìm thấy người dùng nào</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} hover sx={{ "&:hover": { bgcolor: "#f0f4ff" } }}>
                      <TableCell sx={{ fontWeight: 600, color: "#64748b" }}>#{user.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar
                            sx={{
                              bgcolor: user.role === "ADMIN" ? "#dbeafe" : "#dcfce7",
                              color: user.role === "ADMIN" ? "#1e40af" : "#16a34a",
                              fontWeight: 800,
                              fontSize: 14,
                              width: 38,
                              height: 38,
                            }}
                          >
                            {getInitials(user.fullName)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700} fontSize={14}>
                              {user.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13}>{user.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.phone || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13}>{user.identityNumber || "—"}</Typography>
                      </TableCell>
                      <TableCell>{getRoleChip(user.role)}</TableCell>
                      <TableCell>{getStatusChip(user.active)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" color="primary" onClick={() => handleOpenEdit(user)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.active ? "Vô hiệu hóa" : "Kích hoạt"}>
                            <IconButton
                              size="small"
                              onClick={() => handleToggleActive(user)}
                              sx={{ color: user.active ? "#f59e0b" : "#16a34a" }}
                            >
                              {user.active ? <LockIcon fontSize="small" /> : <UnlockIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton size="small" color="error" onClick={() => handleDelete(user)}>
                              <DeleteIcon fontSize="small" />
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
        )}

        {/* Create / Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{
              background: HEADER_BG,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 800,
            }}
          >
            {editingUser ? `Chỉnh sửa: ${editingUser.fullName}` : "Thêm người dùng mới"}
            <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            <Grid container spacing={2.5} sx={{ pt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Họ và tên *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Username *"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  disabled={!!editingUser}
                  helperText={editingUser ? "Không thể đổi username" : ""}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label={editingUser ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CCCD / CMND"
                  name="identityNumber"
                  value={formData.identityNumber}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Địa chỉ"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Vai trò</InputLabel>
                  <Select name="role" value={formData.role} label="Vai trò" onChange={handleChange}>
                    <MenuItem value="TENANT">Khách thuê</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, height: "100%" }}>
                  <Typography>Trạng thái tài khoản:</Typography>
                  <Switch
                    name="active"
                    checked={formData.active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                    color="success"
                  />
                  <Typography color={formData.active ? "success.main" : "text.disabled"} fontWeight={600}>
                    {formData.active ? "Hoạt động" : "Vô hiệu hóa"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleCloseDialog} disabled={saving}>
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} /> : null}
              sx={{ background: HEADER_BG, fontWeight: 700 }}
            >
              {saving ? "Đang lưu..." : editingUser ? "Lưu thay đổi" : "Tạo người dùng"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserManagement;