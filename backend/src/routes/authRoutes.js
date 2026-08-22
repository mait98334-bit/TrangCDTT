const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register -> Đăng ký
router.post('/register', authController.register);

// POST /api/auth/login -> Đăng nhập
router.post('/login', authController.login);

// POST /api/auth/forgot-password -> Gửi yêu cầu quên mật khẩu
router.post('/forgot-password', authController.forgotPassword);

// POST /api/auth/reset-password -> Đặt lại mật khẩu mới
router.post('/reset-password', authController.resetPassword);

module.exports = router;