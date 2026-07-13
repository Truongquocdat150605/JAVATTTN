// frontend/src/pages/public/RoomsPage.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import {
  Container, Grid, Typography, Button, Box,
  Alert, Pagination, Stack, } from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { motion } from "framer-motion";
import useDebounce from "../../hooks/useDebounce";
import RoomCard from "../../components/rooms/RoomCard";
import PillFilter from "../../components/common/PillFilter";
import EmptyState from "../../components/common/EmptyState";
import RoomCardSkeleton from "../../components/rooms/RoomCardSkeleton";
import RoomsHero from "../../components/rooms/RoomsHero";

const PRICE_FILTERS = [
  { label: "Tất cả", value: "" },
  { label: "Dưới 2 triệu", value: "2000000" },
  { label: "2 – 5 triệu", value: "5000000" },
  { label: "5 – 10 triệu", value: "10000000" },
  { label: "Trên 10 triệu", value: "99000000" },
];

const AREA_FILTERS = [
  { label: "Tất cả", value: "" },
  { label: "≥ 15m²", value: "15" },
  { label: "≥ 20m²", value: "20" },
  { label: "≥ 30m²", value: "30" },
  { label: "≥ 40m²", value: "40" },
];

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filters, setFilters] = useState({ q: "", maxPrice: "", minArea: "", type: "" });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQ = useDebounce(filters.q, 300);
  const debouncedMaxPrice = useDebounce(filters.maxPrice, 300);
  const debouncedMinArea = useDebounce(filters.minArea, 300);
  const debouncedType = useDebounce(filters.type, 300);

  const itemsPerPage = 9;
  const navigate = useNavigate();
  const location = useLocation();

  const TYPE_FILTERS = useMemo(() => {
    const types = Array.from(new Set(rooms.map(r => r.type).filter(Boolean)));
    return [
      { label: "Tất cả Danh mục", value: "" },
      ...types.map(t => ({ label: t, value: t }))
    ];
  }, [rooms]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword");
    if (keyword) {
      setFilters((prev) => ({ ...prev, q: keyword }));
      setPage(1);
    }
  }, [location.search]);

  useEffect(() => {
    api
      .get("/rooms/available")
      .then((res) => {
        const data = res.data || res;
        setRooms(Array.isArray(data) ? data : []);
      })
      .catch(() => setErrorMsg("Không thể tải danh sách phòng. Vui lòng thử lại sau."))
      .finally(() => setLoading(false));
  }, []);

  const visibleRooms = useMemo(() => {
    const q = (debouncedQ || "").toLowerCase().trim();
    return rooms.filter((r) => {
      const matchQ =
        !q ||
        String(r.roomNumber || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (r.address || "").toLowerCase().includes(q);
      const matchPrice = !debouncedMaxPrice || Number(r.price) <= Number(debouncedMaxPrice);
      const matchArea = !debouncedMinArea || Number(r.area) >= Number(debouncedMinArea);
      const matchType = !debouncedType || r.type === debouncedType;
      return matchQ && matchPrice && matchArea && matchType;
    });
  }, [rooms, debouncedQ, debouncedMaxPrice, debouncedMinArea, debouncedType]);

  useEffect(() => { setPage(1); }, [debouncedQ, debouncedMaxPrice, debouncedMinArea, debouncedType]);

  const totalPages = Math.ceil(visibleRooms.length / itemsPerPage);
  const paginatedRooms = useMemo(
    () => visibleRooms.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [visibleRooms, page]
  );

  const handleRentClick = useCallback((room) => {
    navigate("/booking-form", { state: { roomId: room.id } });
  }, [navigate]);

  const handleViewDetail = useCallback((roomId) => {
    navigate(`/rooms/${roomId}`);
  }, [navigate]);

  const clearFilters = useCallback(() => {
    setFilters({ q: "", maxPrice: "", minArea: "", type: "" });
    setPage(1);
  }, []);

  const hasActiveFilters = filters.q || filters.maxPrice || filters.minArea || filters.type;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#FDFBF7" }}>
      <RoomsHero
        roomsCount={rooms.length}
        searchValue={filters.q}
        onSearchChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {/* FILTER PANEL */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #EAE0D5", py: 3 }}>
          <Container maxWidth="xl">
            <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems={{ md: "flex-end" }} justifyContent="space-between">
              <Stack direction={{ xs: "column", md: "row" }} spacing={4} flexWrap="wrap" useFlexGap>
                <PillFilter
                  label="🏠 Danh mục"
                  options={TYPE_FILTERS}
                  value={filters.type}
                  onChange={(v) => setFilters((p) => ({ ...p, type: v }))}
                />
                <PillFilter
                  label="💰 Giá thuê"
                  options={PRICE_FILTERS}
                  value={filters.maxPrice}
                  onChange={(v) => setFilters((p) => ({ ...p, maxPrice: v }))}
                />
                <PillFilter
                  label="📐 Diện tích tối thiểu"
                  options={AREA_FILTERS}
                  value={filters.minArea}
                  onChange={(v) => setFilters((p) => ({ ...p, minArea: v }))}
                />
              </Stack>
              {hasActiveFilters && (
                <Button
                  startIcon={<ClearAllIcon />}
                  onClick={clearFilters}
                  sx={{ color: "#8B5A2B", fontWeight: 700, textTransform: "none", whiteSpace: "nowrap" }}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </Stack>
          </Container>
        </Box>
      </motion.div>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#3E2A1A">
              {loading ? "Đang tải..." : `${visibleRooms.length} phòng phù hợp`}
            </Typography>
            {hasActiveFilters && !loading && (
              <Typography variant="body2" color="#6E5C4F" mt={0.5}>
                Đang áp dụng bộ lọc •{" "}
                <Box
                  component="span"
                  onClick={clearFilters}
                  sx={{ color: "#8B5A2B", cursor: "pointer", fontWeight: 700, "&:hover": { textDecoration: "underline" } }}
                >
                  Xóa tất cả
                </Box>
              </Typography>
            )}
          </Box>
        </Stack>

        {errorMsg && <Alert severity="error" sx={{ mb: 4, borderRadius: 3, fontWeight: 600 }}>{errorMsg}</Alert>}

        {loading ? (
          <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
            {[...Array(9)].map((_, i) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={i} sx={{ display: "flex" }}>
                <RoomCardSkeleton />
              </Grid>
            ))}
          </Grid>

        ) : visibleRooms.length === 0 ? (
          <EmptyState
            title="Không tìm thấy phòng phù hợp"
            description="Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm"
            buttonText="Xóa bộ lọc"
            onButtonClick={clearFilters}
          />
        ) : (
          <>
            <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
              {paginatedRooms.map((room, idx) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={4}
                  key={room.id}
                  sx={{ display: "flex" }}
                >
                  <RoomCard
                    room={room}
                    index={idx}
                    variant="vertical"
                    onViewDetail={() => handleViewDetail(room.id)}
                    onRentClick={() => handleRentClick(room)}
                  />
                </Grid>
              ))}
            </Grid>


            {totalPages > 1 && (
              <Stack alignItems="center" mt={6}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: "50%", fontWeight: 700,
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                      background: "linear-gradient(135deg, #A06E41, #8B5A2B)",
                      color: "#fff",
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" mt={1.5} fontWeight={600}>
                  Trang {page} / {totalPages} • {visibleRooms.length} phòng
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default RoomsPage;