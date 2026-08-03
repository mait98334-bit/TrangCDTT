'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/apiService';

export default function AdminReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadReviews = async () => {
        setLoading(true);
        const res = await fetchApi('/reviews');
        if (res.success) {
            setReviews(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadReviews();
    }, []);

    // Xử lý Xóa nhận xét/đánh giá
    const handleDeleteReview = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa nhận xét đánh giá này?')) return;

        const res = await fetchApi(`/reviews/${id}`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Xóa nhận xét thành công!');
            loadReviews();
        } else {
            alert(res.message || 'Xóa nhận xét thất bại!');
        }
    };

    // Hiển thị số sao đánh giá
    const renderStars = (rating) => {
        const parsedRating = Math.min(5, Math.max(1, Number(rating) || 5));
        return (
            <div className="flex justify-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }, (_, idx) => (
                    <span key={idx} className="text-sm">
                        {idx < parsedRating ? '★' : '☆'}
                    </span>
                ))}
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách đánh giá...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Đánh giá</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách nhận xét, chấm điểm sản phẩm từ khách hàng</p>
                </div>
            </div>

            {/* Bảng danh sách nhận xét */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100 font-bold">
                            <th className="p-4 font-bold text-slate-800">ID</th>
                            <th className="p-4 font-bold text-slate-800">Khách hàng</th>
                            <th className="p-4 font-bold text-slate-800">Sản phẩm đánh giá</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Số sao</th>
                            <th className="p-4 font-bold text-slate-800">Nội dung bình luận</th>
                            <th className="p-4 font-bold text-slate-800">Ngày đánh giá</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {reviews.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-gray-500">Chưa có đánh giá nào của khách hàng.</td>
                            </tr>
                        ) : (
                            reviews.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-medium">#{item.id}</td>
                                    <td className="p-4 font-bold text-gray-800">{item.user_name}</td>
                                    <td className="p-4 text-indigo-600 font-semibold max-w-[200px] truncate">{item.product_name}</td>
                                    <td className="p-4 text-center">{renderStars(item.rating)}</td>
                                    <td className="p-4 text-gray-600 max-w-[300px] truncate italic">"{item.comment || 'Không có bình luận'}"</td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => handleDeleteReview(item.id)}
                                            className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
