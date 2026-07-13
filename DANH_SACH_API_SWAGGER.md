# Danh Sach API Tu Swagger

File nay tong hop cac API chinh cua he thong Quan Ly Phong Tro theo Swagger/OpenAPI.

Swagger UI:

```text
http://localhost:8082/swagger-ui/index.html
```

OpenAPI JSON:

```text
http://localhost:8082/v3/api-docs
```

## 1. Auth API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| POST | `/api/auth/register` | Dang ky tai khoan |
| POST | `/api/auth/login` | Dang nhap, tra ve token |
| PUT | `/api/auth/change-password` | Doi mat khau |
| POST | `/api/auth/forgot-password` | Yeu cau quen mat khau |
| POST | `/api/auth/verify-reset-token` | Kiem tra token reset mat khau |
| POST | `/api/auth/reset-password` | Dat lai mat khau |

## 2. Public API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| POST | `/api/public/rental-requests` | Khach gui yeu cau thue phong |
| POST | `/api/public/contacts` | Khach gui lien he |
| POST | `/api/public/chat` | Chatbot tu van phong |

## 3. Room API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/rooms` | Lay danh sach tat ca phong |
| POST | `/api/rooms` | Tao phong moi |
| GET | `/api/rooms/{id}` | Lay chi tiet phong |
| PUT | `/api/rooms/{id}` | Cap nhat thong tin phong |
| DELETE | `/api/rooms/{id}` | Xoa phong |
| PUT | `/api/rooms/{id}/image` | Cap nhat anh phong |
| GET | `/api/rooms/available` | Lay danh sach phong con trong |
| GET | `/api/rooms/hot` | Lay danh sach phong noi bat |
| GET | `/api/rooms/newest` | Lay danh sach phong moi nhat |

## 4. Service API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/services` | Lay danh sach dich vu |
| POST | `/api/services` | Tao dich vu |
| GET | `/api/services/{id}` | Lay chi tiet dich vu |
| PUT | `/api/services/{id}` | Cap nhat dich vu |
| DELETE | `/api/services/{id}` | Xoa dich vu |
| PATCH | `/api/services/{id}/toggle-active` | Bat/tat trang thai dich vu |

## 5. Contract API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/contracts` | Admin lay tat ca hop dong |
| POST | `/api/contracts` | Admin tao hop dong |
| GET | `/api/contracts/{id}` | Lay chi tiet hop dong theo id |
| PUT | `/api/contracts/{id}` | Cap nhat hop dong |
| DELETE | `/api/contracts/{id}` | Xoa hop dong |
| POST | `/api/contracts/create-with-tenant` | Tao hop dong kem thong tin nguoi thue |
| GET | `/api/contracts/my` | Tenant lay hop dong cua tai khoan hien tai |
| GET | `/api/contracts/my-contracts/{tenantId}` | Lay hop dong theo tenantId |

## 6. Invoice API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/invoices` | Admin lay danh sach hoa don |
| POST | `/api/invoices` | Tao hoa don |
| PUT | `/api/invoices/{id}` | Cap nhat hoa don |
| DELETE | `/api/invoices/{id}` | Xoa hoa don |
| GET | `/api/invoices/my` | Tenant lay hoa don cua tai khoan hien tai |
| GET | `/api/invoices/my-invoices/{tenantId}` | Lay hoa don theo tenantId |

## 7. Payment API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/payments/my` | Tenant lay lich su thanh toan |
| GET | `/api/payments/invoice/{invoiceId}` | Lay thanh toan theo hoa don |
| POST | `/api/payments/stripe/{invoiceId}` | Tao thanh toan Stripe |
| POST | `/api/payments/payos/{invoiceId}` | Tao thanh toan PayOS |
| POST | `/api/payments/cash/{invoiceId}` | Tenant/Admin ghi nhan chon thanh toan tien mat |
| PUT | `/api/payments/cash/{invoiceId}/confirm` | Admin xac nhan da thu tien mat va cap nhat hoa don PAID |
| POST | `/api/payments/payos/callback` | Callback tu PayOS |
| PUT | `/api/payments/{paymentId}/confirm` | Xac nhan thanh toan |

## 8. Maintenance API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/maintenance` | Admin lay tat ca yeu cau bao tri |
| POST | `/api/maintenance` | Tenant tao yeu cau bao tri |
| GET | `/api/maintenance/my` | Tenant lay yeu cau bao tri cua minh |
| PUT | `/api/maintenance/{id}/status` | Admin cap nhat trang thai bao tri |

## 9. Notification API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/notifications/my` | Lay thong bao cua tai khoan hien tai |
| GET | `/api/notifications/my/unread-count` | Dem thong bao chua doc |
| PATCH | `/api/notifications/my/{id}/read` | Danh dau da doc |
| PATCH | `/api/notifications/my/mark-all-read` | Danh dau tat ca da doc |
| DELETE | `/api/notifications/my/{id}` | Xoa thong bao cua minh |
| GET | `/api/notifications/admin/all` | Admin lay tat ca thong bao |
| POST | `/api/notifications/admin/send` | Admin gui thong bao |
| DELETE | `/api/notifications/admin/{id}` | Admin xoa thong bao |

## 10. Admin Request API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/admin/requests/rental` | Admin lay danh sach yeu cau thue phong |
| PUT | `/api/admin/requests/rental/{id}/status` | Admin cap nhat trang thai yeu cau |
| POST | `/api/admin/requests/rental/{id}/approve-and-create-contract` | Duyet yeu cau va tao hop dong |
| GET | `/api/admin/requests/contacts` | Admin lay danh sach lien he |

## 11. Admin User API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/admin/users` | Lay danh sach nguoi dung |
| POST | `/api/admin/users` | Tao nguoi dung |
| GET | `/api/admin/users/{id}` | Lay chi tiet nguoi dung |
| PUT | `/api/admin/users/{id}` | Cap nhat nguoi dung |
| DELETE | `/api/admin/users/{id}` | Xoa nguoi dung |

## 12. Admin Dashboard API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/admin/dashboard/stats` | Lay thong ke tong quan dashboard |
| GET | `/api/admin/dashboard/report-range` | Lay bao cao theo khoang thoi gian |

## 13. Tenant API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/tenant/me` | Lay thong tin tenant hien tai |
| PUT | `/api/tenant/profile` | Cap nhat ho so tenant |
| PUT | `/api/tenant/change-password` | Tenant doi mat khau |
| GET | `/api/tenant/my-rooms` | Lay phong dang thue cua tenant |

## 14. Finance API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| GET | `/api/finance/report` | Lay bao cao tai chinh theo nam |
| GET | `/api/finance/expenses` | Lay danh sach chi phi |
| POST | `/api/finance/expenses` | Tao chi phi |
| PUT | `/api/finance/expenses/{id}` | Cap nhat chi phi |
| DELETE | `/api/finance/expenses/{id}` | Xoa chi phi |

## 15. Upload API

| Method | Endpoint | Chuc nang |
| --- | --- | --- |
| POST | `/api/upload` | Upload hinh anh |

## Ghi Chu Demo

Luong nghiep vu quan trong nhat de demo:

1. User xem phong tren `/api/rooms`, `/api/rooms/available`.
2. User gui yeu cau thue phong qua `/api/public/rental-requests`.
3. Admin xem yeu cau qua `/api/admin/requests/rental`.
4. Admin duyet va tao hop dong qua `/api/admin/requests/rental/{id}/approve-and-create-contract`.
5. Tenant vao profile xem hop dong qua `/api/contracts/my`.
6. Tenant xem hoa don qua `/api/invoices/my`.
7. Tenant thanh toan hoa don qua Payment API.
