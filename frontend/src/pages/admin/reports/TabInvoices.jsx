import React from "react";
import {
  Paper,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const TabInvoices = ({ reportData }) => {
  return (
    <Paper sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
        📋 Danh sách hóa đơn trong kỳ
      </Typography>
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Hiển thị {reportData.totalInvoices} hóa đơn trong khoảng thời gian đã chọn
      </Alert>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#0f766e" }}>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Mã HD</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Phòng</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Khách thuê</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }} align="right">
                Tổng tiền
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography color="text.secondary">
                  Vui lòng chọn khoảng thời gian để xem chi tiết
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TabInvoices;
