const ProductExtra = require('../models/productExtraModel');

exports.getDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        const variants = await ProductExtra.getVariantsByProductId(productId);
        const images = await ProductExtra.getImagesByProductId(productId);
        res.status(200).json({ success: true, data: { variants, images } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addVariant = async (req, res) => {
    try {
        const { productId } = req.params;
        const { color, size, price, stock, image } = req.body;
        const result = await ProductExtra.addVariant(productId, { color, size, price, stock, image });
        res.status(201).json({ success: true, message: 'Thêm biến thể thành công', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        await ProductExtra.deleteVariant(variantId);
        res.status(200).json({ success: true, message: 'Xóa biến thể thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const { color, size, price, stock, image } = req.body;
        await ProductExtra.updateVariant(variantId, { color, size, price, stock, image });
        res.status(200).json({ success: true, message: 'Cập nhật biến thể thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addImage = async (req, res) => {
    try {
        const { productId } = req.params;
        const { image_url } = req.body;
        if (!image_url) {
            return res.status(400).json({ success: false, message: 'Đường dẫn ảnh là bắt buộc' });
        }
        const result = await ProductExtra.addImage(productId, image_url);
        res.status(201).json({ success: true, message: 'Thêm ảnh phụ thành công', data: { id: result.insertId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        await ProductExtra.deleteImage(imageId);
        res.status(200).json({ success: true, message: 'Xóa ảnh phụ thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};