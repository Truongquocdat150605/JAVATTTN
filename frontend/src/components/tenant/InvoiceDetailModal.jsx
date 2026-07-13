/**
 * @file InvoiceDetailModal.jsx
 * @description Modal hiển thị chi tiết hóa đơn (điện, nước, tiền phòng).
 * @module components/tenant
 */
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, Grid, Typography, Divider, Chip } from "@mui/material";
import { Close as CloseIcon, CheckCircle as CheckCircleIcon, WarningAmber as WarningIcon, Schedule as ScheduleIcon } from "@mui/icons-material";
import { formatVND } from "../../utils/formatVND";

const formatMonth = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${m}/${y}`;
};

const getStatusChip = (status) => {
  if (status === "PAID") return <Chip icon={<CheckCircleIcon />} label="Đã thanh toán" color="success" size="small" />;
  if (status === "UNPAID") return <Chip icon={<ScheduleIcon />} label="Chưa thanh toán" color="warning" size="small" />;
  if (status === "OVERDUE") return <Chip icon={<WarningIcon />} label="Quá hạn" color="error" size="small" />;
  return <Chip label={status || "-"} size="small" />;
};

const asNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const getFixedRoomServices = (invoice) => {
  const services = invoice?.contract?.room?.services;
  if (!Array.isArray(services)) return [];
  return services.filter((svc) => svc?.active !== false && svc.category !== "ELECTRICITY" && svc.category !== "WATER");
};

const InvoiceDetailModal = ({ open, handleClose, selectedInvoice, handleOpenPay }) => {
  const [transactions, setTransactions] = React.useState([]);
  const fixedServices = React.useMemo(() => getFixedRoomServices(selectedInvoice), [selectedInvoice]);
  const fixedServiceTotal = fixedServices.reduce((sum, svc) => sum + asNumber(svc.price), 0);
  const invoiceServiceAmount = asNumber(selectedInvoice?.serviceAmount);
  const serviceTotalDiffers = fixedServices.length > 0 && Math.abs(fixedServiceTotal - invoiceServiceAmount) > 1;

  React.useEffect(() => {
    if (open && selectedInvoice) {
      import("../../services/api").then((module) => {
        module.default.get(`/payments/invoice/${selectedInvoice.id}`)
          .then(res => setTransactions(Array.isArray(res) ? res : (res?.data || [])))
          .catch(err => console.error("Error fetching transactions", err));
      });
    } else {
      setTransactions([]);
    }
  }, [open, selectedInvoice]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Chi tiết hóa đơn #{selectedInvoice?.id}
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {selectedInvoice && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Tháng</Typography>
                <Typography fontWeight={600}>{formatMonth(selectedInvoice.billingDate)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Trạng thái</Typography>
                <Box>{getStatusChip(selectedInvoice.status)}</Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Điện (chỉ số cũ → mới)</Typography>
                <Typography fontWeight={600}>{selectedInvoice.electricityStart} → {selectedInvoice.electricityEnd}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Nước (chỉ số cũ → mới)</Typography>
                <Typography fontWeight={600}>{selectedInvoice.waterStart} → {selectedInvoice.waterEnd}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Tiền điện</Typography>
                <Typography fontWeight={600}>{formatVND(selectedInvoice.electricityAmount)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Tiền nước</Typography>
                <Typography fontWeight={600}>{formatVND(selectedInvoice.waterAmount)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Tiền phòng</Typography>
                <Typography fontWeight={600}>{formatVND(selectedInvoice.rentalAmount)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Phí dịch vụ</Typography>
                <Typography fontWeight={600}>{formatVND(selectedInvoice.serviceAmount)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ p: 1.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                    Chi tiet thanh toan
                  </Typography>
                  <Box sx={{ display: "grid", gap: 0.75 }}>
                    <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <span>Tien phong</span>
                      <strong>{formatVND(selectedInvoice.rentalAmount)}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <span>Dien: {selectedInvoice.electricityStart} - {selectedInvoice.electricityEnd} x {formatVND(selectedInvoice.electricityPrice)}</span>
                      <strong>{formatVND(selectedInvoice.electricityAmount)}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                      <span>Nuoc: {selectedInvoice.waterStart} - {selectedInvoice.waterEnd} x {formatVND(selectedInvoice.waterPrice)}</span>
                      <strong>{formatVND(selectedInvoice.waterAmount)}</strong>
                    </Typography>
                    {fixedServices.length > 0 ? (
                      fixedServices.map((svc) => (
                        <Typography key={svc.id} variant="body2" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                          <span>{svc.name} {svc.unit ? `(${svc.unit})` : ""}</span>
                          <strong>{formatVND(svc.price)}</strong>
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                        <span>Dich vu co dinh</span>
                        <strong>{formatVND(selectedInvoice.serviceAmount)}</strong>
                      </Typography>
                    )}
                  </Box>
                  {serviceTotalDiffers && (
                    <Typography variant="caption" color="warning.main" sx={{ display: "block", mt: 1 }}>
                      Luu y: tong dich vu cua hoa don la {formatVND(selectedInvoice.serviceAmount)}. Danh sach tren la dich vu hien tai cua phong, co the khac neu admin da doi gia/dich vu sau khi tao hoa don.
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Divider sx={{ my: 2, width: "100%" }} />
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tổng cộng:</span>
                  <span style={{ color: "#0f766e", fontWeight: 900 }}>{formatVND(selectedInvoice.totalAmount)}</span>
                </Typography>
              </Grid>

              <Divider sx={{ my: 2, width: "100%" }} />
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="primary" fontWeight={700} sx={{ mb: 1 }}>
                  Lịch sử thanh toán (Transaction Logs)
                </Typography>
                
                {transactions.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", p: 1, bgcolor: "#f8fafc", borderRadius: 2 }}>
                    Chưa có giao dịch nào được ghi nhận cho hóa đơn này.
                  </Typography>
                ) : (
                  transactions.map(tx => (
                    <Box key={tx.id} sx={{ mb: 1, p: 1.5, bgcolor: "#f8fafc", borderRadius: 2, border: "1px dashed #cbd5e1" }}>
                      <Typography variant="body2" fontWeight={600}>
                        Mã GD: #{tx.id} - {tx.method} 
                        {tx.status === "PENDING" && <Chip size="small" label="Đang chờ" color="warning" sx={{ ml: 1, height: 20 }} />}
                        {tx.status === "COMPLETED" && <Chip size="small" label="Thành công" color="success" sx={{ ml: 1, height: 20 }} />}
                        {tx.status === "CANCELLED" && <Chip size="small" label="Đã hủy" color="error" sx={{ ml: 1, height: 20 }} />}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Thời gian tạo: {new Date(tx.createdAt).toLocaleString("vi-VN")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Ghi chú: {tx.notes || "Không có"}
                      </Typography>
                    </Box>
                  ))
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
        {selectedInvoice?.status !== "PAID" && handleOpenPay && (
          <Button variant="contained" onClick={() => { handleClose(); handleOpenPay(selectedInvoice); }}>
            Thanh toán ngay
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InvoiceDetailModal;
