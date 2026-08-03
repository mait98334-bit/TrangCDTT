const Contact = require('../models/contactModel');

// 1. Lấy danh sách liên hệ
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.getAll();
        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách liên hệ',
            error: error.message
        });
    }
};

// 2. Khách gửi liên hệ mới
exports.createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ tên, email và nội dung tin nhắn'
            });
        }

        const result = await Contact.create({ name, email, phone, message });

        res.status(201).json({
            success: true,
            message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.',
            data: { id: result.insertId, name, email, phone, message }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi liên hệ',
            error: error.message
        });
    }
};

// 3. Xóa liên hệ
exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Contact.delete(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy liên hệ có ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa liên hệ thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa liên hệ',
            error: error.message
        });
    }
};