# Chuyển về thư mục dự án
Set-Location -Path "d:\MaiThiTrang_2123110340"

Write-Host "Bắt đầu chuẩn bị đẩy Backend lên GitHub cho Tuần 2..." -ForegroundColor Cyan

# 1. Chuyển sang nhánh main
git checkout main

# 2. Lấy thư mục backend từ nhánh completed sang nhánh main
Write-Host "Đang lấy thư mục backend từ nhánh completed..." -ForegroundColor Yellow
git checkout completed -- backend

# 3. Thêm vào Git và commit
git add backend/
git commit -m "feat: implement express backend api server and core database routes"

# 4. Đẩy lên GitHub
Write-Host "Đang đẩy code lên GitHub..." -ForegroundColor Yellow
git push origin main

# 5. Chuyển lại về nhánh completed để làm việc tiếp
git checkout completed

Write-Host "Hoàn thành! Đã đẩy thành công Backend lên GitHub nhánh main." -ForegroundColor Green
