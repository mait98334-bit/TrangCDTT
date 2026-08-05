const Brand = require('../models/brandModel');

// 1. Lấy danh sách thương hiệu
exports.getBrands = async (req, res) => {
    try {
        const includeDeleted = req.query.admin === 'true';
        const brands = await Brand.getAll(includeDeleted);
        res.status(200).json({
            success: true,
            count: brands.length,
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách thương hiệu',
            error: error.message
        });
    }
};

// 2. Lấy thương hiệu theo ID
exports.getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const includeDeleted = req.query.admin === 'true';
        const brand = await Brand.getById(id, includeDeleted);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy thương hiệu có ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: brand
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy chi tiết thương hiệu',
            error: error.message
        });
    }
};

// 3. Thêm thương hiệu mới
exports.createBrand = async (req, res) => {
    try {
        const { name, slug, image } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Tên thương hiệu không được để trống'
            });
        }

        const result = await Brand.create({ name, slug, image });

        res.status(201).json({
            success: true,
            message: 'Thêm thương hiệu thành công',
            data: { id: result.insertId, name, slug, image }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm thương hiệu',
            error: error.message
        });
    }
};

// 4. Cập nhật thương hiệu
exports.updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, image } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Tên thương hiệu không được để trống'
            });
        }

        const brand = await Brand.getById(id, true);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy thương hiệu có ID: ${id}`
            });
        }

        await Brand.update(id, { name, slug, image });

        res.status(200).json({
            success: true,
            message: 'Cập nhật thương hiệu thành công',
            data: { id: Number(id), name, slug, image }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật thương hiệu',
            error: error.message
        });
    }
};

// 5. Xóa mềm thương hiệu
exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await Brand.getById(id, true);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy thương hiệu có ID: ${id}`
            });
        }

        await Brand.delete(id);

        res.status(200).json({
            success: true,
            message: 'Xóa thương hiệu thành công (đã đưa vào Thùng rác)'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa thương hiệu',
            error: error.message
        });
    }
};

// 6. Khôi phục thương hiệu đã xóa mềm
exports.restoreBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await Brand.getById(id, true);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy thương hiệu có ID: ${id}`
            });
        }

        await Brand.restore(id);

        res.status(200).json({
            success: true,
            message: 'Khôi phục thương hiệu thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi khôi phục thương hiệu',
            error: error.message
        });
    }
};

// 7. Xóa vĩnh viễn thương hiệu khỏi database
exports.hardDeleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await Brand.getById(id, true);
        if (!brand) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy thương hiệu có ID: ${id}`
            });
        }

        await Brand.hardDelete(id);

        res.status(200).json({
            success: true,
            message: 'Đã xóa vĩnh viễn thương hiệu khỏi hệ thống'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vĩnh viễn thương hiệu',
            error: error.message
        });
    }
};