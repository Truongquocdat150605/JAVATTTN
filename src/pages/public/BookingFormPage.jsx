import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  Container, Box, Typography, Card, CardContent, TextField, Button, Grid, Divider, CircularProgress, Alert
} from "@mui/material";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';

const BookingFormPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rentalForm, setRentalForm] = useState({
    fullName: "",
    phone: "",
    identityNumber: "",
    desiredMoveInDate: "",
    note: "",
  });

  useEffect(() => {
    const roomId = location.state?.roomId;
    if (roomId) {
      api.get(`/rooms/${roomId}`)
        .then((res) => {
          setSelectedRoom(res.data || res);
        })
        .catch((error) => {
          toast.error("Không tìm thấy thông tin phòng.");
          navigate("/rooms");
        })
        .finally(() => setLoadingRoom(false));
    } else {
      toast.error("Không có phòng nào được chọn.");
      navigate("/rooms");
    }
  }, [location.state?.roomId, navigate]);

  const submitRental = async (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      toast.error("Vui lòng chọn phòng trước khi gửi yêu cầu.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/public/rental-requests", { ...rentalForm, roomId: selectedRoom.id });
      toast.success("Đã gửi yêu cầu thuê phòng, admin sẽ liên hệ sớm.");
      setRentalForm({ fullName: "", phone: "", identityNumber: "", desiredMoveInDate: "", note: "" });
      navigate("/rooms");
    } catch (error) {
      toast.error("Gửi yêu cầu thất bại. Vui lòng kiểm tra lại thông tin.");
      console.error("Error submitting rental request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingRoom) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedRoom) return null;

  return (
    <Box sx={{ py: 8, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Card sx={{ 
          borderRadius: 4, 
          boxShadow: "0 20px 40px rgba(15,23,42,0.08)", 
          overflow: "hidden" 
        }}>
          <Box sx={{ bgcolor: "primary.main", color: "white", p: 4, textAlign: "center" }}>
            <MeetingRoomIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Đăng Ký Thuê Phòng {selectedRoom.roomNumber}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
              Vui lòng điền đầy đủ thông tin để gửi yêu cầu thuê phòng. Chúng tôi sẽ liên hệ lại ngay!
            </Typography>
          </Box>
          
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <form onSubmit={submitRental}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    variant="outlined"
                    required
                    value={rentalForm.fullName}
                    onChange={(e) => setRentalForm({ ...rentalForm, fullName: e.target.value })}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    variant="outlined"
                    required
                    value={rentalForm.phone}
                    onChange={(e) => setRentalForm({ ...rentalForm, phone: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Căn cước công dân (CCCD)"
                    variant="outlined"
                    value={rentalForm.identityNumber}
                    onChange={(e) => setRentalForm({ ...rentalForm, identityNumber: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ngày muốn chuyển vào"
                    type="date"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    required
                    value={rentalForm.desiredMoveInDate}
                    onChange={(e) => setRentalForm({ ...rentalForm, desiredMoveInDate: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Ghi chú thêm"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={rentalForm.note}
                    onChange={(e) => setRentalForm({ ...rentalForm, note: e.target.value })}
                    placeholder="Bạn có yêu cầu đặc biệt nào không?"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  onClick={() => navigate("/rooms")}
                  startIcon={<CancelIcon />}
                  sx={{ px: 3, py: 1.5, borderRadius: 2 }}
                >
                  Hủy Bỏ
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                >
                  Gửi Yêu Cầu
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default BookingFormPage;