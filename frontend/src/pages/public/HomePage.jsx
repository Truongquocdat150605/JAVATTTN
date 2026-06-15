import React, { useEffect, useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Box, Button, Chip, Container, Skeleton, Stack, Typography,
  Fab, Zoom, useScrollTrigger, IconButton, Paper
} from "@mui/material";
import {
  Search, KeyboardArrowUp, Whatshot, EmojiEmotions, LocationOn, SquareFoot,
  Verified, Security, SupportAgent, Speed, Favorite, FavoriteBorder, Star,
  Apartment, PeopleAlt, DoneAll
} from "@mui/icons-material";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
const IMAGE_BASE = "http://localhost:8082/uploads/";
const getRoomImageUrl = (img) => (img ? `${IMAGE_BASE}${img}` : PLACEHOLDER_IMG);

// ========================
//  Scroll to Top
// ========================
function ScrollTop() {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 300 });
  return (
    <Zoom in={trigger}>
      <Fab onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        size="small"
        sx={{
          position: "fixed", bottom: 32, right: 32,
          background: "linear-gradient(135deg,#14b8a6,#0f766e)", color: "#fff",
          boxShadow: "0 8px 24px rgba(15,118,110,0.4)",
          "&:hover": { transform: "scale(1.1)" }, transition: "transform 0.2s"
        }}>
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
}

// ========================
//  FadeIn khi scroll
// ========================
const FadeIn = ({ children, delay = 0 }) => {
  const ctrl = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  useEffect(() => { if (inView) ctrl.start("visible"); }, [ctrl, inView]);
  return (
    <motion.div ref={ref} animate={ctrl} initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 36 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
      }}>
      {children}
    </motion.div>
  );
};

// ========================
//  Room Card (ngang, có like)
// ========================
const RoomCard = memo(({ room, onViewDetail, index }) => {
  const [liked, setLiked] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: index * 0.08 }}>
      <Box onClick={() => onViewDetail(room.id)} sx={{
        width: 280, flexShrink: 0, borderRadius: "20px", overflow: "hidden",
        bgcolor: "#fff", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
          transform: "translateY(-8px)", boxShadow: "0 24px 48px rgba(15,118,110,0.15)",
          "& .ri": { transform: "scale(1.07)" }, "& .hov": { opacity: 1 }
        },
      }}>
        {/* Ảnh */}
        <Box sx={{ position: "relative", overflow: "hidden", height: 180 }}>
          <img className="ri" src={getRoomImageUrl(room.image)} alt={`Phòng ${room.roomNumber}`} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)" }}
            onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }} />
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", pointerEvents: "none" }} />
          {/* Badge + Like */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ position: "absolute", top: 10, left: 10, right: 10, zIndex: 2 }}>
            <Chip label="✅ Còn phòng" size="small" sx={{ bgcolor: "#10b981", color: "#fff", fontWeight: 700, fontSize: "0.7rem" }} />
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              sx={{ bgcolor: "rgba(255,255,255,0.92)", width: 30, height: 30, "&:hover": { bgcolor: "#fff", transform: "scale(1.15)" }, transition: "all 0.2s" }}>
              {liked ? <Favorite sx={{ fontSize: 15, color: "#ef4444" }} /> : <FavoriteBorder sx={{ fontSize: 15, color: "#cbd5e1" }} />}
            </IconButton>
          </Stack>
          {/* Giá */}
          <Box sx={{ position: "absolute", bottom: 10, left: 12, zIndex: 2 }}>
            <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: "1.05rem", lineHeight: 1 }}>
              {room.price ? new Intl.NumberFormat("vi-VN").format(room.price) + "đ" : "Liên hệ"}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.68rem", fontWeight: 600 }}>/ tháng</Typography>
          </Box>
          {/* Hover overlay */}
          <Box className="hov" sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.18)", opacity: 0, transition: "opacity 0.3s", zIndex: 3 }}>
            <Paper sx={{ bgcolor: "rgba(255,255,255,0.95)", color: "#0f766e", fontWeight: 800, fontSize: "0.85rem", px: 2.5, py: 0.8, borderRadius: "50px", backdropFilter: "blur(8px)" }}>
              Xem chi tiết →
            </Paper>
          </Box>
        </Box>
        {/* Nội dung */}
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.8}>
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>Phòng {room.roomNumber}</Typography>
            <Stack direction="row" alignItems="center" spacing={0.3}>
              <Star sx={{ fontSize: 13, color: "#f59e0b" }} />
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#78716c" }}>4.9</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1.5} mb={1.8}>
            <Box display="flex" alignItems="center" gap={0.4}>
              <SquareFoot sx={{ fontSize: 13, color: "#94a3b8" }} />
              <Typography variant="caption" fontWeight={600} color="text.secondary">{room.area}m²</Typography>
            </Box>
            {room.address && (
              <Box display="flex" alignItems="center" gap={0.4} minWidth={0}>
                <LocationOn sx={{ fontSize: 13, color: "#94a3b8", flexShrink: 0 }} />
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.address}</Typography>
              </Box>
            )}
          </Stack>
          <Button variant="contained" fullWidth component={Link} to="/booking-form" state={{ roomId: room.id }} onClick={(e) => e.stopPropagation()}
            sx={{
              borderRadius: "10px", py: 0.9, fontWeight: 700, textTransform: "none", fontSize: "0.85rem",
              background: "linear-gradient(135deg,#14b8a6,#0f766e)", boxShadow: "0 4px 12px rgba(15,118,110,0.28)",
              "&:hover": { background: "linear-gradient(135deg,#0f766e,#134e4a)", transform: "translateY(-1px)" }, transition: "all 0.25s"
            }}>
            Đăng ký thuê
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
});

