const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// GET /api/posts -> Lấy tất cả bài viết
router.get('/', postController.getPosts);

// GET /api/posts/:id -> Lấy bài viết theo ID
router.get('/:id', postController.getPostById);

// POST /api/posts -> Thêm bài viết mới (Admin)
router.post('/', postController.createPost);

// PUT /api/posts/:id -> Cập nhật bài viết
router.put('/:id', postController.updatePost);

// POST /api/posts/:id/restore -> Khôi phục bài viết đã xóa mềm
router.post('/:id/restore', postController.restorePost);

// DELETE /api/posts/:id/hard -> Xóa vĩnh viễn bài viết
router.delete('/:id/hard', postController.hardDeletePost);

// DELETE /api/posts/:id -> Xóa mềm bài viết
router.delete('/:id', postController.deletePost);

module.exports = router;