/**
 * @file UserList.jsx
 * @description Trang danh sách người dùng (hiển thị thống kê, bộ lọc, bảng danh sách).
 * @module pages/admin/users
 */
import React, { useEffect, useState, useMemo } from "react";
import { Box, Button, Chip, Container, Grid, IconButton, InputAdornment, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography, Avatar, Stack, FormControl, InputLabel, TablePagination } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, People as PeopleIcon, Search as SearchIcon, AdminPanelSettings as AdminIcon, Person as PersonIcon, Lock as LockIcon, LockOpen as UnlockIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { paginateRows, sortNewestFirst } from "../../../utils/adminListUtils";

const HEADER_BG = "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)";

const getRoleChip = (role) => {
  if (role === "ADMIN") return <Chip icon={<AdminIcon />} label="Admin" size="small" sx={{ bgcolor: "#dbeafe", color: "#1e40af", fontWeight: 700 }} />;
  return <Chip icon={<PersonIcon />} label="Khách thuê" size="small" sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 700 }} />;
};

const getStatusChip = (active) =>
  active ? <Chip label="Hoạt động" color="success" size="small" sx={{ fontWeight: 600 }} /> : <Chip label="Vô hiệu hóa" color="default" size="small" sx={{ fontWeight: 600 }} />;

const getInitials = (name) => name?.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase() || "?";

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      const payload = res?.data || res?.content || res;
      setUsers(Array.isArray(payload) ? payload : []);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (user) => {
    try {
      await api.put(`/admin/users/${user.id}`, { ...user, active: !user.active });
      toast.success(user.active ? "Đã vô hiệu hóa tài khoản" : "Đã kích hoạt tài khoản");
      fetchUsers();
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái tài khoản");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.fullName}"?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success("Đã xóa người dùng");
      fetchUsers();
    } catch (error) {
      toast.error("Không thể xóa người dùng (có thể đang được sử dụng)");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.phone?.includes(search);
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const sortedUsers = useMemo(() => sortNewestFirst(filteredUsers, ["updatedAt", "lastModifiedDate", "createdAt", "id"]), [filteredUsers]);
  const paginatedUsers = useMemo(() => paginateRows(sortedUsers, page, rowsPerPage), [sortedUsers, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [search, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "ADMIN").length,
      tenants: users.filter((u) => u.role === "TENANT").length,
      inactive: users.filter((u) => !u.active).length,
    };
  }, [users]);

  return (
    <Box sx={{ bgcolor: "#f0f4ff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: HEADER_BG, color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PeopleIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>Quản Lý Người Dùng</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý tài khoản Admin và Khách thuê</Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/users/add")}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", color: "white", fontWeight: 700, "&:hover": { bgcolor: "rgba(255,255,255,0.35)" }, borderRadius: 2 }}
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
                <Typography variant="h4" fontWeight={900} color={s.color}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "0 10px 30px rgba(0,0,0,0.06)", overflowX: "auto", overflowY: "visible" }}>
            <Table sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow sx={{ background: HEADER_BG }}>
                  {["#", "Người dùng", "Email / Điện thoại", "CCCD", "Vai trò", "Trạng thái", "Thao tác"].map((h) => (
                    <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}>{h}</TableCell>
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
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id} hover sx={{ "&:hover": { bgcolor: "#f0f4ff" } }}>
                      <TableCell sx={{ fontWeight: 600, color: "#64748b" }}>#{user.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: user.role === "ADMIN" ? "#dbeafe" : "#dcfce7", color: user.role === "ADMIN" ? "#1e40af" : "#16a34a", fontWeight: 800, fontSize: 14, width: 38, height: 38 }}>
                            {getInitials(user.fullName)}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={700} fontSize={14}>{user.fullName}</Typography>
                            <Typography variant="caption" color="text.secondary">@{user.username}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={13}>{user.email}</Typography>
                        <Typography variant="caption" color="text.secondary">{user.phone || "—"}</Typography>
                      </TableCell>
                      <TableCell><Typography fontSize={13}>{user.identityNumber || "—"}</Typography></TableCell>
                      <TableCell>{getRoleChip(user.role)}</TableCell>
                      <TableCell>{getStatusChip(user.active)}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" color="primary" onClick={() => navigate(`/admin/users/edit/${user.id}`)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={user.active ? "Vô hiệu hóa" : "Kích hoạt"}>
                            <IconButton size="small" onClick={() => handleToggleActive(user)} sx={{ color: user.active ? "#f59e0b" : "#16a34a" }}>
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
            <TablePagination
              component="div"
              count={sortedUsers.length}
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
        )}
      </Container>
    </Box>
  );
};

export default UserList;
