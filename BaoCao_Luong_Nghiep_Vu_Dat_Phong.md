# Báo Cáo Luồng Nghiệp Vụ Đặt Phòng Trọ

## 1. Mục Đích Của Luồng Nghiệp Vụ

Trong hệ thống quản lý phòng trọ, chức năng đặt phòng không chỉ là một form để khách nhập thông tin. Mục đích chính của luồng nghiệp vụ là giúp hệ thống quản lý được toàn bộ quá trình từ lúc khách có nhu cầu thuê phòng cho đến khi admin xác nhận và tạo hợp đồng.

Luồng này giúp trả lời các câu hỏi nghiệp vụ quan trọng:

- Khách đã gửi yêu cầu thuê phòng hay chưa?
- Admin đã nhận được yêu cầu đó chưa?
- Yêu cầu đang chờ duyệt, đã duyệt hay bị từ chối?
- Khi admin duyệt thì hệ thống có tạo hợp đồng và hóa đơn không?
- Khách thuê có thể theo dõi kết quả trong tài khoản cá nhân không?

Vì vậy, mục đích của chức năng này là đảm bảo cả khách thuê và admin đều biết trạng thái xử lý của việc thuê phòng.

## 2. Luồng Tổng Quát

Luồng nghiệp vụ đặt phòng trong hệ thống gồm các bước:

1. Khách xem danh sách phòng trống.
2. Khách chọn một phòng muốn thuê.
3. Khách nhập thông tin yêu cầu thuê phòng.
4. Hệ thống lưu yêu cầu với trạng thái chờ duyệt.
5. Admin vào trang quản lý yêu cầu để xem yêu cầu mới.
6. Admin kiểm tra thông tin khách và phòng.
7. Admin duyệt hoặc từ chối yêu cầu.
8. Nếu duyệt, hệ thống tạo hợp đồng thuê phòng.
9. Hệ thống cập nhật trạng thái phòng thành đã thuê.
10. Hệ thống tạo hóa đơn đầu tiên cho khách.
11. Khách đăng nhập vào trang cá nhân để xem hợp đồng và hóa đơn.

## 3. Luồng Chi Tiết

### Bước 1: Khách Gửi Yêu Cầu Thuê Phòng

Khách vào trang danh sách phòng, chọn một phòng còn trống và bấm đặt phòng. Sau đó khách nhập các thông tin như họ tên, số điện thoại, email, CCCD, ngày muốn chuyển vào và ghi chú nếu có.

Khi khách bấm gửi yêu cầu, hệ thống tạo một bản ghi yêu cầu thuê phòng với trạng thái ban đầu là `PENDING`, nghĩa là chờ admin duyệt.

Ở bước này, phòng chưa được chuyển sang trạng thái đã thuê. Lý do là admin vẫn cần xác nhận lại thông tin trước khi tạo hợp đồng chính thức.

### Bước 2: Admin Nhận Yêu Cầu

Sau khi khách gửi yêu cầu, admin có thể nhìn thấy yêu cầu trong trang quản lý yêu cầu thuê. Mỗi yêu cầu hiển thị thông tin khách, phòng muốn thuê, số điện thoại, email, ngày muốn chuyển vào và trạng thái xử lý.

Điều này giúp admin biết rằng khách đã gửi yêu cầu thành công. Đây cũng là điểm chứng minh hệ thống không chỉ nhận form, mà còn đưa dữ liệu vào quy trình quản lý.

### Bước 3: Admin Duyệt Hoặc Từ Chối

Admin có hai hướng xử lý:

- Từ chối yêu cầu nếu thông tin không hợp lệ hoặc phòng không còn phù hợp.
- Duyệt yêu cầu và tạo hợp đồng nếu thông tin hợp lệ.

Nếu admin từ chối, yêu cầu chuyển sang trạng thái `REJECTED`. Hệ thống không tạo hợp đồng, không tạo hóa đơn và phòng vẫn còn trống.

Nếu admin duyệt, yêu cầu chuyển sang trạng thái `APPROVED`. Hệ thống tạo hợp đồng thuê phòng cho khách.

