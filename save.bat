@echo off
chcp 65001 > nul
echo ==========================================
echo [1/4] Đang sao lưu cơ sở dữ liệu ra database.sql...
"C:\xampp\mysql\bin\mysqldump.exe" -u root --default-character-set=utf8mb4 trangcdtt > "%~dp0database.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [Lỗi] Không thể sao lưu cơ sở dữ liệu! Hãy chắc chắn XAMPP MySQL đang chạy.
    pause
    exit /b %ERRORLEVEL%
)
echo Sao lưu CSDL thành công!

echo ==========================================
echo [2/4] Đang thêm các file thay đổi vào Git...
git add .

echo ==========================================
echo [3/4] Đang tạo bản ghi commit...
set /p msg="Nhập nội dung commit (Nhấn Enter để dùng mặc định: 'Cập nhật database và code'): "
if "%msg%"=="" set msg="Cập nhật database và code"
git commit -m "%msg%"

echo ==========================================
echo [4/4] Đang đẩy (push) mã nguồn lên GitHub...
git push
if %ERRORLEVEL% NEQ 0 (
    echo [Lỗi] Không thể push lên GitHub! Hãy kiểm tra kết nối mạng hoặc remote origin.
    pause
    exit /b %ERRORLEVEL%
)
echo ==========================================
echo ĐÃ HOÀN THÀNH SAO LƯU VÀ ĐẨY LÊN GITHUB THÀNH CÔNG!
pause
