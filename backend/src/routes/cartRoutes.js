const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Route Admin (Lưu ý đặt các route tĩnh này TRƯỚC route động :userId để tránh trùng khớp)
// GET /api/carts -> Lấy tất cả giỏ hàng hoạt động
router.get('/', cartController.getCarts);

// GET /api/carts/details/:cartId -> Xem chi tiết các sản phẩm trong giỏ hàng
router.get('/details/:cartId', cartController.getCartDetails);

// DELETE /api/carts/:cartId -> Xóa toàn bộ sản phẩm trong giỏ hàng
router.delete('/:cartId', cartController.clearUserCart);


// Route Client
// GET /api/carts/:userId -> Lấy giỏ hàng theo User ID
router.get('/:userId', cartController.getCart);

// POST /api/carts/add -> Thêm sản phẩm vào giỏ
router.post('/add', cartController.addToCart);

// DELETE /api/carts/item/:itemId -> Xóa 1 sản phẩm khỏi giỏ
router.delete('/item/:itemId', cartController.removeCartItem);

// PUT /api/carts/item/:itemId -> Cập nhật số lượng sản phẩm trong giỏ
router.put('/item/:itemId', cartController.updateCartItem);

module.exports = router;