### Bước 4: Tạo Hợp Đồng Và Hóa Đơn

Khi admin duyệt yêu cầu, hệ thống thực hiện các xử lý sau:

- Tạo hợp đồng thuê phòng.
- Gắn hợp đồng với khách thuê.
- Gắn hợp đồng với phòng được chọn.
- Lưu giá thuê, tiền cọc, ngày bắt đầu và ngày kết thúc nếu có.
- Cập nhật trạng thái phòng thành đã thuê.
- Tạo hóa đơn đầu tiên cho khách thuê.

Như vậy, việc duyệt không chỉ là đổi trạng thái yêu cầu. Nó còn sinh ra các dữ liệu nghiệp vụ quan trọng là hợp đồng và hóa đơn.

### Bước 5: Khách Theo Dõi Trong Tài Khoản Cá Nhân

Sau khi admin duyệt, khách đăng nhập vào hệ thống có thể kiểm tra:

- Trang hợp đồng của tôi: xem hợp đồng thuê phòng đã được tạo.
- Trang hóa đơn của tôi: xem hóa đơn cần thanh toán.
- Trang thông tin cá nhân: kiểm tra thông tin tài khoản khách thuê.

Điều này giúp khách biết yêu cầu của mình đã được xử lý, không cần hỏi trực tiếp admin.

## 4. Cách Trả Lời Khi Thầy Hỏi

### Câu hỏi 1: Khi khách đặt phòng thì làm sao biết khách đã đặt?

Có thể trả lời:

Khi khách gửi yêu cầu thuê phòng, hệ thống lưu yêu cầu vào cơ sở dữ liệu với trạng thái chờ duyệt. Admin có thể nhìn thấy yêu cầu đó trong trang quản lý yêu cầu thuê. Nếu admin duyệt, hệ thống sẽ tạo hợp đồng và hóa đơn cho khách. Khách đăng nhập vào tài khoản cá nhân sẽ thấy hợp đồng và hóa đơn của mình.

### Câu hỏi 2: Tại sao khách gửi yêu cầu rồi chưa có hợp đồng ngay?

Có thể trả lời:

Vì thuê phòng là nghiệp vụ cần admin xác nhận. Khách gửi yêu cầu chỉ thể hiện mong muốn thuê phòng. Admin phải kiểm tra thông tin khách, phòng, ngày vào ở, giá thuê và tiền cọc. Sau khi admin duyệt thì hệ thống mới tạo hợp đồng chính thức.

### Câu hỏi 3: Nếu admin không duyệt thì sao?

Có thể trả lời:

Nếu admin từ chối, yêu cầu chuyển sang trạng thái từ chối. Hệ thống không tạo hợp đồng, không tạo hóa đơn và phòng vẫn giữ trạng thái còn trống.

### Câu hỏi 4: Nếu admin duyệt thì hệ thống làm gì?

Có thể trả lời:

Khi admin duyệt, hệ thống tạo hợp đồng thuê phòng, cập nhật phòng sang trạng thái đã thuê và tạo hóa đơn đầu tiên cho khách. Sau đó khách có thể vào trang cá nhân để xem hợp đồng và hóa đơn.

### Câu hỏi 5: Làm sao chứng minh đây là luồng nghiệp vụ chứ không chỉ là giao diện?

Có thể trả lời:

Vì sau mỗi thao tác, hệ thống đều thay đổi dữ liệu thật trong cơ sở dữ liệu. Khách gửi yêu cầu thì sinh bản ghi yêu cầu thuê. Admin duyệt thì sinh hợp đồng, sinh hóa đơn và cập nhật trạng thái phòng. Các dữ liệu này được dùng tiếp ở các màn hình khác như quản lý hợp đồng, quản lý hóa đơn và trang cá nhân của khách thuê.

## 5. Kịch Bản Demo Gợi Ý

Khi demo cho thầy, có thể làm theo thứ tự:

