import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box, Typography, CircularProgress, Alert,
  Button, Chip, Divider, Grid, Stack, IconButton,
  Skeleton, Tooltip,
} from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  SquareFoot as SquareFootIcon,
  MeetingRoom as MeetingRoomIcon,
  LocationOn as LocationOnIcon,
  Wifi as WifiIcon,
  LocalParking as ParkingIcon,
  AcUnit as AcUnitIcon,
  WaterDrop as WaterIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  StarRate as StarRateIcon,
  Shield as ShieldIcon,
  CalendarMonth as CalendarIcon,
  ElectricBolt as ElectricIcon,
} from "@mui/icons-material";
import api from "../../services/api";
import { motion } from "framer-motion";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85";
const EXTRA_IMGS = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
];
const IMAGE_BASE = "http://localhost:8082/uploads/";
const getRoomImageUrl = (image) => (!image ? PLACEHOLDER_IMG : `${IMAGE_BASE}${image}`);

const DEFAULT_AMENITIES = [
  { icon: <WifiIcon />, label: "Wifi tốc độ cao" },
  { icon: <ParkingIcon />, label: "Chỗ để xe" },
  { icon: <AcUnitIcon />, label: "Điều hòa 2 chiều" },
  { icon: <WaterIcon />, label: "Nước nóng" },
  { icon: <ElectricIcon />, label: "Điện riêng" },
  { icon: <ShieldIcon />, label: "An ninh 24/7" },
];

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/rooms/${id}`)
      .then((res) => setRoom(res.data || res))
      .catch(() => setErrorMsg("Không thể tải thông tin phòng. Vui lòng thử lại."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRentClick = () => navigate("/booking-form", { state: { roomId: room.id } });

  // Loading State
  if (loading) {
    return (
      <Box sx={{ maxWidth: 1120, mx: "auto", px: { xs: 2, md: 4 }, py: 5 }}>
        <Skeleton width={160} height={36} sx={{ mb: 3 }} />
        <Skeleton width="60%" height={48} sx={{ mb: 1 }} />
        <Skeleton width="30%" height={28} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 4, mb: 4 }} />
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            {[1,2,3].map(i => <Skeleton key={i} height={24} sx={{ mb: 1 }} />)}
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (errorMsg || !room) {
    return (
      <Box sx={{ py: 8, px: 2, maxWidth: 800, mx: "auto" }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{errorMsg || "Không tìm thấy phòng."}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/rooms")} sx={{ mt: 2 }}>
          Quay lại danh sách
        </Button>
      </Box>
    );
  }

  const mainImageUrl = imageError ? PLACEHOLDER_IMG : getRoomImageUrl(room.image);
  const allImages = [mainImageUrl, ...EXTRA_IMGS];

  const statusConfig = {
    AVAILABLE: { label: "✅ Còn phòng", color: "#10b981", bg: "#d1fae5" },
    RENTED: { label: "🔴 Đã cho thuê", color: "#64748b", bg: "#f1f5f9" },
    MAINTENANCE: { label: "🔧 Đang bảo trì", color: "#f59e0b", bg: "#fef3c7" },
  };
  const status = statusConfig[room.status] || statusConfig.AVAILABLE;

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", pb: 12 }}>
      <Box sx={{ maxWidth: 1120, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, pt: 4 }}>

        {/* ── BREADCRUMB ── */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/rooms")}
              sx={{
                fontWeight: 700, color: "#475569", textTransform: "none", p: 0,
                "&:hover": { bgcolor: "transparent", color: "#0f766e" },
              }}
            >
              Danh sách phòng
            </Button>
            <Typography color="text.disabled">/</Typography>
            <Typography color="text.secondary" fontWeight={600}>Phòng {room.roomNumber}</Typography>
          </Stack>
        </motion.div>

        {/* ── TITLE ROW ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2} mb={3}>
            <Box>
              <Typography variant="h4" fontWeight={900} sx={{ color: "#0f172a", lineHeight: 1.2, mb: 1.5 }}>
                Phòng Trọ Số {room.roomNumber} — {room.area}m²
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                <Chip
                  label={status.label}
                  size="small"
                  sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700, fontSize: "0.82rem" }}
                />
                <Stack direction="row" alignItems="center" spacing={0.4}>
                  <StarRateIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
                  <Typography fontWeight={700} fontSize="0.9rem">4.9</Typography>
                  <Typography color="text.secondary" fontSize="0.85rem">(12 đánh giá)</Typography>
                </Stack>
                {room.address && (
                  <Stack direction="row" alignItems="center" spacing={0.4}>
                    <LocationOnIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>{room.address}</Typography>
                  </Stack>
                )}
              </Stack>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Chia sẻ">
                <IconButton sx={{ border: "1px solid #e2e8f0", borderRadius: "50%", "&:hover": { bgcolor: "#f8fafc" } }}>
                  <ShareIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={liked ? "Bỏ lưu" : "Lưu phòng"}>
                <IconButton
                  onClick={() => setLiked(!liked)}
                  sx={{ border: "1px solid #e2e8f0", borderRadius: "50%", "&:hover": { bgcolor: "#fff0f0" } }}
                >
                  {liked ? <FavoriteIcon fontSize="small" sx={{ color: "#ef4444" }} /> : <FavoriteBorderIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </motion.div>

        {/* ── GALLERY ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Box sx={{ mb: 6 }}>
            {/* Main + Side grid */}
            <Box sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
              gridTemplateRows: { md: "200px 200px" },
              gap: 1.5,
              borderRadius: "20px",
              overflow: "hidden",
              height: { xs: 260, sm: 340, md: 420 },
            }}>
              {/* Main Image */}
              <Box sx={{ gridRow: { md: "1 / 3" }, position: "relative", overflow: "hidden" }}>
                <img
                  src={allImages[activeImg]}
                  alt={`Phòng ${room.roomNumber}`}
                  onError={() => setImageError(true)}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    transition: "transform 0.5s ease",
                    cursor: "zoom-in",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                {/* Image count badge */}
                <Box sx={{
                  position: "absolute", bottom: 16, right: 16,
                  bgcolor: "rgba(0,0,0,0.6)", color: "#fff",
                  px: 2, py: 0.5, borderRadius: "50px",
                  fontSize: "0.8rem", fontWeight: 700, backdropFilter: "blur(4px)",
                }}>
                  📷 {allImages.length} ảnh
                </Box>
              </Box>

              {/* Side Images (Desktop only) */}
              {EXTRA_IMGS.slice(0, 2).map((img, i) => (
                <Box
                  key={i}
                  onClick={() => setActiveImg(i + 1)}
                  sx={{
                    display: { xs: "none", md: "block" },
                    overflow: "hidden", cursor: "pointer", position: "relative",
                    "&:hover img": { transform: "scale(1.06)" },
                  }}
                >
                  <img
                    src={img}
                    alt={`Chi tiết ${i + 1}`}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Thumbnail strip (Mobile) */}
            <Stack direction="row" spacing={1} mt={1.5} sx={{ display: { xs: "flex", md: "none" }, overflowX: "auto" }}>
              {allImages.map((img, i) => (
                <Box
                  key={i}
                  onClick={() => setActiveImg(i)}
                  sx={{
                    width: 64, height: 64, flexShrink: 0, borderRadius: 2,
                    overflow: "hidden", cursor: "pointer",
                    border: activeImg === i ? "2.5px solid #0f766e" : "2.5px solid transparent",
                    transition: "border-color 0.2s",
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ))}
            </Stack>
          </Box>
        </motion.div>

        {/* ── MAIN CONTENT ── */}
        <Grid container spacing={{ xs: 4, md: 7 }}>
          {/* Left: Info */}
          <Grid item xs={12} md={7} lg={8}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>

              {/* Quick stats bar */}
              <Stack direction="row" spacing={4} sx={{ pb: 4, mb: 4, borderBottom: "1px solid #f1f5f9" }} flexWrap="wrap">
                {[
                  { icon: <MeetingRoomIcon sx={{ color: "#0f766e" }} />, label: `Phòng ${room.roomNumber}` },
                  { icon: <SquareFootIcon sx={{ color: "#0f766e" }} />, label: `${room.area} m²` },
                  { icon: <LocationOnIcon sx={{ color: "#0f766e" }} />, label: room.address || "Vị trí trung tâm" },
                ].map((s, i) => (
                  <Box key={i} display="flex" alignItems="center" gap={1}>
                    {s.icon}
                    <Typography fontWeight={600} color="text.secondary">{s.label}</Typography>
                  </Box>
                ))}
              </Stack>

              {/* Description */}
              <Box sx={{ pb: 4, mb: 4, borderBottom: "1px solid #f1f5f9" }}>
                <Typography variant="h6" fontWeight={800} mb={2} color="#0f172a">
                  Giới thiệu về phòng
                </Typography>
                <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.9, color: "#475569", fontSize: "0.97rem" }}>
                  {room.description ||
                    "Phòng trọ tiện nghi, sạch sẽ, thoáng mát với đầy đủ các tiện ích cơ bản. Khu vực an ninh, bảo vệ 24/7, camera giám sát toàn khu. Gần chợ, trường học, bệnh viện và các tiện ích công cộng. Phù hợp cho sinh viên và người đi làm."}
                </Typography>
              </Box>

              {/* Amenities */}
              <Box sx={{ pb: 4, mb: 4, borderBottom: "1px solid #f1f5f9" }}>
                <Typography variant="h6" fontWeight={800} mb={3} color="#0f172a">
                  Tiện ích nổi bật
                </Typography>
                <Grid container spacing={2}>
                  {(room.services && room.services.length > 0
                    ? room.services.map((s) => ({ icon: <CheckCircleIcon sx={{ color: "#0f766e" }} />, label: s.name }))
                    : DEFAULT_AMENITIES
                  ).map((amenity, i) => (
                    <Grid item xs={6} sm={4} key={i}>
                      <Stack direction="row" alignItems="center" spacing={1.5}
                        sx={{
                          p: 1.5, borderRadius: 2, bgcolor: "#f8fafc",
                          border: "1px solid #f1f5f9",
                          transition: "all 0.2s",
                          "&:hover": { bgcolor: "#f0fdf9", borderColor: "#99f6e4" },
                        }}
                      >
                        <Box sx={{ color: "#0f766e", display: "flex", flexShrink: 0 }}>
                          {React.cloneElement(amenity.icon, { sx: { fontSize: 20, color: "#0f766e" } })}
                        </Box>
                        <Typography variant="body2" fontWeight={600}>{amenity.label}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Pricing Details */}
              <Box>
                <Typography variant="h6" fontWeight={800} mb={3} color="#0f172a">
                  Chi phí hàng tháng
                </Typography>
                <Box sx={{ bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                  {[
                    { label: "Tiền phòng", value: room.price ? new Intl.NumberFormat("vi-VN").format(room.price) + "đ" : "—" },
                    { label: "Tiền điện", value: "Tính theo chỉ số (thực tế)" },
                    { label: "Tiền nước", value: "Tính theo khối (thực tế)" },
                    { label: "Tiền cọc", value: "1 tháng tiền phòng" },
                  ].map((item, i, arr) => (
                    <Box key={i}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2 }}>
                        <Typography color="text.secondary" fontWeight={600}>{item.label}</Typography>
                        <Typography fontWeight={700} color="#0f172a">{item.value}</Typography>
                      </Stack>
                      {i < arr.length - 1 && <Divider sx={{ borderColor: "#f1f5f9" }} />}
                    </Box>
                  ))}
                </Box>
              </Box>

            </motion.div>
          </Grid>

          {/* Right: Booking Card (Sticky) */}
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ position: "sticky", top: 90 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
                <Box sx={{
                  borderRadius: "24px",
                  border: "1.5px solid #e2e8f0",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}>
                  {/* Price header */}
                  <Box sx={{
                    p: 3.5, pb: 3,
                    background: "linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)",
                    borderBottom: "1px solid #e2e8f0",
                  }}>
                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                      <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#0f766e" }}>
                        {room.price ? new Intl.NumberFormat("vi-VN").format(room.price) : "Liên hệ"}
                      </Typography>
                      {room.price && (
                        <Typography color="text.secondary" fontWeight={600} fontSize="1rem">đ/tháng</Typography>
                      )}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                      <StarRateIcon sx={{ color: "#f59e0b", fontSize: 16 }} />
                      <Typography fontWeight={700} fontSize="0.88rem">4.9</Typography>
                      <Typography color="text.secondary" fontSize="0.82rem">· 12 đánh giá</Typography>
                    </Stack>
                  </Box>

                  {/* Details */}
                  <Box sx={{ p: 3 }}>
                    {[
                      { label: "Trạng thái", value: status.label, color: status.color },
                      { label: "Diện tích", value: `${room.area} m²`, color: "#0f172a" },
                      { label: "Tiền cọc", value: "1 tháng tiền phòng", color: "#0f172a" },
                    ].map((row, i, arr) => (
                      <Box key={i}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
                          <Typography color="text.secondary" fontWeight={600} fontSize="0.9rem">{row.label}</Typography>
                          <Typography fontWeight={700} fontSize="0.9rem" color={row.color}>{row.value}</Typography>
                        </Stack>
                        {i < arr.length - 1 && <Divider sx={{ borderColor: "#f8fafc" }} />}
                      </Box>
                    ))}

                    {/* CTA Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleRentClick}
                      disabled={room.status !== "AVAILABLE"}
                      sx={{
                        mt: 2.5, borderRadius: "14px", py: 1.7,
                        fontWeight: 800, fontSize: "1rem", textTransform: "none",
                        background: room.status === "AVAILABLE"
                          ? "linear-gradient(135deg, #14b8a6, #0f766e)"
                          : undefined,
                        boxShadow: room.status === "AVAILABLE" ? "0 8px 24px rgba(15,118,110,0.35)" : "none",
                        "&:hover": {
                          background: "linear-gradient(135deg, #0f766e, #134e4a)",
                          boxShadow: "0 12px 30px rgba(15,118,110,0.45)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.25s",
                      }}
                    >
                      {room.status === "AVAILABLE" ? "🏠 Đăng ký thuê ngay" : "Phòng không còn trống"}
                    </Button>

                    <Typography
                      variant="caption" display="block" textAlign="center"
                      mt={2} color="text.disabled" fontWeight={600}
                    >
                      Bạn sẽ không bị trừ tiền ngay bây giờ
                    </Typography>

                    {/* Trust badges */}
                    <Stack spacing={1.5} mt={3} pt={3} sx={{ borderTop: "1px solid #f1f5f9" }}>
                      {[
                        { icon: "🔒", text: "Thông tin của bạn được bảo mật" },
                        { icon: "📋", text: "Hợp đồng điện tử minh bạch" },
                        { icon: "⚡", text: "Xét duyệt nhanh trong 24h" },
                      ].map((t, i) => (
                        <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                          <Typography fontSize="1rem">{t.icon}</Typography>
                          <Typography variant="body2" color="text.secondary" fontWeight={600}>{t.text}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Box>

                {/* Contact nudge */}
                <Box sx={{
                  mt: 2, p: 2.5, borderRadius: "16px",
                  bgcolor: "#f8fafc", border: "1px solid #f1f5f9",
                  textAlign: "center",
                }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Có câu hỏi? Liên hệ ngay với chúng tôi!
                  </Typography>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="text"
                    sx={{ mt: 0.5, fontWeight: 700, color: "#0f766e", textTransform: "none" }}
                  >
                    Liên hệ hỗ trợ →
                  </Button>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default RoomDetail;