# 📋 KẾ HOẠCH TRIỂN KHAI DỊCH VỤ PHỤ & THÔNG BÁO

**Ngày tạo:** 23/05/2026  
**Trạng thái:** Chờ xác nhận từ bạn

---

## 🎯 TỔNG QUAN

Dự án **Smart Phòng Trọ** đã có nền tảng cho Module Dịch Vụ Phụ ở cả Backend và Frontend. Kế hoạch này sẽ:
1. **Giai đoạn 1** (NGAY): Hoàn thiện Module Quản Lý Dịch Vụ Phụ
2. **Giai đoạn 2** (CHỜ XÁC NHẬN): Triển khai Tính Năng Thông Báo

---

## ✅ TRẠNG THÁI HIỆN TẠI

### Backend - JAVA (Spring Boot 3.2)

| Thành phần | Trạng thái | Ghi chú |
|-----------|----------|--------|
| **Entity RentalService** | ✅ Có | `id, name, price, description, active` |
| **ServiceController** | ✅ Có | GET, POST, PUT, DELETE, PATCH đầy đủ |
| **RentalServiceRepository** | ✅ Có | CRUD operations |
| **Entity Notification** | ✅ Có | `id, title, content, createdAt, targetUserId, isRead` |
| **NotificationController** | ✅ Có | Admin/Tenant endpoints |
| **NotificationRepository** | ✅ Có | Custom queries `findNotificationsForUser`, `countUnreadForUser` |

### Frontend - REACT

| Thành phần | Trạng thái | Ghi chú |
|-----------|----------|--------|
| **ServiceList.jsx** | ✅ Có | Hiển thị danh sách, nút Sửa/Xóa |
| **ServiceForm.jsx** | ✅ Có | Form nhập dữ liệu |
| **ServiceAdd.jsx** | ✅ Có | Thêm dịch vụ mới |
| **ServiceEdit.jsx** | ✅ Có | Chỉnh sửa dịch vụ |
| **Routes** | ✅ Có | `/admin/services`, `/admin/services/add`, `/admin/services/edit/:id` |
| **MyNotifications.jsx** | ✅ Có | Hiển thị thông báo cho tenant |
| **AdminLayout** | ⚠️ Cần cập nhật | Menu item chỉ tới `/admin/expenses`, cần thêm riêng item Dịch vụ |

---

## 🔧 GIAI ĐOẠN 1: QUẢN LÝ DỊCH VỤ PHỤ (Làm Ngay)

### 1.1 Frontend - Cập Nhật Menu Admin

**File:** `frontend/src/layouts/AdminLayout.jsx`

**Công việc:**
- Thêm item menu mới trong `adminMenu` array:
  ```javascript
  { to: "/admin/services", label: "Dịch vụ phụ", icon: <LocalOffer /> }
  ```
- Import icon: `LocalOffer` từ `@mui/icons-material`

**Kết quả mong đợi:** Menu Admin sẽ hiển thị item "Dịch vụ phụ" giữa "Chi phí/Dịch vụ" và "Bảo trì"

### 1.2 Backend - Kiểm Tra API

**Các API đã sẵn có:**

```bash
# Lấy tất cả dịch vụ
GET /api/services
Response: [
  { id: 1, name: "Tiền nước", price: 15000, description: "...", active: true },
  { id: 2, name: "Tiền điện", price: 3500, description: "...", active: true }
]

# Lấy theo ID
GET /api/services/{id}

# Tạo dịch vụ (Admin)
POST /api/services
Body: { name: "Tiền rác", price: 50000, description: "Dịch vụ rác hàng tuần" }

# Cập nhật dịch vụ (Admin)
PUT /api/services/{id}
Body: { name: "Tiền rác", price: 60000, description: "...", active: true }

# Xóa dịch vụ (Admin) - Có kiểm tra ràng buộc
DELETE /api/services/{id}
Response: 204 No Content hoặc 400 nếu đang được sử dụng

# Bật/Tắt hoạt động (Admin)
PATCH /api/services/{id}/toggle-active
```

**Kiểm tra:** ✅ Tất cả API đã triển khai đầy đủ

### 1.3 Frontend - Kiểm Tra Components

**Các file đã sẵn có:**

```
frontend/src/pages/admin/services/
├── ServiceList.jsx    ✅ Bảng danh sách
├── ServiceForm.jsx    ✅ Form chung (sử dụng lại)
├── ServiceAdd.jsx     ✅ Thêm mới
└── ServiceEdit.jsx    ✅ Chỉnh sửa
```

