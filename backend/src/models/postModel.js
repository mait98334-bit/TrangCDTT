const db = require('../config/db');

const Post = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM posts ORDER BY id ASC');
        return rows;
    },

    // 2. Lấy chi tiết bài viết theo ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
        return rows[0];
    },

    // 3. Thêm bài viết mới (Dành cho Admin)
    create: async (data) => {
        const { title, slug, image, content } = data;
        const [result] = await db.query(
            'INSERT INTO posts (title, slug, image, content) VALUES (?, ?, ?, ?)',
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

    // Xóa bài viết theo ID
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM posts WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Post;