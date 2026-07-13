import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card as MuiCard,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Button,
  Chip,
  Avatar,
  Tooltip,
  LinearProgress,
  Tabs,
  Tab,
  TablePagination,
} from "@mui/material";
import {
  Build as BuildIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  MeetingRoom as RoomIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../../services/api";
import UpdateStatusDialog, { statusConfig } from "./UpdateStatusDialog";
import { paginateRows, sortNewestFirst } from "../../../utils/adminListUtils";

const getStatusChip = (status) => {
  const config = statusConfig[status] || statusConfig.PENDING;
  return (
    <Chip
      icon={config.icon}
      label={config.label}
      size="small"
      sx={{
        bgcolor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        "& .MuiChip-icon": { color: config.color },
      }}
    />
  );
};

const MaintenanceList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await api.get("/maintenance");
      setIssues(Array.isArray(res) ? res : []);
    } catch (error) {
      toast.error("Lỗi tải danh sách sự cố");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleOpenStatusDialog = (issue) => {
    setSelectedIssue(issue);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIssue(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter issues by tab
  const filteredIssues = issues.filter((issue) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return issue.status === "PENDING";
    if (tabValue === 2) return issue.status === "IN_PROGRESS";
    if (tabValue === 3) return issue.status === "RESOLVED";
    return true;
  });
  const sortedIssues = sortNewestFirst(filteredIssues, ["updatedAt", "lastModifiedDate", "createdAt", "id"]);
  const paginatedIssues = paginateRows(sortedIssues, page, rowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [tabValue]);

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "PENDING").length,
    inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
    resolved: issues.filter((i) => i.status === "RESOLVED").length,
  };

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BuildIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Quản Lý Bảo Trì & Sự Cố
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Theo dõi và xử lý các yêu cầu sửa chữa từ khách thuê
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchIssues}
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
              }}
            >
              Làm mới
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={3}>
            <MuiCard sx={{ borderRadius: 3, textAlign: "center", p: 2 }}>
              <Typography variant="h4" fontWeight={900} color="#0f766e">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng yêu cầu
              </Typography>
            </MuiCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <MuiCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#fef3c7" }}>
              <Typography variant="h4" fontWeight={900} color="#f59e0b">
                {stats.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chờ xử lý
              </Typography>
            </MuiCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <MuiCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#dbeafe" }}>
              <Typography variant="h4" fontWeight={900} color="#3b82f6">
                {stats.inProgress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đang xử lý
              </Typography>
            </MuiCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <MuiCard sx={{ borderRadius: 3, textAlign: "center", p: 2, bgcolor: "#d1fae5" }}>
              <Typography variant="h4" fontWeight={900} color="#10b981">
                {stats.resolved}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hoàn thành
              </Typography>
            </MuiCard>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Tất cả" />
            <Tab label={`Chờ xử lý (${stats.pending})`} />
            <Tab label={`Đang xử lý (${stats.inProgress})`} />
            <Tab label={`Hoàn thành (${stats.resolved})`} />
          </Tabs>
        </Box>

        {/* Issues Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            overflowX: "auto",
            overflowY: "visible",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <Table sx={{ minWidth: 980 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#0f766e" }}>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Mã</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Ngày báo</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Phòng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Khách hàng</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Nội dung sự cố</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 700 }} align="right">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedIssues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <BuildIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 1 }} />
                    <Typography color="text.secondary">Không có yêu cầu bảo trì nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedIssues.map((issue) => (
                  <TableRow key={issue.id} hover>
                    <TableCell>#{issue.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ScheduleIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                        <Typography variant="body2">{formatDate(issue.createdAt)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <RoomIcon sx={{ fontSize: 16, color: "#0f766e" }} />
                        <Typography fontWeight={600}>Phòng {issue.room?.roomNumber}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: "#0f766e",
                            fontSize: "0.875rem",
                          }}
                        >
                          {issue.tenant?.fullName?.charAt(0) || "U"}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {issue.tenant?.fullName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {issue.tenant?.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300, whiteSpace: "normal" }}>
                        {issue.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(issue.status)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Cập nhật trạng thái">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<UpdateIcon />}
                          onClick={() => handleOpenStatusDialog(issue)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            borderColor: "#0f766e",
                            color: "#0f766e",
                            "&:hover": {
                              bgcolor: "rgba(15,118,110,0.08)",
                              borderColor: "#0d9488",
                            },
                          }}
                        >
                          Cập nhật
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedIssues.length}
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

        {/* Update Status Dialog */}
        <UpdateStatusDialog
          open={openDialog}
          onClose={handleCloseDialog}
          issue={selectedIssue}
          onSuccess={fetchIssues}
        />
      </Container>
    </Box>
  );
};

export default MaintenanceList;
