import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  LinearProgress,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp,
  People,
  Home,
  Description,
  Receipt,
  AttachMoney,
  Refresh,
  MeetingRoom,
  EventNote,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  Warning,
  CheckCircle,
  Pending,
  LocalHospital,
  Apartment,
  PersonAdd,
  MonetizationOn,
  ReceiptLong,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import api from "../../services/api";

const COLORS = ["#0f766e", "#0d9488", "#14b8a6", "#5eead4"];
const STATUS_COLORS = {
  AVAILABLE: "#10b981",
  OCCUPIED: "#f59e0b",
  RENTED: "#3b82f6",
  MAINTENANCE: "#ef4444",
};

const StatCard = ({ title, value, icon, color, trend, trendValue, onClick }) => (
  <Card
    sx={{
      borderRadius: 4,
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s ease",
      "&:hover": onClick ? { transform: "translateY(-4px)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } : {},
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, color: color }}>
            {typeof value === "number" && title.includes("doanh thu") ? `${value.toLocaleString("vi-VN")}₫` : value}
          </Typography>
          {trend && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
              {trend === "up" ? <ArrowUpward sx={{ fontSize: 14, color: "#10b981" }} /> : <ArrowDownward sx={{ fontSize: 14, color: "#ef4444" }} />}
              <Typography variant="caption" color={trend === "up" ? "#10b981" : "#ef4444"} fontWeight={600}>
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}15`, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalContracts: 0,
    totalRevenue: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    unpaidInvoices: 0,
    pendingContracts: 0,
    pendingRequests: 0,
    pendingMaintenance: 0,
  });
  const [chartData, setChartData] = useState([]);
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
      const [statsRes, chartRes, contractsRes, requestsRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/finance/report?year=2026"),
        api.get("/contracts").catch(() => []),
        api.get("/admin/requests/rental").catch(() => []),
      ]);

      if (statsRes?.success && statsRes?.data) {
        setStats(statsRes.data);
      }
      if (Array.isArray(chartRes)) {
        setChartData(chartRes);
      }
      if (Array.isArray(contractsRes)) {
        setRecentContracts(contractsRes.slice(0, 5));
      }
      if (Array.isArray(requestsRes)) {
        setRecentRequests(requestsRes.slice(0, 5));
      }
    } catch (error) {
      console.error("Lỗi tải dashboard:", error);
      toast.error("Không thể tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Dữ liệu cho biểu đồ tròn
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
            <StatCard
              title="TỔNG DOANH THU"
              value={stats.totalRevenue}
              icon={<AttachMoney sx={{ fontSize: 28, color: "#10b981" }} />}
              color="#10b981"
              trend="up"
              trendValue="+12.5%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="PHÒNG ĐANG THUÊ"
              value={`${stats.occupiedRooms}/${stats.totalRooms}`}
              icon={<MeetingRoom sx={{ fontSize: 28, color: "#3b82f6" }} />}
              color="#3b82f6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="HÓA ĐƠN CHƯA THU"
              value={stats.unpaidInvoices}
              icon={<ReceiptLong sx={{ fontSize: 28, color: "#f59e0b" }} />}
              color="#f59e0b"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="HỢP ĐỒNG HIỆU LỰC"
              value={stats.totalContracts}
              icon={<Description sx={{ fontSize: 28, color: "#8b5cf6" }} />}
              color="#8b5cf6"
            />
          </Grid>
        </Grid>

        {/* Intro Text for Operations & Pie Chart */}
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
                  <Button variant="contained" component={Link} to="/admin/requests" sx={{ bgcolor: "#f59e0b", "&:hover": { bgcolor: "#d97706" } }}>Duyệt yêu cầu thuê</Button>
                  <Button variant="outlined" component={Link} to="/admin/invoices" sx={{ borderColor: "#0f766e", color: "#0f766e" }}>Thu tiền hóa đơn</Button>
                  <Button variant="outlined" component={Link} to="/admin/reports" sx={{ borderColor: "#8b5cf6", color: "#8b5cf6" }}>Xem báo cáo tài chính</Button>
                </Box>
             </Paper>
          </Grid>

          {/* Room Status Pie Chart */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, borderRadius: 4, height: "100%", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                🏠 Tình trạng phòng
              </Typography>
              <Box sx={{ width: "100%", height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={roomStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {roomStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 2 }}>
                {roomStatusData.map((item, idx) => (
                  <Chip key={idx} label={`${item.name}: ${item.value}`} size="small" sx={{ bgcolor: `${item.color}15`, color: item.color, fontWeight: 600 }} />
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Contracts & Requests */}
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
                  component={Link}
                  to={item.path}
                  fullWidth
                  startIcon={item.icon}
                  sx={{
                    bgcolor: "white",
                    color: item.color,
                    border: `1px solid ${item.color}20`,
                    borderRadius: 3,
                    py: 1.5,
                    justifyContent: "flex-start",
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