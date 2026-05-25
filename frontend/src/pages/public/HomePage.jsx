import React, { useEffect, useMemo, useState, memo } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { formatVND } from "../../utils/formatVND";
import {
  Alert, Box, Button, Card, CardActions, CardContent, CardMedia,
  Container, Grid, LinearProgress, MenuItem, Stack, Typography, Select
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

const PLACEHOLDER_IMG = "https://via.placeholder.com/600x400?text=No+Image";
const IMAGE_BASE = "http://localhost:8082/uploads/";

const getRoomImageUrl = (imageFileName) => {
  if (!imageFileName) return PLACEHOLDER_IMG;
  return `${IMAGE_BASE}${imageFileName}`;
};

// Memoized RoomCard để tối ưu performance
const RoomCard = memo(({ room }) => {
  const [imgSrc, setImgSrc] = useState(getRoomImageUrl(room.imageFileName));

  return (
    <Card sx={{ borderRadius: "16px", height: "100%", boxShadow: "0 10px 30px rgba(15,23,42,0.08)", border: "1px solid rgba(148,163,184,0.35)", overflow: "hidden" }}>
      <CardMedia 
        component="img" height="160" image={imgSrc} alt={`Phòng ${room.roomNumber}`}
        onError={() => setImgSrc(PLACEHOLDER_IMG)} 
      />
      <CardContent sx={{ padding: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>Phòng {room.roomNumber}</Typography>
        <Typography sx={{ mt: 0.75, color: "text.secondary", fontWeight: 700 }}>Giá: {formatVND(room.price)}</Typography>
        <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>Diện tích: {room.area} m²</Typography>
      </CardContent>
      <CardActions sx={{ padding: 2, paddingTop: 0, display: "flex", gap: 1 }}>
        <Button variant="outlined" size="small" href={`/rooms?roomId=${room.id}`}>Chi tiết</Button>
        <Button variant="contained" size="small" component={Link} to="/booking-form" state={{ roomId: room.id }}>Thuê ngay</Button>
      </CardActions>
    </Card>
  );
});

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");

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

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const price = Number(r.price);
      const area = Number(r.area);
      const matchPrice = !maxPrice || price <= Number(maxPrice);
      const matchArea = !minArea || area >= Number(minArea);
      return matchPrice && matchArea;
    });
  }, [rooms, maxPrice, minArea]);

  const resetFilters = () => {
    setMaxPrice("");
    setMinArea("");
  };

  return (
    <Container sx={{ py: 5 }}>
      {/* Banner & Header section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Chào mừng đến với Smart Phòng Trọ</Typography>
        <Typography color="text.secondary">Tìm kiếm không gian sống lý tưởng của bạn.</Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

      {/* Filter Section */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3, alignItems: "center" }}>
        <Select size="small" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} displayEmpty sx={{ minWidth: 200 }}>
          <MenuItem value="">Giá tối đa (Tất cả)</MenuItem>
          <MenuItem value={2000000}>≤ 2.000.000</MenuItem>
          <MenuItem value={5000000}>≤ 5.000.000</MenuItem>
        </Select>
        <Select size="small" value={minArea} onChange={(e) => setMinArea(e.target.value)} displayEmpty sx={{ minWidth: 200 }}>
          <MenuItem value="">Diện tích (Tất cả)</MenuItem>
          <MenuItem value={15}>≥ 15 m²</MenuItem>
          <MenuItem value={30}>≥ 30 m²</MenuItem>
        </Select>
        <Button startIcon={<RefreshIcon />} onClick={resetFilters} variant="text">Reset</Button>
      </Stack>

      {/* Rooms Grid */}
      <Grid container spacing={3}>
        {filteredRooms.map((room) => (
          <Grid item key={room.id} xs={12} sm={6} md={4}>
            <RoomCard room={room} />
          </Grid>
        ))}
        {!loading && filteredRooms.length === 0 && (
          <Grid item xs={12}>
            <Alert severity="info">Không tìm thấy phòng phù hợp. Hãy thử thay đổi tiêu chí lọc!</Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;