const db = require('../config/db');

const Review = {
    // Lấy đánh giá của 1 sản phẩm (lọc chỉ lấy các đánh giá chưa bị xóa mềm)
    getByProduct: async (productId) => {
        const [rows] = await db.query(
            `SELECT r.*, u.name as user_name 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = ? AND (r.is_deleted = 0 OR r.is_deleted IS NULL)
             ORDER BY r.created_at DESC`,
            [productId]
        );
        return rows;
    },
    create: async (data) => {
        const { product_id, user_id, rating, comment } = data;
        const [result] = await db.query(
            'INSERT INTO reviews (product_id, user_id, rating, comment, is_deleted) VALUES (?, ?, ?, ?, 0)',
            [product_id, user_id, rating, comment]
        );
        return result;
    },

    // Lấy tất cả đánh giá (cho Admin, có hỗ trợ includeDeleted)
    getAll: async (includeDeleted = false) => {
        const query = includeDeleted
            ? `SELECT r.*, p.name as product_name, u.name as user_name 
               FROM reviews r 
               JOIN products p ON r.product_id = p.id
               JOIN users u ON r.user_id = u.id 
               ORDER BY r.id ASC`
            : `SELECT r.*, p.name as product_name, u.name as user_name 
               FROM reviews r 
               JOIN products p ON r.product_id = p.id
               JOIN users u ON r.user_id = u.id 
               WHERE r.is_deleted = 0 OR r.is_deleted IS NULL
               ORDER BY r.id ASC`;
        const [rows] = await db.query(query);
        return rows;
    },

    // Lấy đánh giá theo ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
        return rows[0];
    },

    // Xóa mềm đánh giá (chuyển is_deleted = 1)
    delete: async (id) => {
        const [result] = await db.query('UPDATE reviews SET is_deleted = 1 WHERE id = ?', [id]);
        return result;
    },

    // Khôi phục đánh giá đã xóa mềm
    restore: async (id) => {
        const [result] = await db.query('UPDATE reviews SET is_deleted = 0 WHERE id = ?', [id]);
        return result;
    },

    // Xóa vĩnh viễn đánh giá khỏi database
    hardDelete: async (id) => {
        const [result] = await db.query('DELETE FROM reviews WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Review;