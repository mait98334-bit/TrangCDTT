@echo off
echo ==========================================
echo [1/4] Dang sao luu co so du lieu ra database.sql...
"C:\xampp\mysql\bin\mysqldump.exe" -u root --default-character-set=utf8mb4 trangcdtt > "%~dp0database.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [Loi] Khong the sao luu co so du lieu! Hay chac chan XAMPP MySQL dang chay.
    pause
    exit /b %ERRORLEVEL%
)
echo Sao luu CSDL thanh cong!

echo ==========================================
echo [2/4] Dang them cac file thay doi vao Git...
git add .

echo ==========================================
echo [3/4] Dang tao ban ghi commit...
set /p msg="Nhap noi dung commit (Nhan Enter de dung mac dinh: 'Cap nhat database va code'): "
if "%msg%"=="" set msg="Cap nhat database va code"
git commit -m "%msg%"

echo ==========================================
echo [4/4] Dang day (push) ma nguon len GitHub...
git push
if %ERRORLEVEL% NEQ 0 (
    echo [Loi] Khong the push len GitHub!
    pause
    exit /b %ERRORLEVEL%
)
echo ==========================================
echo DA HOAN THANH SAO LUU VA DAY LEN GITHUB THANH CONG!
pause
