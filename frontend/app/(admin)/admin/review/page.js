'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/apiService';

export default function AdminReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' hoặc 'trash'
    const [currentPage, setCurrentPage] = useState(1);

    const loadReviews = async () => {
        setLoading(true);
        const res = await fetchApi('/reviews?admin=true');
        if (res.success) {
            setReviews(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadReviews();
    }, []);

    // Xóa mềm nhận xét/đánh giá
    const handleDeleteReview = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn đưa nhận xét đánh giá này vào thùng rác?')) return;

        const res = await fetchApi(`/reviews/${id}`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Đã chuyển nhận xét vào Thùng rác!');
            loadReviews();
        } else {
            alert(res.message || 'Xóa nhận xét thất bại!');
        }
    };

    // Khôi phục nhận xét đã xóa mềm
    const handleRestoreReview = async (id) => {
        const res = await fetchApi(`/reviews/${id}/restore`, {
            method: 'POST'
        });

        if (res.success) {
            alert('Khôi phục nhận xét thành công!');
            loadReviews();
        } else {
            alert(res.message || 'Khôi phục nhận xét thất bại!');
        }
    };

    // Xóa vĩnh viễn nhận xét khỏi database
    const handleHardDeleteReview = async (id) => {
        if (!confirm('CẢNH BÁO: Bạn có chắc muốn xóa vĩnh viễn nhận xét này? Thao tác này sẽ xóa sạch bản ghi khỏi database và KHÔNG thể hoàn tác!')) return;

        const res = await fetchApi(`/reviews/${id}/hard`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Đã xóa vĩnh viễn nhận xét khỏi hệ thống!');
            loadReviews();
        } else {
            alert(res.message || 'Xóa vĩnh viễn thất bại!');
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

    const filteredReviews = reviews.filter(r => activeTab === 'active' ? !r.is_deleted : r.is_deleted);

    // Phân trang
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Đánh giá</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách nhận xét, chấm điểm sản phẩm từ khách hàng</p>
                </div>
            </div>

            {/* Tab điều hướng */}
            <div className="flex gap-4 border-b border-gray-200 mb-6 text-sm">
                <button
                    onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
                    className={`pb-3 font-semibold px-2 cursor-pointer transition-all border-b-2 ${
                        activeTab === 'active'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    📦 Hoạt động ({reviews.filter(r => !r.is_deleted).length})
                </button>
                <button
                    onClick={() => { setActiveTab('trash'); setCurrentPage(1); }}
                    className={`pb-3 font-semibold px-2 cursor-pointer transition-all border-b-2 ${
                        activeTab === 'trash'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    🗑️ Thùng rác ({reviews.filter(r => r.is_deleted).length})
                </button>
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
                        {currentReviews.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-gray-500">
                                    {activeTab === 'trash' ? 'Thùng rác trống.' : 'Chưa có đánh giá nào của khách hàng.'}
                                </td>
                            </tr>
                        ) : (
                            currentReviews.map((item) => (
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
                                        <div className="flex items-center justify-center gap-1.5">
                                            {activeTab === 'trash' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRestoreReview(item.id)}
                                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Khôi phục
                                                    </button>
                                                    <button
                                                        onClick={() => handleHardDeleteReview(item.id)}
                                                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Xóa vĩnh viễn
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleDeleteReview(item.id)}
                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                >
                                                    Xóa
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Điều khiển phân trang */}
            <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm mt-4 text-sm font-medium">
                <div className="text-gray-500">
                    {filteredReviews.length === 0 ? (
                        <span>Không có đánh giá nào để hiển thị</span>
                    ) : (
                        <span>
                            Hiển thị <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> -{' '}
                            <span className="font-semibold text-gray-800">{Math.min(indexOfLastItem, filteredReviews.length)}</span> trên{' '}
                            <span className="font-semibold text-gray-800">{filteredReviews.length}</span> đánh giá
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || filteredReviews.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang trước
                    </button>
                    {totalPages <= 1 ? (
                        <button
                            disabled
                            className="w-8 h-8 rounded-lg font-bold text-xs bg-indigo-600 text-white flex items-center justify-center"
                        >
                            1
                        </button>
                    ) : (
                        Array.from({ length: totalPages }, (_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
                                    currentPage === idx + 1
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))
                    )}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || filteredReviews.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang sau
                    </button>
                </div>
            </div>
        </div>
    );
}
