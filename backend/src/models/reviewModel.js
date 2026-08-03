const db = require('../config/db');

const Review = {
    getByProduct: async (productId) => {
        const [rows] = await db.query(
            `SELECT r.*, u.name as user_name 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? ORDER BY r.created_at DESC`,
            [productId]
        );
        return rows;
    },
    create: async (data) => {
        const { product_id, user_id, rating, comment } = data;
        const [result] = await db.query(
            'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [product_id, user_id, rating, comment]
        );
        return result;
    },

    // Lấy tất cả đánh giá (cho Admin)
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT r.*, p.name as product_name, u.name as user_name 
             FROM reviews r 
             JOIN products p ON r.product_id = p.id
             JOIN users u ON r.user_id = u.id 
             ORDER BY r.id ASC`
        );
        return rows;
    },

    // Xóa đánh giá theo ID
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM reviews WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Review;