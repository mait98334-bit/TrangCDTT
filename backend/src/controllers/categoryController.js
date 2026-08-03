const Category = require('../models/categoryModel');

// 1. Lấy danh sách danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.getAll();
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách danh mục',
            error: error.message
        });
    }
};

// 2. Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.getById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy danh mục có ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy chi tiết danh mục',
            error: error.message
        });
    }
};

// 3. Thêm danh mục mới
exports.createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Tên danh mục không được để trống'
            });
        }

        const result = await Category.create({ name, slug });

        res.status(201).json({
            success: true,
            message: 'Thêm danh mục thành công',
            data: { id: result.insertId, name, slug }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm danh mục',
            error: error.message
        });
    }
};

// 4. Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Tên danh mục không được để trống'
            });
        }

        const category = await Category.getById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy danh mục có ID: ${id}`
            });
        }

        await Category.update(id, { name, slug });

        res.status(200).json({
            success: true,
            message: 'Cập nhật danh mục thành công',
            data: { id: Number(id), name, slug }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật danh mục',
            error: error.message
        });
    }
};

// 5. Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.getById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy danh mục có ID: ${id}`
            });
        }

        await Category.delete(id);

        res.status(200).json({
            success: true,
            message: 'Xóa danh mục thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa danh mục',
            error: error.message
        });
    }
};