**Chức năng cần kiểm tra:**
- ✅ Hiển thị danh sách dịch vụ
- ✅ Nút "Thêm dịch vụ" → ServiceAdd
- ✅ Nút "Sửa" từng dòng → ServiceEdit
- ✅ Nút "Xóa" với xác nhận
- ✅ Xử lý lỗi khi xóa dịch vụ đang sử dụng

### 1.4 Kiểm Tra Trường Dữ Liệu

**Các trường dữ liệu của RentalService:**

| Trường | Kiểu | Bắt buộc | Ghi chú |
|-------|------|---------|--------|
| `id` | Long | ✅ Auto | PK tự tăng |
| `name` | String | ✅ Có | Ví dụ: "Tiền nước", "Tiền điện", "Tiền rác" |
| `price` | BigDecimal | ✅ Có | Đơn vị: VND (ví dụ: 50000, 15000) |
| `description` | String | ❌ Optional | Mô tả chi tiết dịch vụ |
| `active` | Boolean | ✅ Có | Default: true; false = ngưng hoạt động |

**Đề xuất trường bổ sung (Optional):**
- `category`: Enum như WATER, ELECTRICITY, GARBAGE, INTERNET, OTHER
- `unit`: Đơn vị tính (ví dụ: "bộ", "cuốn", "lần/tháng")
- `frequency`: Tần suất (MONTHLY, WEEKLY, ONE_TIME)

**Câu hỏi cho bạn:**
> Có cần thêm các trường trên không? Hay 4 trường hiện tại đã đủ?

### 1.5 Kế Hoạch Kiểm Thử

**Test Scenario 1: Thêm dịch vụ mới**
```
1. Click "Dịch vụ phụ" trong menu admin
2. Click nút "Thêm dịch vụ"
3. Nhập: Tên = "Tiền rác", Giá = 50000, Mô tả = "Dịch vụ rác hàng tuần"
4. Click "Lưu"
✅ Dịch vụ mới xuất hiện trong danh sách
```

**Test Scenario 2: Cập nhật dịch vụ**
```
1. Click nút "Sửa" trên dòng "Tiền rác"
2. Đổi giá từ 50000 → 60000
3. Click "Cập nhật"
✅ Giá được cập nhật, hiển thị 60000 trong danh sách
```

**Test Scenario 3: Xóa dịch vụ (kiểm tra ràng buộc)**
```
Trường hợp A: Dịch vụ chưa được sử dụng
1. Click nút "Xóa" trên dòng bất kì
2. Xác nhận xóa
✅ Dịch vụ bị xóa khỏi danh sách

Trường hợp B: Dịch vụ đang được gán cho phòng
1. Click nút "Xóa" trên dịch vụ đang được phòng nào dùng
2. Xác nhận xóa
❌ Hiện lỗi: "Không thể xóa: Dịch vụ này đang được sử dụng..."
✅ Có nút "Ngưng hoạt động" thay thế
```

---

## 📢 GIAI ĐOẠN 2: TÍNH NĂNG THÔNG BÁO (Chờ Xác Nhận)

### Tóm Tắt

Hệ thống **phải lưu thông báo vào Database** (đã có Entity Notification) để khi tenant đăng nhập, họ sẽ thấy:
- 🔔 Cái chuông (Bell icon) hiển thị số lượng thông báo chưa đọc
- 📄 Trang "Thông báo của tôi" (MyNotifications.jsx đã có)

### 2.1 Backend - Tình Trạng

**Entity Notification** ✅ Có:
```java
@Entity
public class Notification {
    Long id;           // PK
    String title;      // "Nhắc đóng tiền phòng"
    String content;    // Nội dung chi tiết
    LocalDateTime createdAt;
    Long targetUserId; // null = tất cả; có id = riêng user
    boolean isRead;    // false = chưa đọc; true = đã đọc
}
```

**NotificationController** ✅ Có:
```
POST   /api/notifications/admin/send  (Admin gửi thông báo)
DELETE /api/notifications/admin/{id}  (Admin xóa)
GET    /api/notifications/admin/all   (Admin xem tất cả)
GET    /api/notifications/my          (Tenant xem riêng)
GET    /api/notifications/my/unread-count (Đếm chưa đọc)
PATCH  /api/notifications/my/{id}/read (Đánh dấu đã đọc)
```

### 2.2 Frontend - Tình Trạng

**Đã có:**
- ✅ `MyNotifications.jsx` - Trang hiển thị thông báo cho tenant

**Cần thêm:**
1. ⚠️ **Notification Bell Icon** trong Header (góc trên cùng)
   - Hiển thị số lượng unread notifications
   - Dropdown nhanh xem 3-5 thông báo gần nhất
   
2. ❌ **NotificationManagement.jsx** cho Admin
   - Form soạn thảo: Tiêu đề, Nội dung
   - Chọn người nhận: "Tất cả tenant" hoặc "Chọn riêng"
   - Nút "Gửi" → API POST /api/notifications/admin/send
   - Danh sách thông báo đã gửi + nút Xóa

