'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/apiService';

export default function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');

    const loadOrders = async () => {
        setLoading(true);
        const res = await fetchApi('/orders');
        if (res.success) {
            setOrders(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // Mở modal xem chi tiết đơn hàng
    const handleOpenDetails = async (orderId) => {
        const res = await fetchApi(`/orders/${orderId}`);
        if (res.success) {
            setSelectedOrderDetails(res.data);
            setSelectedStatus(res.data.order.status || 'Chờ xử lý');
            setShowModal(true);
        } else {
            alert(res.message || 'Không thể lấy thông tin chi tiết đơn hàng!');
        }
    };

    // Cập nhật trạng thái đơn hàng
    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        if (!selectedOrderDetails) return;

        setUpdatingStatus(true);
        const res = await fetchApi(`/orders/${selectedOrderDetails.order.id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: selectedStatus })
        });
        setUpdatingStatus(false);

        if (res.success) {
            alert('Cập nhật trạng thái đơn hàng thành công!');
            // Load lại danh sách và cập nhật modal hiện tại
            loadOrders();
            const detailRes = await fetchApi(`/orders/${selectedOrderDetails.order.id}`);
            if (detailRes.success) {
                setSelectedOrderDetails(detailRes.data);
            }
        } else {
            alert(res.message || 'Cập nhật trạng thái thất bại!');
        }
    };

    // Xóa đơn hàng
    const handleDeleteOrder = async (orderId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này? Thao tác này sẽ xóa vĩnh viễn đơn hàng và chi tiết sản phẩm.')) return;

        const res = await fetchApi(`/orders/${orderId}`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Xóa đơn hàng thành công!');
            loadOrders();
        } else {
            alert(res.message || 'Xóa đơn hàng thất bại!');
        }
    };

    // Hàm trả về màu sắc của Badge trạng thái
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Đã giao':
            case 'Completed':
            case 'Success':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Đang giao':
            case 'Shipping':
                return 'bg-sky-50 text-sky-700 border-sky-100';
            case 'Đã xác nhận':
            case 'Confirmed':
                return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'Đã hủy':
            case 'Cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-100';
            default:
                return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách đơn hàng...</div>;

    // Phân trang
    const itemsPerPage = 8;
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách hóa đơn đặt hàng thời trang của hệ thống</p>
                </div>
            </div>

            {/* Bảng đơn hàng */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100 font-bold">
                            <th className="p-4 font-bold text-slate-800">Mã ĐH</th>
                            <th className="p-4 font-bold text-slate-800">Khách hàng</th>
                            <th className="p-4 font-bold text-slate-800">Số điện thoại</th>
                            <th className="p-4 font-bold text-slate-800">Tổng tiền</th>
                            <th className="p-4 font-bold text-slate-800">Trạng thái</th>
                            <th className="p-4 font-bold text-slate-800">Ngày đặt</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {currentOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-gray-500">Chưa có đơn hàng nào trong cơ sở dữ liệu.</td>
                            </tr>
                        ) : (
                            currentOrders.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-medium">#{item.id}</td>
                                    <td className="p-4 font-bold text-gray-800">{item.fullname}</td>
                                    <td className="p-4 text-gray-600">{item.phone}</td>
                                    <td className="p-4 text-rose-600 font-extrabold">
                                        {Number(item.total_price).toLocaleString('vi-VN')} đ
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md font-semibold text-xs border ${getStatusBadgeClass(item.status)}`}>
                                            {item.status || 'Chờ xử lý'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(item.created_at).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => handleOpenDetails(item.id)}
                                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                            >
                                                Chi tiết
                                            </button>
                                            <button
                                                onClick={() => handleDeleteOrder(item.id)}
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
                    {orders.length === 0 ? (
                        <span>Không có đơn hàng nào để hiển thị</span>
                    ) : (
                        <span>
                            Hiển thị <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> -{' '}
                            <span className="font-semibold text-gray-800">{Math.min(indexOfLastItem, orders.length)}</span> trên{' '}
                            <span className="font-semibold text-gray-800">{orders.length}</span> đơn hàng
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || orders.length === 0}
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
                        disabled={currentPage === totalPages || orders.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang sau
                    </button>
                </div>
            </div>

            {/* Modal Chi tiết đơn hàng & cập nhật trạng thái */}
            {showModal && selectedOrderDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng #{selectedOrderDetails.order.id}</h3>
                                <p className="text-xs text-gray-500 font-semibold mt-0.5">Đặt ngày: {new Date(selectedOrderDetails.order.created_at).toLocaleString('vi-VN')}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Thông tin khách hàng & Dropdown Trạng thái */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                                <div className="space-y-2.5 text-sm">
                                    <h4 className="text-sm font-bold text-slate-800 border-b border-slate-200/60 pb-1.5">Thông tin giao hàng</h4>
                                    <div><span className="text-gray-500 font-medium">Mã KH (User ID):</span> <span className="font-semibold text-indigo-600">{selectedOrderDetails.order.user_id ? `#${selectedOrderDetails.order.user_id}` : 'Khách vãng lai'}</span></div>
                                    {selectedOrderDetails.order.user_email && (
                                        <div>
                                            <span className="text-gray-500 font-medium">Email tài khoản:</span>{' '}
                                            <span className="font-semibold text-gray-800">{selectedOrderDetails.order.user_email}</span>
                                            <a
                                                href={`mailto:${selectedOrderDetails.order.user_email}?subject=Thông báo đơn hàng #${selectedOrderDetails.order.id} - Trang Store&body=Chào ${selectedOrderDetails.order.fullname}, Trang Store xin thông báo về đơn hàng #${selectedOrderDetails.order.id} của bạn...`}
                                                className="ml-2 inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100 transition-colors"
                                            >
                                                ✉️ Gửi Mail
                                            </a>
                                        </div>
                                    )}
                                    <div><span className="text-gray-500 font-medium">Họ tên nhận hàng:</span> <span className="font-semibold text-gray-800">{selectedOrderDetails.order.fullname}</span></div>
                                    <div>
                                        <span className="text-gray-500 font-medium">Điện thoại liên hệ:</span>{' '}
                                        <span className="font-semibold text-gray-800">{selectedOrderDetails.order.phone}</span>
                                        <a
                                            href={`https://zalo.me/${selectedOrderDetails.order.phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 transition-colors"
                                        >
                                            💬 Chat Zalo
                                        </a>
                                    </div>
                                    <div><span className="text-gray-500 font-medium">Địa chỉ giao:</span> <span className="font-semibold text-gray-800">{selectedOrderDetails.order.address}</span></div>
                                    <div><span className="text-gray-500 font-medium">Tổng tiền:</span> <span className="font-extrabold text-rose-600">{Number(selectedOrderDetails.order.total_price).toLocaleString('vi-VN')} đ</span></div>
                                </div>

                                <form onSubmit={handleUpdateStatus} className="space-y-3.5 text-sm">
                                    <h4 className="text-sm font-bold text-slate-800 border-b border-slate-200/60 pb-1.5">Trạng thái hiện tại: <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusBadgeClass(selectedOrderDetails.order.status)}`}>{selectedOrderDetails.order.status || 'Chờ xử lý'}</span></h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Thay đổi trạng thái</label>
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm bg-white"
                                        >
                                            <option value="Chờ xử lý">Chờ xử lý</option>
                                            <option value="Đã xác nhận">Đã xác nhận</option>
                                            <option value="Đang giao">Đang giao</option>
                                            <option value="Đã giao">Đã giao</option>
                                            <option value="Đã hủy">Đã hủy</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updatingStatus}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl shadow-md transition-colors text-xs cursor-pointer disabled:bg-indigo-400"
                                    >
                                        {updatingStatus ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                                    </button>
                                </form>
                            </div>

                            {/* Danh sách sản phẩm mua */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-slate-800">Sản phẩm đã đặt mua ({selectedOrderDetails.items.length})</h4>
                                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm max-h-[250px] overflow-y-auto">
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
                                            {selectedOrderDetails.items.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="p-4 text-center text-gray-500 font-medium">
                                                        Không có sản phẩm nào trong chi tiết đơn hàng này.
                                                    </td>
                                                </tr>
                                            ) : (
                                                selectedOrderDetails.items.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="p-3 font-bold text-gray-800 max-w-[250px] truncate">{item.product_name}</td>
                                                        <td className="p-3 text-center">
                                                            <img
                                                                src={item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=200&auto=format&fit=crop'}
                                                                alt={item.product_name}
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
