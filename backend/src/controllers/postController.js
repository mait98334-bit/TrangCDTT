const Post = require('../models/postModel');

// 1. Lấy danh sách bài viết
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.getAll();
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
        const post = await Post.getById(id);

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

        const post = await Post.getById(id);
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

// 5. Xóa bài viết
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.getById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: `Không tìm thấy bài viết có ID: ${id}`
            });
        }

        await Post.delete(id);

        res.status(200).json({
            success: true,
            message: 'Xóa bài viết thành công'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa bài viết',
            error: error.message
        });
    }
};