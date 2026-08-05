const Product = require('../models/productModel');

// 1. Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const includeDeleted = req.query.admin === 'true';
        const products = await Product.getAll(includeDeleted);
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách sản phẩm',
            error: error.message
        });
    }
};

// 2. Lấy chi tiết sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const includeDeleted = req.query.admin === 'true';
        const product = await Product.getById(id, includeDeleted);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy sản phẩm có ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy chi tiết sản phẩm',
            error: error.message
        });
    }
};

// 3. Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const { name, price, price_sale, image, description, category_id, brand_id, is_sale, is_hot, is_new } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Tên và giá sản phẩm không được để trống'
            });
        }

        const result = await Product.create({ 
            name, 
            price, 
            price_sale: price_sale ? Number(price_sale) : null,
            image, 
            description, 
            category_id, 
            brand_id, 
            is_sale: Number(is_sale || 0), 
            is_hot: Number(is_hot || 0), 
            is_new: Number(is_new || 0) 
        });

        res.status(201).json({
            success: true,
            message: 'Thêm sản phẩm thành công',
            data: { 
                id: result.insertId, 
                name, 
                price, 
                price_sale: price_sale ? Number(price_sale) : null,
                image, 
                description, 
                category_id, 
                brand_id, 
                is_sale: Number(is_sale || 0), 
                is_hot: Number(is_hot || 0), 
                is_new: Number(is_new || 0) 
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm sản phẩm',
            error: error.message
        });
    }
};

// 4. Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, price_sale, image, description, category_id, brand_id, is_sale, is_hot, is_new } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Tên và giá sản phẩm không được để trống'
            });
        }

        const product = await Product.getById(id, true); // Lấy kể cả sản phẩm đã soft delete để cập nhật
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy sản phẩm có ID: ${id}`
            });
        }

        await Product.update(id, { 
            name, 
            price, 
            price_sale: price_sale ? Number(price_sale) : null,
            image, 
            description, 
            category_id, 
            brand_id, 
            is_sale: Number(is_sale || 0), 
            is_hot: Number(is_hot || 0), 
            is_new: Number(is_new || 0) 
        });

        res.status(200).json({
            success: true,
            message: 'Cập nhật sản phẩm thành công',
            data: { 
                id: Number(id), 
                name, 
                price, 
                price_sale: price_sale ? Number(price_sale) : null,
                image, 
                description, 
                category_id, 
                brand_id, 
                is_sale: Number(is_sale || 0), 
                is_hot: Number(is_hot || 0), 
                is_new: Number(is_new || 0) 
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật sản phẩm',
            error: error.message
        });
    }
};

// 5. Xóa mềm sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.getById(id, true);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy sản phẩm có ID: ${id}`
            });
        }

        await Product.delete(id);

        res.status(200).json({
            success: true,
            message: 'Xóa sản phẩm thành công (đã đưa vào Thùng rác)'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa sản phẩm',
            error: error.message
        });
    }
};

// 6. Khôi phục sản phẩm đã xóa mềm
exports.restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.getById(id, true);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy sản phẩm có ID: ${id}`
            });
        }

        await Product.restore(id);

        res.status(200).json({
            success: true,
            message: 'Khôi phục sản phẩm thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi khôi phục sản phẩm',
            error: error.message
        });
    }
};

// 7. Xóa vĩnh viễn sản phẩm
exports.hardDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.getById(id, true);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy sản phẩm có ID: ${id}`
            });
        }

        await Product.hardDelete(id);

        res.status(200).json({
            success: true,
            message: 'Đã xóa vĩnh viễn sản phẩm khỏi hệ thống'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vĩnh viễn sản phẩm',
            error: error.message
        });
    }
};