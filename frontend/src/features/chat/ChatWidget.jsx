import React, { useState, useRef, useEffect } from "react";
import { 
  Box, Fab, Paper, Typography, IconButton, TextField, 
  Avatar, Fade, Stack, Chip, CircularProgress
} from "@mui/material";
import { 
  Close as CloseIcon, 
  Send as SendIcon, 
  SmartToy as BotIcon,
} from "@mui/icons-material";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Khởi tạo Gemini với API key từ biến môi trường
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Prompt hệ thống để định hướng câu trả lời
const systemPrompt = `Bạn là trợ lý ảo thông minh của website Smart Phòng Trọ (hệ thống quản lý nhà trọ). 
Nhiệm vụ: trả lời câu hỏi của khách hàng bằng tiếng Việt, ngắn gọn, thân thiện, hữu ích.
Giới thiệu các chức năng chính: xem phòng trống, đặt phòng, tạo hợp đồng, hóa đơn, thanh toán online (QR PayOS/Stripe), yêu cầu bảo trì, thông báo.
Nếu câu hỏi ngoài phạm vi, hãy trả lời: "Vui lòng liên hệ Admin qua hotline 0123.456.789 hoặc gửi tin nhắn trong mục Liên hệ."`;

const quickReplies = [
  "Cách tìm phòng trống?",
  "Thanh toán hóa đơn?",
  "Báo hỏng điện nước",
  "Xem hợp đồng?",
  "Hỗ trợ khẩn cấp"
];

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "🏡 Chào bạn! Mình là trợ lý ảo AI của Smart Phòng Trọ. Bạn cần hỗ trợ gì hôm nay?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      // Xây dựng lịch sử hội thoại để gửi lên Gemini (giữ 6 tin nhắn gần nhất)
      const history = messages.slice(-6).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));
      
      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(`${systemPrompt}\n\nNgười dùng hỏi: ${text}`);
      const reply = result.response.text();
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (error) {
      console.error("Lỗi gọi Gemini:", error);
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Rất tiếc, mình đang gặp sự cố. Vui lòng thử lại sau hoặc liên hệ Admin qua hotline 0123.456.789." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (text) => {
    handleSend(text);
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
              background: "linear-gradient(145deg, #ffffff 0%, #e6f7f5 100%)",
              boxShadow: "0 8px 20px rgba(15,118,110,0.3)",
              border: "1px solid rgba(15,118,110,0.2)",
              width: 56,
              height: 56,
              "&:hover": { 
                transform: "scale(1.08)",
                boxShadow: "0 12px 28px rgba(15,118,110,0.4)",
                background: "linear-gradient(145deg, #f0fdfa 0%, #ccf0ec 100%)"
              },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Box sx={{ position: "relative", width: 32, height: 32 }}>
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 32, height: 32 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15h-2v-2h2v2zm0-4h-2V7h2v6zm6 4h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                <circle cx="8.5" cy="9.5" r="1.5" fill="white"/>
                <circle cx="15.5" cy="9.5" r="1.5" fill="white"/>
                <path d="M12 17c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" fill="white"/>
              </svg>
            </Box>
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
              width: { xs: 320, sm: 360 },
              height: 500,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
              border: "1px solid rgba(0,0,0,0.05)",
              zIndex: 9999,
            }}
          >
            {/* Header */}
            <Box sx={{ 
              p: 2, 
              background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)", 
              color: "white", 
              display: "flex", 
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: "white", color: "#0f766e", width: 32, height: 32 }}>
                  <BotIcon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                    Trợ lý AI
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    (Gemini) • Luôn sẵn sàng
                  </Typography>
                </Box>
              </Stack>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#f8fafc" }}>
              {messages.map((m, i) => (
                <Box 
                  key={i} 
                  sx={{ 
                    display: "flex", 
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                    mb: 2 
                  }}
                >
                  {m.role === "bot" && (
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "#0f766e", mr: 1, mt: 0.5 }}>
                      <BotIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: "75%",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: m.role === "user" ? "#0f766e" : "white",
                      color: m.role === "user" ? "white" : "text.primary",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      borderTopRightRadius: m.role === "user" ? 4 : 16,
                      borderTopLeftRadius: m.role === "bot" ? 4 : 16,
                      fontSize: "0.9rem"
                    }}
                  >
                    {m.text}
                    {m.role === "bot" && loading && i === messages.length - 1 && (
                      <CircularProgress size={12} sx={{ ml: 1, color: "#0f766e" }} />
                    )}
                  </Box>
                </Box>
              ))}
              
              {/* Quick Replies */}
              {!loading && messages[messages.length - 1]?.role === "bot" && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1, ml: 4.5 }}>
                  {quickReplies.map((qr, idx) => (
                    <Chip 
                      key={idx} 
                      label={qr} 
                      size="small" 
                      onClick={() => handleQuickReply(qr)}
                      sx={{ 
                        bgcolor: "white", 
                        border: "1px solid #0f766e", 
                        color: "#0f766e",
                        "&:hover": { bgcolor: "#f0fdfa" } 
                      }} 
                    />
                  ))}
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 1.5, bgcolor: "white", borderTop: "1px solid #e2e8f0" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập câu hỏi của bạn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleSend(input)}
                disabled={loading}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 6,
                    pr: 0.5
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton 
                      color="primary" 
                      onClick={() => handleSend(input)}
                      disabled={!input.trim() || loading}
                      sx={{ color: "#0f766e" }}
                    >
                      {loading ? <CircularProgress size={18} /> : <SendIcon fontSize="small" />}
                    </IconButton>
                  )
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