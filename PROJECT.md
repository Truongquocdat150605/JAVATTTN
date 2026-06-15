SMART PHÒNG TRỌ - HỆ THỐNG QUẢN LÝ NHÀ TRỌ

TỔNG QUAN
Backend: Spring Boot 3.2 (Java 17), REST API, JWT, Maven. Frontend: React 18 + Material-UI v5 + Axios + React Router v6. Database: MySQL (tên DB: quan_ly_phong_tro). Thanh toán: Stripe (USD) và PayOS (VNĐ). Backend chạy port 8082, Frontend port 3000.

VAI TRÒ & TÀI KHOẢN MẪU
- ADMIN: username `admin`, password `admin123`
- TENANT: tự động tạo khi ký hợp đồng (SĐT = username, mật khẩu mặc định `123456`)

CẤU TRÚC THƯ MỤC CHÍNH
D:\Java_QLPhongTRo\
├── frontend/
│   ├── src/layouts/ (Header, Footer, AdminLayout, MainLayout)
│   ├── src/pages/ (auth, admin, tenant, public)
│   ├── src/components/ (ProtectedRoute, ScrollToTop...)
│   ├── src/services/ (api.js, AuthService.js)
│   ├── src/contexts/ (AuthContext.jsx)
│   ├── src/utils/ (formatVND.js)
│   └── App.js
└── quanliPT/quanliPT/ (backend)
    ├── src/main/java/.../controller (15 controllers)
    ├── service (8 services)
    ├── repository (11 repos)
    ├── model (19 entities)
    ├── dto, config, security
    └── resources/application.properties

CÁCH CHẠY
Backend:
  cd D:\Java_QLPhongTRo\quanliPT\quanliPT
  mvn spring-boot:run
  Swagger: http://localhost:8082/swagger-ui/index.html
  API JSON: http://localhost:8082/v3/api-docs
Frontend:
  cd D:\Java_QLPhongTRo\frontend
  npm install   (chỉ lần đầu)
  npm start
  Web: http://localhost:3000

LUỒNG NGHIỆP VỤ QUAN TRỌNG
1. Tạo hợp đồng (Admin)
   API: POST /api/contracts/create-with-tenant
   Input: roomId, tenantFullName, tenantEmail, tenantPhone, tenantIdentity, startDate, endDate, rentPrice, deposit
   Backend tự động:
     - Tìm/tạo User (mật khẩu 123456, role TENANT)
     - Tạo Contract (status ACTIVE)
     - Cập nhật phòng thành OCCUPIED (ENUM đã có)
     - Tự động tạo hóa đơn tháng đầu (BillingService)
2. Hóa đơn
   - Admin cập nhật chỉ số điện/nước → tự tính tiền
   - Tenant xem hóa đơn: GET /api/invoices/my
   - Thanh toán: tạo QR (Stripe/PayOS) → xác nhận PUT /api/payments/{paymentId}/confirm → Invoice.status = PAID
3. Phân quyền
   - JWT token lưu localStorage
   - ProtectedRoute kiểm tra token + role
   - Header hiển thị menu theo isAdmin / isTenant

LƯU Ý VỀ ENUM (đã đồng bộ giữa code và database)
- rooms.status: AVAILABLE, OCCUPIED, RENTED, MAINTENANCE
- contracts.status: PENDING, ACTIVE, EXPIRED, TERMINATED
- invoices.status: PAID, UNPAID, OVERDUE
- payment_transactions.method: CASH, QR, STRIPE, PAYOS
- payment_transactions.status: PENDING, COMPLETED, CANCELLED
- users.role: ADMIN, TENANT
- Các bảng khác (maintenance_requests, rental_requests, rental_services) cũng đã đồng bộ.
- Nếu thêm ENUM mới, cần chạy ALTER TABLE (Hibernate không tự thêm vào ENUM hiện có).

KIỂM TRA NHANH
- Dùng Swagger UI để test API trực tiếp
- Import Swagger JSON vào Postman
- Dùng MySQL Workbench / phpMyAdmin để xem dữ liệu

CÁC API QUAN TRỌNG
- POST /api/auth/login : đăng nhập
- POST /api/contracts/create-with-tenant : tạo hợp đồng + tenant
- GET /api/rooms/available : danh sách phòng trống
- GET /api/invoices/my : hóa đơn của tôi (tenant)
- POST /api/maintenance?roomId=&description= : gửi yêu cầu bảo trì
- POST /api/payments/payos/{invoiceId} : tạo QR PayOS
- PUT /api/payments/{paymentId}/confirm : xác nhận thanh toán
- POST /api/notifications/admin/send : gửi thông báo (admin)
- GET /api/services : danh sách dịch vụ

TÌNH TRẠNG HIỆN TẠI
- Database đã đồng bộ ENUM, có dữ liệu mẫu (phòng, hợp đồng, hóa đơn, giao dịch)
- Thanh toán Stripe và PayOS đều hoạt động (đã có giao dịch thành công)
- Giao diện trang chủ có banner carousel, đầy đủ các trang admin/tenant/public
- Đã sửa lỗi thiếu OCCUPIED trong bảng rooms và đồng bộ ENUM thanh toán

HỖ TRỢ
- Swagger: http://localhost:8082/swagger-ui/index.html
- Log backend: xem console khi chạy mvn spring-boot:run
- Log frontend: DevTools (F12) → Console / Network

Tài liệu được tạo ngày 30/05/2026 – dùng để khởi động lại phiên làm việc nhanh chóng.