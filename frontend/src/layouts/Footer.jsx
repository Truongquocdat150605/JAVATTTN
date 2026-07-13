import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Phone,
  Email,
  LocationOn,
  Send,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#3E2A1A",
        color: "#FDFBF7",
        mt: "auto",
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: "#ffffff" }}>
              Smart Phòng Trọ
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              Hệ thống quản lý nhà trọ thông minh, giúp kết nối chủ nhà và người thuê một cách dễ dàng và hiệu quả.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: "#e2e8f0", "&:hover": { color: "#0f766e" } }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: "#e2e8f0", "&:hover": { color: "#0f766e" } }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: "#e2e8f0", "&:hover": { color: "#0f766e" } }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: "#e2e8f0", "&:hover": { color: "#0f766e" } }}>
                <YouTube />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: "1rem", color: "#ffffff" }}>
              Liên kết nhanh
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" component={Link} to="/" sx={{ color: "#e2e8f0", textDecoration: "none", "&:hover": { color: "#0f766e" } }}>
                Trang chủ
              </Typography>
              <Typography variant="body2" component={Link} to="/rooms" sx={{ color: "#e2e8f0", textDecoration: "none", "&:hover": { color: "#0f766e" } }}>
                Danh sách phòng
              </Typography>
              <Typography variant="body2" component={Link} to="/contact" sx={{ color: "#e2e8f0", textDecoration: "none", "&:hover": { color: "#0f766e" } }}>
                Liên hệ
              </Typography>
              <Typography variant="body2" component={Link} to="/about" sx={{ color: "#e2e8f0", textDecoration: "none", "&:hover": { color: "#0f766e" } }}>
                Giới thiệu
              </Typography>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: "1rem", color: "#ffffff" }}>
              Thông tin liên hệ
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone sx={{ fontSize: 20, color: "#0f766e" }} />
                <Typography variant="body2">0123 456 789</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Email sx={{ fontSize: 20, color: "#0f766e" }} />
                <Typography variant="body2">contact@smartphongtro.com</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationOn sx={{ fontSize: 20, color: "#0f766e" }} />
                <Typography variant="body2">41 Đường số 5, Tăng Nhơn Phú B, TP. Thủ Đức, TP.HCM</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: "1rem", color: "#ffffff" }}>
              Đăng ký nhận tin
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Nhận thông tin về phòng trọ mới nhất qua email
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Email của bạn"
                variant="outlined"
                sx={{
                  bgcolor: "#1e293b",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    color: "#ffffff",
                    "& fieldset": { borderColor: "#334155" },
                  },
                }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#0f766e",
                  minWidth: "auto",
                  "&:hover": { bgcolor: "#0d9488" },
                }}
              >
                <Send />
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "#334155" }} />

        <Typography variant="body2" align="center" sx={{ color: "#94a3b8" }}>
          © {new Date().getFullYear()} Smart Phòng Trọ. Tất cả các quyền được bảo lưu.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;