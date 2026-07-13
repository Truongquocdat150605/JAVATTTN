/**
 * @file RoomDetail.jsx
 * @description Trang chi tiết phòng trọ. Trang này gọi API lấy dữ liệu và hiển thị bằng các Component con từ thư mục src/components/roomDetail/.
 * @module pages/public
 */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Alert, Grid, Stack, Typography, Paper } from "@mui/material";
import { 
  ArrowBack as ArrowBackIcon, 
  Wifi as WifiIcon, 
  LocalParking as ParkingIcon, 
  AcUnit as AcUnitIcon, 
  WaterDrop as WaterIcon, 
  ElectricBolt as ElectricIcon, 
  Shield as ShieldIcon, 
  Payments as PaymentsIcon, 
  WaterDamage as WaterDamageIcon, 
  Security as SecurityIcon 
} from "@mui/icons-material";
import { motion } from "framer-motion";
import api from "../../services/api";

import RoomDetailSkeleton from "../../components/roomDetail/RoomDetailSkeleton";
import RoomHeader from "../../components/roomDetail/RoomHeader";
import RoomGallery from "../../components/roomDetail/RoomGallery";
import RoomAmenities from "../../components/roomDetail/RoomAmenities";
import RoomDescription from "../../components/roomDetail/RoomDescription";
import RoomActionBox from "../../components/roomDetail/RoomActionBox";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=85";
const EXTRA_IMGS = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
];
const IMAGE_BASE = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/uploads/";
const getRoomImageUrl = (image) => (!image ? PLACEHOLDER_IMG : `${IMAGE_BASE}${image}`);

const DEFAULT_AMENITIES = [
  { icon: <WifiIcon />, label: "Wifi tốc độ cao" },
  { icon: <ParkingIcon />, label: "Chỗ để xe" },
  { icon: <AcUnitIcon />, label: "Điều hòa 2 chiều" },
  { icon: <WaterIcon />, label: "Nước nóng" },
  { icon: <ElectricIcon />, label: "Điện riêng" },
  { icon: <ShieldIcon />, label: "An ninh 24/7" },
];

const statusConfig = {
  AVAILABLE: { label: "✅ Còn phòng", color: "#10b981", bg: "#d1fae5" },
  RENTED: { label: "🔴 Đã cho thuê", color: "#64748b", bg: "#f1f5f9" },
  MAINTENANCE: { label: "🔧 Đang bảo trì", color: "#f59e0b", bg: "#fef3c7" },
};

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

  if (loading) return <RoomDetailSkeleton />;

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
  const status = statusConfig[room.status] || statusConfig.AVAILABLE;

  return (
    <Box sx={{ 
      bgcolor: "#fafafa", 
      minHeight: "100vh", 
      pb: 12,
      backgroundImage: "radial-gradient(circle at top right, rgba(15, 118, 110, 0.05), transparent 400px)"
    }}>
      <Box sx={{ maxWidth: 1120, mx: "auto", px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 2, md: 4 } }}>
        
        {/* BREADCRUMB */}
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={3}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/rooms")}
              sx={{ 
                fontWeight: 600, 
                color: "#64748b", 
                textTransform: "none", 
                p: "6px 12px", 
                borderRadius: "8px",
                "&:hover": { bgcolor: "#f1f5f9", color: "#0f766e" } 
              }}
            >
              Danh sách phòng
            </Button>
            <Typography color="text.disabled" sx={{ mx: 1 }}>/</Typography>
            <Typography color="#0f766e" fontWeight={600} sx={{
              bgcolor: "rgba(15, 118, 110, 0.1)",
              px: 1.5, py: 0.5, borderRadius: "6px", fontSize: "0.875rem"
            }}>Phòng {room.roomNumber}</Typography>
          </Stack>
        </motion.div>

        {/* HEADER */}
        <RoomHeader room={room} status={status} liked={liked} setLiked={setLiked} />

        {/* GALLERY */}
        <RoomGallery allImages={allImages} activeImg={activeImg} setActiveImg={setActiveImg} setImageError={setImageError} room={room} />

        {/* MAIN CONTENT */}
        <Grid container spacing={{ xs: 4, md: 5 }}>
          
          {/* Left: Info */}
          <Grid item xs={12} md={7} lg={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", mb: 4, border: "1px solid #e2e8f0" }}>
                <RoomDescription room={room} />
              </Paper>
              
              <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: "24px", mb: 4, border: "1px solid #e2e8f0" }}>
                <RoomAmenities services={room.services} defaultAmenities={DEFAULT_AMENITIES} />
              </Paper>
              
              {/* Pricing Details */}
              <Paper elevation={0} sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: "24px", 
                border: "1px solid #e2e8f0",
                background: "linear-gradient(145deg, #ffffff, #f8fafc)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)"
              }}>
                <Typography variant="h5" fontWeight={800} mb={3} color="#0f172a" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentsIcon sx={{ color: '#0f766e' }} /> Chi phí hàng tháng
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { label: "Tiền phòng", value: room.price ? new Intl.NumberFormat("vi-VN").format(room.price) + "đ" : "—", icon: <PaymentsIcon color="primary" />, desc: "Thanh toán mỗi tháng" },
                    { label: "Tiền điện", value: "Tính theo chỉ số", icon: <ElectricIcon color="warning" />, desc: "Giá nhà nước / KWh" },
                    { label: "Tiền nước", value: "Tính theo khối", icon: <WaterDamageIcon color="info" />, desc: "Hoặc theo người (thực tế)" },
                    { label: "Tiền cọc", value: "1 tháng", icon: <SecurityIcon color="success" />, desc: "Hoàn trả khi hết HĐ" },
                  ].map((item, i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <Box sx={{ 
                        display: 'flex', alignItems: 'flex-start', p: 2, 
                        bgcolor: "#fff", borderRadius: "16px", 
                        border: "1px solid #f1f5f9",
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: "#cbd5e1", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }
                      }}>
                        <Box sx={{ 
                          p: 1.5, borderRadius: "12px", 
                          bgcolor: `${item.icon.props.color}.light`, 
                          color: `${item.icon.props.color}.main`,
                          mr: 2, display: 'flex', opacity: 0.8
                        }}>
                          {React.cloneElement(item.icon, { sx: { fontSize: 24 } })}
                        </Box>
                        <Box>
                          <Typography color="text.secondary" fontSize="0.875rem" fontWeight={500} mb={0.5}>{item.label}</Typography>
                          <Typography fontWeight={700} color="#0f172a" fontSize="1.1rem">{item.value}</Typography>
                          <Typography color="text.disabled" fontSize="0.75rem" mt={0.5}>{item.desc}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* Right: Booking Card (Sticky) */}
          <Grid item xs={12} md={5} lg={4}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <RoomActionBox room={room} status={status} handleRentClick={handleRentClick} />
            </Box>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default RoomDetail;