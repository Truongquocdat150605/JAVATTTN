import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit, MeetingRoom } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { formatCurrency } from "../../../utils/formatUtils";

const IMAGE_BASE_URL = "http://localhost:8082/uploads/";

const getStatusChip = (status) => {
  const value = String(status || "").toUpperCase();

  if (value === "AVAILABLE") {
    return <Chip label="Trống" color="success" size="small" />;
  }
  if (value === "OCCUPIED" || value === "RENTED") {
    return <Chip label="Đã thuê" color="error" size="small" />;
  }
  if (value === "MAINTENANCE") {
    return <Chip label="Bảo trì" color="warning" size="small" />;
  }

  return <Chip label={status || "-"} size="small" />;
};

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await api.get("/rooms");
      setRooms(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Không thể tải danh sách phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (roomId) => {
    if (!window.confirm("Bạn có chắc muốn xóa phòng này?")) return;

    try {
      await api.delete(`/rooms/${roomId}`);
      toast.success("Xóa phòng thành công");
      fetchRooms();
    } catch (error) {
      const serverMsg = error.response?.data?.error || "Không thể xóa phòng";
      toast.error(serverMsg);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, display: "flex", alignItems: "center", gap: 1 }}>
          <MeetingRoom color="primary" />
          Quản lý phòng
        </Typography>

        <Button variant="contained" startIcon={<Add />} onClick={() => navigate("/admin/rooms/add")}>
          Thêm phòng
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Ảnh</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Số phòng</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Loại phòng</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Giá thuê</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 700 }}>Mô tả</TableCell>
              <TableCell align="right" sx={{ color: "white", fontWeight: 700 }}>
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              rooms.map((room) => (
                <TableRow key={room.id} hover>
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={room.image ? `${IMAGE_BASE_URL}${room.image}` : ""}
                      alt={`Phòng ${room.roomNumber || ""}`}
                      sx={{ width: 64, height: 48 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>{room.roomNumber}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.area} m²</TableCell>
                  <TableCell>{formatCurrency(room.price)}</TableCell>
                  <TableCell>{getStatusChip(room.status)}</TableCell>
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Typography variant="body2" noWrap title={room.description || ""}>
                      {room.description || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => navigate(`/admin/rooms/edit/${room.id}`)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(room.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

            {!loading && rooms.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  Chưa có phòng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default RoomList;
