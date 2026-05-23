# 📦 GIAI ĐOẠN 1 - QUẢN LÝ DỊCH VỤ PHỤ ✅ HOÀN THÀNH

**Ngày hoàn thành:** 23/05/2026  
**Trạng thái:** ✅ Sẵn sàng kiểm thử

---

## 🎯 TÓM TẮT CÔNG VIỆC ĐÃ HOÀN THÀNH

### 1. Backend - Cấu Trúc File

```
src/main/java/com/example/quanliPT/
├── model/
│   ├── RentalService.java          ✅ Refactor (thêm enums: category, unit, frequency)
│   └── enums/                       ✅ Tạo mới
│       ├── ServiceCategory.java     (WATER, ELECTRICITY, GARBAGE, INTERNET, SECURITY, CLEANING, MAINTENANCE, OTHER)
│       ├── ServiceFrequency.java    (MONTHLY, WEEKLY, DAILY, ONE_TIME, QUARTERLY, ANNUAL)
│       └── ServiceUnit.java         (UNIT, PERSON, MONTH, WEEK, DAY, KWH, CUBIC_METER, LITER, HOUR, TIME)
├── dto/
│   └── RentalServiceDTO.java        ✅ Tạo mới (chứa toàn bộ fields)
└── controller/
    └── ServiceController.java       ✅ Cập nhật (sử dụng DTO, có converter)
```

### 2. Database Schema

**RentalService Entity:**
```sql
CREATE TABLE rental_services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),                    -- ENUM: WATER, ELECTRICITY, GARBAGE, ...
    unit VARCHAR(50),                        -- ENUM: UNIT, PERSON, MONTH, ...
    frequency VARCHAR(50),                   -- ENUM: MONTHLY, WEEKLY, DAILY, ...
    description TEXT,
    active BOOLEAN DEFAULT true
);
```

### 3. Frontend - Cấu Trúc File

```
src/pages/admin/services/
├── ServiceList.jsx      ✅ Cập nhật (thêm cột: Loại, Đơn vị, Tần suất)
├── ServiceForm.jsx      ✅ Cập nhật (thêm Select fields cho enums)
├── ServiceAdd.jsx       ✅ Không thay đổi (dùng ServiceForm)
└── ServiceEdit.jsx      ✅ Không thay đổi (dùng ServiceForm)
```

### 4. AdminLayout Menu

```javascript
// ✅ Thêm menu item mới
{ to: "/admin/services", label: "Dịch vụ phụ", icon: <LocalOffer /> }
// Hiển thị giữa "Chi phí/Dịch vụ" và "Bảo trì"
```

---

## 📋 API ENDPOINTS (Đầy Đủ)

### GET - Lấy danh sách dịch vụ
```bash
GET /api/services
Response: [
  {
    id: 1,
    name: "Tiền rác",
    price: 50000,
    category: "GARBAGE",           # 🗑️ Rác
    unit: "MONTH",                 # Tháng
    frequency: "MONTHLY",          # Hàng tháng
    description: "Dịch vụ rác hàng tuần",
    active: true
  },
  ...
]
```

### GET - Lấy theo ID
```bash
GET /api/services/{id}
Response: { id, name, price, category, unit, frequency, description, active }
```

### POST - Tạo dịch vụ mới (Admin)
```bash
POST /api/services
Content-Type: application/json

{
  "name": "Tiền rác",
  "price": 50000,
  "category": "GARBAGE",
  "unit": "MONTH",
  "frequency": "MONTHLY",
  "description": "Dịch vụ rác hàng tuần"
}

Response: 200 OK + object đã tạo
```

### PUT - Cập nhật dịch vụ (Admin)
```bash
PUT /api/services/{id}
Content-Type: application/json

{
  "name": "Tiền rác",
  "price": 60000,                   # ← Đổi giá
  "category": "GARBAGE",
  "unit": "MONTH",
  "frequency": "MONTHLY",
  "description": "Cập nhật giá mới",
  "active": true
}

Response: 200 OK + object đã cập nhật
```

### DELETE - Xóa dịch vụ (Admin)
```bash
DELETE /api/services/{id}

Response 1: 204 No Content (Xóa thành công nếu chưa được sử dụng)

Response 2: 400 Bad Request (Nếu đang được sử dụng)
{
  "error": "Không thể xóa: Dịch vụ này đang được sử dụng bởi một hoặc nhiều phòng..."
}
```

