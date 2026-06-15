# CẤU TRÚC THƯ MỤC DỰ ÁN (Smart Phòng Trọ)

Tài liệu này tóm tắt lại cấu trúc thư mục chính theo mô hình `tree /F`.

---

## 1) FRONTEND (React)

```text
frontend/
├─ .gitignore
├─ build.log
├─ build2.log
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ README.md
├─ tailwind.config.js
├─ build/                (build output)
├─ node_modules/         (dependency)
├─ public/
│  ├─ favicon.ico
│  ├─ index.html
│  ├─ logo192.png
│  ├─ logo512.png
│  ├─ manifest.json
│  └─ robots.txt
└─ src/
   ├─ App.js
   ├─ App.css
   ├─ App.test.js
   ├─ index.js
   ├─ index.css
   ├─ logo.svg
   ├─ reportWebVitals.js
   ├─ setupTests.js
   ├─ components/
   │  ├─ ProtectedRoute.js
   │  ├─ RoleBasedGuard.js
   │  └─ ScrollToTop.jsx
   ├─ context/
   ├─ contexts/
   │  └─ AuthContext.jsx
   ├─ features/
   │  ├─ chat/
   │  │  └─ ChatWidget.jsx
   │  └─ payment/
   │     └─ paymentService.js
   ├─ layouts/
   │  ├─ AdminLayout.jsx
   │  ├─ Footer.jsx
   │  ├─ Header.jsx
   │  └─ MainLayout.jsx
   ├─ pages/
   │  ├─ auth/
   │  │  ├─ Login.js
   │  │  └─ Register.jsx
   │  ├─ admin/
   │  │  ├─ AdminDashboard.jsx
   │  │  ├─ ContractManagement.jsx
   │  │  ├─ ExpenseManagement.jsx
   │  │  ├─ InvoiceManagement.jsx
   │  │  ├─ MaintenanceManagement.jsx
   │  │  ├─ NotificationManagement.jsx
   │  │  ├─ ReportManagement.jsx
   │  │  ├─ RequestManagement.jsx
   │  │  ├─ ServiceList.jsx
   │  │  └─ UserManagement.jsx
   │  │  ├─ rooms/
   │  │  │  ├─ RoomAdd.jsx
   │  │  │  ├─ RoomEdit.jsx
   │  │  │  ├─ RoomForm.jsx
   │  │  │  └─ RoomList.jsx
   │  │  └─ services/
   │  │     ├─ ServiceAdd.jsx
   │  │     ├─ ServiceEdit.jsx
   │  │     ├─ ServiceForm.jsx
   │  │     └─ ServiceList.jsx
   │  ├─ tenant/
   │  │  ├─ ChangePassword.jsx
   │  │  ├─ MyContracts.jsx
   │  │  ├─ MyInvoices.jsx
   │  │  ├─ MyNotifications.jsx
   │  │  ├─ MyPayments.jsx
   │  │  ├─ TenantMaintenance.jsx
   │  │  └─ TenantProfile.jsx
   │  │  └─ notifications/
   │  └─ public/
   │     ├─ BookingFormPage.jsx
   │     ├─ ContactPage.jsx
   │     ├─ HomePage.jsx
   │     ├─ RoomDetail.jsx
   │     ├─ RoomsPage.jsx
   │     └─ UnauthorizedPage.jsx
   ├─ services/
   │  ├─ api.js
   │  └─ AuthService.js
   ├─ styles/
   │  └─ Header.css
   └─ utils/
      ├─ authUtils.js
      ├─ formatUtils.js
      └─ formatVND.js
```

---

## 2) BACKEND (Spring Boot)

> Backend nằm ở thư mục `quanliPT/quanliPT`.

