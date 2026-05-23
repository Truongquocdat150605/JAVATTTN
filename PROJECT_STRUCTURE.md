# Cau truc thu muc de xuat (da ap dung mot phan)

## Frontend (`frontend/src`)
- `pages/auth`: Dang nhap, dang ky
- `pages/public`: Trang cong khai (phong, lien he)
- `pages/tenant`: Chuc nang nguoi thue
- `pages/admin`: Chuc nang admin
- `features/chat`: AI chat widget
- `features/payment`: Thanh toan online cho hoa don
- `services`: API client dung chung
- `layouts`, `styles`: khung giao dien

## Backend (`quanliPT/quanliPT/src/main/java/com/example/quanliPT`)
- `controller`: API endpoints
- `service`: xu ly nghiep vu
- `repository`: truy cap DB
- `model`: entity + enum
- `dto`: request/response objects
- `security`, `config`: cau hinh he thong

## Ghi chu
- Da bo sung module `PaymentTransaction` cho thanh toan online hoa don.
- Da bo sung `ChatWidget` cho tro ly hoi dap nhanh trong giao dien.
