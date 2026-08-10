const db = require('../config/db');

const Order = {
    // 1. Tạo đơn hàng mới kèm theo chi tiết sản phẩm
    create: async (orderData, items) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Lưu thông tin chung vào bảng orders
            const { user_id, fullname, phone, address, total_price } = orderData;
            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, fullname, phone, address, total_price) VALUES (?, ?, ?, ?, ?)',
                [user_id || null, fullname, phone, address, total_price]
            );
            const orderId = orderResult.insertId;

            // Lưu từng sản phẩm vào bảng order_details
            for (const item of items) {
                await connection.query(
                    'INSERT INTO order_details (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, item.price]
                );
            }

            await connection.commit();
            connection.release();
            return { orderId };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    },

    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM orders ORDER BY id ASC');
        return rows;
    },

    // 3. Lấy chi tiết 1 đơn hàng kèm theo các sản phẩm bên trong nó
    getById: async (id) => {
        const [orders] = await db.query(
            `SELECT o.*, u.email as user_email, u.name as user_registered_name 
             FROM orders o 
             LEFT JOIN users u ON o.user_id = u.id 
             WHERE o.id = ?`,
            [id]
        );
        if (orders.length === 0) return null;

        const [details] = await db.query(
            `SELECT od.*, p.name as product_name, p.image 
             FROM order_details od 
             JOIN products p ON od.product_id = p.id 
             WHERE od.order_id = ?`,
            [id]
        );

        return {
            order: orders[0],
            items: details
        };
    },

    // Cập nhật trạng thái đơn hàng (cho Admin)
    updateStatus: async (id, status) => {
        const [result] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        return result;
    },

    // Xóa đơn hàng theo ID
    delete: async (id) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            // Xóa chi tiết đơn hàng trước
            await connection.query('DELETE FROM order_details WHERE order_id = ?', [id]);
            // Xóa đơn hàng sau
            const [result] = await connection.query('DELETE FROM orders WHERE id = ?', [id]);
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

module.exports = Order;