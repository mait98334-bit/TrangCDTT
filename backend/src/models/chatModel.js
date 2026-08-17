const db = require('../config/db');

const Chat = {
    // Lấy danh sách các cuộc hội thoại (session) đang hoạt động
    getSessions: async () => {
        // Lấy tin nhắn mới nhất của từng session_id để hiển thị trong danh sách chat của admin
        const query = `
            SELECT m1.*
            FROM chat_messages m1
            INNER JOIN (
                SELECT session_id, MAX(id) as max_id
                FROM chat_messages
                GROUP BY session_id
            ) m2 ON m1.id = m2.max_id
            ORDER BY m1.id DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    // Lấy lịch sử chat của một session_id
    getMessages: async (sessionId) => {
        const query = 'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY id ASC';
        const [rows] = await db.query(query, [sessionId]);
        return rows;
    },

    // Lưu tin nhắn mới vào database
    createMessage: async (data) => {
        const { session_id, sender_name, message, is_admin } = data;
        const query = 'INSERT INTO chat_messages (session_id, sender_name, message, is_admin) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [session_id, sender_name, message, is_admin ? 1 : 0]);
        return result;
    }
};

module.exports = Chat;
