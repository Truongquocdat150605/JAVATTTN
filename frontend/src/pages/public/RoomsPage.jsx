import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { formatVND } from "../../utils/formatVND";
import {
  Container, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, TextField, Box, InputAdornment, CircularProgress, Alert
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SquareFootIcon from '@mui/icons-material/SquareFoot';

const PLACEHOLDER_IMG = "https://via.placeholder.com/600x400?text=No+Image";
const IMAGE_BASE = "http://localhost:8082/uploads/";

const getRoomImageUrl = (imageFileName) => {
  if (!imageFileName) return PLACEHOLDER_IMG;
  return `${IMAGE_BASE}${imageFileName}`;
};

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [filters, setFilters] = useState({ q: "", maxPrice: "", minArea: "" });
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/rooms/available")
      .then((res) => {
        // Handle standard array response or wrapped response
        const data = res.data || res;
        if (Array.isArray(data)) {
            setRooms(data);
        } else {
            setRooms([]);
            console.error("Invalid response format", res);
        }
      })
      .catch((err) => {
          console.error(err);
          setErrorMsg("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchQ = !filters.q || (r.roomNumber && String(r.roomNumber).toLowerCase().includes(filters.q.toLowerCase())) || (r.description && r.description.toLowerCase().includes(filters.q.toLowerCase()));
      const matchPrice = !filters.maxPrice || Number(r.price) <= Number(filters.maxPrice);
      const matchArea = !filters.minArea || Number(r.area) >= Number(filters.minArea);
      return matchQ && matchPrice && matchArea;
    });
  }, [rooms, filters]);

  const handleRentClick = (room) => {
    navigate("/booking-form", { state: { roomId: room.id } });
  };

  return (
    <Box sx={{ py: 6, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Typography variant="h3" fontWeight={900} textAlign="center" gutterBottom color="primary.main" sx={{ mb: 4 }}>
          Danh Sách Phòng Trống
        </Typography>

        {/* Filter Section */}
        <Card sx={{ p: 3, mb: 5, borderRadius: 3, boxShadow: "0 10px 30px rgba(15,23,42,0.05)" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField 
                fullWidth 
                placeholder="Tìm mã phòng, mô tả..." 
                variant="outlined" 
                value={filters.q} 
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon color="action"/></InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField 
                fullWidth 
                type="number" 
                placeholder="Giá tối đa" 
                variant="outlined" 
                value={filters.maxPrice} 
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AttachMoneyIcon color="action"/></InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField 
                fullWidth 
                type="number" 
                placeholder="Diện tích tối thiểu" 
                variant="outlined" 
                value={filters.minArea} 
                onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SquareFootIcon color="action"/></InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </Card>

        {errorMsg && <Alert severity="error" sx={{ mb: 4 }}>{errorMsg}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : visibleRooms.length === 0 && !errorMsg ? (
          <Alert severity="info" sx={{ borderRadius: 2 }}>Không tìm thấy phòng nào phù hợp.</Alert>
        ) : (
          <Grid container spacing={4}>
            {visibleRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.id}>
                <Card sx={{ 
                  borderRadius: "16px", 
                  height: "100%", 
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)", 
                  border: "1px solid rgba(148,163,184,0.2)", 
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 15px 40px rgba(15,23,42,0.12)" }
                }}>
                  <CardMedia 
                    component="img" 
                    height="200" 
                    image={getRoomImageUrl(room.imageFileName)} 
                    alt={`Phòng ${room.roomNumber}`}
                    onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "text.primary" }}>
                      Phòng {room.roomNumber}
                    </Typography>
                    <Typography sx={{ color: "primary.main", fontWeight: 700, fontSize: "1.1rem", mb: 1 }}>
                      {formatVND(room.price)} / tháng
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                      <SquareFootIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {room.area} m²
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden' 
                    }}>
                      {room.description || "Chưa có mô tả."}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      sx={{ borderRadius: "8px", py: 1, fontWeight: 700 }}
                      onClick={() => handleRentClick(room)}
                    >
                      Đăng ký thuê
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default RoomsPage;