1. Vào trang danh sách phòng.
2. Chọn một phòng còn trống.
3. Bấm đặt phòng.
4. Nhập thông tin khách thuê và gửi yêu cầu.
5. Chuyển sang tài khoản admin.
6. Vào trang quản lý yêu cầu thuê.
7. Chỉ cho thầy thấy yêu cầu mới đang ở trạng thái chờ duyệt.
8. Bấm duyệt và tạo hợp đồng.
9. Vào trang quản lý hợp đồng để thấy hợp đồng mới.
10. Vào trang quản lý hóa đơn để thấy hóa đơn mới.
11. Đăng nhập lại tài khoản khách thuê.
12. Vào trang hợp đồng của tôi và hóa đơn của tôi để thấy dữ liệu đã được tạo.

## 6. Ví Dụ So Sánh Với Website Bán Hàng

Nếu website bán hàng có luồng đặt hàng thì:

- User bấm đặt hàng.
- Hệ thống tạo đơn hàng.
- Admin thấy đơn hàng mới.
- Admin xác nhận hoặc hủy đơn.
- User xem trạng thái đơn hàng trong tài khoản.

Với website quản lý phòng trọ thì tương ứng:

- Khách bấm đặt phòng.
- Hệ thống tạo yêu cầu thuê phòng.
- Admin thấy yêu cầu thuê mới.
- Admin duyệt hoặc từ chối.
- Nếu duyệt, hệ thống tạo hợp đồng và hóa đơn.
- Khách xem hợp đồng và hóa đơn trong tài khoản.

Điểm khác là đặt phòng không tạo hợp đồng ngay lập tức, vì cần admin xác nhận trước.

## 7. Câu Trả Lời Ngắn Gọn Nhất

Nếu thầy hỏi nhanh, có thể trả lời:

Trong bài của em, khi khách đặt phòng thì hệ thống tạo một yêu cầu thuê ở trạng thái chờ duyệt. Admin sẽ thấy yêu cầu này trong trang quản lý yêu cầu. Khi admin duyệt, hệ thống tự tạo hợp đồng, tạo hóa đơn đầu tiên và cập nhật trạng thái phòng thành đã thuê. Sau đó khách vào trang cá nhân sẽ xem được hợp đồng và hóa đơn của mình. Đây là luồng nghiệp vụ từ đặt phòng đến duyệt, tạo hợp đồng và thanh toán.
## 8. Cong Nghe Su Dung Va Vi Tri Code Quan Trong

### 8.1. Frontend ReactJS

Frontend dung ReactJS de xay dung giao dien cho khach thue va admin.

File giao dien chinh:

- `frontend/src/pages/public/BookingFormPage.jsx`: form khach gui yeu cau thue phong.
- `frontend/src/pages/admin/RequestManagement.jsx`: admin xem yeu cau thue, duyet hoac tu choi.
- `frontend/src/pages/admin/contracts/ContractList.jsx`: admin quan ly hop dong.
- `frontend/src/pages/admin/invoices/InvoiceList.jsx`: admin quan ly hoa don, xem hoa don moi sinh, bam nut demo sinh hoa don.
- `frontend/src/pages/admin/invoices/InvoiceEdit.jsx`: admin nhap chi so dien nuoc va luu hoa don.
- `frontend/src/pages/admin/invoices/InvoiceForm.jsx`: hien thi tien dien, tien nuoc, tong tien theo du lieu dang nhap.
- `frontend/src/pages/tenant/MyContracts.jsx`: tenant xem hop dong cua minh.
- `frontend/src/pages/tenant/MyInvoices.jsx`: tenant xem hoa don cua minh va thanh toan online.
- `frontend/src/pages/tenant/TenantProfile.jsx`: tenant cap nhat thong tin ca nhan.

Loi ich:

- Giao dien tach rieng cho admin va tenant.
- Admin thay yeu cau, hop dong, hoa don.
- Tenant thay hop dong va hoa don cua chinh minh.
- Trang hoa don admin va tenant co auto refresh de khi demo sinh hoa don tu dong, ca hai ben deu thay du lieu moi.

### 8.2. Backend Spring Boot

