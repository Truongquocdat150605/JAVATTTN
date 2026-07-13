# HƯỚNG DẪN TÍCH HỢP THANH TOÁN QUỐC TẾ BẰNG STRIPE (SPRING BOOT + REACTJS)

Tài liệu này mô tả chi tiết kiến trúc và luồng hoạt động của tính năng thanh toán quốc tế qua cổng **Stripe** trong hệ thống Smart Phòng Trọ.

---

## 1. Tổng quan hệ thống
- **Cổng thanh toán:** Stripe (Hỗ trợ thẻ Visa, Mastercard...).
- **Backend:** Java Spring Boot sử dụng thư viện `stripe-java`.
- **Đặc thù tiền tệ:** Vì Stripe không hỗ trợ trực tiếp nạp tiền bằng VNĐ ở một số khu vực, hệ thống của chúng ta tự động **quy đổi VNĐ sang USD** (Tỷ giá giả định: 1 USD = 25.000 VNĐ) trước khi gửi lên Stripe. Số tiền sau quy đổi được nhân với 100 vì Stripe tính theo `cents` (xu).

---

## 2. Luồng hoạt động (Stripe Payment Flow)

1. **Khởi tạo thanh toán (Frontend -> Backend):**
   - Khách thuê ấn chọn thanh toán bằng thẻ quốc tế (Stripe) cho hóa đơn.
   - Frontend gửi POST request tới `POST /api/payments/stripe/{invoiceId}`.

2. **Xử lý tại Backend (Stripe Checkout Session):**
   - Backend lấy tổng tiền hóa đơn (VNĐ).
   - Quy đổi sang Cents: `long amountInCents = (stripeAmount / 250);` (Tương đương chia 25.000 rồi nhân 100).
   - Đảm bảo số tiền tối thiểu `amountInCents >= 50` (vì Stripe yêu cầu giao dịch tối thiểu là $0.50).
   - Backend gọi API của Stripe để tạo một `SessionCreateParams`. Tham số truyền vào gồm: Tên hóa đơn, Giá tiền USD (cents), `success_url` và `cancel_url`.
   - Stripe trả về `session.getUrl()`.
   - Backend tạo sẵn một bản ghi `PaymentTransaction` với trạng thái `PENDING` và trả `session.getUrl()` về cho Frontend.

3. **Thanh toán trên trang Stripe (Frontend):**
   - Frontend nhận `checkoutUrl` và tự động chuyển hướng (redirect) hoặc mở cửa sổ mới để khách điền thông tin thẻ Visa/Mastercard.
   - Khi thanh toán thành công, Stripe tự động chuyển hướng khách hàng về `success_url` của Frontend. (Ví dụ: `http://localhost:3000/tenant/invoices?status=success`).

4. **Xác nhận thanh toán (Success URL):**
   - Hiện tại, hệ thống cập nhật trạng thái Hóa đơn sang `PAID` và Transaction sang `COMPLETED` trực tiếp thông qua Success URL khi khách hàng quay lại ứng dụng, hoặc xác nhận ngay trong lúc Backend sinh link (nếu hệ thống không dùng Webhook cho Stripe).
   - *Lưu ý:* Để bảo mật cao nhất, môi trường Production của Stripe cũng cần cấu hình Webhook tương tự như PayOS để Backend tự động lắng nghe sự kiện `checkout.session.completed` từ máy chủ Stripe.

---

## 3. Cấu hình (Application.properties)

Để Stripe hoạt động, cần điền 2 Key lấy từ Dashboard của Stripe (https://dashboard.stripe.com/test/apikeys):
```properties
stripe.secret.key=sk_test_... (Dùng cho Backend)
stripe.publishable.key=pk_test_... (Dùng cho Frontend nếu cần gọi trực tiếp)
```

## 4. Đoạn code tham khảo chính (PaymentController.java)

```java
@PostMapping("/stripe/{invoiceId}")
public ResponseEntity<?> payWithStripe(@PathVariable Long invoiceId) {
    Invoice invoice = invoiceRepository.findById(invoiceId).orElseThrow();
    
    // Quy đổi VNĐ sang USD cents
    long stripeAmount = invoice.getTotalAmount().longValue();
    long amountInCents = stripeAmount / 250; 
    if (amountInCents < 50) amountInCents = 50; // Tối thiểu $0.50

    // Cấu hình Stripe Session
    SessionCreateParams params = SessionCreateParams.builder()
        .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
        .setMode(SessionCreateParams.Mode.PAYMENT)
        .setSuccessUrl("http://localhost:3000/tenant/invoices?status=success&invoiceId=" + invoiceId)
        .setCancelUrl("http://localhost:3000/tenant/invoices?status=cancel")
        .addLineItem(SessionCreateParams.LineItem.builder()
            .setQuantity(1L)
            .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("usd") // Sử dụng USD
                .setUnitAmount(amountInCents)
                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                    .setName("Thanh toan hoa don #" + invoiceId)
                    .build())
                .build())
            .build())
        .build();

    // Gọi API Stripe
    Session session = Session.create(params);
    return ResponseEntity.ok(Map.of("checkoutUrl", session.getUrl()));
}
```

---
**Ghi chú cho AI hỗ trợ:** Flow này tập trung vào tạo Checkout Session của Stripe và quy đổi VNĐ sang USD do giới hạn về tiền tệ của hệ thống test Stripe. Hãy dựa vào flow này để debug nếu người dùng gặp lỗi liên quan đến Stripe Checkout hoặc Webhook Stripe.
