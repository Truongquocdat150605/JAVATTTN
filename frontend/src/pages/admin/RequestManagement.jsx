/**
 * @file RequestManagement.jsx
 * @description Trang quản lý yêu cầu thuê phòng và tin nhắn liên hệ.
 *              Hỗ trợ realtime qua WebSocket (STOMP/SockJS).
 * @module pages/admin
 */
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
  Tooltip,
  Tabs,
  Tab,
  LinearProgress,
  Badge,
  TablePagination,
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
  Refresh as RefreshIcon,
  AssignmentTurnedIn as ContractIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import api from "../../services/api";
import ContractDialog from "./requests/ContractDialog";
import ContactsTab from "./requests/ContactsTab";
import { paginateRows, sortNewestFirst } from "../../utils/adminListUtils";

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const StatCard = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}>
    {children}
  </Paper>
);

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// ─── Component ───────────────────────────────────────────────────────────────

const RequestManagement = () => {
  const [rentalRequests, setRentalRequests] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [requestPage, setRequestPage] = useState(0);
  const [requestRowsPerPage, setRequestRowsPerPage] = useState(10);

  // Contract dialog state
  const [openContractDialog, setOpenContractDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [contractForm, setContractForm] = useState({
    rentPrice: "",
    deposit: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  // ── WebSocket realtime ──────────────────────────────────────────────────
  useEffect(() => {
    const socket = new SockJS((process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe("/topic/rental-requests", (message) => {
          try {
            const newRequest = JSON.parse(message.body);
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

  // ── Data fetching ───────────────────────────────────────────────────────
  const loadData = async () => {
    try {
      setLoading(true);
      const [rentalRes, contactRes] = await Promise.all([
        api.get("/admin/requests/rental"),
        api.get("/admin/requests/contacts"),
      ]);
      setRentalRequests(Array.isArray(rentalRes) ? rentalRes : []);
      setContacts(Array.isArray(contactRes) ? contactRes : []);
    } catch {
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ── Actions ─────────────────────────────────────────────────────────────
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
    
    // Đồng bộ ngày khách muốn chuyển vào, nếu không có thì lấy ngày hiện tại
    let defaultStartDate = new Date().toISOString().split("T")[0];
    if (request.desiredMoveInDate) {
      try {
        defaultStartDate = new Date(request.desiredMoveInDate).toISOString().split("T")[0];
      } catch (e) {
        // Fallback to today if invalid date
      }
    }

    setContractForm({
      rentPrice: request.room?.price || "",
      deposit: request.room?.price || "", // Mặc định cọc 1 tháng tiền phòng
      startDate: defaultStartDate,
      endDate: "",
    });
    setOpenContractDialog(true);
  };

  const handleCloseContractDialog = () => {
    setOpenContractDialog(false);
    setSelectedRequest(null);
  };

  const handleCreateContract = async () => {
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

  // ── Derived state ────────────────────────────────────────────────────────
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
  const sortedRequests = sortNewestFirst(filteredRequests, ["updatedAt", "lastModifiedDate", "createdAt", "desiredMoveInDate", "id"]);
  const paginatedRequests = paginateRows(sortedRequests, requestPage, requestRowsPerPage);

  useEffect(() => {
    setRequestPage(0);
  }, [tabValue]);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
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
              <PersonAddIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>Quản Lý Yêu Cầu</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Duyệt yêu cầu thuê phòng và quản lý tin nhắn liên hệ
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={loadData}
              sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}
            >
              Làm mới
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <StatCard>
              <Typography variant="h4" fontWeight={900} color="#0f766e">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Tổng yêu cầu</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard sx={{ bgcolor: "#fef3c7" }}>
              <Typography variant="h4" fontWeight={900} color="#f59e0b">{stats.pending}</Typography>
              <Typography variant="body2" color="text.secondary">Chờ duyệt</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard sx={{ bgcolor: "#d1fae5" }}>
              <Typography variant="h4" fontWeight={900} color="#10b981">{stats.approved}</Typography>
              <Typography variant="body2" color="text.secondary">Đã duyệt</Typography>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard sx={{ bgcolor: "#fee2e2" }}>
              <Badge badgeContent={stats.contacts} color="error" sx={{ "& .MuiBadge-badge": { right: -10, top: -5 } }}>
                <Typography variant="h4" fontWeight={900} color="#ef4444">{stats.contacts}</Typography>
              </Badge>
              <Typography variant="body2" color="text.secondary">Tin nhắn liên hệ</Typography>
            </StatCard>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto", overflowY: "visible", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Table sx={{ minWidth: 980 }}>
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
                {sortedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">Không có yêu cầu nào</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRequests.map((req) => (
                    <TableRow key={req.id} hover>
                      <TableCell>#{req.id}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <RoomIcon sx={{ fontSize: 16, color: "#0f766e" }} />
                          <Typography fontWeight={600}>Phòng {req.room?.roomNumber}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "#0f766e" }}>
                            {req.fullName?.charAt(0) || "U"}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={500}>{req.fullName}</Typography>
                            {req.identityNumber && (
                              <Typography variant="caption" color="text.secondary">CCCD: {req.identityNumber}</Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PhoneIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                            <Typography variant="body2">{req.phone}</Typography>
                          </Box>
                          {req.email && (
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <EmailIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                              <Typography variant="body2">{req.email}</Typography>
                            </Box>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {req.desiredMoveInDate ? (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <CalendarIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                            <Typography variant="body2">{formatDate(req.desiredMoveInDate)}</Typography>
                          </Box>
                        ) : "—"}
                      </TableCell>
                      <TableCell>{getStatusChip(req.status)}</TableCell>
                      <TableCell align="center">
                        {req.status === "PENDING" ? (
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Duyệt và tạo hợp đồng">
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<ContractIcon />}
                                onClick={() => handleOpenContractDialog(req)}
                                sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
                              >
                                Duyệt + HĐ
                              </Button>
                            </Tooltip>

                            <Tooltip title="Từ chối">
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<CancelIcon />}
                                onClick={() => updateStatus(req.id, "REJECTED")}
                                sx={{ borderColor: "#ef4444", color: "#ef4444" }}
                              >
                                Từ chối
                              </Button>
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
            <TablePagination
              component="div"
              count={sortedRequests.length}
              page={requestPage}
              onPageChange={(event, newPage) => setRequestPage(newPage)}
              rowsPerPage={requestRowsPerPage}
              onRowsPerPageChange={(event) => {
                setRequestRowsPerPage(parseInt(event.target.value, 10));
                setRequestPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage="Dòng/trang"
            />
          </TableContainer>
        )}

        {/* Contacts Tab */}
        {tabValue === 4 && (
          <ContactsTab contacts={contacts} formatDate={formatDate} />
        )}

        {/* Contract Dialog */}
        <ContractDialog
          open={openContractDialog}
          selectedRequest={selectedRequest}
          contractForm={contractForm}
          onClose={handleCloseContractDialog}
          onChange={(e) => setContractForm({ ...contractForm, [e.target.name]: e.target.value })}
          onSubmit={handleCreateContract}
        />

      </Container>
    </Box>
  );
};

export default RequestManagement;
