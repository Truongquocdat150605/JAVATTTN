import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { FaEnvelope, FaFacebookF, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "48px",
        background: "#064e3b",
        color: "white",
        padding: "32px 0",
      }}
    >
      <div className="container">
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1.5 }}>
          Liên hệ Smart Phòng Trọ
        </Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.95 }}>
            <FaPhone /> 0123 456 789
          </Typography>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.95 }}>
            <FaEnvelope /> contact@phongtro.vn
          </Typography>
          <Typography sx={{ display: "flex", alignItems: "center", gap: 1, opacity: 0.95 }}>
            <FaMapMarkerAlt /> 123 Đường ABC, Quận XYZ, TP.HCM
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            href="#"
            startIcon={<FaFacebookF />}
            sx={{
              borderColor: "rgba(255,255,255,0.7)",
              color: "white",
              borderRadius: "999px",
            }}
          >
            Facebook
          </Button>
          <Button
            variant="outlined"
            size="small"
            href="#"
            sx={{
              borderColor: "rgba(255,255,255,0.7)",
              color: "white",
              borderRadius: "999px",
            }}
          >
            Zalo
          </Button>
        </Stack>
      </div>
    </footer>
  );
};

export default Footer;
