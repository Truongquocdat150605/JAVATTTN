import React from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Không có quyền truy cập
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Tài khoản của bạn không được phép sử dụng chức năng này.
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button component={Link} to="/" variant="contained">
            Về trang chủ
          </Button>
          <Button component={Link} to="/login" variant="outlined">
            Đăng nhập lại
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
