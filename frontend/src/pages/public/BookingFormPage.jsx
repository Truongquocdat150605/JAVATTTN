import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  Container, Box, Typography, Card, CardContent, TextField, Button, Grid, Divider, CircularProgress, Alert
} from "@mui/material";
import { MeetingRoom as RoomIcon, Send as SendIcon, Cancel as CancelIcon, CheckCircle as CheckIcon, Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from "../../contexts/AuthContext";
import { getCurrentUser } from "../../utils/authUtils";

const BookingFormPage = () => {
  const { user } = useAuth();
  const sessionUser = user || getCurrentUser();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({ 
    fullName: sessionUser?.fullName || "", 
    phone: sessionUser?.phone || "", 
    email: sessionUser?.email || "", 
    identityNumber: sessionUser?.identityNumber || "", 
    desiredMoveInDate: "", 
    note: "" 
  });
  useEffect(() => {
    if (!state?.roomId) {
      toast.error("Không có phòng nào được chọn.");
      return navigate("/rooms");
    }
    api.get(`/rooms/${state.roomId}`).then(res => setSelectedRoom(res.data || res))
      .catch(() => {
        toast.error("Không tìm thấy thông tin phòng.");
        navigate("/rooms");
      })
      .finally(() => setLoading(false));
  }, [state?.roomId, navigate]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim() || value.length < 3) error = "Họ tên tối thiểu 3 ký tự";
        break;
      case "phone":
        if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(value)) error = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03/05/07/08/09)";
        break;
      case "email":
        if (!value.trim()) error = "Vui lòng nhập Email";
        else if (!/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(value)) error = "Email không hợp lệ";
        break;
      case "identityNumber":
        if (value && !/^\d{12}$/.test(value)) error = "CCCD phải đúng 12 số";
        break;
      case "desiredMoveInDate":
        if (!value || new Date(value) < new Date().setHours(0,0,0,0)) error = "Ngày chuyển vào không hợp lệ (phải từ hôm nay trở đi)";
        break;
      default:
        break;
    }
    return error;
  };

  const isFieldLocked = (name) => {
    switch (name) {
      case "fullName": return !!(sessionUser && sessionUser.fullName);
      case "phone": return !!(sessionUser && sessionUser.phone);
      case "email": return !!(sessionUser && sessionUser.email);
      case "identityNumber": return !!(sessionUser && sessionUser.identityNumber);
      default: return false;
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      if (!isFieldLocked(key)) {
        const error = validateField(key, form[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    setTouched({
      fullName: true, phone: true, email: true, identityNumber: true, desiredMoveInDate: true
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Vui lòng kiểm tra lại thông tin trên form.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/public/rental-requests", { ...form, roomId: selectedRoom.id, userId: sessionUser?.id || null });
      toast.success(`Đã gửi yêu cầu thuê phòng ${selectedRoom.roomNumber}!`);
      setTimeout(() => navigate("/rooms"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi yêu cầu thất bại.");
    } finally { setIsSubmitting(false); }
  };

  if (loading) return <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>;

  const fields = [
    { n: "fullName", l: "Họ và tên *", xs: 12, locked: !!(sessionUser && sessionUser.fullName) },
    { n: "phone", l: "Số điện thoại *", xs: 6, locked: !!(sessionUser && sessionUser.phone) },
    { n: "email", l: "Email *", t: "email", xs: 6, locked: !!(sessionUser && sessionUser.email) },
    { n: "identityNumber", l: "CCCD (12 số)", xs: 12, locked: !!(sessionUser && sessionUser.identityNumber) },
    { n: "desiredMoveInDate", l: "Ngày muốn chuyển vào *", t: "date", xs: 12, locked: false },
    { n: "note", l: "Ghi chú thêm", m: true, r: 4, xs: 12, locked: false }
  ];

  return (
    <Box sx={{ py: 8, bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Card sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(15,23,42,0.1)", border: "1px solid #e2e8f0" }}>
          <Box sx={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", color: "white", p: 4, textAlign: "center" }}>
            <RoomIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight={800}>Đăng Ký Thuê Phòng {selectedRoom?.roomNumber}</Typography>
            <Alert icon={<CheckIcon />} severity="info" sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.2)", color: "white", border: "none", ".MuiAlert-icon": { color: "white" } }}>
              {new Intl.NumberFormat('vi-VN').format(selectedRoom?.price)}đ/tháng | {selectedRoom?.area}m²
            </Alert>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {fields.map(f => (
                  <Grid item xs={f.xs} key={f.n}>
                    <TextField 
                      fullWidth 
                      label={f.l} 
                      type={f.t || "text"} 
                      multiline={f.m} 
                      rows={f.r}
                      variant="outlined" 
                      value={form[f.n]} 
                      error={!!errors[f.n]} 
                      helperText={errors[f.n]}
                      InputLabelProps={f.t === 'date' || f.locked ? { shrink: true } : {}}
                      onBlur={() => !f.locked && handleBlur(f.n)}
                      onChange={e => !f.locked && handleChange(f.n, e.target.value)} 
                      disabled={f.locked}
                      InputProps={{
                        endAdornment: f.locked ? <LockIcon fontSize="small" sx={{ color: "text.disabled" }} /> : null,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#0f766e' },
                          '&.Mui-focused fieldset': { borderColor: '#0f766e' },
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my: 4 }} />
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="inherit" onClick={() => navigate("/rooms")} startIcon={<CancelIcon />} sx={{ borderRadius: 2, fontWeight: 600 }}>Hủy</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={<SendIcon />} 
                  sx={{ 
                    bgcolor: "#0f766e", 
                    borderRadius: 2, 
                    fontWeight: 700,
                    px: 4,
                    '&:hover': { bgcolor: "#0d9488", transform: "translateY(-2px)" },
                    transition: "all 0.2s"
                  }}>
                  {isSubmitting ? "Đang gửi..." : "Gửi Yêu Cầu"}
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
