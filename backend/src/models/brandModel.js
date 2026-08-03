const db = require('../config/db');

const Brand = {
    // Lấy tất cả thương hiệu
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM brands ORDER BY id ASC');
        return rows;
    },

    // Lấy thương hiệu theo ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM brands WHERE id = ?', [id]);
        return rows[0];
    },

    // Thêm thương hiệu mới
    create: async (data) => {
        const { name, slug, image } = data;
        const [result] = await db.query(
            'INSERT INTO brands (name, slug, image) VALUES (?, ?, ?)',
            [name, slug || name.toLowerCase(), image]
        );
        return result;
    },

    // Cập nhật thương hiệu
    update: async (id, data) => {
        const { name, slug, image } = data;
        const [result] = await db.query(
            'UPDATE brands SET name = ?, slug = ?, image = ? WHERE id = ?',
            [name, slug || name.toLowerCase(), image, id]
        );
        return result;
    },

    // Xóa thương hiệu theo ID
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM brands WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Brand;