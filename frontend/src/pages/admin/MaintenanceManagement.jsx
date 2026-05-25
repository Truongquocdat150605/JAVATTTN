import React, { useEffect, useState } from "react";
import { 
    Container, Paper, Typography, Box, Grid, Card, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, IconButton, Chip, Dialog, DialogTitle, DialogContent, 
    DialogActions, TextField, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Hammer, CheckCircle, Clock, AlertTriangle, Trash2 } from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";

const MaintenanceManagement = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [status, setStatus] = useState("");

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const res = await api.get("/maintenance");
            setIssues(res || []);
        } catch (error) {
            toast.error("Lỗi tải danh sách sự cố");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    const handleOpenStatus = (issue) => {
        setSelectedIssue(issue);
        setStatus(issue.status);
        setOpen(true);
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/maintenance/${selectedIssue.id}/status?status=${status}`);
            toast.success("Đã cập nhật trạng thái bảo trì");
            fetchIssues();
            setOpen(false);
        } catch (error) {
            toast.error("Lỗi cập nhật trạng thái");
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING": return <Clock size={16} className="text-warning" />;
            case "IN_PROGRESS": return <Hammer size={16} className="text-primary" />;
            case "RESOLVED": return <CheckCircle size={16} className="text-success" />;
            default: return <AlertTriangle size={16} />;
        }
    };

    const getStatusChip = (status) => {
        const config = {
            PENDING: { color: "warning", label: "Chờ xử lý" },
            IN_PROGRESS: { color: "primary", label: "Đang sửa chữa" },
            RESOLVED: { color: "success", label: "Đã xong" },
            CANCELLED: { color: "default", label: "Đã hủy" }
        };
        const s = config[status] || config.PENDING;
        return <Chip label={s.label} color={s.color} size="small" />;
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box mb={3}>
                <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                    <Hammer className="text-primary" /> Quản Lý Bảo Trì & Sự Cố
                </Typography>
                <Typography color="textSecondary">Theo dõi và phản hồi các yêu cầu sửa chữa từ khách thuê</Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: "grey.100" }}>
                        <TableRow>
                            <TableCell>Ngày báo</TableCell>
                            <TableCell>Phòng</TableCell>
                            <TableCell>Người báo</TableCell>
                            <TableCell>Nội dung sự cố</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issues.length > 0 ? issues.map((issue) => (
                            <TableRow key={issue.id} hover>
                                <TableCell>{new Date(issue.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell fontWeight="bold">Phòng {issue.room?.roomNumber}</TableCell>
                                <TableCell>{issue.tenant?.fullName}</TableCell>
                                <TableCell sx={{ maxWidth: 300 }}>{issue.description}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {getStatusIcon(issue.status)}
                                        {getStatusChip(issue.status)}
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    <Button variant="outlined" size="small" onClick={() => handleOpenStatus(issue)}>
                                        Cập nhật
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>Chưa có báo cáo sự cố nào</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Cập nhật trạng thái bảo trì</DialogTitle>
                <DialogContent sx={{ minWidth: 300, mt: 1 }}>
                    <FormControl fullWidth>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select value={status} label="Trạng thái" onChange={(e) => setStatus(e.target.value)}>
                            <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                            <MenuItem value="IN_PROGRESS">Đang sửa chữa</MenuItem>
                            <MenuItem value="RESOLVED">Đã xong</MenuItem>
                            <MenuItem value="CANCELLED">Hủy bỏ</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Đóng</Button>
                    <Button onClick={handleUpdateStatus} variant="contained">Lưu thay đổi</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MaintenanceManagement;
