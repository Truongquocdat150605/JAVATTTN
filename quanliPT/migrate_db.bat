@echo off
echo ========================================================
echo DONG BO DU LIEU TU XAMPP LEN AIVEN CLOUD
echo ========================================================
echo.

echo 1. Dang xuat du lieu tu XAMPP (Localhost)...
C:\xampp\mysql\bin\mysqldump.exe -u root quan_ly_phong_tro > D:\Java_QLPhongTRo\quanliPT\backup.sql
if %errorlevel% neq 0 (
    echo [LOI] Khong the xuat du lieu tu XAMPP.
    pause
    exit /b
)
echo [OK] Da xuat du lieu thanh cong ra file backup.sql!
echo.

echo 2. Dang import du lieu len Aiven Cloud (Co the mat vai phut)...
C:\xampp\mysql\bin\mysql.exe -h mysql-7004309-dattruongquoc78-b6f6.f.aivencloud.com -P 22276 -u avnadmin -pAVNS_4slF97RK1F2mfisxEQs defaultdb < D:\Java_QLPhongTRo\quanliPT\backup.sql
if %errorlevel% neq 0 (
    echo [LOI] Khong the import du lieu len Aiven. Vui long kiem tra lai mang.
    pause
    exit /b
)
echo [OK] Da import thanh cong toan bo du lieu len Aiven Cloud!
echo.
pause