Backend dung Spring Boot de xay dung API, xu ly nghiep vu, phan quyen va ket noi database.

File backend chinh:

- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/controller/guest/PublicController.java`: nhan yeu cau thue phong tu khach.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/controller/admin/AdminRequestController.java`: admin duyet yeu cau thue va goi tao hop dong.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/service/contract/ContractBusinessService.java`: xu ly tao tenant, tao hop dong, cap nhat phong va tao hoa don dau tien.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/service/finance/BillingService.java`: xu ly sinh hoa don theo hop dong.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/service/task/BillingScheduler.java`: lich tu dong chay sinh hoa don dinh ky.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/controller/finance/InvoiceController.java`: API quan ly hoa don, cap nhat dien nuoc, sinh hoa don.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/controller/finance/PaymentController.java`: API thanh toan online.

Loi ich:

- Controller nhan request tu frontend.
- Service xu ly nghiep vu that.
- Repository thao tac voi database.
- Code tach lop ro rang, de giai thich khi demo.

### 8.3. Luong Tao Hop Dong Va Hoa Don Dau Tien

Khi admin duyet yeu cau thue, ham chinh la:

`ContractBusinessService.createContractAndTenant(...)`

Ham nay lam cac viec:

1. Tim phong theo `roomId`.
2. Tim hoac tao tai khoan tenant.
3. Tao hop dong moi.
4. Cap nhat trang thai phong thanh da thue.
5. Goi `billingService.generateInvoiceForContract(contract)` de tao hoa don dau tien.

Loi ich:

- Admin khong can tao hop dong va hoa don bang tay.
- Duyet yeu cau thue la he thong tu sinh du lieu nghiep vu that.
- Tenant vao tai khoan se thay hop dong va hoa don.

### 8.4. Sinh Hoa Don Dinh Ky

Chuc nang sinh hoa don dinh ky nam o:

`BillingScheduler.runMonthlyBilling()`

Scheduler goi:

`BillingService.generateMonthlyInvoices(...)`

Cau hinh lich chay nam trong:

`quanliPT/quanliPT/src/main/resources/application-dev.properties`

Cau hinh chay that:

```properties
app.billing.monthly-cron=0 0 0 1 * ?
app.billing.scheduler-force-create=false
```

Y nghia:

- `0 0 0 1 * ?` la chay luc 00:00 ngay 1 moi thang.
- `scheduler-force-create=false` la che do that, tranh tao trung hoa don trong cung thang.

Cau hinh demo:

```properties
# app.billing.monthly-cron=0 * * * * ?
# app.billing.scheduler-force-create=true
```

Y nghia:

- Chay moi phut de thay ket qua tren giao dien.
- `scheduler-force-create=true` dung rieng khi demo de tao hoa don that moi lan chay.

Cau tra loi khi thay hoi:

"Trong thuc te he thong chay dau moi thang. Khi demo em doi cron sang moi phut de thay ket qua ngay tren giao dien admin va tenant. Sau demo em doi lai cron dau thang va tat force-create."

### 8.5. Cap Nhat Dien Nuoc Va Tinh Tong Hoa Don

Frontend tinh tien dien nuoc tai:

- `frontend/src/pages/admin/invoices/InvoiceEdit.jsx`
- `frontend/src/pages/admin/invoices/InvoiceForm.jsx`

Ham chinh:

- `calculateElectricityAmount()`: tinh tien dien.
- `calculateWaterAmount()`: tinh tien nuoc.
- `calculateTotal()`: tinh tong tien hoa don.

Backend cung tu tinh lai khi luu tai:

`InvoiceController.recalculateInvoiceAmounts(...)`

Cong thuc:

```text
Tien dien = max(0, chi so moi - chi so cu) * don gia dien
Tien nuoc = max(0, chi so moi - chi so cu) * don gia nuoc
Tong tien = tien phong + tien dien + tien nuoc + phi dich vu
```

Loi ich:

- Admin nhap chi so dien/nuoc thi giao dien cap nhat tien ngay.
- Backend van tinh lai de tranh frontend gui sai tong tien.

### 8.6. Thanh Toan Online

Thanh toan online nam o:

- `frontend/src/components/tenant/PaymentModal.jsx`: giao dien chon phuong thuc thanh toan.
- `frontend/src/pages/tenant/MyInvoices.jsx`: tenant chon hoa don va mo modal thanh toan.
- `frontend/src/features/payment/paymentService.js`: goi API thanh toan.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/controller/finance/PaymentController.java`: backend tao giao dich va xac nhan thanh toan.

