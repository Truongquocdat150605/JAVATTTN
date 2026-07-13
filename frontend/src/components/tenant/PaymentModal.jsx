/**
 * @file PaymentModal.jsx
 * @description Modal chọn phương thức thanh toán hóa đơn.
 * @module components/tenant
 */
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, Button, CircularProgress } from "@mui/material";
import { CreditCard as CardIcon, AccountBalanceWallet as BankIcon, Payments as CashIcon } from "@mui/icons-material";
import { formatVND } from "../../utils/formatVND";

const PaymentModal = ({ open, handleClose, selectedInvoice, payLoading, handlePay }) => (
  <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ textAlign: "center", fontWeight: 800, color: "#0f766e" }}>
      Chọn Phương Thức Thanh Toán
    </DialogTitle>
    <DialogContent dividers>
      <Box textAlign="center" sx={{ py: 1 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Hóa đơn #{selectedInvoice?.id}
        </Typography>
        <Typography variant="h5" sx={{ color: "#0f766e", fontWeight: 800, mb: 3 }}>
          {formatVND(selectedInvoice?.totalAmount)}
        </Typography>

        {payLoading ? (
          <Box sx={{ py: 3 }}>
            <CircularProgress color="inherit" sx={{ color: "#0f766e" }} />
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Đang khởi tạo giao dịch thanh toán...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => handlePay("stripe")}
              startIcon={<CardIcon />}
              sx={{
                py: 2, borderRadius: 3, borderColor: "#635bff", color: "#635bff",
                fontWeight: 700, textTransform: "none", borderWidth: 2,
                "&:hover": { borderWidth: 2, borderColor: "#4a3df5", bgcolor: "rgba(99, 91, 255, 0.04)", transform: "translateY(-2px)", transition: "all 0.2s" }
              }}
            >
              Thanh toán qua Stripe (Visa/Master)
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => handlePay("payos")}
              startIcon={<BankIcon />}
              sx={{
                py: 2, borderRadius: 3, borderColor: "#0d9488", color: "#0d9488",
                fontWeight: 700, textTransform: "none", borderWidth: 2,
                "&:hover": { borderWidth: 2, borderColor: "#0f766e", bgcolor: "rgba(13, 148, 136, 0.04)", transform: "translateY(-2px)", transition: "all 0.2s" }
              }}
            >
              Thanh toán qua PayOS (VietQR)
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => handlePay("cash")}
              startIcon={<CashIcon />}
              sx={{
                py: 2, borderRadius: 3, borderColor: "#d97706", color: "#b45309",
                fontWeight: 700, textTransform: "none", borderWidth: 2,
                "&:hover": { borderWidth: 2, borderColor: "#b45309", bgcolor: "rgba(217, 119, 6, 0.06)", transform: "translateY(-2px)", transition: "all 0.2s" }
              }}
            >
              Thanh toan tien mat
            </Button>
          </Box>
        )}
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} disabled={payLoading}>Đóng</Button>
    </DialogActions>
  </Dialog>
);

export default PaymentModal;
