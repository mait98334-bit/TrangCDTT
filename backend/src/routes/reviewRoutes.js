const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET /api/reviews/product/:productId -> Lấy đánh giá của 1 sản phẩm
router.get('/product/:productId', reviewController.getReviewsByProduct);

// GET /api/reviews -> Lấy tất cả đánh giá (Admin)
router.get('/', reviewController.getReviews);

// POST /api/reviews -> Thêm đánh giá mới
router.post('/', reviewController.createReview);

// DELETE /api/reviews/:id -> Xóa đánh giá (Admin)
router.delete('/:id', reviewController.deleteReview);

module.exports = router;