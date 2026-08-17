# BẢN TÓM TẮT KỸ THUẬT & HƯỚNG DẪN BÀN GIAO DỰ ÁN
*(Lưu ý: Hãy sao chép nội dung file này gửi cho AI Assistant tiếp theo khi bạn mở phiên chat mới)*

## 1. Trạng thái hiện tại của dự án
Dự án là website bán hàng thời trang thể thao (Next.js Frontend + Node.js Express Backend + MySQL Database).
Các nhánh Git hiện tại đã được đồng bộ hóa và đẩy lên nhánh `main` trên GitHub. Dữ liệu database mới nhất nằm ở file `database.sql` ở thư mục gốc.

---

## 2. Các công việc LỚN đã hoàn thành (Mới nhất)
* **Khắc phục lỗi phản hồi VNPAY return:** Sửa lỗi `hasOwnProperty` trên đối tượng query null-prototype ở hàm `sortObject` trong [paymentRoutes.js](file:///d:/TrangCDTT/backend/src/routes/paymentRoutes.js). Hoàn tất quy trình thanh toán online VNPAY Sandbox trơn tru, tự động cập nhật đơn hàng thành "Đã thanh toán" trong Database và redirect về trang success của Frontend.
* **Hệ thống Toast Notification & Loại bỏ alert():** Loại bỏ hoàn toàn các hàm `alert()` chặn màn hình gây gián đoạn trải nghiệm trên cả trang khách lẫn trang admin, chuyển sang dùng Custom Event `showToast` hiển thị thông báo góc dưới bên phải rất đẹp mắt và mượt mà.
* **Liên kết Sản phẩm vào Liên hệ:** Khách hàng từ trang chi tiết sản phẩm có thể bấm nút **💬 Tư vấn sản phẩm** để nhảy sang trang liên hệ với thông tin sản phẩm và lời nhắn mẫu được điền tự động. Phía Admin cũng có thêm cột sản phẩm liên kết kèm link trực quan.
* **Khung chat tư vấn trực tuyến (Live Chat):** 
  - Tạo bảng `chat_messages` lưu tin nhắn.
  - Viết API Backend cho chat và dịch vụ `ChatService` ở Frontend.
  - Xây dựng component nổi `<ChatBubble />` ở góc dưới bên phải trang khách hỗ trợ cả khách vãng lai và thành viên.
  - Xây dựng giao diện chat room Admin đa luồng giống Messenger tại `/admin/chat`.
  - Sử dụng cơ chế HTTP Polling tự động fetch tin nhắn mới mỗi 2-3 giây không cần F5.

---

## 3. Công việc tiếp theo & Hướng dẫn kiểm thử Live Chat

### Hướng dẫn kiểm thử nhanh tính năng Live Chat:
1. Đăng nhập hoặc làm khách vãng lai ở trang khách, bấm vào bong bóng chat 💬 ở góc phải dưới, nhắn tin xin tư vấn.
2. Đăng nhập tài khoản admin (`admin1@gmail.com` / `123`), vào trang `/admin/chat`. Bạn sẽ thấy danh sách cuộc trò chuyện bên trái. Chọn phòng chat và gõ phản hồi.
3. Cả hai bên đều dùng cơ chế tự động load tin nhắn thời gian thực cực kỳ mượt mà.

### Nhiệm vụ tiếp theo cần làm:
* **Tối ưu hóa hành động cuộn của Chat Admin:** Nếu cuộc trò chuyện có lịch sử dài hơn chiều cao hiển thị `430px`, cần đảm bảo thanh cuộn hoạt động tốt khi cuộn lên để xem lại tin nhắn cũ.
* **Cấu hình giữ nguyên tên file gốc khi upload từ Admin:**
  - **Mục tiêu:** Khi bạn đặt tên file trên máy tính là `product_1.jpg` và upload lên qua trang Admin, Backend phải giữ nguyên tên file là `product_1.jpg` (có lọc bỏ tiếng Việt/ký tự lạ để tránh lỗi URL) thay vì tự động đổi tên thành chuỗi số ngẫu nhiên.
  - **Nơi cần chỉnh sửa:** File `backend/src/routes/uploadRoutes.js` ở phần cấu hình `multer.diskStorage` -> hàm `filename`.

---

## 4. Hướng dẫn chạy dự án trên máy nhà
1. **Pull Code mới nhất:** Chạy lệnh `git pull origin main` trên máy nhà.
2. **Cài đặt thư viện:** Chạy `npm install` ở cả hai thư mục `backend` và `frontend`.
3. **Nhập Database:**
   - Mở XAMPP MySQL.
   - Tạo cơ sở dữ liệu tên `trangcdtt`.
   - Import file `database.sql` ở thư mục gốc vào.
4. **Cấu hình môi trường:**
   - Kiểm tra file `backend/.env` xem thông số kết nối MySQL đã chính xác chưa.
5. **Chạy dự án:**
   - Chạy Backend: Mở terminal tại `backend/` chạy `npm run dev`.
   - Chạy Frontend: Mở terminal tại `frontend/` chạy `npm run dev`.
