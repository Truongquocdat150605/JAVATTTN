import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search,
  Home,
  MeetingRoom,
  Phone,
  Login,
  PersonAdd,
  Dashboard,
  Description,
  Receipt,
  Build,
  Logout,
  AccountCircle,
  Notifications,
  KeyboardArrowDown,
  Favorite,
  History,
  Settings,
  Help,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import api from "../services/api";

const getCurrentUser = () => {
  try {
    let user = JSON.parse(sessionStorage.getItem("user") || "null");
    let role = user?.role || sessionStorage.getItem("role");
    if (!user) {
      user = JSON.parse(localStorage.getItem("user") || "null");
      role = user?.role || localStorage.getItem("role");
    }
    return user ? { ...user, role } : null;
  } catch {
    return null;
  }
};

const Header = () => {
  const [user, setUser] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          const res = await api.get("/notifications/my/unread-count");
          setUnreadCount(res?.count || 0);
        }
      } catch (err) {
        console.error("Lỗi lấy số thông báo:", err);
      }
    };
    fetchUnread();
  }, [user]);

  const isAdmin = user?.role === "ADMIN";
  const isTenant = user?.role === "TENANT";
  const username = user?.fullName || user?.username || "Tài khoản";

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/rooms?keyword=${encodeURIComponent(searchText)}`);
      setSearchText("");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login");
  };

  const mainMenuItems = [
    { label: "Trang chủ", path: "/", icon: <Home /> },
    { label: "Phòng trọ", path: "/rooms", icon: <MeetingRoom /> },
    { label: "Liên hệ", path: "/contact", icon: <Phone /> },
  ];

  const tenantMenuItems = [
    { label: "Hồ sơ của tôi", path: "/tenant/profile", icon: <AccountCircle /> },
    { label: "Hợp đồng của tôi", path: "/my-contracts", icon: <Description /> },
    { label: "Hóa đơn thanh toán", path: "/my-invoices", icon: <Receipt /> },
    { label: "Yêu cầu bảo trì", path: "/my-maintenance", icon: <Build /> },
    { label: "Lịch sử thanh toán", path: "/my-payments", icon: <History /> },
    { label: "Thông báo", path: "/my-notifications", icon: <Notifications /> },
    { label: "Đổi mật khẩu", path: "/change-password", icon: <Settings /> },
  ];

  const userMenuItems = isTenant ? [
    { label: "Tài khoản của tôi", path: "/tenant/profile", icon: <AccountCircle /> },
    { label: "Hợp đồng", path: "/my-contracts", icon: <Description /> },
    { label: "Hóa đơn", path: "/my-invoices", icon: <Receipt /> },
    { label: "Yêu thích", path: "/favorites", icon: <Favorite /> },
    { divider: true },
    { label: "Cài đặt", path: "/settings", icon: <Settings /> },
    { label: "Trợ giúp", path: "/help", icon: <Help /> },
    { divider: true },
    { label: "Đăng xuất", action: logout, icon: <Logout /> },
  ] : isAdmin ? [
    { label: "Quản trị hệ thống", path: "/admin/dashboard", icon: <Dashboard /> },
    { label: "Hồ sơ admin", path: "/admin/profile", icon: <AccountCircle /> },
    { divider: true },
    { label: "Đăng xuất", action: logout, icon: <Logout /> },
  ] : [];

  const drawer = (
    <Box sx={{ width: 280 }} onClick={handleDrawerToggle}>
      <Box sx={{ p: 3, bgcolor: "#0f766e", color: "white" }}>
        <Typography variant="h6" fontWeight={900}>Smart Phòng Trọ</Typography>
        {user && <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>Xin chào, {username}</Typography>}
      </Box>
      <Divider />
      <List sx={{ pt: 2 }}>
        {mainMenuItems.map((item) => (
          <ListItem key={item.label} component={Link} to={item.path} sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItem>
        ))}
        {user && isTenant && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="overline" sx={{ px: 2, color: "#64748b", fontWeight: 700 }}>QUẢN LÝ CÁ NHÂN</Typography>
            {tenantMenuItems.map((item) => (
              <ListItem key={item.label} component={Link} to={item.path} sx={{ py: 1.2 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "0.9rem" }} />
              </ListItem>
            ))}
          </>
        )}
        {user && isAdmin && (
          <ListItem component={Link} to="/admin/dashboard" sx={{ py: 1.5 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><Dashboard /></ListItemIcon>
            <ListItemText primary="Bảng điều khiển" />
          </ListItem>
        )}
        <Divider sx={{ my: 1 }} />
        {!user ? (
          <>
            <ListItem component={Link} to="/login"><ListItemIcon><Login /></ListItemIcon><ListItemText primary="Đăng nhập" /></ListItem>
            <ListItem component={Link} to="/register"><ListItemIcon><PersonAdd /></ListItemIcon><ListItemText primary="Đăng ký" /></ListItem>
          </>
        ) : (
          <ListItem onClick={logout} sx={{ cursor: "pointer", color: "#ef4444" }}>
            <ListItemIcon sx={{ color: "#ef4444" }}><Logout /></ListItemIcon><ListItemText primary="Đăng xuất" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={scrolled ? 8 : 0} sx={{ bgcolor: scrolled ? "rgba(255,255,255,0.98)" : "#ffffff", backdropFilter: scrolled ? "blur(10px)" : "none", borderBottom: `1px solid ${scrolled ? "transparent" : "rgba(0,0,0,0.08)"}` }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton edge="start" onClick={handleDrawerToggle} sx={{ display: { xs: "flex", md: "none" }, mr: 2 }}><MenuIcon /></IconButton>
              <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                <Box sx={{ width: 45, height: 45, borderRadius: 2, background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", display: "flex", alignItems: "center", justifyContent: "center", mr: 1.5, boxShadow: "0 4px 12px rgba(15,118,110,0.25)" }}>
                  <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>SP</Typography>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", letterSpacing: "-0.5px" }}>Smart Phòng Trọ</Typography>
                  <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>Tìm kiếm không gian sống lý tưởng</Typography>
                </Box>
              </Link>
            </Box>

            {!isMobile && (
              <Paper elevation={0} sx={{ width: 400, borderRadius: 3, border: "1px solid #e2e8f0", transition: "all 0.3s ease", "&:hover": { borderColor: "#0f766e", boxShadow: "0 0 0 3px rgba(15,118,110,0.1)" } }}>
                <TextField fullWidth size="small" placeholder="Tìm phòng trọ theo tên, địa chỉ..." value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94a3b8" }} /></InputAdornment>, endAdornment: searchText && <InputAdornment position="end"><IconButton size="small" onClick={() => setSearchText("")}>✕</IconButton></InputAdornment> }} />
              </Paper>
            )}

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              {mainMenuItems.map((item) => (
                <Button key={item.label} component={Link} to={item.path} startIcon={item.icon} sx={{ color: location.pathname === item.path ? "#0f766e" : "#475569", fontWeight: 600, px: 2, py: 1, borderRadius: 2, "&:hover": { color: "#0f766e", bgcolor: "rgba(15,118,110,0.08)" } }}>{item.label}</Button>
              ))}
              {user && isTenant && (
                <IconButton onClick={() => navigate("/my-notifications")} sx={{ color: "#475569", "&:hover": { bgcolor: "rgba(15,118,110,0.08)" } }}>
                  <Badge badgeContent={unreadCount} color="error"><Notifications /></Badge>
                </IconButton>
              )}
              {!user ? (
                <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                  <Button component={Link} to="/login" variant="outlined" startIcon={<Login />} sx={{ borderColor: "#0f766e", color: "#0f766e", fontWeight: 700, borderRadius: 2, px: 3 }}>Đăng nhập</Button>
                  <Button component={Link} to="/register" variant="contained" startIcon={<PersonAdd />} sx={{ bgcolor: "#0f766e", fontWeight: 700, borderRadius: 2, px: 3, "&:hover": { bgcolor: "#0d9488", transform: "translateY(-2px)" }, transition: "all 0.2s" }}>Đăng ký</Button>
                </Box>
              ) : (
                <Box sx={{ ml: 2 }}>
                  <Tooltip title="Tài khoản">
                    <Button onClick={handleOpenUserMenu} sx={{ color: "#475569", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "rgba(15,118,110,0.08)" } }} endIcon={<KeyboardArrowDown />}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#0f766e", mr: 1 }}>{username.charAt(0).toUpperCase()}</Avatar>
                      <Typography sx={{ fontWeight: 600, display: { xs: "none", lg: "block" } }}>{username.length > 15 ? username.substring(0, 15) + "..." : username}</Typography>
                    </Button>
                  </Tooltip>
                  <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} onClick={handleCloseUserMenu} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} PaperProps={{ elevation: 4, sx: { mt: 1.5, minWidth: 240, borderRadius: 2, overflow: "hidden" } }}>
                    {userMenuItems.map((item, index) => {
                      if (item.divider) return <Divider key={index} />;
                      return <MenuItem key={item.label} onClick={item.action || (() => navigate(item.path))} sx={{ py: 1.2, px: 2 }}><ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon><Typography variant="body2" fontWeight={500}>{item.label}</Typography></MenuItem>;
                    })}
                  </Menu>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", md: "none" } }}>{drawer}</Drawer>
    </>
  );
};

export default Header;