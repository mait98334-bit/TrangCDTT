const Order = require('../models/orderModel');

// 1. Khách đặt hàng
exports.createOrder = async (req, res) => {
    try {
        const { user_id, fullname, phone, address, total_price, items } = req.body;

        if (!fullname || !phone || !address || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin giao hàng và giỏ hàng không được trống'
            });
        }

        const result = await Order.create(
            { user_id, fullname, phone, address, total_price },
            items
        );

        res.status(201).json({
            success: true,
            message: 'Đặt hàng thành công!',
            data: { orderId: result.orderId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi đặt hàng',
            error: error.message
        });
    }
};

// 2. Lấy danh sách đơn hàng (Admin)
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách đơn hàng',
            error: error.message
        });
    }
};

// 3. Xem chi tiết đơn hàng
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const orderData = await Order.getById(id);

        if (!orderData) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy đơn hàng có ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: orderData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy chi tiết đơn hàng',
            error: error.message
        });
    }
};

// 4. Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái đơn hàng không được để trống'
            });
        }

        const orderData = await Order.getById(id);
        if (!orderData) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy đơn hàng có ID: ${id}`
            });
        }

        await Order.updateStatus(id, status);

        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công',
            data: { id: Number(id), status }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái đơn hàng',
            error: error.message
        });
    }
};

// 5. Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const orderData = await Order.getById(id);
        if (!orderData) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy đơn hàng có ID: ${id}`
            });
        }

        await Order.delete(id);

        res.status(200).json({
            success: true,
            message: 'Xóa đơn hàng thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa đơn hàng',
            error: error.message
        });
    }
};