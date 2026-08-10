const db = require('../config/db');

const Contact = {
    // Lấy tất cả liên hệ (có hỗ trợ includeDeleted cho Admin)
    getAll: async (includeDeleted = false) => {
        const query = includeDeleted
            ? 'SELECT * FROM contacts ORDER BY id ASC'
            : 'SELECT * FROM contacts WHERE is_deleted = 0 OR is_deleted IS NULL ORDER BY id ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    // Lấy chi tiết liên hệ theo ID
    getById: async (id, includeDeleted = false) => {
        const query = includeDeleted
            ? 'SELECT * FROM contacts WHERE id = ?'
            : 'SELECT * FROM contacts WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Gửi liên hệ mới từ phía khách hàng (Frontend gửi lên)
    create: async (data) => {
        const { name, email, phone, message } = data;
        const [result] = await db.query(
            'INSERT INTO contacts (name, email, phone, message, is_deleted) VALUES (?, ?, ?, ?, 0)',
            [name, email, phone, message]
        );
        return result;
    },

    // Xóa mềm liên hệ (Admin xóa đưa vào thùng rác)
    delete: async (id) => {
        const [result] = await db.query('UPDATE contacts SET is_deleted = 1 WHERE id = ?', [id]);
        return result;
    },

    // Khôi phục liên hệ đã xóa mềm
    restore: async (id) => {
        const [result] = await db.query('UPDATE contacts SET is_deleted = 0 WHERE id = ?', [id]);
        return result;
    },

    // Xóa vĩnh viễn liên hệ khỏi database
    hardDelete: async (id) => {
        const [result] = await db.query('DELETE FROM contacts WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Contact;