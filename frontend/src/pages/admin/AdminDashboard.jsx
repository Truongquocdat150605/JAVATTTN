/**
 * @file AdminDashboard.jsx
 * @description Trang Bảng điều khiển (Dashboard) dành cho Admin. Hiển thị tổng quan các thống kê, tình trạng phòng và hoạt động gần đây.
 * @module pages/admin
 */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Container, Paper, Typography, Grid, Button, Skeleton } from "@mui/material";
import { MeetingRoom, Description, Receipt, People, AttachMoney, Pending, LocalHospital, EventNote, Apartment, ReceiptLong } from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

import StatCard from "../../components/admin/StatCard";
import DashboardChart from "../../components/admin/DashboardChart";
import RecentActivities from "../../components/admin/RecentActivities";
import { sortNewestFirst } from "../../utils/adminListUtils";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0, totalRooms: 0, totalContracts: 0, totalRevenue: 0,
    availableRooms: 0, occupiedRooms: 0, unpaidInvoices: 0,
    pendingContracts: 0, pendingRequests: 0, pendingMaintenance: 0,
  });
  const [recentContracts, setRecentContracts] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) setCurrentUser(JSON.parse(user));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, contractsRes, requestsRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/contracts").catch(() => []),
        api.get("/admin/requests/rental").catch(() => []),
      ]);

      if (statsRes?.success && statsRes?.data) setStats(statsRes.data);
      if (Array.isArray(contractsRes)) setRecentContracts(sortNewestFirst(contractsRes, ["lastModifiedDate", "updatedAt", "createdAt", "startDate", "id"]).slice(0, 5));
      if (Array.isArray(requestsRes)) setRecentRequests(sortNewestFirst(requestsRes, ["updatedAt", "lastModifiedDate", "createdAt", "desiredMoveInDate", "id"]).slice(0, 5));
    } catch (error) {
      console.error("Lỗi tải dashboard:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  const roomStatusData = [
    { name: "Đã thuê", value: stats.occupiedRooms, color: "#0f766e" },
    { name: "Còn trống", value: stats.availableRooms, color: "#10b981" },
    { name: "Bảo trì", value: stats.totalRooms - stats.occupiedRooms - stats.availableRooms, color: "#ef4444" },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            Bảng điều khiển quản trị
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chào mừng trở lại,{" "}
            <Typography component="span" sx={{ fontWeight: 700, color: "#0f766e" }}>
              {currentUser?.fullName || currentUser?.username || "Admin"}
            </Typography>
            . Dưới đây là tổng quan hệ thống của bạn.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="TỔNG DOANH THU" value={stats.totalRevenue} icon={<AttachMoney sx={{ fontSize: 28, color: "#10b981" }} />} color="#10b981" trend="up" trendValue="+12.5%" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="PHÒNG ĐANG THUÊ" value={`${stats.occupiedRooms}/${stats.totalRooms}`} icon={<MeetingRoom sx={{ fontSize: 28, color: "#3b82f6" }} />} color="#3b82f6" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="HÓA ĐƠN CHƯA THU" value={stats.unpaidInvoices} icon={<ReceiptLong sx={{ fontSize: 28, color: "#f59e0b" }} />} color="#f59e0b" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="HỢP ĐỒNG HIỆU LỰC" value={stats.totalContracts} icon={<Description sx={{ fontSize: 28, color: "#8b5cf6" }} />} color="#8b5cf6" />
          </Grid>
        </Grid>

        {/* Operations & Chart */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
             <Paper sx={{ p: 4, borderRadius: 4, height: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#0f766e" }}>
                  Tổng quan vận hành hôm nay
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", mb: 3 }}>
                  Có <strong style={{color:"#f59e0b"}}>{stats.pendingRequests} yêu cầu thuê mới</strong> đang chờ duyệt, 
                  và <strong style={{color:"#ef4444"}}>{stats.unpaidInvoices} hóa đơn</strong> chưa thu. 
                  Hãy kiểm tra danh sách bên dưới để xử lý kịp thời.
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" component={Link} to="/admin/requests" sx={{ bgcolor: "#f59e0b", "&:hover": { bgcolor: "#d97706" } }}>Duyệt yêu cầu</Button>
                  <Button variant="outlined" component={Link} to="/admin/invoices" sx={{ borderColor: "#0f766e", color: "#0f766e" }}>Thu tiền hóa đơn</Button>
                  <Button variant="outlined" component={Link} to="/admin/reports" sx={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}>Xem báo cáo</Button>
                </Box>
             </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <DashboardChart roomStatusData={roomStatusData} />
          </Grid>
        </Grid>

        {/* Recent Activities */}
        <RecentActivities recentContracts={recentContracts} recentRequests={recentRequests} />

        {/* Quick Actions */}
        <Paper sx={{ p: 4, mt: 4, borderRadius: 4, background: "linear-gradient(135deg, #f0fdf9 0%, #e6f7f5 100%)" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
            <Apartment /> Lối tắt quản trị nhanh
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: <MeetingRoom />, label: "Quản lý phòng", path: "/admin/rooms", color: "#0f766e" },
              { icon: <Description />, label: "Hợp đồng", path: "/admin/contracts", color: "#3b82f6" },
              { icon: <Receipt />, label: "Hóa đơn", path: "/admin/invoices", color: "#f59e0b" },
              { icon: <People />, label: "Khách thuê", path: "/admin/users", color: "#8b5cf6" },
              { icon: <AttachMoney />, label: "Chi phí", path: "/admin/expenses", color: "#ef4444" },
              { icon: <Pending />, label: "Yêu cầu thuê", path: "/admin/requests", color: "#ec4898" },
              { icon: <LocalHospital />, label: "Bảo trì", path: "/admin/maintenance", color: "#14b8a6" },
              { icon: <EventNote />, label: "Báo cáo", path: "/admin/reports", color: "#6366f1" },
            ].map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item.path}>
                <Button
                  component={Link} to={item.path} fullWidth startIcon={item.icon}
                  sx={{
                    bgcolor: "white", color: item.color, border: `1px solid ${item.color}20`,
                    borderRadius: 3, py: 1.5, justifyContent: "flex-start",
                    "&:hover": { bgcolor: `${item.color}10`, transform: "translateX(4px)" },
                    transition: "all 0.2s",
                  }}
                >
                  {item.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
