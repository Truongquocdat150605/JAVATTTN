import React, { useEffect, useState } from "react";
import { 
    Container, Paper, Typography, Box, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton, Chip, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    FormControl, InputLabel, Select, MenuItem, Stack, Avatar, Button
} from "@mui/material";
import { Edit, Delete, Person, Shield, Add } from "@mui/icons-material";
import api from "../../services/api";
import { toast } from "react-toastify";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        fullName: "",
        email: "",
        phone: "",
        identityNumber: "",
        address: "",
        role: "TENANT",
        active: true
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/users");
            setUsers(res);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpen = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username || "",
                password: "", // Không hiển thị mật khẩu cũ
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                identityNumber: user.identityNumber || "",
                address: user.address || "",
                role: user.role || "TENANT",
                active: user.active ?? true
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: "",
                password: "",
                fullName: "",
                email: "",
                phone: "",
                identityNumber: "",
                address: "",
                role: "TENANT",
                active: true
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingUser(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'active' ? value === 'true' : value;
        setFormData({ ...formData, [name]: finalValue });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.fullName || !formData.username || (!editingUser && !formData.password)) {
                toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
                return;
            }

            if (editingUser) {
                await api.put(`/admin/users/${editingUser.id}`, formData);
                toast.success("Cập nhật thông tin người dùng thành công");
            } else {
                await api.post("/admin/users", formData);
                toast.success("Thêm người dùng mới thành công");
            }
            fetchUsers();
            handleClose();
        } catch (error) {
            const msg = error.response?.data || "Lỗi khi xử lý người dùng";
            toast.error(typeof msg === 'string' ? msg : "Lỗi hệ thống");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
            try {
                await api.delete(`/admin/users/${id}`);
                toast.success("Đã xóa người dùng");
                fetchUsers();
            } catch (error) {
                toast.error("Lỗi khi xóa người dùng");
            }
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Quản Lý Người Dùng
                    </Typography>
                    <Typography color="textSecondary">Quản lý tài khoản và thông tin cá nhân của người thuê trọ và quản trị viên</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: 2 }}
                >
                    Thêm người dùng
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Người dùng</TableCell>
                            <TableCell sx={{ color: 'white' }}>Email / SĐT</TableCell>
                            <TableCell sx={{ color: 'white' }}>CCCD</TableCell>
                            <TableCell sx={{ color: 'white' }}>Vai trò</TableCell>
                            <TableCell sx={{ color: 'white' }}>Trạng thái</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Avatar sx={{ mr: 2, bgcolor: user.role === 'ADMIN' ? 'error.main' : 'primary.main' }}>
                                            {user.fullName?.charAt(0) || user.username?.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography fontWeight="bold">{user.fullName || "Chưa đặt tên"}</Typography>
                                            <Typography variant="body2" color="textSecondary">@{user.username}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{user.email || "-"}</Typography>
                                    <Typography variant="body2">{user.phone || "-"}</Typography>
                                </TableCell>
                                <TableCell>{user.identityNumber || "Chưa cập nhật"}</TableCell>
                                <TableCell>
                                    {user.role === 'ADMIN' ? 
                                        <Chip label="Quản trị" color="error" size="small" icon={<Shield />} /> : 
                                        <Chip label="Khách thuê" color="info" size="small" />
                                    }
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.active ? "Đang hoạt động" : "Bị khóa"} 
                                        color={user.active ? "success" : "default"} 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpen(user)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>{editingUser ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField 
                            label="Tên đăng nhập" 
                            name="username" 
                            fullWidth 
                            disabled={!!editingUser}
                            value={formData.username} 
                            onChange={handleChange} 
                            required
                        />
                        <TextField 
                            label={editingUser ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"} 
                            name="password" 
                            type="password"
                            fullWidth 
                            value={formData.password} 
                            onChange={handleChange} 
                            required={!editingUser}
                        />
                        <TextField 
                            label="Họ và tên" 
                            name="fullName" 
                            fullWidth 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            required
                        />
                        <TextField label="Email" name="email" fullWidth value={formData.email} onChange={handleChange} />
                        <TextField label="Số điện thoại" name="phone" fullWidth value={formData.phone} onChange={handleChange} />
                        <TextField label="Số CCCD" name="identityNumber" fullWidth value={formData.identityNumber} onChange={handleChange} />
                        <TextField label="Địa chỉ" name="address" fullWidth multiline rows={2} value={formData.address} onChange={handleChange} />
                        
                        <FormControl fullWidth>
                            <InputLabel>Vai trò</InputLabel>
                            <Select name="role" value={formData.role} label="Vai trò" onChange={handleChange}>
                                <MenuItem value="TENANT">Khách thuê (TENANT)</MenuItem>
                                <MenuItem value="ADMIN">Quản trị viên (ADMIN)</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Trạng thái tài khoản</InputLabel>
                            <Select name="active" value={formData.active.toString()} label="Trạng thái tài khoản" onChange={handleChange}>
                                <MenuItem value="true">Đang hoạt động</MenuItem>
                                <MenuItem value="false">Khóa tài khoản</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingUser ? "Lưu thay đổi" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagement;
