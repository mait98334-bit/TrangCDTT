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

// In-memory store for reset codes: email -> { code, expiresAt }
const resetCodes = new Map();

// 3. Yêu cầu quên mật khẩu
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập địa chỉ email'
            });
        }

        // Kiểm tra xem email có tồn tại không
        const user = await User.getByEmail(email);
        if (!user || user.is_deleted === 1) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản nào đăng ký với email này!'
            });
        }

        // Tạo mã xác thực ngẫu nhiên 6 chữ số
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Lưu mã vào memory với hạn dùng 10 phút
        resetCodes.set(email, {
            code,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 phút
        });

        res.status(200).json({
            success: true,
            message: `Mã xác thực đặt lại mật khẩu đã được tạo (Mã test: ${code})`,
            demoCode: code // Trả về để tiện test offline
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi yêu cầu đặt lại mật khẩu',
            error: error.message
        });
    }
};

// 4. Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ email, mã xác thực và mật khẩu mới'
            });
        }

        // Kiểm tra mã trong memory
        const record = resetCodes.get(email);
        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực không tồn tại hoặc đã hết hạn!'
            });
        }

        if (record.code !== code.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực không chính xác!'
            });
        }

        if (record.expiresAt < Date.now()) {
            resetCodes.delete(email);
            return res.status(400).json({
                success: false,
                message: 'Mã xác thực đã hết hạn!'
            });
        }

        // Tìm người dùng
        const user = await User.getByEmail(email);
        if (!user || user.is_deleted === 1) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản!'
            });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu trong database
        await User.update(user.id, {
            name: user.name,
            email: user.email,
            role: user.role,
            hashedPassword
        });

        // Xóa mã đã sử dụng
        resetCodes.delete(email);

        res.status(200).json({
            success: true,
            message: 'Đặt lại mật khẩu thành công! Hãy đăng nhập lại bằng mật khẩu mới.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ khi đặt lại mật khẩu',
            error: error.message
        });
    }
};