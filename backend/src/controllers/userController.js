const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// 1. Lấy danh sách tất cả người dùng
exports.getUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách tài khoản',
            error: error.message
        });
    }
};

// 2. Lấy thông tin chi tiết một người dùng
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.getById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy tài khoản có ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy thông tin tài khoản',
            error: error.message
        });
    }
};

// 3. Tạo tài khoản mới (Admin tạo)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền tên, email và mật khẩu'
            });
        }

        // Kiểm tra email tồn tại chưa
        const existingUser = await User.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email này đã được sử dụng!'
            });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await User.create({
            name,
            email,
            hashedPassword,
            role: role || 'customer'
        });

        res.status(201).json({
            success: true,
            message: 'Tạo tài khoản mới thành công!',
            data: {
                id: result.insertId,
                name,
                email,
                role: role || 'customer'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi tạo tài khoản',
            error: error.message
        });
    }
};

// 4. Cập nhật thông tin tài khoản
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, password } = req.body;

        const user = await User.getById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy tài khoản có ID: ${id}`
            });
        }

        // Nếu thay đổi email, check trùng với email người khác
        if (email && email !== user.email) {
            const existingUser = await User.getByEmail(email);
            if (existingUser && existingUser.id !== Number(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email này đã được sử dụng bởi người dùng khác!'
                });
            }
        }

        let hashedPassword = null;
        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        await User.update(id, {
            name: name || user.name,
            email: email || user.email,
            role: role || user.role,
            hashedPassword
        });

        res.status(200).json({
            success: true,
            message: 'Cập nhật tài khoản thành công!',
            data: {
                id: Number(id),
                name: name || user.name,
                email: email || user.email,
                role: role || user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật tài khoản',
            error: error.message
        });
    }
};

// 5. Xóa tài khoản
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.getById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy tài khoản có ID: ${id}`
            });
        }

        await User.delete(id);

        res.status(200).json({
            success: true,
            message: 'Xóa tài khoản thành công!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa tài khoản',
            error: error.message
        });
    }
};
