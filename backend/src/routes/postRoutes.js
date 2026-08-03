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

// DELETE /api/posts/:id -> Xóa bài viết
router.delete('/:id', postController.deletePost);

module.exports = router;