Luong thanh toan:

1. Tenant chon hoa don chua thanh toan.
2. Tenant chon phuong thuc PayOS hoac Stripe.
3. Backend tao `PaymentTransaction` voi trang thai `PENDING`.
4. Backend tra ve link/QR thanh toan.
5. Sau khi thanh toan thanh cong, he thong cap nhat hoa don sang `PAID`.
6. He thong luu ngay thanh toan vao `paymentDate`.

Loi ich:

- Tenant thanh toan online thay vi bao admin thu cong.
- Admin biet hoa don nao da thanh toan.
- He thong co lich su giao dich de doi chieu.

#### Thanh Toan Tien Mat

Ngoai thanh toan online, he thong co luong thanh toan tien mat:

1. Tenant mo hoa don chua thanh toan va chon `Thanh toan tien mat`.
2. Backend tao `PaymentTransaction` voi `method = CASH`, `status = PENDING`.
3. Hoa don van giu trang thai `UNPAID` de tranh viec tenant tu danh dau da thanh toan.
4. Admin thu tien ngoai thuc te, sau do bam nut xac nhan thu tien mat tren trang quan ly hoa don.
5. Backend chuyen giao dich sang `COMPLETED`, cap nhat hoa don sang `PAID`, luu `paymentDate`.

File va ham lien quan:

