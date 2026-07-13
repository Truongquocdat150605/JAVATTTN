/**
 * @file RecentActivities.jsx
 * @description Bảng dữ liệu hiển thị các hợp đồng vừa tạo và yêu cầu thuê mới nhất.
 * @module components/admin
 */
import React from "react";
import { Link } from "react-router-dom";
import { Grid, Paper, Box, Typography, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";

const RecentActivities = ({ recentContracts, recentRequests }) => (
  <Grid container spacing={3}>
    {/* Recent Contracts */}
    <Grid item xs={12} md={6}>
      <Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 3, bgcolor: "#0f766e", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            📄 Hợp đồng gần đây
          </Typography>
          <Button component={Link} to="/admin/contracts" sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
            Xem tất cả
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Khách thuê</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Giá thuê</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Chưa có hợp đồng nào</TableCell>
                </TableRow>
              ) : (
                recentContracts.map((contract) => (
                  <TableRow key={contract.id} hover>
                    <TableCell>{contract.tenant?.fullName}</TableCell>
                    <TableCell>Phòng {contract.room?.roomNumber}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#0f766e" }}>{contract.rentPrice?.toLocaleString("vi-VN")}₫</TableCell>
                    <TableCell>
                      <Chip
                        label={contract.status === "ACTIVE" ? "Hiệu lực" : "Chờ duyệt"}
                        size="small"
                        color={contract.status === "ACTIVE" ? "success" : "warning"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>

    {/* Recent Rental Requests */}
    <Grid item xs={12} md={6}>
      <Paper sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 3, bgcolor: "#f59e0b", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            📋 Yêu cầu thuê mới
          </Typography>
          <Button component={Link} to="/admin/requests" sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
            Xem tất cả
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>SĐT</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">Chưa có yêu cầu nào</TableCell>
                </TableRow>
              ) : (
                recentRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>{request.fullName}</TableCell>
                    <TableCell>Phòng {request.room?.roomNumber}</TableCell>
                    <TableCell>{request.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status === "PENDING" ? "Chờ duyệt" : "Đã xử lý"}
                        size="small"
                        color={request.status === "PENDING" ? "warning" : "success"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  </Grid>
);

export default RecentActivities;
