const db = require('../config/db');

const Category = {
    // Lấy tất cả danh mục
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM categories ORDER BY id ASC');
        return rows;
    },

    // Lấy danh mục theo ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    },

    // Thêm danh mục mới
    create: async (data) => {
        const { name, slug } = data;
        const [result] = await db.query(
            'INSERT INTO categories (name, slug) VALUES (?, ?)',
            [name, slug || name.toLowerCase()]
        );
        return result;
    },

    // Cập nhật danh mục
    update: async (id, data) => {
        const { name, slug } = data;
        const [result] = await db.query(
            'UPDATE categories SET name = ?, slug = ? WHERE id = ?',
            [name, slug || name.toLowerCase(), id]
        );
        return result;
    },

    // Xóa danh mục
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Category;