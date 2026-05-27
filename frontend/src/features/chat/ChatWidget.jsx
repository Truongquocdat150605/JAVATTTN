import React, { useMemo, useState } from "react";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Xin chào! Mình là trợ lý Smart Phòng Trọ. Bạn cần hỗ trợ tìm phòng, hóa đơn hay bảo trì?" },
  ]);
  const [input, setInput] = useState("");

  const cannedAnswers = useMemo(
    () => [
      { keys: ["phòng", "trống", "tìm"], text: "Bạn vào mục Danh sách phòng để lọc theo giá/diện tích và gửi yêu cầu thuê trực tiếp." },
      { keys: ["hóa đơn", "thanh toán"], text: "Bạn vào mục Hóa đơn của tôi để xem chi tiết và thanh toán online bằng QR." },
      { keys: ["bảo trì", "hỏng", "sửa"], text: "Bạn vào mục Bảo trì, chọn phòng đang thuê và mô tả sự cố để admin xử lý." },
      { keys: ["hợp đồng"], text: "Bạn vào mục Hợp đồng để xem thời hạn, giá thuê và trạng thái hợp đồng hiện tại." },
      { keys: ["thông tin", "phòng"], text: "Bạn có thể xem thông tin chi tiết về phòng, bao gồm giá, diện tích, và tiện ích." },
      { keys: ["hỗ trợ", "khách hàng"], text: "Bạn có thể liên hệ với chúng tôi qua mục Hỗ trợ khách hàng để được giải đáp thắc mắc." },
    ],
    []
  );

  const askBot = (question) => {
    const q = question.toLowerCase();
    const found = cannedAnswers.find((item) => item.keys.some((k) => q.includes(k)));
    return found ? found.text : "Cảm ơn bạn đã nhắn! Mình chưa hiểu rõ, bạn có thể mô tả thêm về nhu cầu tìm phòng, hợp đồng, hóa đơn hoặc bảo trì không ạ?";
  };

  const send = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((prev) => [...prev, { role: "user", text }, { role: "bot", text: askBot(text) }]);
    setInput("");
  };

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
      {!open && (
        <button onClick={() => setOpen(true)} style={{ borderRadius: 999, padding: "10px 14px" }}>
          AI Hỗ trợ
        </button>
      )}
      {open && (
        <div style={{ width: 320, background: "#fff", border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: 10, background: "#064e3b", color: "#fff", display: "flex", justifyContent: "space-between" }}>
            <strong>Trợ lý Smart Phòng Trọ</strong>
            <button onClick={() => setOpen(false)} style={{ color: "#fff", background: "transparent", border: "none" }}>x</button>
          </div>
          <div style={{ height: 260, overflowY: "auto", padding: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", marginBottom: 8 }}>
                <span style={{ background: m.role === "user" ? "#dcfce7" : "#f3f4f6", padding: "6px 8px", borderRadius: 8, display: "inline-block" }}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, padding: 10 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Nhập câu hỏi..." />
            <button onClick={send}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
