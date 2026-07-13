import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tab,
  TablePagination,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Delete,
  Group,
  Person,
  Schedule,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../../services/api";
import { paginateRows, sortNewestFirst } from "../../../utils/adminListUtils";

const NotificationHistory = ({ notifications, users, stats, onDeleteSuccess }) => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleDelete = async (id) => {
    if (!window.confirm("Xoa thong bao?")) return;
    try {
      await api.delete(`/notifications/admin/${id}`);
      toast.success("Da xoa");
      if (onDeleteSuccess) onDeleteSuccess();
    } catch {
      toast.error("Xoa that bai");
    }
  };

  const filtered = notifications.filter((n) => {
    if (tabValue === 0) return true;
    if (tabValue === 1) return n.broadcast;
    if (tabValue === 2) return !n.broadcast;
    return false;
  });
  const sortedNotifications = sortNewestFirst(filtered, ["updatedAt", "lastModifiedDate", "createdAt", "id"]);
  const paginatedNotifications = paginateRows(sortedNotifications, page, rowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [tabValue, notifications]);

  const formatDate = (d) => (d ? new Date(d).toLocaleString("vi-VN") : "-");

  return (
    <Paper sx={{ p: 4, borderRadius: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={800}>
          Lich su thong bao
        </Typography>
        <Badge badgeContent={stats.total} color="primary" />
      </Box>
      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        sx={{ mb: 2 }}
      >
        <Tab label="Tat ca" />
        <Tab label="Gui tat ca" />
        <Tab label="Gui rieng" />
      </Tabs>
      {sortedNotifications.length === 0 ? (
        <Alert severity="info">Chua co thong bao nao</Alert>
      ) : (
        <>
          <Stack spacing={2}>
            {paginatedNotifications.map((n) => (
              <Paper
                key={n.id}
                sx={{
                  p: 3,
                  borderLeft: `4px solid ${n.broadcast ? "#0f766e" : "#f59e0b"}`,
                  transition: "0.2s",
                  "&:hover": { boxShadow: 2 },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      {n.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-wrap", my: 1 }}
                    >
                      {n.content}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ flexWrap: "wrap", gap: 1 }}>
                      <Chip
                        size="small"
                        icon={n.broadcast ? <Group /> : <Person />}
                        label={
                          n.broadcast
                            ? "Tat ca"
                            : `Rieng: ${users.find((u) => u.id === n.targetUserId)?.fullName || n.targetUserId}`
                        }
                      />
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Schedule fontSize="small" />
                        {formatDate(n.createdAt)}
                      </Box>
                      <Chip
                        size="small"
                        icon={<CheckCircle />}
                        label="Da gui"
                        sx={{ bgcolor: "#e8f5e9", color: "#4caf50" }}
                      />
                    </Stack>
                  </Box>
                  <Tooltip title="Xoa">
                    <IconButton color="error" onClick={() => handleDelete(n.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Paper>
            ))}
          </Stack>
          <TablePagination
            component="div"
            count={sortedNotifications.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
            labelRowsPerPage="Dong/trang"
          />
        </>
      )}
    </Paper>
  );
};

export default NotificationHistory;
