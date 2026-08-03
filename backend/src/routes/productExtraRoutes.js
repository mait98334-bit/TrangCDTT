const express = require('express');
const router = express.Router();
const productExtraController = require('../controllers/productExtraController');

// GET /api/products/:productId/extra -> Lấy toàn bộ biến thể và ảnh phụ của sản phẩm
router.get('/:productId/extra', productExtraController.getDetails);

// Biến thể
router.post('/:productId/variants', productExtraController.addVariant);
router.delete('/variants/:variantId', productExtraController.deleteVariant);

// Ảnh phụ
router.post('/:productId/images', productExtraController.addImage);
router.delete('/images/:imageId', productExtraController.deleteImage);

module.exports = router;