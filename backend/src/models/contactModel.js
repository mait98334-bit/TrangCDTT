const db = require('../config/db');

const Contact = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM contacts ORDER BY id ASC');
        return rows;
    },

    // Gửi liên hệ mới từ phía khách hàng (Frontend gửi lên)
    create: async (data) => {
        const { name, email, phone, message } = data;
        const [result] = await db.query(
            'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, phone, message]
        );
        return result;
    },

    // Xóa liên hệ (Admin xóa)
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM contacts WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Contact;