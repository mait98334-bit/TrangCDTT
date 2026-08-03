const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// GET /api/brands -> Lấy tất cả thương hiệu
router.get('/', brandController.getBrands);

// GET /api/brands/:id -> Lấy thương hiệu theo ID
router.get('/:id', brandController.getBrandById);

// POST /api/brands -> Thêm thương hiệu mới
router.post('/', brandController.createBrand);

// PUT /api/brands/:id -> Cập nhật thương hiệu
router.put('/:id', brandController.updateBrand);

// DELETE /api/brands/:id -> Xóa thương hiệu
router.delete('/:id', brandController.deleteBrand);

module.exports = router;