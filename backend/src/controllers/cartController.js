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
        const { userId, productId, quantity, variantId, variant_id } = req.body;
        const vId = variantId || variant_id || null;
        await Cart.addItem(userId, productId, quantity || 1, vId);
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

// 7. Cập nhật sản phẩm trong giỏ hàng (Client)
exports.updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity, variantId, variant_id } = req.body;
        
        const updates = {};
        if (quantity !== undefined) {
            if (isNaN(quantity) || parseInt(quantity) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Số lượng phải là số dương hợp lệ'
                });
            }
            updates.quantity = parseInt(quantity);
        }

        const vId = variantId !== undefined ? variantId : (variant_id !== undefined ? variant_id : undefined);
        if (vId !== undefined) {
            updates.variant_id = vId;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có thông tin cần cập nhật'
            });
        }
        
        await Cart.updateCartItem(itemId, updates);
        res.status(200).json({
            success: true,
            message: 'Cập nhật giỏ hàng thành công!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật giỏ hàng',
            error: error.message
        });
    }
};