const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// 1. Lấy danh sách các cuộc hội thoại chat (Admin xem)
router.get('/sessions', chatController.getSessions);

// 2. Lấy danh sách tin nhắn của 1 cuộc hội thoại (session_id)
router.get('/messages', chatController.getMessages);

// 3. Gửi tin nhắn mới (Khách / Admin)
router.post('/message', chatController.sendMessage);

module.exports = router;
