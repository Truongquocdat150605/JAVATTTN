/**
 * @file RoomActionBox.jsx
 * @description Khối giao diện hiển thị giá tiền nổi bật và nút Call to Action "Đăng ký thuê ngay", được dán cố định (sticky) bên phải trang web.
 * @module components/roomDetail
 */
import React from "react";
import { Box, Typography, Stack, Divider, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { StarRate as StarRateIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const RoomActionBox = ({ room, status, handleRentClick }) => (
  <Box sx={{ position: "sticky", top: 90 }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
      <Box sx={{
        borderRadius: "24px",
        border: "1.5px solid #e2e8f0",
        boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}>
        {/* Price header */}
        <Box sx={{
          p: 3.5, pb: 3,
          background: "linear-gradient(135deg, #f0fdf9 0%, #ecfdf5 100%)",
          borderBottom: "1px solid #e2e8f0",
        }}>
          <Stack direction="row" alignItems="baseline" spacing={0.5}>
            <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#0f766e" }}>
              {room.price ? new Intl.NumberFormat("vi-VN").format(room.price) : "Liên hệ"}
            </Typography>
            {room.price && (
              <Typography color="text.secondary" fontWeight={600} fontSize="1rem">đ/tháng</Typography>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
            <StarRateIcon sx={{ color: "#f59e0b", fontSize: 16 }} />
            <Typography fontWeight={700} fontSize="0.88rem">4.9</Typography>
            <Typography color="text.secondary" fontSize="0.82rem">· 12 đánh giá</Typography>
          </Stack>
        </Box>

        {/* Details */}
        <Box sx={{ p: 3 }}>
          {[
            { label: "Trạng thái", value: status.label, color: status.color },
            { label: "Diện tích", value: `${room.area} m²`, color: "#0f172a" },
            { label: "Tiền cọc", value: "1 tháng tiền phòng", color: "#0f172a" },
          ].map((row, i, arr) => (
            <Box key={i}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
                <Typography color="text.secondary" fontWeight={600} fontSize="0.9rem">{row.label}</Typography>
                <Typography fontWeight={700} fontSize="0.9rem" color={row.color}>{row.value}</Typography>
              </Stack>
              {i < arr.length - 1 && <Divider sx={{ borderColor: "#f8fafc" }} />}
            </Box>
          ))}

          {/* CTA Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleRentClick}
            disabled={room.status !== "AVAILABLE"}
            sx={{
              mt: 2.5, borderRadius: "14px", py: 1.7,
              fontWeight: 800, fontSize: "1rem", textTransform: "none",
              background: room.status === "AVAILABLE"
                ? "linear-gradient(135deg, #14b8a6, #0f766e)"
                : undefined,
              boxShadow: room.status === "AVAILABLE" ? "0 8px 24px rgba(15,118,110,0.35)" : "none",
              "&:hover": {
                background: "linear-gradient(135deg, #0f766e, #134e4a)",
                boxShadow: "0 12px 30px rgba(15,118,110,0.45)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.25s",
            }}
          >
            {room.status === "AVAILABLE" ? "🏠 Đăng ký thuê ngay" : "Phòng không còn trống"}
          </Button>

          <Typography
            variant="caption" display="block" textAlign="center"
            mt={2} color="text.disabled" fontWeight={600}
          >
            Bạn sẽ không bị trừ tiền ngay bây giờ
          </Typography>

          {/* Trust badges */}
          <Stack spacing={1.5} mt={3} pt={3} sx={{ borderTop: "1px solid #f1f5f9" }}>
            {[
              { icon: "🔒", text: "Thông tin của bạn được bảo mật" },
              { icon: "📋", text: "Hợp đồng điện tử minh bạch" },
              { icon: "⚡", text: "Xét duyệt nhanh trong 24h" },
            ].map((t, i) => (
              <Stack key={i} direction="row" alignItems="center" spacing={1.5}>
                <Typography fontSize="1rem">{t.icon}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>{t.text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Contact nudge */}
      <Box sx={{
        mt: 2, p: 2.5, borderRadius: "16px",
        bgcolor: "#f8fafc", border: "1px solid #f1f5f9",
        textAlign: "center",
      }}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          Có câu hỏi? Liên hệ ngay với chúng tôi!
        </Typography>
        <Button
          component={Link}
          to="/contact"
          variant="text"
          sx={{ mt: 0.5, fontWeight: 700, color: "#0f766e", textTransform: "none" }}
        >
          Liên hệ hỗ trợ →
        </Button>
      </Box>
    </motion.div>
  </Box>
);

export default RoomActionBox;
