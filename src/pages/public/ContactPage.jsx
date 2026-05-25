import React, { useMemo, useState } from "react";
import api from "../../services/api";

import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const ContactPage = () => {
  const [form, setForm] = useState({ fullName: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const phoneHint = useMemo(() => "Ví dụ: 0901 234 567", []);

  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      setSubmitting(true);
      await api.post(
        "/public/contacts",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMsg(
        "Đã gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất!"
      );
      setForm({ fullName: "", phone: "", message: "" });
    } catch (err) {
      const msg = err?.response?.data?.message ||
        "Gửi liên hệ thất bại. Vui lòng thử lại.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>
          Liên hệ hỗ trợ
        </Typography>
        <Typography sx={{ mt: 1, color: "text.secondary", fontWeight: 600 }}>
          Gửi thông tin, đội ngũ của Smart Phòng Trọ sẽ liên hệ trong thời gian sớm nhất.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card
            elevation={1}
            sx={{
              p: 2.5,
              borderRadius: "16px",
              border: "1px solid rgba(2, 6, 23, 0.06)",
              boxShadow: "0 2px 10px rgba(2, 6, 23, 0.05)",
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.10), rgba(59,130,246,0.06))",
            }}
          >
            <Typography sx={{ fontWeight: 900, mb: 1.5, color: "#064e3b" }}>
              Thông tin liên hệ
            </Typography>

            <Box sx={{ display: "grid", gap: 1.2 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                Hotline
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                0123 456 789
              </Typography>

              <Typography sx={{ fontWeight: 700, color: "#0f172a", mt: 1.2 }}>
                Email
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                contact@phongtro.vn
              </Typography>

              <Typography sx={{ fontWeight: 700, color: "#0f172a", mt: 1.2 }}>
                Giờ làm việc
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Thứ 2 - Thứ 7 (08:00 - 17:30)
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2, borderRadius: "12px" }}>
              Bạn có thể để lại yêu cầu về thuê phòng, gia hạn hợp đồng hoặc báo lỗi bảo trì.
            </Alert>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card
            elevation={1}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              border: "1px solid rgba(2, 6, 23, 0.06)",
              boxShadow: "0 2px 10px rgba(2, 6, 23, 0.05)",
              bgcolor: "#fff",
            }}
          >
            <Box component="form" onSubmit={submit} sx={{ mt: 0.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Họ tên"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder="Nguyễn Văn A"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Số điện thoại"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={phoneHint}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    minRows={4}
                    label="Nội dung"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Bạn cần hỗ trợ vấn đề gì?"
                  />
                </Grid>

                <Grid item xs={12}>
                  {errorMsg && (
                    <Alert severity="error" sx={{ mb: 1, borderRadius: "12px" }}>
                      {errorMsg}
                    </Alert>
                  )}
                  {successMsg && (
                    <Alert
                      severity="success"
                      sx={{ mb: 1, borderRadius: "12px" }}
                    >
                      {successMsg}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                    sx={{
                      mt: 1,
                      borderRadius: "999px",
                      bgcolor: "#064e3b",
                      fontWeight: 900,
                      py: 1.1,
                      px: 3,
                      "&:hover": { bgcolor: "#053a2c" },
                    }}
                  >
                    {submitting ? (
                      <>
                        <CircularProgress
                          size={20}
                          sx={{ color: "#fff", mr: 1 }}
                        />
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi liên hệ"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactPage;

