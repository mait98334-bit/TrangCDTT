const db = require('../config/db');

const Brand = {
    // Lấy tất cả thương hiệu
    getAll: async (includeDeleted = false) => {
        const query = includeDeleted 
            ? 'SELECT * FROM brands ORDER BY id ASC'
            : 'SELECT * FROM brands WHERE is_deleted = 0 OR is_deleted IS NULL ORDER BY id ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    // Lấy thương hiệu theo ID
    getById: async (id, includeDeleted = false) => {
        const query = includeDeleted
            ? 'SELECT * FROM brands WHERE id = ?'
            : 'SELECT * FROM brands WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Thêm thương hiệu mới
    create: async (data) => {
        const { name, slug, image } = data;
        const [result] = await db.query(
            'INSERT INTO brands (name, slug, image, is_deleted) VALUES (?, ?, ?, 0)',
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

    // Xóa mềm thương hiệu (đưa vào thùng rác)
    delete: async (id) => {
        const [result] = await db.query('UPDATE brands SET is_deleted = 1 WHERE id = ?', [id]);
        return result;
    },

    // Khôi phục thương hiệu đã xóa mềm
    restore: async (id) => {
        const [result] = await db.query('UPDATE brands SET is_deleted = 0 WHERE id = ?', [id]);
        return result;
    },

    // Xóa vĩnh viễn thương hiệu khỏi database
    hardDelete: async (id) => {
        const [result] = await db.query('DELETE FROM brands WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Brand;