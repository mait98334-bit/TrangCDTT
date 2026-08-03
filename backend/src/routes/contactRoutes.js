const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET /api/contacts -> Lấy danh sách liên hệ (Admin)
router.get('/', contactController.getContacts);

// POST /api/contacts -> Khách gửi liên hệ
router.post('/', contactController.createContact);

// DELETE /api/contacts/:id -> Xóa liên hệ (Admin)
router.delete('/:id', contactController.deleteContact);

module.exports = router;