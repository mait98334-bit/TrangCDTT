# Kế hoạch Thiết lập Môi trường Phát triển và Chạy Dự án

Kế hoạch này giúp chuẩn bị đầy đủ các tài nguyên và thiết lập môi trường để có thể chạy dự án thông qua lệnh `npm run dev` cho cả Backend và Frontend, đồng thời hoàn thành gộp Modal và chuẩn hóa upload ảnh.

## Vị trí & Trạng thái Hiện tại
Dựa trên lịch sử hội thoại (`conversation_history/` và `PROJECT_HANDOVER.md`), dự án đang ở trạng thái:
1. **Đã Hoàn thành:** Chuẩn hóa toàn bộ đường dẫn ảnh sang tương đối (`/uploads/ten_anh.jpg`), tải ảnh về máy để chạy Offline 100%, đồng bộ Git.
2. **Nhiệm vụ Tiếp theo (Đã hoàn thành):** 
   - Gộp nút Chi tiết và Sửa thành một Modal thống nhất 3 tab.
   - Cấu hình giữ nguyên tên file gốc khi upload từ Admin (trong [uploadRoutes.js](file:///d:/TrangCDTT/backend/src/routes/uploadRoutes.js)).
3. **Môi trường Hiện tại:**
   - XAMPP MySQL đang chạy trên cổng `3306`.
   - Cơ sở dữ liệu `trangcdtt` đã được tạo và import.
   - Thư mục `node_modules` ở cả Backend và Frontend đã được cài đặt.

---

## Các bước đề xuất thực hiện

### 1. Chuẩn bị Cơ sở dữ liệu
* **Tạo Database:** Tạo cơ sở dữ liệu `trangcdtt` trong MySQL (Đã xong).
* **Import Dữ liệu:** Nhập dữ liệu từ file [database.sql](file:///d:/TrangCDTT/database.sql) ở thư mục gốc vào cơ sở dữ liệu `trangcdtt` (Đã xong).

### 2. Cài đặt Thư viện (Dependencies)
* **Backend:** Chạy lệnh `npm install` tại thư mục [backend](file:///d:/TrangCDTT/backend) (Đã xong).
* **Frontend:** Chạy lệnh `npm install` tại thư mục [frontend](file:///d:/TrangCDTT/frontend) (Đã xong).

### 3. Gộp Modal và Hành động trên Admin Product
* **Hành động:** Loại bỏ nút "Chi tiết", gộp toàn bộ vào tab của nút "Sửa" ([page.js](file:///d:/TrangCDTT/frontend/app/(admin)/admin/product/page.js)).
* **Giao diện:** Thêm tab chuyển đổi: `ℹ️ Thông tin chung`, `🖼️ Ảnh phụ` và `👟 Biến thể` (Đã xong).

### 4. Chuẩn hóa Tên ảnh khi Tải lên
* **Sanitize:** Dùng hàm loại bỏ dấu tiếng Việt, chuyển khoảng trắng thành `_` để giữ nguyên tên ảnh sạch ([uploadRoutes.js](file:///d:/TrangCDTT/backend/src/routes/uploadRoutes.js)).
* **Trùng file:** Tự động tăng hậu tố số để tránh ghi đè file có sẵn (Đã xong).

---

## Kế hoạch Xác minh (Verification Plan)

### Kiểm tra Tự động & Thủ công
1. **Xác minh Compile Frontend:** Kiểm tra xem Next.js biên dịch trang Admin Product thành công không bị lỗi JSX (Đã xong).
2. **Khởi chạy Backend:** Chạy `npm run dev` trong thư mục `backend/` và kiểm tra xem server có khởi động thành công trên cổng `5000` (Đã xong).
3. **Khởi chạy Frontend:** Chạy `npm run dev` trong thư mục `frontend/` và kiểm tra xem ứng dụng Next.js có khởi chạy thành công hay không (Đã xong).

