const Review = require('../models/reviewModel');

exports.getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.getByProduct(productId);
        res.status(200).json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi lấy danh sách đánh giá', error: error.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { product_id, user_id, rating, comment } = req.body;
        if (!product_id || !user_id || !rating) {
            return res.status(400).json({ success: false, message: 'Thiếu thông tin đánh giá' });
        }
        const result = await Review.create({ product_id, user_id, rating, comment });
        res.status(201).json({ success: true, message: 'Thêm đánh giá thành công', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi thêm đánh giá', error: error.message });
    }
};

// Lấy tất cả đánh giá (cho Admin)
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.getAll();
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy tất cả đánh giá',
            error: error.message
        });
    }
};

// Xóa đánh giá (Admin)
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Review.delete(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy đánh giá có ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            message: 'Xóa đánh giá thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa đánh giá',
            error: error.message
        });
    }
};