/**
 * @file ContractList.jsx
 * @description Trang danh sách hợp đồng (thống kê, bộ lọc, bảng danh sách).
 * @module pages/admin/contracts
 */
import React, { useEffect, useState } from "react";
import { Box, Button, Chip, Container, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, Avatar, Stack, Tabs, Tab, CircularProgress, TablePagination } from "@mui/material";
import { Add, Edit, Delete, HistoryEdu, CheckCircle, Pending, Cancel, Draw as DrawIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { formatVND } from "../../../utils/formatVND";
import ContractSignDialog from "../../../components/contracts/ContractSignDialog";
import { paginateRows, sortNewestFirst } from "../../../utils/adminListUtils";

const getStatusChip = (status) => {
  switch (status) {
    case "ACTIVE": return <Chip icon={<CheckCircle />} label="Hiệu lực" color="success" size="small" sx={{ fontWeight: 600 }} />;
    case "PENDING": return <Chip icon={<Pending />} label="Chờ duyệt" color="warning" size="small" sx={{ fontWeight: 600 }} />;
    case "EXPIRED": return <Chip icon={<Cancel />} label="Hết hạn" color="error" size="small" sx={{ fontWeight: 600 }} />;
    case "TERMINATED": return <Chip icon={<Cancel />} label="Đã chấm dứt" color="default" size="small" />;
    default: return <Chip label={status} size="small" />;
  }
};

const AdminCard = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", ...sx }}>
    {children}
  </Paper>
);

const ContractList = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [signDialog, setSignDialog] = useState({ open: false, contract: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/contracts");
      const data = Array.isArray(res) ? res : (res?.data || res?.content || []);
      setContracts(data);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu hợp đồng");
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
  const sortedContracts = sortNewestFirst(filteredContracts, ["lastModifiedDate", "updatedAt", "createdAt", "startDate", "id"]);
  const paginatedContracts = paginateRows(sortedContracts, page, rowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [tabValue]);

  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === "ACTIVE").length,
    pending: contracts.filter((c) => c.status === "PENDING").length,
    expired: contracts.filter((c) => c.status === "EXPIRED").length,
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
        <Paper sx={{ p: 4, mb: 4, borderRadius: 4, background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HistoryEdu sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>Quản Lý Hợp Đồng</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý tất cả hợp đồng thuê phòng</Typography>
              </Box>
            </Box>
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/admin/contracts/add")} sx={{ bgcolor: "rgba(255,255,255,0.2)", "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } }}>
              Tạo hợp đồng mới
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h3" fontWeight={900} color="#0f766e">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Tổng hợp đồng</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#d1fae5" }}>
              <Typography variant="h3" fontWeight={900} color="#10b981">{stats.active}</Typography>
              <Typography variant="body2" color="text.secondary">Đang hiệu lực</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fef3c7" }}>
              <Typography variant="h3" fontWeight={900} color="#f59e0b">{stats.pending}</Typography>
              <Typography variant="body2" color="text.secondary">Chờ duyệt</Typography>
            </AdminCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <AdminCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fee2e2" }}>
              <Typography variant="h3" fontWeight={900} color="#ef4444">{stats.expired}</Typography>
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
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: "auto", overflowY: "visible", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <Table sx={{ minWidth: 1120 }}>
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
              {sortedContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}><Typography color="text.secondary">Không có hợp đồng nào</Typography></TableCell>
                </TableRow>
              ) : (
                paginatedContracts.map((contract) => (
                  <TableRow key={contract.id} hover>
                    <TableCell>#{contract.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#0f766e" }}>{contract.tenant?.fullName?.charAt(0) || "U"}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{contract.tenant?.fullName}</Typography>
                          <Typography variant="caption" color="text.secondary">{contract.tenant?.phone}</Typography>
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
                          <IconButton size="small" color="primary" onClick={() => navigate(`/admin/contracts/edit/${contract.id}`)}>
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
          <TablePagination
            component="div"
            count={sortedContracts.length}
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

export default ContractList;
