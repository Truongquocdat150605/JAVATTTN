/**
 * @file ContractDialog.jsx
 * @description Dialog duyệt yêu cầu thuê và tạo hợp đồng nhanh.
 * @module pages/admin/requests
 */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Stack,
  Paper,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {object|null} props.selectedRequest
 * @param {object} props.contractForm
 * @param {Function} props.onClose
 * @param {Function} props.onChange
 * @param {Function} props.onSubmit
 */
const ContractDialog = ({ open, selectedRequest, contractForm, onClose, onChange, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          bgcolor: "#0f766e",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
        }}
      >
        Duyệt yêu cầu &amp; Tạo hợp đồng
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {selectedRequest && (
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Thông tin yêu cầu */}
            <Paper sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
              >
                <ViewIcon fontSize="small" /> Thông tin yêu cầu
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Phòng</Typography>
                  <Typography variant="body2" fontWeight={500}>Phòng {selectedRequest.room?.roomNumber}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Giá phòng</Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {new Intl.NumberFormat("vi-VN").format(selectedRequest.room?.price)}₫/tháng
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Khách hàng</Typography>
                  <Typography variant="body2">{selectedRequest.fullName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Số điện thoại</Typography>
                  <Typography variant="body2">{selectedRequest.phone}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Form hợp đồng */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Giá thuê (VNĐ/tháng)"
                  name="rentPrice"
                  type="number"
                  value={contractForm.rentPrice}
                  onChange={onChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tiền cọc (VNĐ)"
                  name="deposit"
                  type="number"
                  value={contractForm.deposit}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  name="startDate"
                  type="date"
                  value={contractForm.startDate}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc (không bắt buộc)"
                  name="endDate"
                  type="date"
                  value={contractForm.endDate}
                  onChange={onChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Alert severity="info">
              <Typography variant="body2" fontWeight={500}>📝 Lưu ý:</Typography>
              <Typography variant="caption" color="text.secondary">
                • Sau khi tạo hợp đồng, hệ thống sẽ tự động tạo hóa đơn hàng tháng<br />
                • Khách thuê sẽ nhận được thông báo về hợp đồng mới
              </Typography>
            </Alert>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          startIcon={<SendIcon />}
          sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
        >
          Duyệt &amp; Tạo hợp đồng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ContractDialog;
