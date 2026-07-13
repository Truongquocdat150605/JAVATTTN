/**
 * @file InvoiceTable.jsx
 * @description Bảng danh sách các hóa đơn của khách thuê.
 * @module components/tenant
 */
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Tooltip, IconButton, Button, Chip } from "@mui/material";
import { Visibility as VisibilityIcon, Download as DownloadIcon, CheckCircle as CheckCircleIcon, WarningAmber as WarningIcon, Schedule as ScheduleIcon } from "@mui/icons-material";
import { formatVND } from "../../utils/formatVND";

const HEADER_BG = "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)";

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

const getStatusChip = (status) => {
  if (status === "PAID") return <Chip icon={<CheckCircleIcon />} label="Đã thanh toán" color="success" size="small" />;
  if (status === "UNPAID") return <Chip icon={<ScheduleIcon />} label="Chưa thanh toán" color="warning" size="small" />;
  if (status === "OVERDUE") return <Chip icon={<WarningIcon />} label="Quá hạn" color="error" size="small" />;
  return <Chip label={status || "-"} size="small" />;
};

const InvoiceTable = ({ invoices, error, handleViewDetail, handleDownload, handleOpenPay }) => (
  <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, overflow: "hidden" }}>
    <Table>
      <TableHead>
        <TableRow sx={{ background: HEADER_BG }}>
          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Mã HD</TableCell>
          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tháng</TableCell>
          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Điện (kWh)</TableCell>
          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Nước (m³)</TableCell>
          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tiền phòng</TableCell>
          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Tổng tiền</TableCell>
          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Trạng thái</TableCell>
          <TableCell sx={{ color: "#fff", fontWeight: 700 }}>Thao tác</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {error && (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
              <Typography color="error">{error}</Typography>
            </TableCell>
          </TableRow>
        )}
        {!error && invoices.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
              <Typography color="text.secondary">Không có hóa đơn nào.</Typography>
            </TableCell>
          </TableRow>
        )}
        {!error &&
          invoices.map((invoice) => {
            const eStart = asNumber(invoice.electricityStart);
            const eEnd = asNumber(invoice.electricityEnd);
            const wStart = asNumber(invoice.waterStart);
            const wEnd = asNumber(invoice.waterEnd);
            const eUsed = Math.max(0, eEnd - eStart);
            const wUsed = Math.max(0, wEnd - wStart);

            return (
              <TableRow key={invoice.id} hover>
                <TableCell>#{invoice.id}</TableCell>
                <TableCell>{formatMonth(invoice.billingDate)}</TableCell>
                <TableCell>{eUsed}</TableCell>
                <TableCell>{wUsed}</TableCell>
                <TableCell>{formatVND(invoice.rentalAmount)}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#0f766e" }}>{formatVND(invoice.totalAmount)}</TableCell>
                <TableCell>{getStatusChip(invoice.status)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Xem chi tiết">
                      <IconButton size="small" onClick={() => handleViewDetail(invoice)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Tải xuống">
                      <IconButton size="small" onClick={() => handleDownload(invoice)}>
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {invoice.status !== "PAID" && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleOpenPay(invoice)}
                        sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
                      >
                        Thanh toán
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default InvoiceTable;
