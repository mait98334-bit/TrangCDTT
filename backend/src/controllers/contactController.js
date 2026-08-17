const Contact = require('../models/contactModel');

// 1. Lấy danh sách liên hệ
exports.getContacts = async (req, res) => {
    try {
        const includeDeleted = req.query.admin === 'true';
        const contacts = await Contact.getAll(includeDeleted);
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
        const { name, email, phone, message, product_id } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ tên, email và nội dung tin nhắn'
            });
        }

        const result = await Contact.create({ name, email, phone, message, product_id });

        res.status(201).json({
            success: true,
            message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.',
            data: { id: result.insertId, name, email, phone, message, product_id }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi liên hệ',
            error: error.message
        });
    }
};

// 3. Xóa mềm liên hệ (đưa vào thùng rác)
exports.deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.getById(id, true);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy liên hệ có ID: ${id}`
            });
        }

        await Contact.delete(id);

        res.status(200).json({
            success: true,
            message: 'Xóa liên hệ thành công (đã đưa vào Thùng rác)'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa liên hệ',
            error: error.message
        });
    }
};

// 4. Khôi phục liên hệ đã xóa mềm
exports.restoreContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.getById(id, true);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy liên hệ có ID: ${id}`
            });
        }

        await Contact.restore(id);

        res.status(200).json({
            success: true,
            message: 'Khôi phục liên hệ thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi khôi phục liên hệ',
            error: error.message
        });
    }
};

// 5. Xóa vĩnh viễn liên hệ khỏi database
exports.hardDeleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.getById(id, true);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy liên hệ có ID: ${id}`
            });
        }

        await Contact.hardDelete(id);

        res.status(200).json({
            success: true,
            message: 'Đã xóa vĩnh viễn liên hệ khỏi hệ thống'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vĩnh viễn liên hệ',
            error: error.message
        });
    }
};