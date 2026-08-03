const Cart = require('../models/cartModel');

// 1. Lấy giỏ hàng của một người dùng (Client)
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartData = await Cart.getByUserId(userId);
        res.status(200).json({ success: true, data: cartData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy giỏ hàng', error: error.message });
    }
};

// 2. Thêm sản phẩm vào giỏ hàng (Client)
exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        await Cart.addItem(userId, productId, quantity || 1);
        res.status(200).json({ success: true, message: 'Đã thêm vào giỏ hàng' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi thêm vào giỏ hàng', error: error.message });
    }
};

// 3. Xóa một sản phẩm khỏi giỏ hàng (Client / Admin)
exports.removeCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        await Cart.removeItem(itemId);
        res.status(200).json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi xóa sản phẩm', error: error.message });
    }
};

// 4. Lấy tất cả giỏ hàng đang hoạt động (Admin)
exports.getCarts = async (req, res) => {
    try {
        const carts = await Cart.getAll();
        res.status(200).json({
            success: true,
            count: carts.length,
            data: carts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách giỏ hàng hệ thống',
            error: error.message
        });
    }
};

// 5. Lấy chi tiết một giỏ hàng (Admin)
exports.getCartDetails = async (req, res) => {
    try {
        const { cartId } = req.params;
        const items = await Cart.getByCartId(cartId);
        res.status(200).json({
            success: true,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy chi tiết giỏ hàng',
            error: error.message
        });
    }
};

// 6. Xóa/Dọn sạch toàn bộ giỏ hàng (Admin)
exports.clearUserCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        await Cart.clearCart(cartId);
        res.status(200).json({
            success: true,
            message: 'Đã dọn sạch giỏ hàng thành công!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa giỏ hàng',
            error: error.message
        });
    }
};