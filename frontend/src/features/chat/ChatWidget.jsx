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
} from "@mui/material";
import {
  AddShoppingCart as BookIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Visibility as EyeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8082";
const IMAGE_BASE = `${API_BASE}/uploads/`;

const quickReplies = [
  "Cach tim phong trong?",
  "Thanh toan hoa don?",
  "Bao hong dien nuoc",
  "Xem hop dong?",
  "Ho tro khan cap",
];

const formatVND = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(value || 0));

const getImageUrl = (image) => {
  if (!image) return "";
  return image.startsWith("http") ? image : `${IMAGE_BASE}${image}`;
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Chao ban! Minh la tro ly ao cua Smart Phong Tro. Ban can ho tro gi hom nay?",
      roomsInfo: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async (text) => {
    const cleanText = text.trim();
    if (!cleanText || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: cleanText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/public/chat", {
        message: cleanText,
        history: messages.slice(-6).filter((m) => m.role === "user" || m.role === "bot"),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: res?.reply || "Xin loi, minh chua the tra loi luc nay.",
          roomsInfo: Array.isArray(res?.roomsInfo) ? res.roomsInfo : [],
        },
      ]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Minh dang gap su co ket noi. Ban vui long thu lai sau hoac lien he Admin qua hotline 0123.456.789.",
          roomsInfo: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderBotMessage = (message) => {
    const rooms = message.roomsInfo || [];
    if (!rooms.length) return message.text;

    return (
      <Box>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
          {message.text}
        </Typography>
        <Stack spacing={1}>
          {rooms.slice(0, 3).map((room) => (
            <Paper key={room.id} variant="outlined" sx={{ overflow: "hidden", borderRadius: 2 }}>
              {room.image && (
                <Box
                  component="img"
                  src={getImageUrl(room.image)}
                  alt={`Phong ${room.roomNumber}`}
                  sx={{ width: "100%", height: 100, objectFit: "cover", display: "block" }}
                />
              )}
              <Box sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0f766e">
                  Phong {room.roomNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                  Loai: {room.type || "-"} - DT: {room.area || "-"} m2
                </Typography>
                <Typography variant="body2" fontWeight={800} color="error" sx={{ mb: 1 }}>
                  {formatVND(room.price)}/thang
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    size="small"
                    icon={<EyeIcon sx={{ fontSize: "14px !important" }} />}
                    label="Chi tiet"
                    onClick={() => {
                      setOpen(false);
                      navigate(`/rooms/${room.id}`);
                    }}
                    sx={{ flex: 1, cursor: "pointer" }}
                  />
                  <Chip
                    size="small"
                    icon={<BookIcon sx={{ fontSize: "14px !important" }} />}
                    label="Dat ngay"
                    color="primary"
                    onClick={() => {
                      setOpen(false);
                      navigate("/booking-form", { state: { roomId: room.id } });
                    }}
                    sx={{ flex: 1, cursor: "pointer", bgcolor: "#0f766e" }}
                  />
                </Stack>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={{ position: "fixed", right: 24, bottom: 24, zIndex: 9999 }}>
      {!open && (
        <Fade in={!open}>
          <Fab
            aria-label="chat"
            onClick={() => setOpen(true)}
            sx={{
              bgcolor: "white",
              color: "#0f766e",
              boxShadow: "0 8px 20px rgba(15,118,110,0.3)",
              border: "1px solid rgba(15,118,110,0.2)",
              "&:hover": { bgcolor: "#f0fdfa", transform: "scale(1.06)" },
            }}
          >
            <BotIcon />
          </Fab>
        </Fade>
      )}

      {open && (
        <Fade in={open}>
          <Paper
            elevation={6}
            sx={{
              position: "fixed",
              right: 24,
              bottom: 24,
              display: "flex",
              flexDirection: "column",
              width: { xs: 320, sm: 370 },
              height: 520,
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2, bgcolor: "#0f766e", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: "white", color: "#0f766e", width: 32, height: 32 }}>
                  <BotIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800} lineHeight={1.2}>
                    Tro ly AI
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.85 }}>
                    Luon san sang ho tro
                  </Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>

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
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "#0f766e", mr: 1, mt: 0.5 }}>
                      <BotIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: "78%",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: message.role === "user" ? "#0f766e" : "white",
                      color: message.role === "user" ? "white" : "text.primary",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      fontSize: 14,
                    }}
                  >
                    {message.role === "bot" ? renderBotMessage(message) : message.text}
                  </Box>
                </Box>
              ))}

              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 4 }}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary">
                    Dang tra loi...
                  </Typography>
                </Box>
              )}

              {!loading && messages[messages.length - 1]?.role === "bot" && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, ml: 4.5 }}>
                  {quickReplies.map((reply) => (
                    <Chip
                      key={reply}
                      label={reply}
                      size="small"
                      onClick={() => handleSend(reply)}
                      sx={{ bgcolor: "white", border: "1px solid #0f766e", color: "#0f766e" }}
                    />
                  ))}
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 1.5, bgcolor: "white", borderTop: "1px solid #e2e8f0" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhap cau hoi cua ban..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSend(input)}
                disabled={loading}
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
