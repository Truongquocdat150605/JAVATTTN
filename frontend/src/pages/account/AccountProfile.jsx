import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Badge as BadgeIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import api from "../../services/api";
import { normalizeRole } from "../../utils/authUtils";

const roleLabels = {
  ADMIN: "Quản trị viên",
  TENANT: "Người thuê",
};

const roleChipStyles = {
  ADMIN: { bgcolor: "#dbeafe", color: "#1e40af" },
  TENANT: { bgcolor: "#e0f2fe", color: "#0284c7" },
};

const AccountProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const setFormFromProfile = (data) => {
    setFormData({
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      identityNumber: data.identityNumber || "",
      address: data.address || "",
    });
  };

  const syncStoredUser = (data) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
    const nextUser = { ...currentUser, ...data, role: normalizeRole(data.role || currentUser.role) };
    sessionStorage.setItem("user", JSON.stringify(nextUser));
    sessionStorage.setItem("role", nextUser.role);
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get("/auth/me");
      const normalized = { ...data, role: normalizeRole(data.role) };
      setProfile(normalized);
      setFormFromProfile(normalized);
      syncStoredUser(normalized);
    } catch (error) {
      toast.error("Không thể tải thông tin tài khoản");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName?.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone?.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0[35789])([0-9]{8})$/.test(formData.phone)) {
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
      const data = await api.put("/auth/profile", formData);
      const normalized = { ...data, role: normalizeRole(data.role || profile.role) };
      setProfile(normalized);
      setFormFromProfile(normalized);
      syncStoredUser(normalized);
      toast.success("Cập nhật thông tin thành công!");
      setEditing(false);
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormFromProfile(profile || {});
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
        <Alert severity="error">Không thể tải thông tin tài khoản</Alert>
      </Container>
    );
  }

  const role = normalizeRole(profile.role);
  const roleLabel = roleLabels[role] || role || "Tài khoản";
  const roleStyle = roleChipStyles[role] || { bgcolor: "#f1f5f9", color: "#334155" };

  const InfoRow = ({ icon, label, value, field }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 1.5 }}>
      <Box sx={{ color: "#0f766e", minWidth: 40 }}>{icon}</Box>
      <Box flex={1}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
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
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
          color: "white",
        }}
      >
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
              {roleLabel} Smart Phòng Trọ
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" fontWeight={800}>
                Thông tin cá nhân
              </Typography>
              {!editing ? (
                <Button startIcon={<EditIcon />} onClick={() => setEditing(true)} sx={{ color: "#0f766e" }}>
                  Chỉnh sửa
                </Button>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button startIcon={<CancelIcon />} onClick={handleCancel} disabled={saving}>
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

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={800} mb={2}>
              Thông tin tài khoản
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Tên đăng nhập
              </Typography>
              <Typography fontWeight={600}>{profile.username}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Loại tài khoản
              </Typography>
              <Box>
                <Chip label={roleLabel} size="small" sx={{ mt: 0.5, ...roleStyle, fontWeight: 600 }} />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Ngày tham gia
              </Typography>
              <Typography fontWeight={600}>
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString("vi-VN") : "-"}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountProfile;
