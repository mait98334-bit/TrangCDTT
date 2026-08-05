const db = require('../config/db');

const Category = {
    // Lấy tất cả danh mục
    getAll: async (includeDeleted = false) => {
        const query = includeDeleted 
            ? 'SELECT * FROM categories ORDER BY id ASC'
            : 'SELECT * FROM categories WHERE is_deleted = 0 OR is_deleted IS NULL ORDER BY id ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    // Lấy danh mục theo ID
    getById: async (id, includeDeleted = false) => {
        const query = includeDeleted
            ? 'SELECT * FROM categories WHERE id = ?'
            : 'SELECT * FROM categories WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Thêm danh mục mới
    create: async (data) => {
        const { name, slug } = data;
        const [result] = await db.query(
            'INSERT INTO categories (name, slug, is_deleted) VALUES (?, ?, 0)',
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

    // Xóa mềm danh mục (đưa vào thùng rác)
    delete: async (id) => {
        const [result] = await db.query('UPDATE categories SET is_deleted = 1 WHERE id = ?', [id]);
        return result;
    },

    // Khôi phục danh mục đã xóa mềm
    restore: async (id) => {
        const [result] = await db.query('UPDATE categories SET is_deleted = 0 WHERE id = ?', [id]);
        return result;
    },

    // Xóa vĩnh viễn danh mục khỏi database
    hardDelete: async (id) => {
        const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Category;