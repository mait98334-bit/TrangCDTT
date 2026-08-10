const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET /api/contacts -> Lấy danh sách liên hệ (Admin)
router.get('/', contactController.getContacts);

// POST /api/contacts -> Khách gửi liên hệ
router.post('/', contactController.createContact);

// POST /api/contacts/:id/restore -> Khôi phục liên hệ đã xóa mềm (Admin)
router.post('/:id/restore', contactController.restoreContact);

// DELETE /api/contacts/:id/hard -> Xóa vĩnh viễn liên hệ (Admin)
router.delete('/:id/hard', contactController.hardDeleteContact);

// DELETE /api/contacts/:id -> Xóa mềm liên hệ (Admin)
router.delete('/:id', contactController.deleteContact);

module.exports = router;