const db = require('../config/db');

const Product = {
    // Lấy danh sách sản phẩm (có tùy chọn lấy cả sản phẩm đã xóa cho admin)
    getAll: async (includeDeleted = false) => {
        const whereClause = includeDeleted ? '' : 'WHERE p.is_deleted = 0 OR p.is_deleted IS NULL';
        const [rows] = await db.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name,
                    COALESCE((SELECT SUM(od.quantity) FROM order_details od WHERE od.product_id = p.id), 0) as total_sold,
                    COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = p.id AND (r.is_deleted = 0 OR r.is_deleted IS NULL)), 0) as average_rating
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             LEFT JOIN brands b ON p.brand_id = b.id
             ${whereClause}
             ORDER BY p.brand_id ASC, p.id ASC`
        );
        return rows.map(prod => {
            const price = Number(prod.price || 0);
            const priceSale = prod.price_sale ? Number(prod.price_sale) : null;
            const totalSold = Number(prod.total_sold || 0);
            const averageRating = Number(prod.average_rating || 0);
            let isHot = Number(prod.is_hot || 0);
            if (totalSold > 5 || (priceSale !== null && priceSale <= price * 0.5)) {
                isHot = 1;
            }
            return { ...prod, is_hot: isHot, average_rating: averageRating };
        });
    },

    // Lấy chi tiết 1 sản phẩm theo ID (có tùy chọn lấy cả sản phẩm đã xóa cho admin)
    getById: async (id, includeDeleted = false) => {
        const whereClause = includeDeleted 
            ? 'WHERE p.id = ?' 
            : 'WHERE p.id = ? AND (p.is_deleted = 0 OR p.is_deleted IS NULL)';
        const [rows] = await db.query(
            `SELECT p.*, c.name as category_name, b.name as brand_name,
                    COALESCE((SELECT SUM(od.quantity) FROM order_details od WHERE od.product_id = p.id), 0) as total_sold,
                    COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = p.id AND (r.is_deleted = 0 OR r.is_deleted IS NULL)), 0) as average_rating
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             LEFT JOIN brands b ON p.brand_id = b.id
             ${whereClause}`,
            [id]
        );
        if (rows.length === 0) return null;
        const prod = rows[0];
        const price = Number(prod.price || 0);
        const priceSale = prod.price_sale ? Number(prod.price_sale) : null;
        const totalSold = Number(prod.total_sold || 0);
        const averageRating = Number(prod.average_rating || 0);
        let isHot = Number(prod.is_hot || 0);
        if (totalSold > 5 || (priceSale !== null && priceSale <= price * 0.5)) {
            isHot = 1;
        }
        return { ...prod, is_hot: isHot, average_rating: averageRating };
    },

    // Thêm sản phẩm mới (dùng cho trang Admin)
    create: async (data) => {
        const { name, price, price_sale, image, description, category_id, brand_id, is_sale, is_hot, is_new } = data;
        const [result] = await db.query(
            'INSERT INTO products (name, price, price_sale, image, description, category_id, brand_id, is_sale, is_hot, is_new, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
            [name, price, price_sale || null, image, description, category_id || null, brand_id || null, is_sale || 0, is_hot || 0, is_new || 0]
        );
        return result;
    },

    // Cập nhật thông tin sản phẩm
    update: async (id, data) => {
        const { name, price, price_sale, image, description, category_id, brand_id, is_sale, is_hot, is_new } = data;
        const [result] = await db.query(
            'UPDATE products SET name = ?, price = ?, price_sale = ?, image = ?, description = ?, category_id = ?, brand_id = ?, is_sale = ?, is_hot = ?, is_new = ? WHERE id = ?',
            [name, price, price_sale || null, image, description, category_id || null, brand_id || null, is_sale || 0, is_hot || 0, is_new || 0, id]
        );
        return result;
    },

    // Xóa mềm sản phẩm (chuyển is_deleted = 1)
    delete: async (id) => {
        const [result] = await db.query(
            'UPDATE products SET is_deleted = 1 WHERE id = ?',
            [id]
        );
        return result;
    },

    // Khôi phục sản phẩm đã xóa mềm (is_deleted = 0)
    restore: async (id) => {
        const [result] = await db.query(
            'UPDATE products SET is_deleted = 0 WHERE id = ?',
            [id]
        );
        return result;
    },

    // Xóa vĩnh viễn sản phẩm khỏi database
    hardDelete: async (id) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Xóa các biến thể sản phẩm
            await connection.query('DELETE FROM product_variants WHERE product_id = ?', [id]);

            // 2. Xóa các ảnh phụ sản phẩm
            await connection.query('DELETE FROM product_images WHERE product_id = ?', [id]);

            // 3. Xóa sản phẩm trong giỏ hàng
            await connection.query('DELETE FROM cart_items WHERE product_id = ?', [id]);

            // 4. Xóa đánh giá của sản phẩm
            await connection.query('DELETE FROM reviews WHERE product_id = ?', [id]);

            // 5. Xóa chi tiết đơn hàng liên quan đến sản phẩm
            await connection.query('DELETE FROM order_details WHERE product_id = ?', [id]);

            // 6. Xóa sản phẩm chính
            const [result] = await connection.query('DELETE FROM products WHERE id = ?', [id]);

            await connection.commit();
            connection.release();
            return result;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
};

module.exports = Product;