### PATCH - Bật/Tắt dịch vụ (Admin)
```bash
PATCH /api/services/{id}/toggle-active

Response: 200 OK + object (active = !active)
```

---

## 🧪 KẾ HOẠCH KIỂM THỬ (3 SCENARIOS)

### Scenario 1: ✅ Thêm dịch vụ mới

**Bước:**
1. Admin → Menu "Dịch vụ phụ" → Nút "Thêm dịch vụ"
2. Nhập:
   - Tên: "Tiền rác"
   - Đơn giá: 50000
   - Loại: 🗑️ Rác
   - Đơn vị: Tháng
   - Tần suất: Hàng tháng
   - Mô tả: "Dịch vụ rác hàng tuần"
3. Click "Thêm mới"

**Kết quả mong đợi:**
- ✅ Dịch vụ xuất hiện trong danh sách
- ✅ Hiển thị đúng: Tên, Giá (50,000₫), Loại (🗑️), Đơn vị (Tháng), Tần suất (Hàng tháng), Trạng thái (Hoạt động)

---

### Scenario 2: ✅ Cập nhật giá dịch vụ

**Bước:**
1. Click nút "Sửa" trên dòng "Tiền rác"
2. Đổi:
   - Đơn giá: 50000 → **60000**
3. Click "Cập nhật"

**Kết quả mong đợi:**
- ✅ Giá được cập nhật thành 60,000₫
- ✅ Hiển thị trong danh sách với giá mới

---

### Scenario 3: ✅ Xóa dịch vụ (Có Kiểm Tra Ràng Buộc)

#### 3A: Dịch vụ chưa được sử dụng

**Bước:**
1. Tạo dịch vụ mới: "Tiền nước" (không gán cho phòng nào)
2. Click nút "Xóa"
3. Xác nhận xóa

**Kết quả mong đợi:**
- ✅ Dịch vụ bị xóa khỏi danh sách
- ✅ Thông báo: "Xóa dịch vụ thành công"

#### 3B: Dịch vụ đang được sử dụng bởi phòng

**Bước:**
1. Tìm dịch vụ đang được gán vào một phòng (ví dụ: WiFi)
2. Click nút "Xóa"
3. Xác nhận xóa

**Kết quả mong đợi:**
- ❌ Hệ thống từ chối xóa
- ✅ Thông báo lỗi: "Không thể xóa: Dịch vụ này đang được sử dụng bởi một hoặc nhiều phòng..."
- ✅ Có gợi ý: "Hãy gỡ dịch vụ khỏi các phòng trước, hoặc chuyển trạng thái sang 'Ngưng hoạt động'."

---

## 🔄 THAY ĐỔI KIẾN TRÚC (Refactor)

### Trước (Cũ)
```
Entity Model: RentalService
├── name, price, description, active
└── Không có các trường chi tiết (category, unit, frequency)

Controller: Trực tiếp sử dụng Entity
└── POST/PUT nhận RentalService
```

### Sau (Mới) ✨
```
Entity Model: RentalService (Giản lược)
├── name, price, description, active
├── category (Enum) → ServiceCategory
├── unit (Enum) → ServiceUnit
├── frequency (Enum) → ServiceFrequency
└── Chỉ chứa dữ liệu cần lưu DB

DTO: RentalServiceDTO (Đầy Đủ)
├── Tất cả fields như Entity
└── Sử dụng cho request/response API

Controller: Sử dụng DTO
├── POST/PUT nhận RentalServiceDTO
├── GET trả về RentalServiceDTO
└── Có method converter: convertToDTO()

Enum Folder: model/enums/
├── ServiceCategory.java
├── ServiceFrequency.java
└── ServiceUnit.java
```

**Lợi ích:**
- ✅ Tách biệt Entity (DB) và DTO (API)
- ✅ Dễ bảo trì, mở rộng trong tương lai
- ✅ Quản lý enum tập trung tại folder `enums`
- ✅ Rõ ràng và theo chuẩn Clean Architecture

---

## 📊 CHỨC NĂNG BỔ SUNG

