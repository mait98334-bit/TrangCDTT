# Kế hoạch chuẩn hóa hình ảnh & Sửa lỗi hiển thị

Để giải quyết triệt để hai vấn đề bạn vừa nêu:
1. **Tránh lỗi đường dẫn cứng:** Không lưu cứng `http://localhost:5000` vào Database vì khi bạn đổi cổng (port) hoặc chạy trên máy khác sẽ bị lỗi ảnh. Thay vào đó, chúng ta sẽ lưu đường dẫn tương đối dạng `/uploads/ten-anh.jpg` vào Database. Frontend sẽ tự động nối địa chỉ Backend khi hiển thị.
2. **Sửa hình ảnh sản phẩm cho chính xác:** Tìm các ảnh Unsplash chân thực, đúng kiểu dáng cho Jordan, Balenciaga và các sản phẩm Nữ mới thêm. Sau đó tải toàn bộ chúng về máy để chạy Offline 100%.

---

## Các thay đổi đề xuất

### 1. Backend

#### [MODIFY] [uploadRoutes.js](file:///d:/TrangCDTT/backend/src/routes/uploadRoutes.js)
Thay đổi API upload để chỉ trả về đường dẫn tương đối (ví dụ: `/uploads/filename.jpg`) thay vì đường dẫn tuyệt đối chứa cổng `5000`.

### 2. Frontend

#### [NEW] [imageHelper.js](file:///d:/TrangCDTT/frontend/services/imageHelper.js)
Tạo hàm helper `getImageUrl(imagePath)` để xử lý hiển thị ảnh:
- Nếu là link tuyệt đối (bắt đầu bằng `http` hoặc `https` từ Unsplash): Trả về nguyên bản.
- Nếu là link tương đối (bắt đầu bằng `/uploads/`): Tự động nối với URL Backend (`http://localhost:5000`).

#### [MODIFY] Thay thế hiển thị ở các trang Frontend
Cập nhật tất cả các thẻ `<img src={...} />` trong Frontend sử dụng hàm `getImageUrl` để đảm bảo hiển thị đúng ảnh ở mọi trang (Trang chủ, chi tiết sản phẩm, giỏ hàng, trang admin quản lý...).

### 3. Database & Cập nhật ảnh offline

* **Chạy script tải ảnh:** Viết một script tự động tải tất cả các ảnh Unsplash hiện có về thư mục `backend/uploads/` cục bộ trên máy bạn.
* **Cập nhật dữ liệu:** Cập nhật cột `image` của tất cả sản phẩm và bài viết trong Database thành đường dẫn tương đối (ví dụ: `/uploads/jordan1.jpg`).
* **Xuất SQL:** Cập nhật lại file `database.sql` sạch sẽ.

---

## Kế hoạch kiểm tra

### Xác minh thủ công
1. Thử upload một ảnh mới trong trang quản trị Admin và kiểm tra xem ảnh hiển thị bình thường.
2. Kiểm tra xem database lưu đường dẫn tương đối `/uploads/...` chứ không còn chứa `http://localhost:5000` nữa.
3. Tắt kết nối Internet của máy và tải lại trang web xem ảnh sản phẩm và bài viết có hiển thị đầy đủ (chạy Offline hoàn toàn).
