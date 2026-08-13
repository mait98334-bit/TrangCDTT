const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const brandRoutes = require('./routes/brandRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const contactRoutes = require('./routes/contactRoutes');
const orderRoutes = require('./routes/orderRoutes');
const postRoutes = require('./routes/postRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const productExtraRoutes = require('./routes/productExtraRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Cấu hình phục vụ thư mục tĩnh uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Cấu hình CORS để cho phép Frontend kết nối
app.use(cors());

// Middleware đọc dữ liệu JSON và urlencoded từ request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route kiểm tra sức khỏe ứng dụng (Health check)
app.use('/', (req, res, next) => {
    if (req.path === '/') {
        return res.json({ success: true, message: 'Backend Node.js API đang hoạt động bình thường!' });
    }
    next();
});

// Định nghĩa các Route API
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/products', productExtraRoutes); // Route này sẽ chạy kiểu http://localhost:5000/api/products/1/extra
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);


// Xử lý Route không tồn tại (404 Not Found)
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route không tồn tại' });
});

// Lắng nghe cổng kết nối
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(` Server đang chạy tại: http://localhost:${PORT}`);
    console.log(` API Sản phẩm: http://localhost:${PORT}/api/products`);
    console.log(`=================================`);
});