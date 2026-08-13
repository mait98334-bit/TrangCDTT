'use client';
import { useState, useEffect } from 'react';
import { PostService } from '@/services/postService';
import { getImageUrl } from '@/services/imageHelper';

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state for reading post
    const [showModal, setShowModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            const res = await PostService.getAll();
            if (res.success) {
                setPosts(res.data);
            }
            setLoading(false);
        };
        loadPosts();
    }, []);

    const handleReadPost = (post) => {
        setSelectedPost(post);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Đang tải tin tức bài viết...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Title Section */}
            <div className="mb-10 border-b border-slate-100 pb-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tin Tức & Xu Hướng</h1>
                <p className="text-slate-500 text-sm mt-1">Cập nhật xu hướng thời trang thể thao mới nhất từ các nhà thiết kế</p>
            </div>

            {/* Grid bài viết */}
            {posts.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-500 font-medium shadow-sm max-w-md mx-auto">
                    <span className="text-4xl block mb-3">📰</span>
                    Chưa có bài viết tin tức nào được cập nhật.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((item) => (
                        <div key={item.id} className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                            <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400&auto=format&fit=crop';
                                    }}
                                />
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase block w-max">Bài Viết</span>
                                    <h3 className="font-extrabold text-slate-800 hover:text-indigo-600 transition-colors text-base line-clamp-2 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                                        {item.content || 'Tìm hiểu các xu hướng và phong cách thời trang thể thao Nike, Adidas nổi bật...'}
                                    </p>
                                </div>
                                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-semibold border-t border-slate-50">
                                    <span>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                                    <button 
                                        onClick={() => handleReadPost(item)}
                                        className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5 cursor-pointer bg-transparent border-none"
                                    >
                                        Đọc tiếp <span>→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Đọc bài viết chi tiết */}
            {showModal && selectedPost && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase block w-max">Xem bài viết</span>
                                <span className="text-xs text-slate-400 font-semibold mt-1 block">Ngày đăng: {new Date(selectedPost.created_at).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                            {/* Title */}
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{selectedPost.title}</h2>

                            {/* Image cover */}
                            <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-slate-100 bg-slate-50 shadow-sm">
                                <img
                                    src={getImageUrl(selectedPost.image)}
                                    alt={selectedPost.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop';
                                    }}
                                />
                            </div>

                            {/* Content body */}
                            <div className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                {selectedPost.content}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                            >
                                Đóng lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
