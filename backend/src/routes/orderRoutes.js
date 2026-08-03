const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders -> Khách đặt hàng
router.post('/', orderController.createOrder);

// GET /api/orders -> Lấy tất cả đơn hàng (Admin)
router.get('/', orderController.getOrders);

// GET /api/orders/:id -> Xem chi tiết đơn hàng
router.get('/:id', orderController.getOrderById);

// PUT /api/orders/:id/status -> Cập nhật trạng thái đơn hàng
router.put('/:id/status', orderController.updateOrderStatus);

// DELETE /api/orders/:id -> Xóa đơn hàng
router.delete('/:id', orderController.deleteOrder);

module.exports = router;