import React, { useEffect, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { formatVND } from "../../utils/formatVND";
import {
  Alert, Box, Button, Card, CardActions, CardContent, CardMedia,
  Container, Grid, MenuItem, Stack, Typography, Select,
  Paper, TextField, InputAdornment, IconButton, Skeleton,
  Chip, Avatar, Rating, Fade, useScrollTrigger,
  Zoom, Fab, Stepper, Step, StepLabel, Dialog,
  DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  SquareFoot as SquareFootIcon,
  AttachMoney as AttachMoneyIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  SupportAgent as SupportAgentIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Star as StarIcon,
  Whatshot as WhatshotIcon,
  EmojiEmotions as EmojiEmotionsIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";
const IMAGE_BASE = "http://localhost:8082/uploads/";

const getRoomImageUrl = (imageFileName) => {
  if (!imageFileName) return PLACEHOLDER_IMG;
  return `${IMAGE_BASE}${imageFileName}`;
};

// Scroll to top button
function ScrollTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Zoom in={trigger}>
      <Fab
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          bgcolor: "#0f766e",
          color: "white",
          "&:hover": { bgcolor: "#0d9488" },
        }}
        size="small"
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
}

// Feature Card
const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Paper
      sx={{
        p: 3,
        textAlign: "center",
        borderRadius: 4,
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          "& .feature-icon": { transform: "scale(1.1)" },
        },
      }}
    >
      <Box
        className="feature-icon"
        sx={{
          width: 70,
          height: 70,
          mx: "auto",
          mb: 2,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0f766e20 0%, #0d948820 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.3s ease",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {desc}
      </Typography>
    </Paper>
  </motion.div>
);

// Room Card Component
const RoomCard = memo(({ room, onViewDetail, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Card sx={{
      borderRadius: "20px",
      height: "100%",
      overflow: "hidden",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative",
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        "& .card-overlay": { opacity: 1 },
        "& .card-image": { transform: "scale(1.05)" },
      },
    }}
    onClick={() => onViewDetail(room.id)}
  >
    <Box sx={{ position: "relative", overflow: "hidden" }}>
      <CardMedia
        className="card-image"
        component="img"
        height="220"
        image={getRoomImageUrl(room.imageFileName)}
        alt={`Phòng ${room.roomNumber}`}
        sx={{ transition: "transform 0.5s ease" }}
      />
      <Box
        className="card-overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "white",
            color: "#0f766e",
            fontWeight: 700,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          Xem chi tiết
        </Button>
      </Box>
      <Chip
        label="Còn phòng"
        size="small"
        sx={{
          position: "absolute",
          top: 12,
          right: 12,
          bgcolor: "#10b981",
          color: "white",
          fontWeight: 600,
          fontSize: "0.7rem",
        }}
      />
    </Box>
    
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="h6" sx={{ fontWeight: 900, fontSize: "1.25rem" }}>
          Phòng {room.roomNumber}
        </Typography>
        <Rating value={4.5} size="small" readOnly precision={0.5} />
      </Stack>
      
      <Stack spacing={1.5} mt={1}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AttachMoneyIcon sx={{ fontSize: 18, color: "#0f766e" }} />
          <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f766e" }}>
            {formatVND(room.price)}
          </Typography>
          <Typography variant="caption" color="text.secondary">/ tháng</Typography>
        </Box>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SquareFootIcon sx={{ fontSize: 18, color: "#94a3b8" }} />
          <Typography variant="body2" color="text.secondary">
            {room.area} m²
          </Typography>
          <Box sx={{ width: 4, height: 4, bgcolor: "#cbd5e1", borderRadius: "50%" }} />
          <Typography variant="body2" color="text.secondary">
            Phòng trọ
          </Typography>
        </Box>
        
        {room.address && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {room.address}
            </Typography>
          </Box>
        )}
      </Stack>
    </CardContent>
    
    <CardActions sx={{ p: 2.5, pt: 0 }}>
      <Button
        fullWidth
        variant="contained"
        component={Link}
        to="/booking-form"
        state={{ roomId: room.id }}
        sx={{
          bgcolor: "#0f766e",
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          py: 1,
          "&:hover": { bgcolor: "#0d9488" },
        }}
      >
        Thuê ngay
      </Button>
    </CardActions>
  </Card>
  </motion.div>
));

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get("/rooms/available");
        if (mounted) setRooms(Array.isArray(res) ? res : []);
      } catch (e) {
        if (mounted) setErrorMsg("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const filteredRooms = rooms.filter((r) => {
    const price = Number(r.price);
    const area = Number(r.area);
    const matchPrice = !maxPrice || price <= Number(maxPrice);
    const matchArea = !minArea || area >= Number(minArea);
    const matchSearch = !searchKeyword ||
      r.roomNumber?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchPrice && matchArea && matchSearch;
  });

  const resetFilters = () => {
    setMaxPrice("");
    setMinArea("");
    setSearchKeyword("");
  };

  const handleViewDetail = (roomId) => {
    navigate(`/rooms?id=${roomId}`);
  };

  const featuredRooms = filteredRooms.slice(0, 6);

  const features = [
    { icon: <VerifiedIcon sx={{ fontSize: 35, color: "#0f766e" }} />, title: "Uy tín hàng đầu", desc: "Cam kết minh bạch, rõ ràng trong mọi giao dịch" },
    { icon: <SecurityIcon sx={{ fontSize: 35, color: "#0f766e" }} />, title: "An toàn & Bảo mật", desc: "Thông tin cá nhân được bảo vệ tuyệt đối" },
    { icon: <SupportAgentIcon sx={{ fontSize: 35, color: "#0f766e" }} />, title: "Hỗ trợ 24/7", desc: "Đội ngũ chăm sóc khách hàng nhiệt tình" },
  ];

  return (
    <>
      {/* Hero Section with Gradient */}
      <Box
        sx={{
          position: "relative",
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1, py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 900,
                color: "white",
                textAlign: "center",
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Tìm Phòng Trọ Lý Tưởng
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255,255,255,0.95)",
                textAlign: "center",
                mb: 5,
                fontWeight: 500,
              }}
            >
              Hơn 1000+ phòng trọ chất lượng với giá tốt nhất
            </Typography>

            {/* Search Box */}
            <Paper
              elevation={0}
              sx={{
                maxWidth: 700,
                mx: "auto",
                p: 1,
                borderRadius: "60px",
                bgcolor: "white",
              }}
            >
              <TextField
                fullWidth
                placeholder="🔍  Nhập tên phòng, địa chỉ hoặc khu vực..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && resetFilters()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "60px",
                    "& fieldset": { border: "none" },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        onClick={() => {}}
                        sx={{
                          borderRadius: "60px",
                          px: 4,
                          py: 1.2,
                          bgcolor: "#0f766e",
                          "&:hover": { bgcolor: "#0d9488" },
                        }}
                      >
                        <SearchIcon /> Tìm kiếm
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>

            {/* Stats */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={4}
              justifyContent="center"
              sx={{ mt: 6 }}
            >
              {[
                { value: "1000+", label: "Phòng trọ" },
                { value: "500+", label: "Khách hàng" },
                { value: "98%", label: "Hài lòng" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: "white" }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              textAlign: "center",
              mb: 2,
              background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Tại Sao Chọn Chúng Tôi?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 6, maxWidth: 600, mx: "auto" }}
          >
            Trải nghiệm dịch vụ chuyên nghiệp và chất lượng hàng đầu
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard {...feature} delay={index * 0.1} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Filter Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 5,
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              🔍 Lọc phòng trọ
            </Typography>
            <Stack direction="row" spacing={2}>
              <Select
                size="small"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                displayEmpty
                sx={{ minWidth: 180, bgcolor: "white", borderRadius: 2 }}
              >
                <MenuItem value="">💰 Tất cả giá</MenuItem>
                <MenuItem value={2000000}>Dưới 2 triệu</MenuItem>
                <MenuItem value={5000000}>2 - 5 triệu</MenuItem>
                <MenuItem value={10000000}>5 - 10 triệu</MenuItem>
                <MenuItem value={15000000}>10 - 15 triệu</MenuItem>
              </Select>
              <Select
                size="small"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                displayEmpty
                sx={{ minWidth: 180, bgcolor: "white", borderRadius: 2 }}
              >
                <MenuItem value="">📏 Tất cả diện tích</MenuItem>
                <MenuItem value={15}>≥ 15 m²</MenuItem>
                <MenuItem value={20}>≥ 20 m²</MenuItem>
                <MenuItem value={30}>≥ 30 m²</MenuItem>
                <MenuItem value={40}>≥ 40 m²</MenuItem>
              </Select>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={resetFilters}
                sx={{ borderColor: "#cbd5e1", color: "#475569", borderRadius: 2 }}
              >
                Đặt lại
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Loading & Error */}
        {loading && (
          <Grid container spacing={3}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
              </Grid>
            ))}
          </Grid>
        )}

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Rooms Grid */}
        {!loading && !errorMsg && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                🏠 Phòng Trọ Nổi Bật
              </Typography>
              <Chip
                icon={<WhatshotIcon />}
                label={`${filteredRooms.length} phòng trọ`}
                sx={{ bgcolor: "#fef3c7", color: "#d97706", fontWeight: 600 }}
              />
            </Box>

            <Grid container spacing={3}>
              {featuredRooms.length > 0 ? (
                featuredRooms.map((room, index) => (
                  <Grid item xs={12} sm={6} md={4} key={room.id}>
                    <RoomCard room={room} onViewDetail={handleViewDetail} index={index} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 6, textAlign: "center", borderRadius: 4 }}>
                    <EmojiEmotionsIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      Không tìm thấy phòng phù hợp
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Hãy thử thay đổi tiêu chí lọc của bạn
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>

            {filteredRooms.length > 6 && (
              <Box sx={{ textAlign: "center", mt: 5 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/rooms")}
                  sx={{
                    bgcolor: "#0f766e",
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#0d9488", transform: "translateY(-2px)" },
                    transition: "all 0.2s",
                  }}
                >
                  Xem tất cả {filteredRooms.length} phòng trọ
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: "#0f172a",
          py: 8,
          mt: 6,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              textAlign: "center",
              color: "white",
              mb: 2,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            Sẵn sàng tìm phòng trọ lý tưởng?
          </Typography>
          <Typography
            variant="body1"
            sx={{ textAlign: "center", color: "rgba(255,255,255,0.8)", mb: 4 }}
          >
            Đăng ký ngay để nhận ưu đãi đặc biệt và cập nhật phòng trọ mới nhất
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenDialog(true)}
              sx={{
                bgcolor: "#0f766e",
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 700,
                "&:hover": { bgcolor: "#0d9488", transform: "translateY(-2px)" },
              }}
            >
              Đăng ký ngay
            </Button>
          </Box>
        </Container>
      </Box>

      <ScrollTop />
    </>
  );
};

export default HomePage;