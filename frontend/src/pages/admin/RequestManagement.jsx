import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  LinearProgress,
  CardContent,
  Badge,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  MeetingRoom as RoomIcon,
  CalendarToday as CalendarIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
  AssignmentTurnedIn as ContractIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const getStatusChip = (status) => {
  switch (status) {
    case "APPROVED":
      return <Chip icon={<CheckCircleIcon />} label="Đã duyệt" color="success" size="small" sx={{ fontWeight: 600 }} />;
    case "PENDING":
      return <Chip icon={<PendingIcon />} label="Chờ duyệt" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    case "REJECTED":
      return <Chip icon={<CancelIcon />} label="Từ chối" color="error" size="small" sx={{ fontWeight: 600 }} />;
    default:
      return <Chip label={status || "Chưa xác định"} size="small" />;
  }
};

const AdminCard = ({ children, sx }) => (
  <Paper
    elevation={0}
    sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}
  >
    {children}
  </Paper>
);

const RequestManagement = () => {
  const [rentalRequests, setRentalRequests] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openContractDialog, setOpenContractDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [contractForm, setContractForm] = useState({
    tenantId: "",
    rentPrice: "",
    deposit: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  // WebSocket connection
  useEffect(() => {
    const socket = new SockJS("http://localhost:8082/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe("/topic/rental-requests", (message) => {
          try {
            const newRequest = JSON.parse(message.body);
            // Thêm yêu cầu mới vào đầu danh sách và hiển thị thông báo
            setRentalRequests((prev) => [newRequest, ...prev]);
            toast.info(`📢 Yêu cầu thuê mới từ ${newRequest.fullName} - Phòng ${newRequest.room?.roomNumber}`);
          } catch (err) {
            console.error("Lỗi parse WebSocket message:", err);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Lỗi STOMP:", frame);
      },
    });
    stompClient.activate();
    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rentalRes, contactRes, userRes] = await Promise.all([
        api.get("/admin/requests/rental"),
        api.get("/admin/requests/contacts"),
        api.get("/admin/users"),
      ]);
      setRentalRequests(Array.isArray(rentalRes) ? rentalRes : []);
      setContacts(Array.isArray(contactRes) ? contactRes : []);
      setUsers((Array.isArray(userRes) ? userRes : []).filter((u) => u.role === "TENANT"));
    } catch {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/requests/rental/${id}/status?status=${status}`);
      toast.success(`Đã ${status === "APPROVED" ? "chấp nhận" : "từ chối"} yêu cầu`);
      loadData();
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái");
    }
  };

  const handleOpenContractDialog = (request) => {
    setSelectedRequest(request);
    setContractForm({
      tenantId: "",
      rentPrice: request.room?.price || "",
      deposit: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    });
    setOpenContractDialog(true);
  };

  const handleCloseContractDialog = () => {
    setOpenContractDialog(false);
    setSelectedRequest(null);
  };

  const handleContractChange = (e) => {
    setContractForm({ ...contractForm, [e.target.name]: e.target.value });
  };

  const handleCreateContract = async () => {
    if (!contractForm.tenantId) return toast.error("Vui lòng chọn khách thuê");
    if (!contractForm.rentPrice) return toast.error("Vui lòng nhập giá thuê");
    if (!contractForm.startDate) return toast.error("Vui lòng nhập ngày bắt đầu");

    try {
      const params = new URLSearchParams({
        rentPrice: String(contractForm.rentPrice),
        deposit: String(contractForm.deposit || 0),
        startDate: contractForm.startDate,
      });
      if (contractForm.endDate) params.append("endDate", contractForm.endDate);

      await api.post(
        `/admin/requests/rental/${selectedRequest.id}/approve-and-create-contract?${params.toString()}`
      );
      toast.success("Đã duyệt và tạo hợp đồng thành công!");
      handleCloseContractDialog();
      loadData();
    } catch {
      toast.error("Lỗi khi tạo hợp đồng");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const stats = {
    total: rentalRequests.length,
    pending: rentalRequests.filter((r) => r.status === "PENDING").length,
    approved: rentalRequests.filter((r) => r.status === "APPROVED").length,
    rejected: rentalRequests.filter((r) => r.status === "REJECTED").length,
    contacts: contacts.length,
  };

  const filteredRequests = rentalRequests.filter((req) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return req.status === "PENDING";
    if (tabValue === 2) return req.status === "APPROVED";
    if (tabValue === 3) return req.status === "REJECTED";
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header - giữ nguyên */}
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
              <PersonAddIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>Quản Lý Yêu Cầu</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Duyệt yêu cầu thuê phòng và quản lý tin nhắn liên hệ</Typography>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<RefreshIcon />} onClick={loadData} sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}>Làm mới</Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#0f766e">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Tổng yêu cầu</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fef3c7" }}>
              <Typography variant="h4" fontWeight={900} color="#f59e0b">{stats.pending}</Typography>
              <Typography variant="body2" color="text.secondary">Chờ duyệt</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#d1fae5" }}>
              <Typography variant="h4" fontWeight={900} color="#10b981">{stats.approved}</Typography>
              <Typography variant="body2" color="text.secondary">Đã duyệt</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fee2e2" }}>
              <Badge badgeContent={stats.contacts} color="error" sx={{ "& .MuiBadge-badge": { right: -10, top: -5 } }}>
                <Typography variant="h4" fontWeight={900} color="#ef4444">{stats.contacts}</Typography>
              </Badge>
              <Typography variant="body2" color="text.secondary">Tin nhắn liên hệ</Typography>
            </AdminCard>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto">
            <Tab label="📋 Yêu cầu thuê" />
            <Tab label={`⏳ Chờ duyệt (${stats.pending})`} />
            <Tab label="✅ Đã duyệt" />
            <Tab label="❌ Từ chối" />
            <Tab label={`💬 Tin nhắn liên hệ (${stats.contacts})`} />
          </Tabs>
        </Box>

        {/* Rental Requests Table */}
        {tabValue !== 4 && (
          <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#0f766e" }}>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>Mã</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>Phòng</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>Khách hàng</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>Liên hệ</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày muốn vào</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700 }} align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow><TableCell colSpan={7} align="center"><Typography color="text.secondary">Không có yêu cầu nào</Typography></TableCell></TableRow>
                ) : (
                  filteredRequests.map((req) => (
                    <TableRow key={req.id} hover>
                      <TableCell>#{req.id}</TableCell>
                      <TableCell><Box display="flex" alignItems="center" gap={1}><RoomIcon sx={{ fontSize: 16, color: "#0f766e" }} /><Typography fontWeight={600}>Phòng {req.room?.roomNumber}</Typography></Box></TableCell>
                      <TableCell><Box display="flex" alignItems="center" gap={1}><Avatar sx={{ width: 32, height: 32, bgcolor: "#0f766e" }}>{req.fullName?.charAt(0) || "U"}</Avatar><Box><Typography variant="body2" fontWeight={500}>{req.fullName}</Typography>{req.identityNumber && <Typography variant="caption" color="text.secondary">CCCD: {req.identityNumber}</Typography>}</Box></Box></TableCell>
                      <TableCell><Stack spacing={0.5}><Box display="flex" alignItems="center" gap={0.5}><PhoneIcon sx={{ fontSize: 14, color: "#94a3b8" }} /><Typography variant="body2">{req.phone}</Typography></Box>{req.email && <Box display="flex" alignItems="center" gap={0.5}><EmailIcon sx={{ fontSize: 14, color: "#94a3b8" }} /><Typography variant="body2">{req.email}</Typography></Box>}</Stack></TableCell>
                      <TableCell>{req.desiredMoveInDate ? <Box display="flex" alignItems="center" gap={0.5}><CalendarIcon sx={{ fontSize: 14, color: "#94a3b8" }} /><Typography variant="body2">{formatDate(req.desiredMoveInDate)}</Typography></Box> : "—"}</TableCell>
                      <TableCell>{getStatusChip(req.status)}</TableCell>
                      <TableCell align="center">
                        {req.status === "PENDING" ? (
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Duyệt và tạo hợp đồng">
                              <Button size="small" variant="contained" startIcon={<ContractIcon />} onClick={() => handleOpenContractDialog(req)} sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}>Duyệt + HĐ</Button>
                            </Tooltip>
                            <Tooltip title="Chấp nhận">
                              <Button size="small" variant="outlined" startIcon={<CheckCircleIcon />} onClick={() => updateStatus(req.id, "APPROVED")} sx={{ borderColor: "#10b981", color: "#10b981" }}>Chấp nhận</Button>
                            </Tooltip>
                            <Tooltip title="Từ chối">
                              <Button size="small" variant="outlined" startIcon={<CancelIcon />} onClick={() => updateStatus(req.id, "REJECTED")} sx={{ borderColor: "#ef4444", color: "#ef4444" }}>Từ chối</Button>
                            </Tooltip>
                          </Stack>
                        ) : (
                          <Chip label="Đã xử lý" size="small" variant="outlined" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Contacts Tab (giữ nguyên) */}
        {tabValue === 4 && (
          <Grid container spacing={3}>
            {contacts.length === 0 ? (
              <Grid item xs={12}><Paper sx={{ p: 6, textAlign: "center" }}><Typography color="text.secondary">📭 Chưa có tin nhắn liên hệ nào từ khách hàng.</Typography><Typography variant="caption" display="block" sx={{ mt: 1 }}>Khi khách gửi liên hệ qua trang /contact, tin nhắn sẽ xuất hiện ở đây.</Typography></Paper></Grid>
            ) : (
              contacts.map((contact) => (
                <Grid item xs={12} md={6} key={contact.id}>
                  <AdminCard>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box display="flex" alignItems="center" gap={1.5}><Avatar sx={{ bgcolor: "#0f766e" }}>{contact.fullName?.charAt(0) || "U"}</Avatar><Box><Typography fontWeight={700}>{contact.fullName}</Typography><Box display="flex" alignItems="center" gap={1}><PhoneIcon sx={{ fontSize: 12, color: "#94a3b8" }} /><Typography variant="caption">{contact.phone}</Typography></Box></Box></Box>
                        <Chip label="Mới" size="small" color="error" />
                      </Stack>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{contact.message}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mt={2}>🕐 {formatDate(contact.createdAt)}</Typography>
                    </CardContent>
                  </AdminCard>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Create Contract Dialog (giữ nguyên) */}
        <Dialog open={openContractDialog} onClose={handleCloseContractDialog} fullWidth maxWidth="md">
          <DialogTitle sx={{ bgcolor: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>Duyệt yêu cầu & Tạo hợp đồng<IconButton onClick={handleCloseContractDialog} sx={{ color: "white" }}><CloseIcon /></IconButton></DialogTitle>
          <DialogContent dividers>
            {selectedRequest && (
              <Stack spacing={3}>
                <Paper sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}><ViewIcon fontSize="small" /> Thông tin yêu cầu</Typography>
                  <Grid container spacing={1.5}>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Phòng</Typography><Typography variant="body2" fontWeight={500}>Phòng {selectedRequest.room?.roomNumber}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Giá phòng</Typography><Typography variant="body2" fontWeight={500}>{new Intl.NumberFormat("vi-VN").format(selectedRequest.room?.price)}₫/tháng</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Khách hàng</Typography><Typography variant="body2">{selectedRequest.fullName}</Typography></Grid>
                    <Grid item xs={6}><Typography variant="caption" color="text.secondary">Số điện thoại</Typography><Typography variant="body2">{selectedRequest.phone}</Typography></Grid>
                  </Grid>
                </Paper>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Giá thuê (VNĐ/tháng)" name="rentPrice" type="number" value={contractForm.rentPrice} onChange={handleContractChange} required /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Tiền cọc (VNĐ)" name="deposit" type="number" value={contractForm.deposit} onChange={handleContractChange} /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Ngày bắt đầu" name="startDate" type="date" value={contractForm.startDate} onChange={handleContractChange} InputLabelProps={{ shrink: true }} required /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Ngày kết thúc (không bắt buộc)" name="endDate" type="date" value={contractForm.endDate} onChange={handleContractChange} InputLabelProps={{ shrink: true }} /></Grid>
                </Grid>
                <Alert severity="info"><Typography variant="body2" fontWeight={500}>📝 Lưu ý:</Typography><Typography variant="caption" color="text.secondary">• Sau khi tạo hợp đồng, hệ thống sẽ tự động tạo hóa đơn hàng tháng<br />• Khách thuê sẽ nhận được thông báo về hợp đồng mới</Typography></Alert>
              </Stack>
            )}
          </DialogContent>
          <DialogActions><Button onClick={handleCloseContractDialog}>Hủy</Button><Button variant="contained" onClick={handleCreateContract} startIcon={<SendIcon />} sx={{ bgcolor: "#0f766e" }}>Duyệt & Tạo hợp đồng</Button></DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default RequestManagement;