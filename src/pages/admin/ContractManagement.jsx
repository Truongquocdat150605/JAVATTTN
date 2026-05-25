import React, { useEffect, useState } from "react";
import { 
    Container, Paper, Typography, Box, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, IconButton, Chip, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    FormControl, InputLabel, Select, MenuItem, Stack, Grid
} from "@mui/material";
import { Edit, Delete, Add, Description, HistoryEdu } from "@mui/icons-material";
import api from "../../services/api";
import { toast } from "react-toastify";

const ContractManagement = () => {
    const [contracts, setContracts] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [formData, setFormData] = useState({
        tenantId: "",
        roomId: "",
        startDate: "",
        endDate: "",
        rentPrice: "",
        deposit: "",
        status: "ACTIVE"
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [contractsRes, roomsRes, usersRes] = await Promise.all([
                api.get("/contracts"),
                api.get("/rooms/available"),
                api.get("/admin/users")
            ]);
            setContracts(contractsRes);
            setRooms(roomsRes);
            setUsers(usersRes);
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (contract = null) => {
        if (contract) {
            setEditingContract(contract);
            setFormData({
                tenantId: contract.tenant.id,
                roomId: contract.room.id,
                startDate: contract.startDate,
                endDate: contract.endDate || "",
                rentPrice: contract.rentPrice,
                deposit: contract.deposit || "",
                status: contract.status
            });
        } else {
            setEditingContract(null);
            setFormData({
                tenantId: "",
                roomId: "",
                startDate: new Date().toISOString().split('T')[0],
                endDate: "",
                rentPrice: "",
                deposit: "",
                status: "ACTIVE"
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingContract(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                tenant: { id: formData.tenantId },
                room: { id: formData.roomId }
            };

            if (editingContract) {
                await api.put(`/contracts/${editingContract.id}`, payload);
                toast.success("Cập nhật hợp đồng thành công");
            } else {
                await api.post("/contracts", payload);
                toast.success("Tạo hợp đồng mới thành công");
            }
            fetchData();
            handleClose();
        } catch (error) {
            toast.error("Lỗi khi lưu hợp đồng");
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

    const getStatusChip = (status) => {
        switch (status) {
            case "ACTIVE": return <Chip label="Hiệu lực" color="success" size="small" />;
            case "PENDING": return <Chip label="Chờ duyệt" color="warning" size="small" />;
            case "EXPIRED": return <Chip label="Hết hạn" color="error" size="small" />;
            default: return <Chip label={status} size="small" />;
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    <HistoryEdu sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Quản Lý Hợp Đồng
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
                    Tạo hợp đồng mới
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Khách thuê</TableCell>
                            <TableCell sx={{ color: 'white' }}>Phòng</TableCell>
                            <TableCell sx={{ color: 'white' }}>Bắt đầu</TableCell>
                            <TableCell sx={{ color: 'white' }}>Kết thúc</TableCell>
                            <TableCell sx={{ color: 'white' }}>Giá thuê</TableCell>
                            <TableCell sx={{ color: 'white' }}>Trạng thái</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contracts.map((contract) => (
                            <TableRow key={contract.id} hover>
                                <TableCell fontWeight="bold">{contract.tenant?.fullName}</TableCell>
                                <TableCell>Phòng {contract.room?.roomNumber}</TableCell>
                                <TableCell>{contract.startDate}</TableCell>
                                <TableCell>{contract.endDate || "N/A"}</TableCell>
                                <TableCell>{contract.rentPrice?.toLocaleString('vi-VN')}₫</TableCell>
                                <TableCell>{getStatusChip(contract.status)}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpen(contract)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(contract.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>
                    {editingContract ? "Chỉnh sửa hợp đồng" : "Tạo hợp đồng mới"}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Khách thuê</InputLabel>
                                <Select
                                    name="tenantId"
                                    value={formData.tenantId}
                                    label="Khách thuê"
                                    onChange={handleChange}
                                    disabled={!!editingContract}
                                >
                                    {users.map(user => (
                                        <MenuItem key={user.id} value={user.id}>{user.fullName} ({user.username})</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Phòng</InputLabel>
                                <Select
                                    name="roomId"
                                    value={formData.roomId}
                                    label="Phòng"
                                    onChange={handleChange}
                                    disabled={!!editingContract}
                                >
                                    {editingContract && (
                                        <MenuItem value={editingContract.room.id}>
                                            Phòng {editingContract.room.roomNumber} (Hiện tại)
                                        </MenuItem>
                                    )}
                                    {rooms.map(room => (
                                        <MenuItem key={room.id} value={room.id}>Phòng {room.roomNumber}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Ngày bắt đầu" name="startDate" type="date" fullWidth 
                                InputLabelProps={{ shrink: true }}
                                value={formData.startDate} onChange={handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Ngày kết thúc" name="endDate" type="date" fullWidth 
                                InputLabelProps={{ shrink: true }}
                                value={formData.endDate} onChange={handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Giá thuê định kỳ" name="rentPrice" type="number" fullWidth 
                                value={formData.rentPrice} onChange={handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="Tiền đặt cọc" name="deposit" type="number" fullWidth 
                                value={formData.deposit} onChange={handleChange} 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái hợp đồng</InputLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    label="Trạng thái hợp đồng"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="ACTIVE">Hiệu lực</MenuItem>
                                    <MenuItem value="PENDING">Chờ duyệt</MenuItem>
                                    <MenuItem value="EXPIRED">Hết hạn</MenuItem>
                                    <MenuItem value="TERMINATED">Đã chấm dứt</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingContract ? "Cập nhật" : "Tạo hợp đồng"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ContractManagement;