### 2.3 Routes & Menu

**Routes cần thêm:**
```javascript
<Route path="/admin/notifications" element={<NotificationManagement />} />
<Route path="/my-notifications" element={<MyNotifications />} /> // đã có
```

**AdminLayout Menu:**
```javascript
{ to: "/admin/notifications", label: "Thông báo", icon: <Notifications /> }
```

### 2.4 Kế Hoạch Triển Khai

**Nếu bạn xác nhận triển khai tính năng này, tôi sẽ:**

1. **Tạo NotificationManagement.jsx**
   - Giao diện soạn thảo thông báo
   - Danh sách thông báo đã gửi
   - Chức năng xóa

2. **Cập nhật Header.jsx**
   - Thêm Bell icon ở góc phải
   - Dropdown thông báo nhanh
   - Real-time unread count

3. **Cập nhật AdminLayout.jsx**
   - Thêm menu item "Thông báo"

4. **Hoàn thiện MyNotifications.jsx**
   - Nếu cần bổ sung giao diện

---

## 🚀 KỲ VỌNG SAU TRIỂN KHAI

### Sau Giai Đoạn 1

**Admin có thể:**
- ✅ Quản lý danh sách dịch vụ phụ (thêm/sửa/xóa)
- ✅ Bật/tắt dịch vụ (không xóa nếu đang dùng)
- ✅ Xem giá hiện tại của từng dịch vụ

**Trong Hợp Đồng:**
- Dịch vụ phụ được gán cho từng phòng
- Tự động tính tiền vào hóa đơn

### Sau Giai Đoạn 2 (Nếu triển khai)

**Admin có thể:**
- ✅ Soạn thảo & gửi thông báo tới tenants
- ✅ Xem lịch sử thông báo đã gửi
- ✅ Chỉnh mục tiêu người nhận (tất cả / riêng)

**Tenant nhận được:**
- ✅ Chuông thông báo ở Header với badge số lượng
- ✅ Trang "Thông báo của tôi" để xem chi tiết
- ✅ Đánh dấu đã đọc / chưa đọc
- ✅ Ví dụ thông báo: "Nhắc đóng tiền phòng", "Lịch cúp điện", v.v.

---

## 📝 BƯỚC TIẾP THEO

### ✅ Giai Đoạn 1: Quản Lý Dịch Vụ Phụ (SẴN SÀNG TRIỂN KHAI)

**Công việc còn lại:**
1. Cập nhật `AdminLayout.jsx` → Thêm menu item "Dịch vụ phụ"
2. **Kiểm thử** 3 scenarios ở mục 1.5
3. Xác nhận các trường dữ liệu đủ hay cần bổ sung

### ⏳ Giai Đoạn 2: Thông Báo (Chờ Xác Nhận)

**Câu hỏi:**
> 🤔 Bạn có muốn tôi triển khai hoàn chỉnh Module Thông Báo sau khi xong Dịch vụ Phụ không?
> 
> **Pro:**
> - ✅ Hoàn thiện 100% yêu cầu đồ án
> - ✅ Tenant có thể nhận thông báo từ Admin
> - ✅ Có thể tự động gửi nhắc thanh toán, cúp điện, v.v.
>
> **Cons:**
> - ⏱️ Cần thêm ~2-3 giờ để hoàn thiện
> - 📱 Cần kiểm thử kỹ lưỡng

---

## 📊 BẢNG KIỂM DANH SÁCH

### Giai Đoạn 1
- [ ] Cập nhật AdminLayout menu
- [ ] Test thêm dịch vụ
- [ ] Test sửa dịch vụ  
- [ ] Test xóa dịch vụ (có & không được sử dụng)
- [ ] ✅ Xác nhận hoàn thành

### Giai Đoạn 2 (If Approved)
- [ ] Tạo NotificationManagement.jsx
- [ ] Cập nhật Header (Bell icon)
- [ ] Cập nhật AdminLayout menu
- [ ] Test gửi thông báo
- [ ] Test nhận thông báo (Tenant)
- [ ] ✅ Xác nhận hoàn thành

---

**Vui lòng xem qua kế hoạch này và cho tôi biết:**

1. ✅ Các trường dữ liệu của Dịch Vụ có đủ không? Hay cần thêm category, unit, frequency?
2. 🔧 Có gì cần điều chỉnh trong Giai Đoạn 1 không?
3. 🚀 Có muốn triển khai Giai Đoạn 2 (Thông báo) không?

Sau khi bạn xác nhận, tôi sẽ bắt đầu triển khai ngay!
