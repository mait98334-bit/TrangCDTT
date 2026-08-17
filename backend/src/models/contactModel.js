const db = require('../config/db');

const Contact = {
    // Lấy tất cả liên hệ (có hỗ trợ includeDeleted cho Admin)
    getAll: async (includeDeleted = false) => {
        const query = includeDeleted
            ? 'SELECT c.*, p.name AS product_name FROM contacts c LEFT JOIN products p ON c.product_id = p.id ORDER BY c.id DESC'
            : 'SELECT c.*, p.name AS product_name FROM contacts c LEFT JOIN products p ON c.product_id = p.id WHERE c.is_deleted = 0 OR c.is_deleted IS NULL ORDER BY c.id DESC';
        const [rows] = await db.query(query);
        return rows;
    },

    // Lấy chi tiết liên hệ theo ID
    getById: async (id, includeDeleted = false) => {
        const query = includeDeleted
            ? 'SELECT c.*, p.name AS product_name FROM contacts c LEFT JOIN products p ON c.product_id = p.id WHERE c.id = ?'
            : 'SELECT c.*, p.name AS product_name FROM contacts c LEFT JOIN products p ON c.product_id = p.id WHERE c.id = ? AND (c.is_deleted = 0 OR c.is_deleted IS NULL)';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Gửi liên hệ mới từ phía khách hàng (Frontend gửi lên)
    create: async (data) => {
        const { name, email, phone, message, product_id } = data;
        const [result] = await db.query(
            'INSERT INTO contacts (name, email, phone, message, product_id, is_deleted) VALUES (?, ?, ?, ?, ?, 0)',
            [name, email, phone, message, product_id || null]
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