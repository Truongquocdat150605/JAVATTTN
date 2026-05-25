import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import api from "../../services/api";
import paymentService from "../../features/payment/paymentService";

const HEADER_BG = "#064e3b";
const FALLBACK_QR_BASE = "http://localhost:8082/api/payments/qr";

const formatMonth = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const y = d.getFullYear();
  return `${m}/${y}`;
};

const asNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const formatMoneyVND = (value) => {
  const n = asNumber(value);
  return `${n.toLocaleString("vi-VN")}₫`;
};

const normalizeQrSrc = ({ qrUrl, qrBase64, invoiceId }) => {
  if (qrBase64) return `data:image/png;base64,${qrBase64}`;
  if (qrUrl) {
    if (typeof qrUrl === "string" && qrUrl.startsWith("http")) return qrUrl;
    if (typeof qrUrl === "string" && qrUrl.startsWith("/")) return `http://localhost:8082${qrUrl}`;
    if (typeof qrUrl === "string" && qrUrl.length > 0) return qrUrl;
  }
  return `${FALLBACK_QR_BASE}/${invoiceId}`;
};

const getStatusChip = (status) => {
  if (status === "PAID") return <Chip label="Đã thanh toán" color="success" size="small" />;
  if (status === "UNPAID") return <Chip label="Chưa thanh toán" color="warning" size="small" />;
  if (status === "OVERDUE") return <Chip label="Quá hạn" color="error" size="small" />;
  return <Chip label={status || "-"} size="small" />;
};

const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openPay, setOpenPay] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [qrSrc, setQrSrc] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");

  const fetchMyInvoices = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/invoices/my");
      setInvoices(Array.isArray(res) ? res : []);
    } catch (e1) {
      try {
        const res2 = await api.get("/tenant/invoices");
        setInvoices(Array.isArray(res2) ? res2 : []);
      } catch (e2) {
        setError("Không thể tải danh sách hóa đơn.");
        setInvoices([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  const rows = useMemo(() => {
    return (Array.isArray(invoices) ? invoices : []).map((i) => {
      const eStart = asNumber(i.electricityStart);
      const eEnd = asNumber(i.electricityEnd);
      const wStart = asNumber(i.waterStart);
      const wEnd = asNumber(i.waterEnd);
      const eUsed = Math.max(0, eEnd - eStart);
      const wUsed = Math.max(0, wEnd - wStart);

      return {
        raw: i,
        id: i.id,
        month: i.month ? String(i.month) : formatMonth(i.billingDate),
        usage: `Điện: ${eUsed} | Nước: ${wUsed}`,
        total: formatMoneyVND(i.totalAmount),
        status: i.status,
      };
    });
  }, [invoices]);

  const handleOpenPay = async (invoice) => {
    setSelectedInvoice(invoice);
    setOpenPay(true);
    setQrLoading(true);
    setQrError("");
    setQrSrc("");

    try {
      const res = await paymentService.createQrForInvoice(invoice.id);
      const src = normalizeQrSrc({ qrUrl: res?.qrUrl || invoice?.qrUrl, qrBase64: res?.qrBase64, invoiceId: invoice.id });
      setQrSrc(src);
    } catch (e) {
      setQrError("Không thể tạo/ tải QR. Vui lòng thử lại.");
      setQrSrc(normalizeQrSrc({ qrUrl: invoice?.qrUrl, invoiceId: invoice.id }));
    } finally {
      setQrLoading(false);
    }
  };

  const handleClosePay = () => {
    setOpenPay(false);
    setSelectedInvoice(null);
    setQrSrc("");
    setQrError("");
    setQrLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Hóa đơn của tôi
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: HEADER_BG }}>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tháng</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Số điện/nước</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tổng tiền</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 700, width: 160 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={26} />
                </TableCell>
              </TableRow>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">Chưa có hóa đơn.</Typography>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              rows.map((r) => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.month}</TableCell>
                  <TableCell>{r.usage}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{r.total}</TableCell>
                  <TableCell>{getStatusChip(r.status)}</TableCell>
                  <TableCell>
                    {r.status === "PAID" ? (
                      <Button variant="outlined" size="small" disabled>
                        Đã thanh toán
                      </Button>
                    ) : (
                      <Button variant="contained" size="small" onClick={() => handleOpenPay(r.raw)} sx={{ backgroundColor: HEADER_BG }}>
                        Thanh toán
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openPay} onClose={handleClosePay} maxWidth="xs" fullWidth>
        <DialogTitle>Thanh toán hóa đơn</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body2" color="text.secondary">
              Hóa đơn #{selectedInvoice?.id || "-"}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
              {formatMoneyVND(selectedInvoice?.totalAmount)}
            </Typography>
          </Box>

          {qrLoading && (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          )}

          {!qrLoading && qrError && (
            <Typography color="error" mb={2}>
              {qrError}
            </Typography>
          )}

          {!qrLoading && qrSrc && (
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Box
                component="img"
                src={qrSrc}
                alt="QR thanh toán"
                sx={{ width: "100%", maxWidth: 320, borderRadius: 2, border: "1px solid #e5e7eb" }}
              />
              <Button href={qrSrc} target="_blank" rel="noreferrer" variant="text">
                Mở ảnh QR
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePay}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyInvoices;
