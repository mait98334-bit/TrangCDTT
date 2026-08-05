const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users -> Lấy danh sách tài khoản
router.get('/', userController.getUsers);

// GET /api/users/:id -> Lấy chi tiết tài khoản
router.get('/:id', userController.getUserById);

// POST /api/users -> Tạo tài khoản mới (Admin)
router.post('/', userController.createUser);

// PUT /api/users/:id -> Cập nhật tài khoản
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id -> Xóa mềm tài khoản
router.delete('/:id', userController.deleteUser);

// POST /api/users/:id/restore -> Khôi phục tài khoản
router.post('/:id/restore', userController.restoreUser);

// DELETE /api/users/:id/hard -> Xóa vĩnh viễn tài khoản
router.delete('/:id/hard', userController.hardDeleteUser);

module.exports = router;
