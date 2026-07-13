/**
 * @file HomePage.jsx
 * @description Trang chủ chính yếu của ứng dụng. Trang này đóng vai trò như một bộ khung, import và lắp ráp các Component con (Hero, Stats, Services...) từ thư mục src/components/home/.
 * @module pages/public
 */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import HomeScrollTop from "../../components/home/HomeScrollTop";
import HeroSection from "../../components/home/HeroSection";
import CollageSection from "../../components/home/CollageSection";
import StatsSection from "../../components/home/StatsSection";
import ServicesSection from "../../components/home/ServicesSection";
import RoomListSection from "../../components/home/RoomListSection";
import CTABanner from "../../components/home/CTABanner";

const HomePage = () => {
  const [hotRooms, setHotRooms] = useState([]);
  const [newestRooms, setNewestRooms] = useState([]);
  const [loadingHot, setLoadingHot] = useState(true);
  const [loadingNewest, setLoadingNewest] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api
      .get("/rooms/hot")
      .then(res => { if (mounted) setHotRooms(Array.isArray(res) ? res : []); })
      .catch(() => { if (mounted) setHotRooms([]); })
      .finally(() => { if (mounted) setLoadingHot(false); });
    api
      .get("/rooms/newest")
      .then(res => { if (mounted) setNewestRooms(Array.isArray(res) ? res : []); })
      .catch(() => { if (mounted) setNewestRooms([]); })
      .finally(() => { if (mounted) setLoadingNewest(false); });
    return () => { mounted = false; };
  }, []);

  const handleSearch = () => { if (searchKeyword) navigate(`/rooms?keyword=${searchKeyword}`); };

  return (
    <Box sx={{ bgcolor: "#FDFBF7" }}>
      {/* 1. Phần Mở đầu */}
      <HeroSection searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword} onSearch={handleSearch} />

      {/* 2. Hình ghép nghệ thuật */}
      <CollageSection />

      {/* 3. Thống kê ấn tượng */}
      <StatsSection />

      {/* 4. Giới thiệu dịch vụ */}
      <ServicesSection />

      {/* 5. Danh sách Phòng */}
      <Box sx={{ bgcolor: "#FDFBF7", py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={6}>
          <Box component="h2" sx={{ color: "#3E2A1A", m: 0, fontSize: "3rem", fontWeight: 700 }}>
            Góc Nhà Thân Thuộc
          </Box>
        </Box>
        <RoomListSection title="Phòng mới nhất" rooms={newestRooms} loading={loadingNewest} icon="✨" />
        <RoomListSection title="Phòng hot nhất" rooms={hotRooms} loading={loadingHot} icon="🔥" />
      </Box>

      {/* 6. Lời kêu gọi hành động (Call To Action) */}
      <CTABanner />

      {/* Nút cuộn lên đầu trang */}
      <HomeScrollTop />
    </Box>
  );
};

export default HomePage;
