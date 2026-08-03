'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/apiService';

export default function AdminPostPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' hoặc 'edit'
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        slug: '',
        image: '',
        content: ''
    });

    const loadPosts = async () => {
        setLoading(true);
        const res = await fetchApi('/posts');
        if (res.success) {
            setPosts(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    // Mở modal Thêm
    const handleOpenAdd = () => {
        setModalType('add');
        setFormData({
            id: '',
            title: '',
            slug: '',
            image: '',
            content: ''
        });
        setShowModal(true);
    };

    // Mở modal Sửa
    const handleOpenEdit = (post) => {
        setModalType('edit');
        setFormData({
            id: post.id,
            title: post.title,
            slug: post.slug || '',
            image: post.image || '',
            content: post.content || ''
        });
        setShowModal(true);
    };

    // Tự động tạo slug khi đổi Tiêu đề
    const handleTitleChange = (e) => {
        const titleVal = e.target.value;
        const slugVal = titleVal
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/([^0-9a-z-\s])/g, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        setFormData((prev) => ({
            ...prev,
            title: titleVal,
            slug: slugVal
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý upload ảnh bài viết từ máy tính
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('image', file);

        setUploadingFile(true);
        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formDataObj
            });
            const data = await res.json();
            if (data.success) {
                setFormData((prev) => ({
                    ...prev,
                    image: data.url
                }));
                alert('Tải ảnh bài viết thành công!');
            } else {
                alert(data.message || 'Upload ảnh thất bại!');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi khi upload ảnh bài viết!');
        } finally {
            setUploadingFile(false);
        }
    };

    // Xử lý Thêm / Sửa bài viết
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            alert('Vui lòng nhập tiêu đề và nội dung bài viết!');
            return;
        }

        setSubmitting(true);
        const endpoint = modalType === 'add' ? '/posts' : `/posts/${formData.id}`;
        const method = modalType === 'add' ? 'POST' : 'PUT';

        const res = await fetchApi(endpoint, {
            method,
            body: JSON.stringify({
                title: formData.title,
                slug: formData.slug,
                image: formData.image,
                content: formData.content
            })
        });

        setSubmitting(false);

        if (res.success) {
            alert(modalType === 'add' ? 'Thêm bài viết thành công!' : 'Cập nhật bài viết thành công!');
            setShowModal(false);
            loadPosts();
        } else {
            alert(res.message || 'Thao tác thất bại!');
        }
    };

    // Xử lý Xóa bài viết
    const handleDeletePost = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bài viết này? Thao tác này không thể hoàn tác.')) return;

        const res = await fetchApi(`/posts/${id}`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Xóa bài viết thành công!');
            loadPosts();
        } else {
            alert(res.message || 'Xóa bài viết thất bại!');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách bài viết...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Bài viết</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách tin tức, bài viết xu hướng thời trang của hệ thống</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                    <span>+ Thêm bài viết mới</span>
                </button>
            </div>

            {/* Bảng danh sách bài viết */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100 font-bold">
                            <th className="p-4 font-bold text-slate-800">ID</th>
                            <th className="p-4 font-bold text-slate-800">Ảnh bìa</th>
                            <th className="p-4 font-bold text-slate-800">Tiêu đề bài viết</th>
                            <th className="p-4 font-bold text-slate-800">Đường dẫn (Slug)</th>
                            <th className="p-4 font-bold text-slate-800">Ngày đăng</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">Chưa có bài viết nào trong hệ thống.</td>
                            </tr>
                        ) : (
                            posts.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-medium">#{item.id}</td>
                                    <td className="p-4">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&auto=format&fit=crop'}
                                            alt={item.title}
                                            className="w-16 h-12 object-cover rounded-lg border border-gray-100 shadow-sm"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&auto=format&fit=crop';
                                            }}
                                        />
                                    </td>
                                    <td className="p-4 font-bold text-gray-800 max-w-[300px] truncate">{item.title}</td>
                                    <td className="p-4 text-gray-600 max-w-[200px] truncate">{item.slug}</td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(item)}
                                                className="bg-sky-50 hover:bg-sky-100 text-sky-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeletePost(item.id)}
                                                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Dialog */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {modalType === 'add' ? 'Thêm bài viết mới' : 'Cập nhật bài viết'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tiêu đề bài viết *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        required
                                        placeholder="Ví dụ: Xu hướng thời trang thu đông 2026"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Đường dẫn thân thiện (Slug)</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="xu-huong-thoi-trang-thu-dong-2026"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-gray-50/50"
                                    />
                                </div>
                            </div>

                            {/* Ảnh đại diện / Ảnh bìa */}
                            <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50 space-y-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Ảnh bìa bài viết</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Upload file từ máy */}
                                    <div className="space-y-1.5">
                                        <span className="block text-xs font-semibold text-gray-600">Tải ảnh từ máy tính</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploadingFile}
                                            className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                        />
                                        {uploadingFile && <span className="text-xs text-indigo-600 animate-pulse block">Đang tải ảnh lên...</span>}
                                    </div>

                                    {/* Nhập link URL */}
                                    <div className="space-y-1.5">
                                        <span className="block text-xs font-semibold text-gray-600">Hoặc nhập link URL ảnh</span>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                            className="w-full px-3 py-1.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                                        />
                                    </div>
                                </div>

                                {formData.image && (
                                    <div className="pt-2">
                                        <span className="block text-xs text-gray-400 mb-1.5">Xem trước ảnh bìa:</span>
                                        <img
                                            src={formData.image}
                                            alt="Preview post"
                                            className="w-32 h-20 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&auto=format&fit=crop';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Nội dung bài viết */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nội dung bài viết *</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows="6"
                                    required
                                    placeholder="Viết nội dung bài viết chi tiết tại đây..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 text-sm">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer disabled:bg-indigo-400"
                                >
                                    {submitting ? 'Đang lưu...' : 'Lưu lại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
