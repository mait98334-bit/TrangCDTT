const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// 1. Đăng ký tài khoản
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ tên, email và mật khẩu'
            });
        }

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = await User.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email này đã được sử dụng rồi!'
            });
        }

        // Mã hóa mật khẩu trước khi lưu vào database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Lưu vào CSDL
        const result = await User.create({
            name,
            email,
            hashedPassword,
            role
        });

        res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công!',
            data: { id: result.insertId, name, email, role: role || 'customer' }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đăng ký',
            error: error.message
        });
    }
};

// 2. Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập email và mật khẩu'
            });
        }

        // Tìm user theo email
        const user = await User.getByEmail(email);
        if (!user || user.is_deleted === 1) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // Đăng nhập thành công (Trả về thông tin cơ bản, không trả mật khẩu ra ngoài)
        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công!',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đăng nhập',
            error: error.message
        });
    }
};