- `frontend/src/components/tenant/PaymentModal.jsx`: hien thi lua chon thanh toan tien mat.
- `frontend/src/pages/tenant/MyInvoices.jsx`: goi API ghi nhan tenant chon tien mat.
- `frontend/src/pages/admin/invoices/InvoiceList.jsx`: admin xac nhan da thu tien mat.
- `frontend/src/features/payment/paymentService.js`: khai bao API `payWithCash` va `confirmCashPayment`.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/controller/finance/PaymentController.java`: ham `requestCashPayment` va `confirmCashPayment`.

Y nghia nghiep vu:

- Neu tenant tra tien mat, he thong van co bang chung tren phan mem.
- Tenant khong the tu doi hoa don thanh da thanh toan.
- Admin la nguoi xac nhan cuoi cung sau khi da thu tien that.
- Lich su thanh toan van luu trong `payment_transactions` de doi chieu sau nay.

### 8.7. Cach Tinh Phi Dich Vu

File lien quan:

- `frontend/src/pages/admin/services/ServiceList.jsx`: admin quan ly danh muc dich vu.
- `frontend/src/pages/admin/rooms/RoomForm.jsx`: admin chon dich vu ap dung cho tung phong.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/controller/room/RoomController.java`: luu danh sach `serviceIds` vao phong.
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/service/finance/BillingService.java`: khi sinh hoa don, lay dich vu cua phong va cong vao `serviceAmount`.
- `frontend/src/components/tenant/InvoiceDetailModal.jsx`: hien thi chi tiet tien phong, dien, nuoc, tung dich vu va lich su thanh toan.

Nguyen tac:

1. Admin tao danh muc dich vu nhu Internet, rac, ve sinh, bao tri.
2. Admin vao phong va chon dich vu nao ap dung cho phong do.
3. Khi tao hop dong/sinh hoa don, backend lay dich vu cua phong de tinh `serviceAmount`.
4. Dien va nuoc khong tinh vao `serviceAmount` vi da co cong thuc rieng theo chi so cu - moi.
5. Hoa don da tao se giu tong tien tai thoi diem tao. Neu admin doi gia dich vu sau do, hoa don cu khong tu doi tong tien; hoa don moi sinh sau thoi diem doi gia se dung gia moi.

Cau tra loi khi thay hoi:

"Dich vu trong admin la danh muc goc. Muon tinh vao hoa don thi admin gan dich vu do cho phong. Khi sinh hoa don, backend cong tien phong, tien dien, tien nuoc va cac dich vu co dinh cua phong. Hoa don cu khong tu thay doi khi sua gia dich vu, de tranh mat tinh doi soat; thay doi gia chi anh huong cac hoa don tao sau do."

### 8.8. Ma Giao Dich Thanh Toan

File lien quan:

- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/model/PaymentTransaction.java`
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/controller/finance/PaymentController.java`

Truong quan trong:

- `invoice`: hoa don duoc thanh toan.
- `method`: phuong thuc thanh toan nhu CASH, QR, STRIPE, PAYOS.
- `status`: trang thai giao dich nhu PENDING, COMPLETED, CANCELLED.
- `amount`: so tien thanh toan.
- `transactionCode`: ma giao dich de doi chieu.
- `qrUrl`: duong dan QR hoac link thanh toan.

Neu thay hoi ma kieu `HC25`, co the tra loi:

"Ma giao dich dung de lien ket giao dich thanh toan voi hoa don. Nho ma nay he thong biet tien thanh toan thuoc hoa don nao va cap nhat dung trang thai hoa don."

### 8.9. Bao Mat Va Phan Quyen

He thong dung JWT va Spring Security.

File chinh:

- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/security/SecurityConfig.java`
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/security/JwtAuthenticationFilter.java`
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/security/JwtUtils.java`
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/security/InvoiceSecurity.java`
- `quanliPT/quanliPT/src/main/java/com/example/quanliPT/security/ContractSecurity.java`

Loi ich:

- Admin quan ly duoc toan bo phong, hop dong, hoa don, nguoi dung.
- Tenant chi xem duoc hop dong va hoa don cua chinh minh.
- API hoa don va thanh toan khong chi dua vao id tu frontend ma con kiem tra user dang dang nhap.

Cau tra loi khi thay hoi:

"Em dung JWT de xac thuc nguoi dung. Backend kiem tra role ADMIN/TENANT va kiem tra hoa don/hop dong co thuoc tenant dang dang nhap khong. Vi vay tenant khong the xem hoac thanh toan hoa don cua nguoi khac."

### 8.10. Database Va ORM

Backend dung Spring Data JPA/Hibernate de thao tac database.

Repository chinh:

- `RentalRequestRepository`: luu yeu cau thue phong.
- `ContractRepository`: luu hop dong.
- `InvoiceRepository`: luu hoa don.
- `PaymentTransactionRepository`: luu giao dich thanh toan.
- `RoomRepository`: luu thong tin phong.
- `UserRepository`: luu admin va tenant.

Loi ich:

- Du lieu khong chi nam tren giao dien ma duoc luu that trong database.
- Khi admin duyet, du lieu duoc tao o nhieu bang lien quan: users, contracts, invoices, rooms.
- Khi tenant dang nhap, he thong truy van database de hien thi hop dong va hoa don cua tenant do.

### 8.11. Cau Tra Loi Tong Hop Khi Bi Hoi Xoay

Neu thay hoi cong nghe va loi ich, co the tra loi:

"Bai cua em dung ReactJS cho giao dien, Spring Boot cho backend API, Spring Security va JWT cho dang nhap phan quyen, Spring Data JPA/Hibernate de luu du lieu vao MySQL. Luong dat phong khong chi la form giao dien ma co xu ly nghiep vu that: khach gui yeu cau, admin duyet, backend tao hop dong, cap nhat phong, sinh hoa don. Hoa don dinh ky dung Spring Scheduler, cau hinh chay that dau moi thang, con khi demo em doi sang chay moi phut de quan sat tren giao dien. Thanh toan online dung giao dich thanh toan de lien ket hoa don voi cong thanh toan, khi thanh toan thanh cong thi cap nhat hoa don sang da thanh toan."
