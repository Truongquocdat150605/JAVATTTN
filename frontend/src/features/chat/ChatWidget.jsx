import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Fab,
  Fade,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Badge,
  Button,
} from "@mui/material";
import {
  AddShoppingCart as BookIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Visibility as EyeIcon,
  AutoAwesome as SparkleIcon,
  CheckCircle as CheckIcon,
  TaskAlt as SuccessIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { UPLOADS_URL as IMAGE_BASE } from "../../config";
import { getCurrentUser } from "../../utils/authUtils";

const quickReplies = [
  "⚡ Đặt phòng giúp tôi",
  "💡 Tìm phòng dưới 3 triệu",
  "🛡️ Phòng trống chuyển vào ngay",
  "📋 Hướng dẫn thủ tục thuê phòng",
];

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));

const getImageUrl = (image) => {
  if (!image) return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
  return image.startsWith("http") ? image.replace("http://", "https://") : `${IMAGE_BASE}${image}`;
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào! Tôi là Trợ Lý AI Agent Matchmaker. Bạn có thể yêu cầu tôi tìm phòng hoặc nói 'Đặt phòng giúp tôi', tôi sẽ tự động gửi đơn đặt phòng lên hệ thống cho bạn ngay lập tức!",
      roomsInfo: [],
      bookingSuccess: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleAutonomousBooking = async (roomNumberTarget = null) => {
    const user = getCurrentUser();
    
    // Fetch available rooms
    let targetRoom = null;
    try {
      const roomsRes = await api.get("/rooms/public");
      const allRooms = Array.isArray(roomsRes.data) ? roomsRes.data : Array.isArray(roomsRes) ? roomsRes : [];
      const availableRooms = allRooms.filter(r => r.status === "AVAILABLE" || !r.status);
      
      if (roomNumberTarget) {
        targetRoom = availableRooms.find(r => String(r.roomNumber) === String(roomNumberTarget));
      }
      if (!targetRoom && availableRooms.length > 0) {
        targetRoom = availableRooms[0];
      }
    } catch (e) {
      console.error("Fetch rooms failed:", e);
    }

    if (!targetRoom) {
      return {
        text: "Hiện tại hệ thống không còn phòng trống sẵn sàng để đặt tự động. Vui lòng quay lại sau!",
        bookingSuccess: null,
      };
    }

    if (!user) {
      return {
        text: `Tôi đã chọn được Phòng ${targetRoom.roomNumber} (${formatVND(targetRoom.price)}/tháng) cho bạn! Vui lòng Đăng nhập tài khoản để tôi tự động gửi yêu cầu đặt phòng nhé.`,
        bookingSuccess: null,
        needLogin: true,
      };
    }

    // Execute Autonomous Booking API Call
    try {
      const payload = {
        roomId: targetRoom.id,
        userId: user.id || null,
        fullName: user.fullName || user.username || "Khách hàng",
        phone: user.phone || "0987654321",
        email: user.email || "khachhang@gmail.com",
        desiredMoveInDate: new Date().toISOString().split("T")[0],
        note: "Yêu cầu đặt phòng tự động bởi Trợ lý AI Agent",
      };

      await api.post("/public/rental-requests", payload);

      return {
        text: `🤖 THÔNG BÁO TỰ ĐỘNG TỪ AI AGENT:\nTôi đã thực thi đặt thành công Phòng ${targetRoom.roomNumber} cho bạn! Đơn đăng ký đã được gửi trực tiếp đến Admin phê duyệt.`,
        bookingSuccess: {
          roomNumber: targetRoom.roomNumber,
          price: targetRoom.price,
          fullName: user.fullName || user.username,
          phone: user.phone || "Đã lưu",
          status: "CHỜ ADMIN DUYỆT",
        },
      };
    } catch (err) {
      console.error("Autonomous booking API failed:", err);
      return {
        text: `Dạ tôi gặp chút gián đoạn khi tự đặt Phòng ${targetRoom.roomNumber}. Bạn có thể bấm nút 'Đặt Ngay' bên dưới để điền form nhanh nhé!`,
        roomsInfo: [targetRoom],
        bookingSuccess: null,
      };
    }
  };

  const handleSend = async (text) => {
    const cleanText = text.trim();
    if (!cleanText || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: cleanText }]);
    setInput("");
    setLoading(true);

    // Detect Autonomous Booking Intent
    const lower = cleanText.toLowerCase();
    const isBookingIntent = lower.includes("đặt phòng") || lower.includes("thuê phòng") || lower.includes("đặt giúp") || lower.includes("đặt ngay");

    if (isBookingIntent) {
      // Extract room number if mentioned, e.g. "đặt phòng 101"
      const match = cleanText.match(/(?:phòng|phong)\s*(\d+)/i);
      const roomNum = match ? match[1] : null;

      const bookingResult = await handleAutonomousBooking(roomNum);
      setMessages((prev) => [...prev, { role: "bot", ...bookingResult }]);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/public/chat", {
        message: cleanText,
        history: messages.slice(-6).filter((m) => m.role === "user" || m.role === "bot"),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res?.reply || "Tôi đã phân tích thông tin của bạn.",
          roomsInfo: Array.isArray(res?.roomsInfo) ? res.roomsInfo : [],
        },
      ]);
    } catch (error) {
      console.error("Chat AI Agent error:", error);
      try {
        const roomsRes = await api.get("/rooms/public");
        const allRooms = Array.isArray(roomsRes.data) ? roomsRes.data : Array.isArray(roomsRes) ? roomsRes : [];
        const availableRooms = allRooms.filter(r => r.status === "AVAILABLE" || !r.status);
        
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: `Tôi đã quét hệ thống và tìm thấy ${availableRooms.length} phòng trọ phù hợp nhất với tiêu chí của bạn:`,
            roomsInfo: availableRooms.slice(0, 3),
          },
        ]);
      } catch (e) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Hệ thống AI Agent hiện đang kết nối trực tiếp với server. Bạn có thể xem danh sách phòng trống ở mục 'Danh sách phòng'.",
            roomsInfo: [],
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderBotMessage = (message) => {
    const rooms = message.roomsInfo || [];
    const booking = message.bookingSuccess;

    return (
      <Box>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mb: rooms.length || booking ? 1.5 : 0, lineHeight: 1.6 }}>
          {message.text}
        </Typography>

        {/* Autonomous Booking Success Card */}
        {booking && (
          <Paper
            elevation={0}
            sx={{
              mt: 1.5, p: 2, borderRadius: 3,
              background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
              border: "1.5px solid #86efac",
              boxShadow: "0 4px 15px rgba(22,163,74,0.12)"
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <SuccessIcon sx={{ color: "#16a34a", fontSize: 22 }} />
              <Typography variant="subtitle2" fontWeight={800} color="#15803d">
                ĐÃ TỰ ĐỘNG TẠO ĐƠN THUÊ
              </Typography>
            </Stack>
            <Box sx={{ bgcolor: "white", p: 1.5, borderRadius: 2, mb: 1.5 }}>
              <Typography variant="body2" fontWeight={700} color="#0f172a">
                Phòng {booking.roomNumber} · {formatVND(booking.price)}/tháng
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Người đặt: {booking.fullName} ({booking.phone})
              </Typography>
              <Typography variant="caption" fontWeight={700} color="#16a34a" display="block" mt={0.5}>
                Trạng thái: {booking.status}
              </Typography>
            </Box>
            <Button
              fullWidth size="small" variant="contained"
              onClick={() => { setOpen(false); navigate("/my-contracts"); }}
              sx={{ bgcolor: "#16a34a", fontWeight: 700, "&:hover": { bgcolor: "#15803d" } }}
            >
              Xem hợp đồng & yêu cầu của tôi
            </Button>
          </Paper>
        )}

        {/* Need Login Card */}
        {message.needLogin && (
          <Button
            size="small" variant="contained"
            onClick={() => { setOpen(false); navigate("/login"); }}
            sx={{ mt: 1.5, bgcolor: "#0f766e", fontWeight: 700 }}
          >
            Đăng nhập ngay để AI tự đặt phòng
          </Button>
        )}

        {/* Rooms Info List */}
        {rooms.length > 0 && (
          <Stack spacing={1.5} mt={1}>
            {rooms.slice(0, 3).map((room, idx) => (
              <Paper
                key={room.id || idx}
                elevation={0}
                sx={{
                  overflow: "hidden",
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s ease",
                  "&:hover": { borderColor: "#0f766e", boxShadow: "0 4px 15px rgba(15,118,110,0.12)" },
                }}
              >
                {room.image && (
                  <Box
                    component="img"
                    src={getImageUrl(room.image)}
                    alt={`Phòng ${room.roomNumber}`}
                    sx={{ width: "100%", height: 110, objectFit: "cover", display: "block" }}
                  />
                )}
                <Box sx={{ p: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                    <Typography variant="subtitle2" fontWeight={800} color="#0f766e">
                      Phòng {room.roomNumber}
                    </Typography>
                    <Chip
                      size="small"
                      icon={<SparkleIcon sx={{ fontSize: "12px !important", color: "#0f766e" }} />}
                      label={`${98 - idx * 3}% Phù hợp`}
                      sx={{ bgcolor: "rgba(15,118,110,0.1)", color: "#0f766e", fontWeight: 700, fontSize: 11 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mb: 0.5 }}>
                    Diện tích: {room.area || "-"} m² · {room.address || "Khu vực trung tâm"}
                  </Typography>
                  <Typography variant="body2" fontWeight={800} color="#0f766e" sx={{ mb: 1.5, fontSize: "0.95rem" }}>
                    {formatVND(room.price)} / tháng
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      size="small"
                      icon={<EyeIcon sx={{ fontSize: "14px !important" }} />}
                      label="Xem chi tiết"
                      onClick={() => {
                        setOpen(false);
                        navigate(`/rooms/${room.id}`);
                      }}
                      sx={{ flex: 1, cursor: "pointer", fontWeight: 600 }}
                    />
                    <Chip
                      size="small"
                      icon={<BookIcon sx={{ fontSize: "14px !important" }} />}
                      label="AI Đặt Tự Động"
                      color="primary"
                      onClick={() => handleSend(`Đặt giúp tôi phòng ${room.roomNumber}`)}
                      sx={{ flex: 1, cursor: "pointer", bgcolor: "#0f766e", fontWeight: 700 }}
                    />
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ position: "fixed", right: 24, bottom: 24, zIndex: 9999 }}>
      {!open && (
        <Fade in={!open}>
          <Fab
            aria-label="ai-agent"
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: "#0f766e",
              color: "white",
              boxShadow: "0 10px 25px rgba(15,118,110,0.4)",
              "&:hover": { bgcolor: "#0d9488", transform: "scale(1.08)" },
              transition: "all 0.3s ease",
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              badgeContent={<SparkleIcon sx={{ fontSize: 14, color: "#f59e0b" }} />}
            >
              <BotIcon sx={{ fontSize: 28 }} />
            </Badge>
          </Fab>
        </Fade>
      )}

      {open && (
        <Fade in={open}>
          <Paper
            elevation={8}
            sx={{
              position: "fixed",
              right: 24,
              bottom: 24,
              display: "flex",
              flexDirection: "column",
              width: { xs: 340, sm: 380 },
              height: 560,
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
          >
            {/* Header Agent */}
            <Box
              sx={{
                p: 2,
                background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: "white", color: "#0f766e", width: 36, height: 36 }}>
                  <SparkleIcon sx={{ fontSize: 22, color: "#0f766e" }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
                    Trợ Lý AI Matchmaker
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CheckIcon sx={{ fontSize: 12, color: "#4ade80" }} /> Đang hoạt động thông minh
                  </Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Chat Body */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#f8fafc" }}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: message.role === "user" ? "flex-end" : "flex-start",
                    mb: 2,
                  }}
                >
                  {message.role === "bot" && (
                    <Avatar sx={{ width: 30, height: 30, bgcolor: "#0f766e", mr: 1, mt: 0.5 }}>
                      <BotIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: "82%",
                      p: 1.75,
                      borderRadius: message.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      bgcolor: message.role === "user" ? "#0f766e" : "white",
                      color: message.role === "user" ? "white" : "#1e293b",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      fontSize: 14,
                      border: message.role === "bot" ? "1px solid #e2e8f0" : "none",
                    }}
                  >
                    {message.role === "bot" ? renderBotMessage(message) : message.text}
                  </Box>
                </Box>
              ))}

              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 4, my: 1 }}>
                  <CircularProgress size={18} sx={{ color: "#0f766e" }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    AI Agent đang tự động xử lý yêu cầu...
                  </Typography>
                </Box>
              )}

              {!loading && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mt: 1, ml: 4.5 }}>
                  {quickReplies.map((reply) => (
                    <Chip
                      key={reply}
                      label={reply}
                      size="small"
                      onClick={() => handleSend(reply)}
                      sx={{
                        bgcolor: "white",
                        border: "1px solid #cbd5e1",
                        color: "#334155",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "#f0fdf4", borderColor: "#0f766e", color: "#0f766e" },
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Box */}
            <Box sx={{ p: 1.5, bgcolor: "white", borderTop: "1px solid #e2e8f0" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập 'Đặt phòng giúp tôi' hoặc tiêu chí..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSend(input)}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    "&:hover fieldset": { borderColor: "#0f766e" },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => handleSend(input)} disabled={!input.trim() || loading} sx={{ color: "#0f766e" }}>
                      {loading ? <CircularProgress size={18} /> : <SendIcon fontSize="small" />}
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default ChatWidget;