### Admin có thể:
✅ Xem danh sách dịch vụ (có lọc theo Loại, Đơn vị, Tần suất)  
✅ Thêm dịch vụ mới với đầy đủ thông tin  
✅ Chỉnh sửa tên, giá, loại, đơn vị, tần suất, mô tả  
✅ Bật/Tắt dịch vụ (ngưng hoạt động mà không xóa)  
✅ Xóa dịch vụ (chỉ nếu chưa được gán cho phòng)  
✅ Xem trạng thái hoạt động của từng dịch vụ  

### Tenant sẽ thấy:
✅ Dịch vụ phụ khi tạo hợp đồng  
✅ Danh sách dịch vụ được gán vào phòng  
✅ Giá của từng dịch vụ  

---

## 🚀 HƯỚNG DẪN KIỂM THỬ

### 1. Start Backend
```bash
cd d:\Web_java\Java_QLPhongTRo\quanliPT\quanliPT
mvn spring-boot:run
# Hoặc IDE: Run QuanliPtApplication.java
```

### 2. Start Frontend
```bash
cd d:\Web_java\Java_QLPhongTRo\frontend
npm start
# Hoặc: npm run build
```

### 3. Đăng nhập Admin
- Username: admin  
- Password: (theo DB của bạn)

### 4. Điều hướng
- Left Sidebar → "Dịch vụ phụ" → Bắt đầu kiểm thử

---

## 📝 ENUM OPTIONS (Có Thể Mở Rộng)

### ServiceCategory
```
WATER         💧 Nước
ELECTRICITY   ⚡ Điện
GARBAGE       🗑️ Rác
INTERNET      📡 Internet
SECURITY      🔒 An ninh
CLEANING      🧹 Vệ sinh
MAINTENANCE   🔧 Bảo trì
OTHER         📝 Khác
```

### ServiceUnit
```
UNIT          Bộ
PERSON        Người
MONTH         Tháng
WEEK          Tuần
DAY           Ngày
KWH           kWh (Điện)
CUBIC_METER   m³ (Nước)
LITER         Lít
HOUR          Giờ
TIME          Lần
```

### ServiceFrequency
```
MONTHLY       Hàng tháng
WEEKLY        Hàng tuần
DAILY         Hàng ngày
ONE_TIME      Một lần
QUARTERLY     Quý
ANNUAL        Năm
```

---

## ✅ DANH SÁCH KIỂM TRA

- [x] Tạo folder enums
- [x] Tạo 3 Enum classes (ServiceCategory, ServiceUnit, ServiceFrequency)
- [x] Refactor RentalService model (thêm enums)
- [x] Tạo RentalServiceDTO
- [x] Cập nhật ServiceController (sử dụng DTO)
- [x] Cập nhật AdminLayout menu (thêm "Dịch vụ phụ")
- [x] Cập nhật ServiceForm (thêm Select fields)
- [x] Cập nhật ServiceList (thêm cột mới)
- [x] Backend compile thành công ✅
- [ ] **Chờ bạn kiểm thử 3 scenarios**
- [ ] Fix bugs (nếu có)
- [ ] Ready for Giai đoạn 2 (Thông báo)

---

## 🎉 SẢN PHẨM CUỐI CÙNG

Người dùng Admin sẽ thấy giao diện:

```
┌─ Quản lý Dịch vụ phụ ──────────────────────────── [Thêm dịch vụ] ─┐
│                                                                      │
│ ┌──────────┬─────────┬──────┬────────┬──────────┬───────────┬────┐  │
│ │ Tên      │ Đơn giá │ Loại │ Đơn vị │ Tần suất │ Trạng thái│ ...│  │
│ ├──────────┼─────────┼──────┼────────┼──────────┼───────────┼────┤  │
│ │ Tiền rác │50,000₫  │🗑️ Rác│ Tháng  │ Hàng     │ ✓ Hoạt ✎ ✕│  │  │
│ │          │         │      │        │ tháng    │   động     │    │  │
│ ├──────────┼─────────┼──────┼────────┼──────────┼───────────┼────┤  │
│ │ WiFi     │100,000₫ │📡 Net│ Bộ     │ Hàng     │ ✓ Hoạt ✎ ✕│  │  │
│ │          │         │      │        │ tháng    │   động     │    │  │
│ └──────────┴─────────┴──────┴────────┴──────────┴───────────┴────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

**👉 Hãy kiểm thử 3 scenarios ở trên và báo cáo kết quả!**

Nếu tất cả ✅ thành công, ta sẽ tiến tới **Giai đoạn 2: Thông báo** 🚀
