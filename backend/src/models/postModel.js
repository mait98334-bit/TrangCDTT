const db = require('../config/db');

const Post = {
    // Lấy tất cả bài viết
    getAll: async (includeDeleted = false) => {
        const query = includeDeleted 
            ? 'SELECT * FROM posts ORDER BY id ASC'
            : 'SELECT * FROM posts WHERE is_deleted = 0 OR is_deleted IS NULL ORDER BY id ASC';
        const [rows] = await db.query(query);
        return rows;
    },

    // Lấy bài viết theo ID
    getById: async (id, includeDeleted = false) => {
        const query = includeDeleted
            ? 'SELECT * FROM posts WHERE id = ?'
            : 'SELECT * FROM posts WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Thêm bài viết mới
    create: async (data) => {
        const { title, slug, image, content } = data;
        const [result] = await db.query(
            'INSERT INTO posts (title, slug, image, content, is_deleted) VALUES (?, ?, ?, ?, 0)',
            [title, slug || title.toLowerCase(), image, content]
        );
        return result;
    },

    // Cập nhật bài viết
    update: async (id, data) => {
        const { title, slug, image, content } = data;
        const [result] = await db.query(
            'UPDATE posts SET title = ?, slug = ?, image = ?, content = ? WHERE id = ?',
            [title, slug || title.toLowerCase(), image, content, id]
        );
        return result;
    },

    // Xóa mềm bài viết (đưa vào thùng rác)
    delete: async (id) => {
        const [result] = await db.query('UPDATE posts SET is_deleted = 1 WHERE id = ?', [id]);
        return result;
    },

    // Khôi phục bài viết đã xóa mềm
    restore: async (id) => {
        const [result] = await db.query('UPDATE posts SET is_deleted = 0 WHERE id = ?', [id]);
        return result;
    },

    // Xóa vĩnh viễn bài viết khỏi database
    hardDelete: async (id) => {
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Post;