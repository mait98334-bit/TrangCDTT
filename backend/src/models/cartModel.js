const db = require('../config/db');

const Cart = {
    // Lấy tất cả giỏ hàng đang hoạt động (có sản phẩm) của hệ thống
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT c.id as cart_id, c.user_id, u.name as user_name, u.email as user_email,
                    COUNT(ci.id) as total_items,
                    SUM(ci.quantity * p.price) as total_price
             FROM carts c
             JOIN users u ON c.user_id = u.id
             JOIN cart_items ci ON c.id = ci.cart_id
             JOIN products p ON ci.product_id = p.id
             GROUP BY c.id, c.user_id, u.name, u.email
             ORDER BY c.id ASC`
        );
        return rows;
    },

    // Lấy chi tiết giỏ hàng theo User ID
    getByUserId: async (userId) => {
        let [carts] = await db.query('SELECT * FROM carts WHERE user_id = ?', [userId]);
        let cart;
        if (carts.length === 0) {
            const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);
            cart = { id: result.insertId, user_id: userId };
        } else {
            cart = carts[0];
        }

        const [items] = await db.query(
            `SELECT ci.*, p.name, p.price, p.image 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.id 
             WHERE ci.cart_id = ?
             ORDER BY ci.id ASC`,
            [cart.id]
        );

        return { cartId: cart.id, items };
    },

    // Lấy chi tiết giỏ hàng theo Cart ID (Admin xem)
    getByCartId: async (cartId) => {
        const [items] = await db.query(
            `SELECT ci.*, p.name, p.price, p.image 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.id 
             WHERE ci.cart_id = ?
             ORDER BY ci.id ASC`,
            [cartId]
        );
        return items;
    },

    addItem: async (userId, productId, quantity) => {
        const { cartId } = await Cart.getByUserId(userId);

        const [existing] = await db.query(
            'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );

        if (existing.length > 0) {
            const newQty = existing[0].quantity + parseInt(quantity);
            await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
        } else {
            await db.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
                [cartId, productId, quantity]
            );
        }
        return { success: true };
    },

    removeItem: async (itemId) => {
        await db.query('DELETE FROM cart_items WHERE id = ?', [itemId]);
        return { success: true };
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: async (cartId) => {
        await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
        return { success: true };
    }
};

module.exports = Cart;