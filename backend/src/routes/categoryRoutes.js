const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories -> Lấy tất cả danh mục
router.get('/', categoryController.getCategories);

// GET /api/categories/:id -> Lấy danh mục theo ID
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories -> Thêm danh mục mới
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id -> Cập nhật danh mục
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id -> Xóa danh mục
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;