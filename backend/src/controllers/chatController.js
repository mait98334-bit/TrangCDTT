const Chat = require('../models/chatModel');

// 1. Admin lấy danh sách các phiên chat (hoạt động)
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Chat.getSessions();
        res.status(200).json({
            success: true,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách phòng chat',
            error: error.message
        });
    }
};

// 2. Lấy toàn bộ lịch sử tin nhắn của một phiên chat
exports.getMessages = async (req, res) => {
    try {
        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu tham số session_id'
            });
        }

        const messages = await Chat.getMessages(session_id);
        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy lịch sử tin nhắn',
            error: error.message
        });
    }
};

// 3. Gửi tin nhắn mới (cho cả Khách hàng và Admin)
exports.sendMessage = async (req, res) => {
    try {
        const { session_id, sender_name, message, is_admin } = req.body;

        if (!session_id || !sender_name || !message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin: session_id, sender_name, message'
            });
        }

        const result = await Chat.createMessage({
            session_id,
            sender_name,
            message,
            is_admin: is_admin === true || is_admin === 1 || is_admin === 'true'
        });

        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công',
            data: {
                id: result.insertId,
                session_id,
                sender_name,
                message,
                is_admin: !!is_admin,
                created_at: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi tin nhắn',
            error: error.message
        });
    }
};
