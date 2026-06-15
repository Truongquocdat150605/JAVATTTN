import React from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Lock as LockIcon, Home as HomeIcon, Login as LoginIcon } from "@mui/icons-material";

const UnauthorizedPage = () => {
  return (
    <Box sx={{ 
      minHeight: "80vh", 
      display: "flex", 
      alignItems: "center",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
    }}>
      <Container maxWidth="sm">
        <Paper sx={{ 
          p: 5, 
          borderRadius: 4, 
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
        }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            mx: "auto", 
            mb: 3,
            borderRadius: "50%",
            bgcolor: "rgba(239,68,68,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <LockIcon sx={{ fontSize: 40, color: "#ef4444" }} />
          </Box>
          
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "#0f172a" }}>
            403 - Không có quyền truy cập
          </Typography>
          
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Tài khoản của bạn không được phép sử dụng chức năng này.
            Vui lòng đăng nhập với tài khoản có quyền phù hợp.
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button 
              component={Link} 
              to="/" 
              variant="contained"
              startIcon={<HomeIcon />}
              sx={{
                bgcolor: "#0f766e",
                borderRadius: 2,
                px: 3,
                py: 1,
                "&:hover": { bgcolor: "#0d9488" }
              }}
            >
              Về trang chủ
            </Button>
            <Button 
              component={Link} 
              to="/login" 
              variant="outlined"
              startIcon={<LoginIcon />}
              sx={{
                borderColor: "#0f766e",
                color: "#0f766e",
                borderRadius: 2,
                px: 3,
                py: 1,
                "&:hover": { borderColor: "#0d9488", bgcolor: "rgba(15,118,110,0.08)" }
              }}
            >
              Đăng nhập lại
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;