const db = require('../config/db');

const User = {
    // Tìm người dùng theo Email (dùng khi đăng nhập hoặc kiểm tra trùng)
    getByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Tìm người dùng theo ID
    getById: async (id, includeDeleted = false) => {
        const queryStr = includeDeleted
            ? 'SELECT id, name, email, role, created_at, is_deleted FROM users WHERE id = ?'
            : 'SELECT id, name, email, role, created_at, is_deleted FROM users WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)';
        const [rows] = await db.query(queryStr, [id]);
        return rows[0];
    },

    // Lấy tất cả tài khoản
    getAll: async (includeDeleted = false) => {
        const queryStr = includeDeleted
            ? 'SELECT id, name, email, role, created_at, is_deleted FROM users ORDER BY id ASC'
            : 'SELECT id, name, email, role, created_at, is_deleted FROM users WHERE is_deleted = 0 OR is_deleted IS NULL ORDER BY id ASC';
        const [rows] = await db.query(queryStr);
        return rows;
    },

    // Tạo tài khoản mới (Đăng ký / Admin tạo)
    create: async (userData) => {
        const { name, email, hashedPassword, role } = userData;
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, is_deleted) VALUES (?, ?, ?, ?, 0)',
            [name, email, hashedPassword, role || 'customer']
        );
        return result;
    },

    // Cập nhật thông tin người dùng (Admin)
    update: async (id, userData) => {
        const { name, email, role, hashedPassword } = userData;
        if (hashedPassword) {
            const [result] = await db.query(
                'UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?',
                [name, email, role, hashedPassword, id]
            );
            return result;
        } else {
            const [result] = await db.query(
                'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
                [name, email, role, id]
            );
            return result;
        }
    },

    // Xóa mềm người dùng (is_deleted = 1)
    delete: async (id) => {
        const [result] = await db.query('UPDATE users SET is_deleted = 1 WHERE id = ?', [id]);
        return result;
    },

    // Khôi phục người dùng (is_deleted = 0)
    restore: async (id) => {
        const [result] = await db.query('UPDATE users SET is_deleted = 0 WHERE id = ?', [id]);
        return result;
    },

    // Xóa vĩnh viễn người dùng khỏi database
    hardDelete: async (id) => {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result;
    }
};

module.exports = User;