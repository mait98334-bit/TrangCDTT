# BẢN TÓM TẮT KỸ THUẬT & HƯỚNG DẪN BÀN GIAO DỰ ÁN
*(Lưu ý: Hãy sao chép nội dung file này gửi cho AI Assistant tiếp theo khi bạn làm việc ở nhà)*

## 1. Trạng thái hiện tại của dự án
Dự án là website bán hàng thời trang thể thao (Next.js Frontend + Node.js Express Backend + MySQL Database).
Các nhánh Git hiện tại đã được đồng bộ hóa và đẩy lên nhánh `main` trên GitHub. Dữ liệu database mới nhất nằm ở file `database.sql` ở thư mục gốc.

---

## 2. Các công việc LỚN đã hoàn thành gần đây
* **Thêm thương hiệu & Phân tách danh mục:** Đã thêm thương hiệu **Jordan** và **Balenciaga**, phân tách các danh mục Nam/Nữ mới (`Áo Nữ`, `Quần Nữ`, `Áo Khoác Nữ`), cùng danh mục chung như `Giày Thể Thao`, `Bộ Đồ Thể Thao`, `Phụ Kiện`.
* **Sửa font chữ tiếng Việt:** Đã vá lỗi mã hóa hiển thị dấu tiếng Việt trong bảng Database thông qua file script SQL dạng UTF-8.
* **Banner trang chủ:** Tích hợp Slider Carousel tự động chuyển slide sau 5 giây rất mượt mà.
* **Cơ chế hình ảnh Offline & Linh hoạt (Quan trọng nhất):**
  - **Database:** Đã chuyển toàn bộ đường dẫn ảnh từ tuyệt đối (chứa `http://localhost:5000/uploads/...`) sang dạng tương đối `/uploads/ten_anh.jpg`. Tránh việc đổi port/IP làm lỗi toàn bộ ảnh.
  - **Frontend Helper:** Tạo file `frontend/services/imageHelper.js` chứa hàm `getImageUrl()` để tự động ghép nối đường dẫn với backend host khi hiển thị.
  - **Tải ảnh Offline:** Đã tải toàn bộ ảnh sản phẩm từ Unsplash về cục bộ thư mục `backend/uploads/` và cập nhật database. Hệ thống hiện chạy Offline 100% không phụ thuộc internet.

---

## 3. Công việc đang làm dở & Cần tiếp tục làm ở nhà

### Nhiệm vụ 1: Cấu hình giữ nguyên tên file gốc khi upload từ Admin
* **Mục tiêu:** Khi bạn đặt tên file trên máy tính là `product_1.jpg` và upload lên qua trang Admin, Backend phải giữ nguyên tên file là `product_1.jpg` (có lọc bỏ tiếng Việt/ký tự lạ để tránh lỗi URL) thay vì tự động đổi tên thành chuỗi số ngẫu nhiên.
* **Nơi cần chỉnh sửa:** File `backend/src/routes/uploadRoutes.js` ở phần cấu hình `multer.diskStorage` -> hàm `filename`.
* **Gợi ý Code thay đổi cho AI Assistant tiếp theo:**
  ```javascript
  filename: (req, file, cb) => {
      // Chuẩn hóa tên file gốc (bỏ dấu tiếng Việt, thay dấu cách bằng gạch dưới)
      const normalized = file.originalname
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9.-]/g, '_');
      cb(null, normalized);
  }
  ```

### Nhiệm vụ 2: Tự thay thế hình ảnh sản phẩm chuẩn xác qua trang Admin
* **Mục tiêu:** Tải các hình ảnh chính xác của các mẫu giày/quần áo (Jordan, Balenciaga,...) về máy của bạn.
* **Cách làm:** Vào trang quản trị Admin, chọn sản phẩm, click Edit và tải ảnh lên. Hệ thống sẽ tự động đổi tên theo cơ chế mới của Nhiệm vụ 1 và lưu cục bộ.

---

## 4. Hướng dẫn chạy dự án trên máy nhà
1. **Pull Code mới nhất:** Chạy lệnh `git pull origin main` trên máy nhà.
2. **Cài đặt thư viện:** Chạy `npm install` ở cả hai thư mục `backend` và `frontend`.
3. **Nhập Database:**
   - Mở XAMPP MySQL.
   - Tạo cơ sở dữ liệu tên `trangcdtt`.
   - Import file `database.sql` ở thư mục gốc vào.
4. **Cấu hình môi trường:**
   - Kiểm tra file `backend/.env` xem thông số kết nối MySQL đã chính xác chưa (Host, User, Password, DB_Name).
5. **Chạy dự án:**
   - Chạy Backend: Mở terminal tại `backend/` chạy `npm run dev`.
   - Chạy Frontend: Mở terminal tại `frontend/` chạy `npm run dev`.
