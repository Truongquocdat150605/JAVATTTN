import React, { useEffect, useState } from "react";
import { 
    Container, Paper, Typography, Box, Grid, Card, CardContent, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, 
    DialogActions, Chip, Tabs, Tab, Stack 
} from "@mui/material";
import { 
    PlusCircle, Trash2, Edit3, DollarSign, Tool, 
    Wifi, Trash, Car, Settings, CreditCard
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";

const ExpenseManagement = () => {
    const [tab, setTab] = useState(0);
    const [services, setServices] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [openDialog, setOpenDialog] = useState(false);
    const [type, setType] = useState("SERVICE"); // SERVICE or EXPENSE
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
        category: "Fixed",
        expenseDate: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sRes, eRes] = await Promise.all([
                api.get("/services"),
                api.get("/finance/expenses") 
            ]);
            setServices(sRes || []);
            setExpenses(eRes || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpen = (mode) => {
        setType(mode);
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
        setFormData({ name: "", price: "", description: "", category: "Fixed", expenseDate: new Date().toISOString().split('T')[0] });
    };

    const handleSubmit = async () => {
        try {
            if (type === "SERVICE") {
                await api.post("/services", {
                    name: formData.name,
                    price: formData.price,
                    description: formData.description
                });
                toast.success("Đã thêm dịch vụ mới");
            } else {
                await api.post("/finance/expenses", {
                    description: formData.name,
                    amount: formData.price,
                    expenseDate: formData.expenseDate,
                    category: formData.category
                });
                toast.success("Đã ghi nhận chi phí");
            }
            fetchData();
            handleClose();
        } catch (error) {
            toast.error("Lỗi khi lưu dữ liệu");
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center">
                    <Settings className="mr-2 text-primary" /> Quản Lý Dòng Tiền & Dịch Vụ
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<PlusCircle size={18} />}
                    onClick={() => handleOpen(tab === 0 ? "SERVICE" : "EXPENSE")}
                >
                    {tab === 0 ? "Thêm Dịch vụ" : "Thêm Chi phí"}
                </Button>
            </Box>

            <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
                <Tab label="Danh mục Dịch vụ (Thu)" icon={<Wifi size={18} />} iconPosition="start" />
                <Tab label="Chi phí vận hành (Chi)" icon={<CreditCard size={18} />} iconPosition="start" />
            </Tabs>

            {tab === 0 ? (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell>Tên dịch vụ</TableCell>
                                <TableCell>Giá cố định (VNĐ)</TableCell>
                                <TableCell>Mô tả bài viết</TableCell>
                                <TableCell>Trạng thái</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {services.map((s) => (
                                <TableRow key={s.id} hover>
                                    <TableCell fontWeight="bold">{s.name}</TableCell>
                                    <TableCell>{s.price?.toLocaleString()}₫</TableCell>
                                    <TableCell>{s.description}</TableCell>
                                    <TableCell><Chip label="Đang dùng" color="success" size="small" /></TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary"><Edit3 size={18} /></IconButton>
                                        <IconButton color="error"><Trash2 size={18} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell>Ngày</TableCell>
                                <TableCell>Nội dung chi</TableCell>
                                <TableCell>Phân loại</TableCell>
                                <TableCell>Số tiền (VNĐ)</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((e) => (
                                <TableRow key={e.id} hover>
                                    <TableCell>{e.expenseDate}</TableCell>
                                    <TableCell fontWeight="bold">{e.description}</TableCell>
                                    <TableCell><Chip label={e.category} variant="outlined" size="small" /></TableCell>
                                    <TableCell color="error.main">-{e.amount?.toLocaleString()}₫</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="error"><Trash2 size={18} /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {type === "SERVICE" ? "Cấu hình Dịch vụ mới" : "Ghi nhận Chi phí mới"}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} mt={1}>
                        <TextField 
                            label={type === "SERVICE" ? "Tên dịch vụ" : "Nội dung chi"} 
                            fullWidth 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <TextField 
                            label="Số tiền (VNĐ)" 
                            type="number" 
                            fullWidth 
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                        {type === "EXPENSE" && (
                            <TextField 
                                label="Ngày chi" 
                                type="date" 
                                fullWidth 
                                value={formData.expenseDate}
                                onChange={(e) => setFormData({...formData, expenseDate: e.target.value})}
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                        <TextField 
                            label="Mô tả / Phân loại" 
                            fullWidth 
                            value={type === "SERVICE" ? formData.description : formData.category}
                            onChange={(e) => setFormData({
                                ...formData, 
                                [type === "SERVICE" ? "description" : "category"]: e.target.value
                            })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" onClick={handleSubmit}>Lưu thông tin</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ExpenseManagement;
