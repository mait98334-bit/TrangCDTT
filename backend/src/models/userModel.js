const db = require('../config/db');

const User = {
    // Tìm người dùng theo Email (dùng khi đăng nhập hoặc kiểm tra trùng)
    getByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // Tìm người dùng theo ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    getAll: async () => {
        const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC');
        return rows;
    },

    // Tạo tài khoản mới (Đăng ký / Admin tạo)
    create: async (userData) => {
        const { name, email, hashedPassword, role } = userData;
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
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

    // Xóa người dùng (Admin)
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result;
    }
};

module.exports = User;