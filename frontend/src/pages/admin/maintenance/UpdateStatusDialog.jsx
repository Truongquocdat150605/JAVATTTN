import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Build as BuildIcon,
  Engineering as EngineeringIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../../services/api";

export const statusConfig = {
  PENDING: {
    label: "Chờ xử lý",
    color: "#f59e0b",
    bgColor: "#fef3c7",
    icon: <PendingIcon />,
    action: "Đang chờ xử lý",
  },
  IN_PROGRESS: {
    label: "Đang sửa chữa",
    color: "#3b82f6",
    bgColor: "#dbeafe",
    icon: <EngineeringIcon />,
    action: "Đang tiến hành sửa chữa",
  },
  RESOLVED: {
    label: "Đã hoàn thành",
    color: "#10b981",
    bgColor: "#d1fae5",
    icon: <CheckCircleIcon />,
    action: "Đã sửa xong",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "#ef4444",
    bgColor: "#fee2e2",
    icon: <CancelIcon />,
    action: "Đã hủy bỏ",
  },
};

const UpdateStatusDialog = ({ open, onClose, issue, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (issue) {
      setStatus(issue.status || "PENDING");
    }
  }, [issue, open]);

  const handleUpdateStatus = async () => {
    if (!issue) return;
    setSubmitting(true);
    try {
      await api.put(`/maintenance/${issue.id}/status?status=${status}`);
      toast.success(`Đã cập nhật trạng thái thành "${statusConfig[status]?.label}"`);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    } finally {
      setSubmitting(false);
    }
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          bgcolor: "#0f766e",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Cập nhật trạng thái bảo trì
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Issue Info */}
          <Paper sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              <BuildIcon fontSize="small" color="primary" />
              Thông tin yêu cầu
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Phòng
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  Phòng {issue.room?.roomNumber}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Khách hàng
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {issue.tenant?.fullName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Nội dung
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {issue.description}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Status Select */}
          <FormControl fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={status}
              label="Trạng thái"
              onChange={(e) => setStatus(e.target.value)}
              disabled={submitting}
            >
              <MenuItem value="PENDING">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PendingIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                  <span>Chờ xử lý</span>
                </Box>
              </MenuItem>
              <MenuItem value="IN_PROGRESS">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EngineeringIcon sx={{ fontSize: 18, color: "#3b82f6" }} />
                  <span>Đang sửa chữa</span>
                </Box>
              </MenuItem>
              <MenuItem value="RESOLVED">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon sx={{ fontSize: 18, color: "#10b981" }} />
                  <span>Đã hoàn thành</span>
                </Box>
              </MenuItem>
              <MenuItem value="CANCELLED">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CancelIcon sx={{ fontSize: 18, color: "#ef4444" }} />
                  <span>Hủy bỏ</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="caption" display="block">
              💡 Sau khi cập nhật trạng thái, hệ thống sẽ thông báo đến khách hàng
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdateStatus}
          startIcon={<DoneAllIcon />}
          disabled={submitting}
          sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusDialog;
