const Post = require('../models/postModel');

// 1. Lấy danh sách bài viết
exports.getPosts = async (req, res) => {
    try {
        const includeDeleted = req.query.admin === 'true';
        const posts = await Post.getAll(includeDeleted);
        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy danh sách bài viết',
            error: error.message
        });
    }
};

// 2. Lấy chi tiết bài viết
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const includeDeleted = req.query.admin === 'true';
        const post = await Post.getById(id, includeDeleted);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy bài viết có ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi lấy chi tiết bài viết',
            error: error.message
        });
    }
};

// 3. Thêm bài viết mới
exports.createPost = async (req, res) => {
    try {
        const { title, slug, image, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Tiêu đề và nội dung bài viết không được để trống'
            });
        }

        const result = await Post.create({ title, slug, image, content });

        res.status(201).json({
            success: true,
            message: 'Thêm bài viết thành công',
            data: { id: result.insertId, title, slug, image, content }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi thêm bài viết',
            error: error.message
        });
    }
};

// 4. Cập nhật bài viết
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, image, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Tiêu đề và nội dung bài viết không được để trống'
            });
        }

        const post = await Post.getById(id, true);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy bài viết có ID: ${id}`
            });
        }

        await Post.update(id, { title, slug, image, content });

        res.status(200).json({
            success: true,
            message: 'Cập nhật bài viết thành công',
            data: { id: Number(id), title, slug, image, content }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật bài viết',
            error: error.message
        });
    }
};

// 5. Xóa mềm bài viết
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.getById(id, true);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy bài viết có ID: ${id}`
            });
        }

        await Post.delete(id);

        res.status(200).json({
            success: true,
            message: 'Xóa bài viết thành công (đã đưa vào Thùng rác)'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa bài viết',
            error: error.message
        });
    }
};

// 6. Khôi phục bài viết đã xóa mềm
exports.restorePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.getById(id, true);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy bài viết có ID: ${id}`
            });
        }

        await Post.restore(id);

        res.status(200).json({
            success: true,
            message: 'Khôi phục bài viết thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi khôi phục bài viết',
            error: error.message
        });
    }
};

// 7. Xóa vĩnh viễn bài viết khỏi database
exports.hardDeletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.getById(id, true);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy bài viết có ID: ${id}`
            });
        }

        await Post.hardDelete(id);

        res.status(200).json({
            success: true,
            message: 'Đã xóa vĩnh viễn bài viết khỏi hệ thống'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa vĩnh viễn bài viết',
            error: error.message
        });
    }
};