// ========================
//  Feature Card (ngang)
// ========================
const FeatureCard = ({ icon, title, desc, gradient, delay }) => (
  <FadeIn delay={delay}>
    <Box sx={{
      minWidth: 220, flex: "1 1 220px", p: 3, borderRadius: "18px", bgcolor: "#fff",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9",
      transition: "all 0.3s",
      "&:hover": { transform: "translateY(-6px)", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", "& .fi": { transform: "scale(1.1) rotate(5deg)" } },
    }}>
      <Box className="fi" sx={{ width: 52, height: 52, borderRadius: "14px", background: gradient, display: "flex", alignItems: "center", justifyContent: "center", mb: 2, transition: "transform 0.3s" }}>
        {icon}
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.8, color: "#0f172a" }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{desc}</Typography>
    </Box>
  </FadeIn>
);

// ========================
//  Hero Section (Tách riêng)
// ========================
const PRICE_FILTERS = [
  { label: "Tất cả", value: "" },
  { label: "< 2 triệu", value: 2000000 },
  { label: "2–5 triệu", value: 5000000 },
  { label: "5–10 triệu", value: 10000000 },
  { label: "> 10 triệu", value: 99000000 },
];

const HeroSection = ({ searchKeyword, setSearchKeyword, onSearch, maxPrice, setMaxPrice }) => (
  <Box sx={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    <Box sx={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=85)", backgroundSize: "cover", backgroundPosition: "center", transform: "scale(1.05)" }} />
    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(15,23,42,0.75) 0%, rgba(15,118,110,0.5) 100%)" }} />
    <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, textAlign: "center", px: { xs: 2, md: 4 } }}>
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Chip label="🏆 Nền tảng quản lý phòng trọ #1 Việt Nam"
          sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700, backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", fontSize: "0.85rem" }} />
        <Typography variant="h1" sx={{ fontWeight: 900, color: "#fff", lineHeight: 1.15, fontSize: { xs: "2.2rem", sm: "3.2rem", md: "4.5rem" }, mb: 2.5, textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
          Tìm Phòng Trọ<br />
          <Box component="span" sx={{ background: "linear-gradient(90deg,#34d399,#a7f3d0)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
            Lý Tưởng Ngay
          </Box>
        </Typography>
        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.82)", mb: 5, fontWeight: 400, maxWidth: 560, mx: "auto", fontSize: { xs: "1rem", md: "1.2rem" }, lineHeight: 1.6 }}>
          Hơn 1.000+ phòng trọ chất lượng cao, thanh toán an toàn, hợp đồng điện tử tiện lợi
        </Typography>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
        <Box sx={{ display: "flex", alignItems: "center", bgcolor: "rgba(255,255,255,0.97)", borderRadius: "60px", p: "6px 6px 6px 22px", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", backdropFilter: "blur(16px)", maxWidth: 620, mx: "auto", flexWrap: { xs: "wrap", sm: "nowrap" } }}>
          <Search sx={{ color: "#94a3b8", mr: 1.5, flexShrink: 0 }} />
          <input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Tìm phòng theo số phòng, khu vực..."
            style={{ border: "none", outline: "none", background: "transparent", flex: 1, fontSize: "0.95rem", color: "#1e293b", fontFamily: "inherit", padding: "8px 0", minWidth: 0 }} />
          <Button onClick={onSearch} variant="contained"
            sx={{ borderRadius: "50px", px: 3.5, py: 1.4, fontWeight: 700, textTransform: "none", fontSize: "0.95rem", flexShrink: 0, background: "linear-gradient(135deg,#14b8a6,#0f766e)", boxShadow: "0 4px 14px rgba(15,118,110,0.4)", "&:hover": { background: "linear-gradient(135deg,#0f766e,#134e4a)", transform: "scale(1.03)" }, transition: "all 0.25s" }}>
            Tìm kiếm
          </Button>
        </Box>
        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" sx={{ mt: 2.5, gap: 1 }}>
          {PRICE_FILTERS.map((f) => (
            <Chip key={f.label} label={f.label} onClick={() => setMaxPrice(f.value)}
              sx={{ cursor: "pointer", fontWeight: 700, fontSize: "0.82rem", bgcolor: maxPrice === f.value ? "#fff" : "rgba(255,255,255,0.18)", color: maxPrice === f.value ? "#0f766e" : "#fff", border: maxPrice === f.value ? "2px solid #0f766e" : "1px solid rgba(255,255,255,0.35)", backdropFilter: "blur(8px)", transition: "all 0.2s", "&:hover": { bgcolor: "rgba(255,255,255,0.35)" } }} />
          ))}
        </Stack>
      </motion.div>
    </Container>
    <Box sx={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
        <Box sx={{ width: 28, height: 46, borderRadius: "14px", border: "2px solid rgba(255,255,255,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", pt: 1 }}>
          <Box sx={{ width: 4, height: 8, borderRadius: 2, bgcolor: "rgba(255,255,255,0.7)" }} />
        </Box>
      </motion.div>
    </Box>
  </Box>
);

// ========================
//  MAIN HomePage
// ========================
const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxPrice, setMaxPrice] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  // Lấy danh sách phòng (chỉ 1 API duy nhất)
  useEffect(() => {
    let mounted = true;
    api.get("/rooms/available")
      .then(res => { if (mounted) setRooms(Array.isArray(res) ? res : []); })
      .catch(err => console.error("Lỗi tải phòng:", err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  // Dữ liệu cho 2 section mới (sort từ rooms)
  const topHotRooms = [...rooms]
    .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
    .slice(0, 3);

  const topPromoRooms = [...rooms]
    .sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
    .slice(0, 3);

  // Lọc (áp dụng cho filter thanh tìm kiếm, nhưng không ảnh hưởng đến 2 section trên)
  const filtered = rooms.filter((r) => {
    const matchPrice = !maxPrice || Number(r.price) <= Number(maxPrice);
    const matchSearch = !searchKeyword || r.roomNumber?.toLowerCase().includes(searchKeyword.toLowerCase()) || r.address?.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchPrice && matchSearch;
  });
  const handleSearch = () => { if (searchKeyword) navigate(`/rooms?keyword=${searchKeyword}`); };

  // Data cho Features
  const features = [
    { icon: <Verified sx={{ color: "#fff", fontSize: 26 }} />, title: "Uy tín & Minh bạch", desc: "Hợp đồng điện tử chữ ký số, giá rõ ràng, không phí ẩn.", gradient: "linear-gradient(135deg,#14b8a6,#0f766e)" },
    { icon: <Security sx={{ color: "#fff", fontSize: 26 }} />, title: "Bảo mật toàn diện", desc: "Thanh toán Stripe & PayOS, mã hóa HTTPS chuẩn ngân hàng.", gradient: "linear-gradient(135deg,#6366f1,#4f46e5)" },
    { icon: <SupportAgent sx={{ color: "#fff", fontSize: 26 }} />, title: "Hỗ trợ 24/7", desc: "Đội ngũ quản lý luôn sẵn sàng qua hệ thống thông báo.", gradient: "linear-gradient(135deg,#f59e0b,#d97706)" },
    { icon: <Speed sx={{ color: "#fff", fontSize: 26 }} />, title: "Xử lý siêu tốc", desc: "Duyệt đơn tự động, hóa đơn tự sinh, tiết kiệm thời gian.", gradient: "linear-gradient(135deg,#ec4899,#be185d)" },
  ];

  const stats = [
    { icon: <Apartment sx={{ color: "#0f766e", fontSize: 28 }} />, value: "1,000+", label: "Phòng trọ" },
    { icon: <PeopleAlt sx={{ color: "#6366f1", fontSize: 28 }} />, value: "500+", label: "Khách hài lòng" },
    { icon: <DoneAll sx={{ color: "#f59e0b", fontSize: 28 }} />, value: "98%", label: "Tỷ lệ hài lòng" },
    { icon: <Star sx={{ color: "#ec4899", fontSize: 28 }} />, value: "4.9 ⭐", label: "Đánh giá TB" },
  ];

  return (
    <>
      {/* Hero Banner */}
      <HeroSection
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onSearch={handleSearch}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      {/* Stats Section */}
      <Box sx={{ bgcolor: "#fff", py: { xs: 5, md: 7 }, borderBottom: "1px solid #f1f5f9" }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-around" alignItems="center" flexWrap="wrap" gap={4}>
            {stats.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Box textAlign="center">
                  <Box sx={{ width: 60, height: 60, borderRadius: "16px", mx: "auto", mb: 1.5, background: "linear-gradient(135deg,#14b8a620,#0f766e20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {s.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>{s.value}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                </Box>
              </FadeIn>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: "#fff", py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          <FadeIn>
            <Box textAlign="center" mb={6}>
              <Typography variant="overline" sx={{ color: "#0f766e", fontWeight: 800, letterSpacing: 2 }}>TẠI SAO CHỌN CHÚNG TÔI?</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mt: 0.5, mb: 1.5 }}>Dịch Vụ Đẳng Cấp</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mx: "auto", lineHeight: 1.8 }}>
                Trải nghiệm thuê phòng hiện đại, an toàn và tiện lợi nhất
              </Typography>
            </Box>
          </FadeIn>
          <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent="center" sx={{ gap: 3 }}>
            {features.map((f, i) => <FeatureCard key={i} {...f} delay={i * 0.1} />)}
          </Stack>
        </Container>
      </Box>

      {/* 🔥 Phòng hot nhất (top 3 giá cao) */}
      <Box sx={{ bgcolor: "#f8fafc", py: { xs: 6, md: 9 } }}>
        <Container maxWidth="xl">
          <FadeIn>
            <Box mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
                🔥 Phòng hot nhất
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                {rooms?.length ? `Có ${rooms.length} phòng` : ""}
              </Typography>
            </Box>
          </FadeIn>
          <Stack direction="row" spacing={2.5} sx={{ overflowX: "auto", pb: 2, scrollSnapType: "x mandatory", "&::-webkit-scrollbar": { height: 6 }, "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "#cbd5e1" } }}>
            {(loading ? Array.from({ length: 3 }) : topHotRooms).map((room, i) => (
              <Box key={room?.id ?? i} sx={{ scrollSnapAlign: "start", minWidth: 280 }}>
                {loading ? (
                  <Box sx={{ width: 280, height: 280, bgcolor: "#fff", borderRadius: "20px", overflow: "hidden" }}>
                    <Skeleton variant="rectangular" height={180} />
                    <Box p={2}><Skeleton width="70%" height={22} /><Skeleton width="40%" /><Skeleton variant="rectangular" height={38} sx={{ borderRadius: 2, mt: 1.5 }} /></Box>
                  </Box>
                ) : (
                  <RoomCard room={room} onViewDetail={(id) => navigate(`/rooms/${id}`)} index={i} />
                )}
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* 🎁 Phòng khuyến mãi (top 3 giá thấp) */}
      <Box sx={{ bgcolor: "#f8fafc", py: { xs: 6, md: 9 }, borderTop: "1px solid #e2e8f0" }}>
        <Container maxWidth="xl">
          <FadeIn>
            <Box mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
                🎁 Phòng khuyến mãi
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                {rooms?.length ? `Có ${rooms.length} phòng` : ""}
              </Typography>
            </Box>
          </FadeIn>
          <Stack direction="row" spacing={2.5} sx={{ overflowX: "auto", pb: 2, scrollSnapType: "x mandatory", "&::-webkit-scrollbar": { height: 6 }, "&::-webkit-scrollbar-thumb": { borderRadius: 3, bgcolor: "#cbd5e1" } }}>
            {(loading ? Array.from({ length: 3 }) : topPromoRooms).map((room, i) => (
              <Box key={room?.id ?? i} sx={{ scrollSnapAlign: "start", minWidth: 280 }}>
                {loading ? (
                  <Box sx={{ width: 280, height: 280, bgcolor: "#fff", borderRadius: "20px", overflow: "hidden" }}>
                    <Skeleton variant="rectangular" height={180} />
                    <Box p={2}><Skeleton width="70%" height={22} /><Skeleton width="40%" /><Skeleton variant="rectangular" height={38} sx={{ borderRadius: 2, mt: 1.5 }} /></Box>
                  </Box>
                ) : (
                  <RoomCard room={room} onViewDetail={(id) => navigate(`/rooms/${id}`)} index={i} />
                )}
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 8, md: 11 }, background: "linear-gradient(135deg,#0f172a 0%,#134e4a 50%,#0f172a 100%)", position: "relative", overflow: "hidden" }}>
        {[{ s: 300, t: -100, r: -50, o: 0.05 }, { s: 200, b: -80, l: -60, o: 0.06 }, { s: 150, t: 30, l: "35%", o: 0.04 }].map((c, i) => (
          <Box key={i} sx={{ position: "absolute", width: c.s, height: c.s, borderRadius: "50%", bgcolor: "#14b8a6", opacity: c.o, top: c.t, right: c.r, bottom: c.b, left: c.l }} />
        ))}
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <FadeIn>
            <Typography variant="overline" sx={{ color: "#34d399", fontWeight: 800, letterSpacing: 2 }}>SẴN SÀNG CHƯA?</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#fff", mt: 1, mb: 2, fontSize: { xs: "1.9rem", md: "2.6rem" } }}>
              Tìm Phòng Của Bạn Ngay Hôm Nay
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.72)", mb: 5, lineHeight: 1.8, maxWidth: 500, mx: "auto" }}>
              Đăng ký miễn phí và trải nghiệm hệ thống quản lý phòng trọ thông minh nhất
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button component={Link} to="/rooms" variant="contained" size="large"
                sx={{ borderRadius: "50px", px: 5, py: 1.6, fontWeight: 700, textTransform: "none", background: "linear-gradient(135deg,#14b8a6,#0f766e)", boxShadow: "0 8px 24px rgba(20,184,166,0.4)", "&:hover": { transform: "translateY(-3px)" }, transition: "all 0.3s" }}>
                🏠 Xem phòng ngay
              </Button>
              <Button component={Link} to="/register" variant="outlined" size="large"
                sx={{ borderRadius: "50px", px: 5, py: 1.6, fontWeight: 700, textTransform: "none", borderColor: "rgba(255,255,255,0.4)", color: "#fff", "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "#fff" } }}>
                Đăng ký miễn phí
              </Button>
            </Stack>
          </FadeIn>
        </Container>
      </Box>

      <ScrollTop />
    </>
  );
};

export default HomePage;