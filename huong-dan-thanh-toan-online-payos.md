# HƯỚNG DẪN TÍCH HỢP THANH TOÁN ONLINE BẰNG PAYOS (SPRING BOOT + REACTJS)

Tài liệu này mô tả chi tiết kiến trúc, luồng hoạt động (flow), các file mã nguồn liên quan và cách thức triển khai tính năng thanh toán trực tuyến qua cổng **PayOS** (tạo mã QR VietQR tự động chốt đơn). Hệ thống này là **thanh toán online thật 100%**.

---

## 1. Kiến trúc hệ thống
- **Cổng thanh toán:** PayOS (Hỗ trợ tạo QR Code ngân hàng tự động nhận diện giao dịch).
- **Backend:** Java Spring Boot (Xử lý tạo link thanh toán và lắng nghe Webhook).
- **Frontend:** ReactJS (Giao diện hiển thị hóa đơn và mở trang thanh toán).
- **Tool hỗ trợ:** `ngrok` (Dùng để đưa localhost public ra internet cho PayOS gọi Webhook) và Script Mock giả lập thanh toán (dùng cho Testing).

---

## 2. Luồng hoạt động (Payment Flow) & Vị trí Mã nguồn

### Bước 1: Tạo Link Thanh Toán & Hiển thị QR (Từ Frontend -> Backend -> PayOS)
- **Hành động:** Khách thuê ở Frontend ấn nút "Thanh toán ngay" cho một Hóa đơn (Invoice).
- **Frontend File:** `frontend/src/components/tenant/PaymentModal.jsx` (hoặc `MyInvoices.jsx`).
  - Lệnh gọi API: `axios.post('/api/payments/payos/' + invoiceId)`
- **Backend File:** `quanliPT/src/main/java/com/example/quanliPT/controller/finance/PaymentController.java`
  - **API:** `POST /api/payments/payos/{invoiceId}`
  - Backend sử dụng SDK của PayOS để tạo `PaymentData` (gồm `orderCode`, `amount`, `description`, `returnUrl`...).
  - Hàm `payOS.createPaymentLink(paymentData)` được gọi để gửi thông tin lên máy chủ PayOS.
  - PayOS trả về một URL chứa trang quét mã QR (`checkoutUrl`). Backend gửi URL này ngược về cho Frontend.
- **Kết quả:** Frontend dùng `window.location.href = checkoutUrl` (hoặc mở popup) để đưa người dùng sang giao diện có mã QR của PayOS.

### Bước 2: Khách hàng chuyển khoản
- Người dùng mở App Ngân hàng thật, quét mã QR trên màn hình và thực hiện chuyển đúng số tiền (Tối thiểu 2.000 VNĐ).

### Bước 3: Lắng nghe và Xử lý Webhook (PayOS -> Backend)
- **Hành động:** Khi tiền vào tài khoản, hệ thống PayOS nhận diện được giao dịch và bắn HTTP POST request (Webhook) về Backend.
- **Backend File:** `quanliPT/src/main/java/com/example/quanliPT/controller/finance/PaymentController.java`
  - **API:** `POST /api/payments/payos/callback`
  - **Xử lý thuật toán:**
    1. Nhận chuỗi JSON từ PayOS.
    2. Xác minh chữ ký (`checksum`) bằng `Checksum Key` để đảm bảo không bị giả mạo.
    3. Nếu trạng thái giao dịch là thành công (`00`), Backend tìm Hóa đơn tương ứng bằng `orderCode`.
    4. Cập nhật trạng thái hóa đơn thành `PAID`.
    5. Ghi log vào bảng `PaymentTransaction`.
    6. Gọi `EmailService.java` để gửi Email Biên lai điện tử cho khách.

---

## 3. Cách Setup Test Bằng Tiền Thật (Dùng Ngrok)

Để PayOS biết đường gửi Webhook về máy tính của bạn khi code đang chạy `localhost:8082`, bạn phải dùng Ngrok:
1. Mở terminal gõ: `ngrok http 8082`.
2. Copy link public ngrok cấp (VD: `https://abcd.ngrok-free.app/api/payments/payos/callback`).
3. Truy cập my.payos.vn -> Dự án -> Cài đặt -> Dán link trên vào ô Webhook.
4. Lên Web của bạn, bấm Thanh toán và lấy điện thoại ra **chuyển 2.000 VNĐ thật**. Hóa đơn sẽ tự động nhảy sang "Đã thanh toán".

---

## 4. Script Giả Lập Ngân Hàng (Dành cho Development/Testing)

**Câu hỏi thường gặp:** *Dùng Script này thì có bị coi là thanh toán ảo/offline không?*
**Trả lời:** Không! Luồng code Backend của bạn là **Online 100%**. Script này chỉ đóng vai trò là "Ngân hàng giả lập" (Mock Server) để test code Backend ở môi trường Development mà không phải tốn 2.000đ tiền thật mỗi lần test. Khi lên Production, bạn tắt script này đi, hệ thống vẫn nhận tiền thật từ PayOS bình thường.

**File test:** `test-payos-webhook.js` (Nằm ở thư mục gốc)

**Cách thức hoạt động của Script:**
- Script này tạo ra một `payload` (gói tin JSON) có cấu trúc y hệt như gói tin mà PayOS gửi về khi có khách chuyển khoản thật.
- Script tự động tính toán mã hóa `signature` (HMAC SHA256) y hệt thuật toán của PayOS để vượt qua được khâu bảo mật của Backend.
- Script dùng hàm `fetch` để bắn POST request thẳng vào API `/api/payments/payos/callback` của Backend local.

**Cách dùng script:**
```bash
node test-payos-webhook.js [Mã_OrderCode]
# Ví dụ: node test-payos-webhook.js 19
```
Chạy xong câu lệnh này, Hóa đơn số 19 trên Web sẽ tự động báo Đã thanh toán y như vừa có người quét mã QR thành công.
