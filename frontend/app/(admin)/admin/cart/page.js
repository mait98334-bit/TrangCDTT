'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/apiService';
import { getImageUrl } from '@/services/imageHelper';

export default function AdminCartPage() {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedCartDetails, setSelectedCartDetails] = useState({
        cartId: '',
        userName: '',
        items: []
    });
    const [loadingDetails, setLoadingDetails] = useState(false);

    const loadCarts = async () => {
        setLoading(true);
        const res = await fetchApi('/carts');
        if (res.success) {
            setCarts(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCarts();
    }, []);

    // Mở modal xem chi tiết giỏ hàng
    const handleOpenDetails = async (cartObj) => {
        setLoadingDetails(true);
        setSelectedCartDetails({
            cartId: cartObj.cart_id,
            userName: cartObj.user_name,
            items: []
        });
        setShowModal(true);

        const res = await fetchApi(`/carts/details/${cartObj.cart_id}`);
        setLoadingDetails(false);

        if (res.success) {
            setSelectedCartDetails((prev) => ({
                ...prev,
                items: res.data
            }));
        } else {
            alert(res.message || 'Không thể lấy chi tiết giỏ hàng!');
            setShowModal(false);
        }
    };

    // Xóa/Dọn sạch giỏ hàng của người dùng
    const handleClearCart = async (cartId) => {
        if (!confirm('Bạn có chắc chắn muốn dọn sạch giỏ hàng này? Tất cả sản phẩm đang chờ mua của khách hàng này sẽ bị xóa.')) return;

        const res = await fetchApi(`/carts/${cartId}`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Dọn sạch giỏ hàng thành công!');
            loadCarts();
        } else {
            alert(res.message || 'Dọn sạch giỏ hàng thất bại!');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách giỏ hàng...</div>;

    // Phân trang
    const itemsPerPage = 8;
    const totalPages = Math.ceil(carts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCarts = carts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Giỏ hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách khách hàng đang có sản phẩm chờ mua trong giỏ</p>
                </div>
            </div>

            {/* Bảng danh sách giỏ hàng */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100 font-bold">
                            <th className="p-4 font-bold text-slate-800">Mã giỏ</th>
                            <th className="p-4 font-bold text-slate-800">Khách hàng</th>
                            <th className="p-4 font-bold text-slate-800">Email</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Số sản phẩm</th>
                            <th className="p-4 font-bold text-slate-800">Tạm tính (VND)</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {currentCarts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">Chưa có giỏ hàng hoạt động nào trong hệ thống.</td>
                            </tr>
                        ) : (
                            currentCarts.map((item) => (
                                <tr key={item.cart_id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-medium">#{item.cart_id}</td>
                                    <td className="p-4 font-bold text-gray-800">{item.user_name}</td>
                                    <td className="p-4 text-gray-600">{item.user_email}</td>
                                    <td className="p-4 text-center font-bold text-gray-700">{item.total_items} món</td>
                                    <td className="p-4 text-rose-600 font-extrabold">
                                        {Number(item.total_price).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="p-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => handleOpenDetails(item)}
                                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                            >
                                                Chi tiết
                                            </button>
                                            <button
                                                onClick={() => handleClearCart(item.cart_id)}
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

            {/* Điều khiển phân trang */}
            <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm mt-4 text-sm font-medium">
                <div className="text-gray-500">
                    {carts.length === 0 ? (
                        <span>Không có giỏ hàng nào để hiển thị</span>
                    ) : (
                        <span>
                            Hiển thị <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> -{' '}
                            <span className="font-semibold text-gray-800">{Math.min(indexOfLastItem, carts.length)}</span> trên{' '}
                            <span className="font-semibold text-gray-800">{carts.length}</span> giỏ hàng
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || carts.length === 0}
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
                        disabled={currentPage === totalPages || carts.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang sau
                    </button>
                </div>
            </div>

            {/* Modal chi tiết giỏ hàng */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Chi tiết giỏ hàng #{selectedCartDetails.cartId}</h3>
                                <p className="text-xs text-gray-500 font-semibold mt-0.5">Khách hàng: {selectedCartDetails.userName}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {loadingDetails ? (
                                <div className="py-8 text-center text-gray-500 font-medium animate-pulse">Đang tải sản phẩm trong giỏ...</div>
                            ) : (
                                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm max-h-[300px] overflow-y-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100 font-bold">
                                                <th className="p-3 font-bold">Sản phẩm</th>
                                                <th className="p-3 font-bold text-center">Hình ảnh</th>
                                                <th className="p-3 font-bold text-center">Đơn giá</th>
                                                <th className="p-3 font-bold text-center">Số lượng</th>
                                                <th className="p-3 font-bold text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-xs">
                                            {selectedCartDetails.items.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="p-4 text-center text-gray-500 font-medium">Giỏ hàng rỗng.</td>
                                                </tr>
                                            ) : (
                                                selectedCartDetails.items.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="p-3 font-bold text-gray-800 max-w-[200px] truncate">{item.name}</td>
                                                        <td className="p-3 text-center">
                                                            <img
                                                                src={getImageUrl(item.image)}
                                                                alt={item.name}
                                                                className="w-10 h-10 object-cover rounded-lg border border-gray-100 mx-auto"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=200&auto=format&fit=crop';
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="p-3 text-center text-gray-600 font-semibold">{Number(item.price).toLocaleString('vi-VN')} đ</td>
                                                        <td className="p-3 text-center font-bold text-gray-800">{item.quantity}</td>
                                                        <td className="p-3 text-right font-extrabold text-rose-600">
                                                            {Number(item.price * item.quantity).toLocaleString('vi-VN')} đ
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
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