```text
quanliPT/quanliPT/
├─ .gitattributes
├─ .gitignore
├─ HELP.md
├─ IntegrationTest.java
├─ mvnw
├─ mvnw.cmd
├─ pom.xml
├─ .mvn/
│  └─ wrapper/
│     └─ maven-wrapper.properties
└─ src/
   ├─ main/
   │  ├─ java/
   │  │  └─ com/example/quanliPT/
   │  │     ├─ QuanliPtApplication.java
   │  │     ├─ config/
   │  │     │  ├─ DataInitializer.java
   │  │     │  ├─ GlobalExceptionHandler.java
   │  │     │  ├─ PayOSConfig.java
   │  │     │  └─ WebConfig.java
   │  │     ├─ controller/
   │  │     │  ├─ AdminDashboardController.java
   │  │     │  ├─ AdminRequestController.java
   │  │     │  ├─ AuthController.java
   │  │     │  ├─ ContractController.java
   │  │     │  ├─ FinanceController.java
   │  │     │  ├─ InvoiceController.java
   │  │     │  ├─ MaintenanceController.java
   │  │     │  ├─ NotificationController.java
   │  │     │  ├─ PaymentController.java
   │  │     │  ├─ PublicController.java
   │  │     │  ├─ RoomController.java
   │  │     │  ├─ ServiceController.java
   │  │     │  ├─ TenantController.java
   │  │     │  ├─ UploadController.java
   │  │     │  └─ UserController.java
   │  │     ├─ dto/
   │  │     │  ├─ ApiResponse.java
   │  │     │  ├─ AuthResponse.java
   │  │     │  ├─ ChangePasswordRequest.java
   │  │     │  ├─ ContactMessageDto.java
   │  │     │  ├─ DashboardDTO.java
   │  │     │  ├─ LoginRequest.java
   │  │     │  ├─ NotificationDTO.java
   │  │     │  ├─ PublicRentalRequestDto.java
   │  │     │  ├─ RegisterRequest.java
   │  │     │  └─ RentalServiceDTO.java
   │  │     ├─ model/
   │  │     │  ├─ BusinessExpense.java
   │  │     │  ├─ ContactMessage.java
   │  │     │  ├─ Contract.java
   │  │     │  ├─ ContractStatus.java
   │  │     │  ├─ Invoice.java
   │  │     │  ├─ InvoiceStatus.java
   │  │     │  ├─ IssueStatus.java
   │  │     │  ├─ MaintenanceRequest.java
   │  │     │  ├─ Notification.java
   │  │     │  ├─ PaymentMethod.java
   │  │     │  ├─ PaymentStatus.java
   │  │     │  ├─ PaymentTransaction.java
   │  │     │  ├─ RentalRequest.java
   │  │     │  ├─ RentalRequestStatus.java
   │  │     │  ├─ RentalService.java
   │  │     │  ├─ Role.java
   │  │     │  ├─ Room.java
   │  │     │  ├─ RoomStatus.java
   │  │     │  └─ User.java
   │  │     ├─ repository/
   │  │     │  ├─ BusinessExpenseRepository.java
   │  │     │  ├─ ContactMessageRepository.java
   │  │     │  ├─ ContractRepository.java
   │  │     │  ├─ InvoiceRepository.java
   │  │     │  ├─ MaintenanceRequestRepository.java
   │  │     │  ├─ NotificationRepository.java
   │  │     │  ├─ PaymentTransactionRepository.java
   │  │     │  ├─ RentalRequestRepository.java
   │  │     │  ├─ RentalServiceRepository.java
   │  │     │  ├─ RoomRepository.java
   │  │     │  └─ UserRepository.java
   │  │     ├─ security/
   │  │     │  ├─ ApplicationConfig.java
   │  │     │  ├─ ContractSecurity.java
   │  │     │  ├─ InvoiceSecurity.java
   │  │     │  ├─ JwtAuthenticationFilter.java
   │  │     │  ├─ JwtUtils.java
   │  │     │  └─ SecurityConfig.java
   │  │     └─ service/
   │  │        ├─ AdminDashboardService.java
   │  │        ├─ AuthService.java
   │  │        ├─ BillingScheduler.java
   │  │        ├─ BillingService.java
   │  │        ├─ ContractBusinessService.java
   │  │        ├─ FinanceService.java
   │  │        ├─ RentalRequestService.java
   │  │        └─ TelegramNotificationService.java
   │  └─ resources/
   │     ├─ application.properties
   │     └─ (các file properties khác tùy môi trường)
   └─ test/
      └─ java/
         └─ com/example/quanliPT/QuanliPtApplicationTests.java

```

---

## 3) Ghi chú nhanh
- Frontend: phân tách theo `pages/` (route theo màn hình) + `features/` (tính năng đặc thù) + `services/` (client API) + `layouts/` (khung giao diện).
- Backend: theo lớp chuẩn Spring: `controller` → `service` → `repository`, và `model/dto/security/config` phục vụ tương tác domain & bảo mật.

---

## Vị trí file
- `frontend/FINAL_FOLDER_STRUCTURE.md`

