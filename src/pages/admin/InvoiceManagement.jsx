import React, { useEffect, useState } from "react";
import { 
    Container, Paper, Typography, Box, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, IconButton, Chip, 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    FormControl, InputLabel, Select, MenuItem, Stack, Grid, Divider
} from "@mui/material";
import { 
    Edit, Delete, Receipt, CheckCircle, PendingActions, 
    Warning, PictureAsPdf, Download 
} from "@mui/icons-material";
import api from "../../services/api";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState(null);
    const [formData, setFormData] = useState({
        rentalAmount: 0,
        electricityStart: 0,
        electricityEnd: 0,
        electricityPrice: 3500,
        waterStart: 0,
        waterEnd: 0,
        waterPrice: 15000,
        serviceAmount: 0,
        status: "UNPAID",
        notes: ""
    });

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await api.get("/invoices");
            setInvoices(res);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách hóa đơn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleOpen = (invoice) => {
        setEditingInvoice(invoice);
        setFormData({
            rentalAmount: invoice.rentalAmount || 0,
            electricityStart: invoice.electricityStart || 0,
            electricityEnd: invoice.electricityEnd || 0,
            electricityPrice: invoice.electricityPrice || 3500,
            waterStart: invoice.waterStart || 0,
            waterEnd: invoice.waterEnd || 0,
            waterPrice: invoice.waterPrice || 15000,
            serviceAmount: invoice.serviceAmount || 0,
            status: invoice.status,
            notes: invoice.notes || ""
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingInvoice(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotal = () => {
        const eAmount = (formData.electricityEnd - formData.electricityStart) * formData.electricityPrice;
        const wAmount = (formData.waterEnd - formData.waterStart) * formData.waterPrice;
        return Number(formData.rentalAmount) + (eAmount > 0 ? eAmount : 0) + (wAmount > 0 ? wAmount : 0) + Number(formData.serviceAmount);
    };


    const generatePDFBlob = (invoice) => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.setTextColor(6, 78, 59);
        doc.text("SMART PHONG TRO - HOA DON", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`, 105, 30, { align: "center" });
        
        doc.setDrawColor(200);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Phong: ${invoice.contract?.room?.roomNumber}`, 20, 50);
        doc.text(`Khach thue: ${invoice.contract?.tenant?.fullName}`, 20, 60);
        doc.text(`Ky thanh toan: ${new Date(invoice.billingDate).toLocaleDateString('vi-VN')}`, 20, 70);

        const columns = ["Noi dung", "Chi so", "Don gia", "Thanh tien"];
        const rows = [
            ["Tien phong", "-", "-", `${invoice.rentalAmount?.toLocaleString()}d`],
            ["Dien", `${invoice.electricityStart} -> ${invoice.electricityEnd}`, `${invoice.electricityPrice}d`, `${invoice.electricityAmount?.toLocaleString()}d`],
            ["Nuoc", `${invoice.waterStart} -> ${invoice.waterEnd}`, `${invoice.waterPrice}d`, `${invoice.waterAmount?.toLocaleString()}d`],
            ["Dich vu khac", "-", "-", `${invoice.serviceAmount?.toLocaleString()}d`],
        ];

        autoTable(doc, {
            startY: 80,
            head: [columns],
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: [6, 78, 59] },
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(16);
        doc.text(`TONG CONG: ${invoice.totalAmount?.toLocaleString()}d`, 190, finalY, { align: "right" });
        
        doc.setFontSize(12);
        doc.setTextColor(invoice.status === 'PAID' ? [46, 125, 50] : [211, 47, 47]);
        doc.text(`Trang thai: ${invoice.status === 'PAID' ? 'DA THANH TOAN' : 'CHUA THANH TOAN'}`, 190, finalY + 10, { align: "right" });

        return doc.output('blob');
    };

    const sendToTelegram = async (invoice, blob) => {
        const chatId = invoice.contract?.tenant?.telegramChatId;
        if (!chatId) {
            toast.warn("Khách thuê này chưa gắn Telegram Chat ID.");
            return;
        }

        const notifyData = new FormData();
        notifyData.append("chatId", chatId);
        notifyData.append("file", blob, `HoaDon_Phong${invoice.contract?.room?.roomNumber}.pdf`);
        notifyData.append("caption", `🔔 Hóa đơn tiền phòng tháng ${new Date(invoice.billingDate).getMonth()+1}. Tổng cộng: ${invoice.totalAmount?.toLocaleString()}₫`);

        try {
            await api.post("/notifications/telegram/send-pdf", notifyData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.info("Đã gửi thông báo Telegram!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
            try {
                await api.delete(`/invoices/${id}`);
                toast.success("Đã xóa hóa đơn");
                fetchInvoices();
            } catch (error) {
                toast.error("Lỗi khi xóa hóa đơn");
            }
        }
    };

    const exportToPDF = (invoice) => {
        const blob = generatePDFBlob(invoice);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `HoaDon_Phong${invoice.contract?.room?.roomNumber}.pdf`;
        link.click();
        toast.success("Đã xuất file PDF!");
    };

    const handleSubmit = async () => {
        try {
            const eAmount = (formData.electricityEnd - formData.electricityStart) * formData.electricityPrice;
            const wAmount = (formData.waterEnd - formData.waterStart) * formData.waterPrice;
            
            const payload = {
                ...formData,
                electricityAmount: eAmount > 0 ? eAmount : 0,
                waterAmount: wAmount > 0 ? wAmount : 0,
                totalAmount: calculateTotal()
            };

            await api.put(`/invoices/${editingInvoice.id}`, payload);
            toast.success("Cập nhật hóa đơn thành công");
            
            // Auto-send Telegram Notification with PDF
            const blob = generatePDFBlob({ ...editingInvoice, ...payload });
            await sendToTelegram(editingInvoice, blob);

            fetchInvoices();
            handleClose();
        } catch (error) {
            toast.error("Lỗi khi lưu hóa đơn");
        }
    };

    const getStatusChip = (status) => {
        switch (status) {
            case "PAID": return <Chip label="Đã thanh toán" color="success" icon={<CheckCircle />} />;
            case "UNPAID": return <Chip label="Chưa thanh toán" color="warning" icon={<PendingActions />} />;
            case "OVERDUE": return <Chip label="Quá hạn" color="error" icon={<Warning />} />;
            default: return <Chip label={status} />;
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Quản Lý Hóa Đơn
                </Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'primary.main' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white' }}>Phòng</TableCell>
                            <TableCell sx={{ color: 'white' }}>Khách thuê</TableCell>
                            <TableCell sx={{ color: 'white' }}>Ngày hóa đơn</TableCell>
                            <TableCell sx={{ color: 'white' }}>Tổng tiền</TableCell>
                            <TableCell sx={{ color: 'white' }}>Trạng thái</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id} hover>
                                <TableCell fontWeight="bold">Phòng {invoice.contract?.room?.roomNumber}</TableCell>
                                <TableCell>{invoice.contract?.tenant?.fullName}</TableCell>
                                <TableCell>{new Date(invoice.billingDate).toLocaleDateString('vi-VN')}</TableCell>
                                <TableCell color="primary">
                                    <Typography fontWeight="bold" color="primary.main">
                                        {invoice.totalAmount?.toLocaleString('vi-VN')}₫
                                    </Typography>
                                </TableCell>
                                <TableCell>{getStatusChip(invoice.status)}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="secondary" onClick={() => exportToPDF(invoice)}>
                                        <PictureAsPdf />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => handleOpen(invoice)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(invoice.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    Chỉnh sửa hóa đơn - Phòng {editingInvoice?.contract?.room?.roomNumber}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">⚡ Điện</Typography>
                            <Stack spacing={2}>
                                <TextField label="Số cũ" name="electricityStart" type="number" fullWidth value={formData.electricityStart} onChange={handleChange} />
                                <TextField label="Số mới" name="electricityEnd" type="number" fullWidth value={formData.electricityEnd} onChange={handleChange} />
                                <TextField label="Đơn giá điện" name="electricityPrice" type="number" fullWidth value={formData.electricityPrice} onChange={handleChange} />
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">💧 Nước</Typography>
                            <Stack spacing={2}>
                                <TextField label="Số cũ" name="waterStart" type="number" fullWidth value={formData.waterStart} onChange={handleChange} />
                                <TextField label="Số mới" name="waterEnd" type="number" fullWidth value={formData.waterEnd} onChange={handleChange} />
                                <TextField label="Đơn giá nước" name="waterPrice" type="number" fullWidth value={formData.waterPrice} onChange={handleChange} />
                            </Stack>
                        </Grid>
                        
                        <Grid item xs={12}><Divider /></Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">💰 Tiền phòng & Khác</Typography>
                            <Stack spacing={2}>
                                <TextField label="Tiền phòng" name="rentalAmount" type="number" fullWidth value={formData.rentalAmount} onChange={handleChange} />
                                <TextField label="Phí dịch vụ" name="serviceAmount" type="number" fullWidth value={formData.serviceAmount} onChange={handleChange} />
                                <FormControl fullWidth>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <Select name="status" value={formData.status} label="Trạng thái" onChange={handleChange}>
                                        <MenuItem value="UNPAID">Chưa thanh toán</MenuItem>
                                        <MenuItem value="PAID">Đã thanh toán</MenuItem>
                                        <MenuItem value="OVERDUE">Quá hạn</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, bgcolor: '#f0f7ff', height: '100%' }}>
                                <Typography variant="h6" gutterBottom>Tổng kết hóa đơn</Typography>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Tiền điện:</Typography>
                                    <Typography fontWeight="bold">{((formData.electricityEnd - formData.electricityStart) * formData.electricityPrice).toLocaleString()}₫</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography>Tiền nước:</Typography>
                                    <Typography fontWeight="bold">{((formData.waterEnd - formData.waterStart) * formData.waterPrice).toLocaleString()}₫</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Typography>Tiền phòng + Dịch vụ:</Typography>
                                    <Typography fontWeight="bold">{(Number(formData.rentalAmount) + Number(formData.serviceAmount)).toLocaleString()}₫</Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="h5" fontWeight="bold">Tổng cộng:</Typography>
                                    <Typography variant="h5" fontWeight="bold" color="primary">{calculateTotal().toLocaleString()}₫</Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField label="Ghi chú" name="notes" multiline rows={2} fullWidth value={formData.notes} onChange={handleChange} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose}>Đóng</Button>
                    <Button variant="outlined" startIcon={<Download />} color="secondary" onClick={() => exportToPDF({...editingInvoice, ...formData})}>Xuất PDF</Button>
                    <Button variant="contained" color="success" onClick={handleSubmit}>Lưu hóa đơn</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default InvoiceManagement;
