@echo off
echo ==========================================
echo [1/5] Dang sao luu co so du lieu ra database.sql...
"C:\xampp\mysql\bin\mysqldump.exe" -u root --default-character-set=utf8mb4 trangcdtt > "%~dp0database.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [Loi] Khong the sao luu co so du lieu! Hay chac chan XAMPP MySQL dang chay.
    pause
    exit /b %ERRORLEVEL%
)
echo Sao luu CSDL thanh cong!

echo ==========================================
echo [2/5] Dang them cac file thay doi vao Git...
git add .

echo ==========================================
echo [3/5] Dang tao ban ghi commit...
:: TU DONG CAU HINH DANH TINH CHO GIT (Thay email va ten cua ban vao day neu muon)
git config user.email "mait98334@gmail.com"
git config user.name "mait98334-bit"

set "msg="
set /p msg="Nhap noi dung commit (An Enter de dung mac dinh): "

if "%msg%"=="" (
    git commit -m "Cap nhat database va code"
) else (
    git commit -m "%msg%"
)

echo ==========================================
echo [4/5] Dang day (push) ma nguon len GitHub...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo [Loi] Khong the push len GitHub!
    pause
    exit /b %ERRORLEVEL%
)
echo DA HOAN THANH SAO LUU VA DAY LEN GITHUB THANH CONG!

echo ==========================================
echo [5/5] DANG XOA THONG TIN DANG NHAP DE BAO MAT...

:: Xoa thong tin credential trong Windows Credential Manager
cmdkey /list | findstr /I "git" > nul
if %errorlevel%==0 (
    cmdkey /delete:LegacyGeneric:target=git:https://github.com
)
:: Fix loi xoa dang nhap phien ban cu bang lenh tieu chuan
git credential-cache exit 2>nul
git config --local --unset credential.helper 2>nul

echo ==========================================
echo DA XOA AN TOAN TAI KHOAN GIT KHOI MAY TRUONG!
echo [An Toan] Thu muc code van duoc giu lai nguyen ven tren may.
echo ==========================================
pause
