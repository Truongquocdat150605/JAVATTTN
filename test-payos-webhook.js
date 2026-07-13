const crypto = require('crypto');

// Config PayOS của bạn
const CHECKSUM_KEY = '61f5c3b171e082eaa7cf4ecce1fb4d8f7a185e6b68cfd94260ddfb7d23ff6231';
const API_URL = 'http://localhost:8082/api/payments/payos/callback';

// Lấy OrderCode từ dòng lệnh (ví dụ: node test-payos-webhook.js 12345)
const orderCode = process.argv[2];

if (!orderCode) {
    console.error("❌ Vui lòng nhập Mã đơn hàng (OrderCode). Ví dụ: node test-payos-webhook.js 12345");
    process.exit(1);
}

// 1. Tạo Data giả lập (thành công)
const data = {
    orderCode: parseInt(orderCode),
    amount: 2000,
    description: "Thanh toan tien phong",
    accountNumber: "123456789",
    reference: "REF" + Date.now(),
    transactionDateTime: "2024-01-01 12:00:00",
    currency: "VND",
    paymentLinkId: "TEST_LINK_ID",
    code: "00",
    desc: "success",
    counterAccountBankId: "VCB",
    counterAccountBankName: "Vietcombank",
    counterAccountName: "NGUYEN VAN A",
    counterAccountNumber: "0987654321",
    virtualAccountName: "CTY PAYOS",
    virtualAccountNumber: "11111111"
};

// 2. Tạo chữ ký HMAC SHA256 y hệt PayOS chuẩn
const signData = `amount=${data.amount}&cancel=false&description=${data.description}&orderCode=${data.orderCode}&status=PAID`;
const signature = crypto.createHmac('sha256', CHECKSUM_KEY).update(signData).digest('hex');

// 3. Đóng gói Payload gửi lên Webhook
const payload = {
    code: "00",
    desc: "success",
    success: true,
    data: data,
    signature: signature
};

console.log("🚀 Đang gửi Webhook giả lập đến:", API_URL);
console.log("📦 Payload:", JSON.stringify(payload, null, 2));

// 4. Gửi Request bằng Fetch API
fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
})
.then(async res => {
    const text = await res.text();
    console.log("✅ Kết quả từ Server:", text);
})
.catch(err => {
    console.error("❌ Lỗi kết nối Server:", err.message);
});
