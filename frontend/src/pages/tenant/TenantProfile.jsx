import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  LocationOn as LocationOnIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";

const TenantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.get("/tenant/me");
      setProfile(data);
      setFormData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        identityNumber: data.identityNumber || "",
        address: data.address || "",
      });
    } catch (error) {
      toast.error("Không thể tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName?.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone?.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/g.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (formData.identityNumber && formData.identityNumber.length !== 12) {
      newErrors.identityNumber = "CCCD phải có 12 số";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await api.put("/tenant/profile", formData);
      setProfile({ ...profile, ...formData });
      toast.success("Cập nhật thông tin thành công!");
      setEditing(false);
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      identityNumber: profile?.identityNumber || "",
      address: profile?.address || "",
    });
    setErrors({});
    setEditing(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Alert severity="error">Không thể tải thông tin cá nhân</Alert>
      </Container>
    );
  }

  const InfoRow = ({ icon, label, value, field }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 1.5 }}>
      <Box sx={{ color: "#0f766e", minWidth: 40 }}>{icon}</Box>
      <Box flex={1}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        {editing ? (
          <TextField
            fullWidth
            size="small"
            value={formData[field] || ""}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            error={!!errors[field]}
            helperText={errors[field]}
            sx={{ mt: 0.5 }}
          />
        ) : (
          <Typography variant="body1" fontWeight={500}>
            {value || <em style={{ color: "#94a3b8" }}>Chưa cập nhật</em>}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 4, 
        background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
        color: "white"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: "rgba(255,255,255,0.2)" }}>
            <PersonIcon sx={{ fontSize: 48 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              {profile.fullName || profile.username}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, display: "flex", alignItems: "center", gap: 1 }}>
              <VerifiedIcon sx={{ fontSize: 16 }} />
              Thành viên Smart Phòng Trọ
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Profile Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" fontWeight={800}>
                Thông tin cá nhân
              </Typography>
              {!editing ? (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                  sx={{ color: "#0f766e" }}
                >
                  Chỉnh sửa
                </Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ bgcolor: "#0f766e", "&:hover": { bgcolor: "#0d9488" } }}
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <InfoRow icon={<PersonIcon />} label="Họ và tên" value={profile.fullName} field="fullName" />
            <Divider />
            <InfoRow icon={<EmailIcon />} label="Email" value={profile.email} field="email" />
            <Divider />
            <InfoRow icon={<PhoneIcon />} label="Số điện thoại" value={profile.phone} field="phone" />
            <Divider />
            <InfoRow icon={<BadgeIcon />} label="Căn cước công dân (CCCD)" value={profile.identityNumber} field="identityNumber" />
            <Divider />
            <InfoRow icon={<LocationOnIcon />} label="Địa chỉ" value={profile.address} field="address" />
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={800} mb={2}>
              Thông tin tài khoản
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Tên đăng nhập</Typography>
              <Typography fontWeight={600}>{profile.username}</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Loại tài khoản</Typography>
              <Chip 
                label="Người thuê" 
                size="small" 
                sx={{ mt: 0.5, bgcolor: "#e0f2fe", color: "#0284c7", fontWeight: 600 }}
              />
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">Ngày tham gia</Typography>
              <Typography fontWeight={600}>
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("vi-VN") : "-"}
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 4, mt: 3, bgcolor: "#f0fdf9" }}>
            <Typography variant="h6" fontWeight={800} mb={2} color="#0f766e">
              Hỗ trợ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Cần hỗ trợ? Liên hệ với chúng tôi qua:
            </Typography>
            <Typography variant="body2">
              📞 Hotline: <strong>0123 456 789</strong>
            </Typography>
            <Typography variant="body2">
              📧 Email: <strong>support@smartphongtro.com</strong>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TenantProfile;