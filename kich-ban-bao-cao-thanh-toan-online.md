# KỊCH BẢN BÁO CÁO: TÍNH NĂNG THANH TOÁN ONLINE (PAYOS)

Kịch bản này được thiết kế để bạn thuyết trình trực tiếp trước hội đồng (hoặc dùng làm tài liệu mớm cho các AI khác viết báo cáo đồ án). Kịch bản đi từ lúc mở màn hình đến lúc chốt hóa đơn.

---

## 1. Giới thiệu tính năng (Phần nói)

**🎤 Lời dẫn:**
> *"Kính thưa hội đồng, tiếp theo em xin phép demo tính năng cốt lõi của hệ thống, đó là **Thanh toán trực tuyến và Tự động chốt hóa đơn**. Hệ thống của em tích hợp cổng thanh toán quốc gia VietQR thông qua nền tảng PayOS.*
>
> *Điểm nhấn của hệ thống là khi người thuê thanh toán, họ không cần phải nhập thủ công nội dung chuyển khoản hay số tiền. Hệ thống tự động sinh ra một mã QR động (Dynamic QR) chứa sẵn mọi thông tin. Và khi tiền vừa vào tài khoản, máy chủ của PayOS sẽ bắn Webhook về hệ thống Backend của em để tự động chốt hóa đơn ngay lập tức trong 2 giây mà admin không cần can thiệp tay."*

---

## 2. Các bước Demo thực tế trên màn hình (Phần làm)

**💻 Thao tác 1: Đăng nhập và mở hóa đơn**
- Đăng nhập bằng tài khoản Người thuê (Tenant).
- Vào menu **"Hóa đơn của tôi"**.
- Tìm một hóa đơn có trạng thái "Chưa thanh toán" (Đảm bảo hóa đơn này đã được sửa tổng tiền > 2.000 VNĐ).

**🎤 Lời dẫn:**
> *"Ở góc độ người thuê, họ sẽ vào xem các hóa đơn hàng tháng. Em xin phép chọn hóa đơn phòng J1003 tháng này để tiến hành thanh toán."*

**💻 Thao tác 2: Tạo link thanh toán**
- Bấm vào nút **"Thanh toán ngay"** trên giao diện Hóa đơn.
- Giao diện chuyển sang trang quét mã QR của PayOS.

**🎤 Lời dẫn:**
> *"Lúc này, hệ thống Backend của em (Spring Boot) sẽ gọi API sang máy chủ PayOS để khởi tạo một phiên giao dịch mã hóa, và trả về một mã QR động riêng biệt cho hóa đơn này. Như thầy/cô thấy, số tiền và nội dung chuyển khoản đã được điền sẵn."*

**💻 Thao tác 3: Thanh toán thật (Hoặc giả lập)**

**(Nếu bạn dùng điện thoại quét mã thật):**
- Mở App Ngân hàng trên điện thoại của bạn, quét mã QR trên màn hình máy tính và bấm chuyển khoản 2.000 VNĐ.

**(Nếu bạn dùng Script giả lập `test-payos-webhook.js`):**
- Mở Terminal (đã chuẩn bị sẵn) và gõ lệnh chạy script.

**🎤 Lời dẫn:**
> *"Bây giờ em sẽ thực hiện chuyển khoản / [Giả lập chuyển khoản]. Ngay khi hệ thống ngân hàng xử lý xong, một tín hiệu Webhook (HTTP POST) sẽ được bắn trực tiếp từ máy chủ PayOS về máy chủ của em."*

**💻 Thao tác 4: Chốt hóa đơn & Kiểm tra Email**
- Tải lại trang web (F5). Hóa đơn lập tức hiển thị **"Đã thanh toán" (Màu xanh)**.
- Mở tab Email lên, show cho hội đồng xem Email Biên Lai vừa gửi tới.

**🎤 Lời dẫn:**
> *"Hệ thống của em đã nhận được Webhook. Backend tiến hành giải mã chữ ký điện tử (HMAC SHA256) để chống giả mạo. Khi xác thực thành công, hệ thống lập tức chốt trạng thái hóa đơn thành 'Đã thanh toán', và đồng thời kích hoạt một luồng chạy nền (Async) để gửi ngay một Email Biên lai điện tử cho khách hàng như thầy cô đang thấy trên màn hình."*

---

## 3. Trả lời câu hỏi phản biện của Hội đồng (Backup)

**Hỏi: Em làm sao để test được Webhook khi code đang chạy trên máy tính (localhost)?**
> **Đáp:** *"Dạ, máy chủ của PayOS ở trên mạng thì không thể gọi trực tiếp vào localhost của máy em được. Nên em sử dụng công cụ **Ngrok** để tạo ra một đường hầm (tunnel), public cổng 8082 của máy em ra Internet thành một tên miền HTTPS. Em lấy tên miền đó đăng ký lên Dashboard của PayOS làm URL Webhook ạ."*

**Hỏi: Nếu khách hàng sửa số tiền chuyển khoản thì sao?**
> **Đáp:** *"Dạ mã QR này là mã QR tĩnh hoặc động (Dynamic) do PayOS sinh ra. Nếu khách hàng cố tình sửa số tiền thành số nhỏ hơn, Webhook trả về sẽ báo số lượng tiền thực tế. Backend của em sẽ so sánh số tiền nhận được với tổng tiền hóa đơn, nếu không khớp sẽ không duyệt hóa đơn ạ."*

**Hỏi: Dữ liệu này có an toàn không? Kẻ gian tự bắn Webhook giả báo là đã thanh toán thì sao?**
> **Đáp:** *"Dạ Backend của em không tin tưởng hoàn toàn dữ liệu được gửi đến. Trong Payload gửi về có đính kèm một `signature` (Chữ ký điện tử). Backend của em sử dụng `Checksum Key` bí mật để mã hóa lại dữ liệu và so sánh với `signature` đó. Nếu trùng khớp mới xử lý tiếp, nên giả mạo Webhook là không thể ạ."*
