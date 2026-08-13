'use client';
import { useState, useEffect, use } from 'react';
import { OrderService } from '@/services/orderService';
import { getImageUrl } from '@/services/imageHelper';
import Link from 'next/link';

export default function OrderSuccessPage({ searchParams }) {
    // Giải nén searchParams bằng React.use()
    const resolvedSearchParams = use(searchParams);
    const orderId = resolvedSearchParams.orderId;
    const responseCode = resolvedSearchParams.vnp_ResponseCode;
    const isError = resolvedSearchParams.error === 'true' || (responseCode && responseCode !== '00');

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            OrderService.getById(Number(orderId))
                .then(res => {
                    if (res.success) {
                        setOrderData(res.data);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Lỗi lấy thông tin đơn hàng:', err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Đang tải thông tin kết quả đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (!orderId) {
        return (
            <div className="max-w-xl mx-auto px-4 py-16 text-center">
                <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm">
                    <span className="text-5xl block mb-4">⚠️</span>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy mã đơn hàng</h1>
                    <p className="text-slate-500 mb-6">Đường dẫn không hợp lệ hoặc thiếu thông tin định danh đơn hàng.</p>
                    <Link href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all inline-block">
                        Quay Lại Trang Chủ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            {/* Hộp trạng thái chính */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-10 mb-8 text-center space-y-6">
                {isError ? (
                    <>
                        <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-4xl text-rose-600 shadow-inner animate-pulse">
                            ❌
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-rose-650 tracking-tight">Thanh Toán Thất Bại</h1>
                            <p className="text-slate-500 text-sm mt-1">Giao dịch qua VNPAY của bạn không hoàn tất hoặc đã bị hủy bỏ.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mx-auto text-4xl text-emerald-600 shadow-inner animate-bounce">
                            🎉
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                {responseCode ? 'Thanh Toán Thành Công!' : 'Đặt Hàng Thành Công!'}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                {responseCode 
                                    ? `Đơn hàng #${orderId} của bạn đã được thanh toán trực tuyến qua VNPAY.`
                                    : `Cảm ơn bạn đã tin tưởng. Đơn hàng #${orderId} đang được chuyển sang bộ phận đóng gói.`
                                }
                            </p>
                        </div>
                    </>
                )}

                {/* Nút thao tác nhanh */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-slate-50">
                    <Link 
                        href="/" 
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-md shadow-indigo-150 hover:shadow-lg transition-all text-sm"
                    >
                        Tiếp tục mua sắm
                    </Link>
                    {isError && (
                        <Link 
                            href="/cart" 
                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all text-sm"
                        >
                            Quay lại Giỏ hàng thử lại
                        </Link>
                    )}
                </div>
            </div>

            {/* Chi tiết đơn hàng hiển thị nếu có */}
            {orderData && (
                <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                    <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
                        <span>📝</span> Chi tiết hóa đơn #{orderId}
                    </h2>

                    {/* Khách hàng & Địa chỉ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-650 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-slate-400 uppercase">Thông tin người nhận</span>
                            <span className="block font-bold text-slate-800">{orderData.order.fullname}</span>
                            <span className="block">{orderData.order.phone}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="block text-xs font-bold text-slate-400 uppercase">Địa chỉ giao hàng</span>
                            <span className="block leading-relaxed">{orderData.order.address}</span>
                        </div>
                    </div>

                    {/* Danh sách mặt hàng */}
                    <div className="space-y-4">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Danh sách sản phẩm</span>
                        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-white">
                            {orderData.items.map((item, idx) => (
                                <div key={idx} className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                                            <img 
                                                src={getImageUrl(item.image)} 
                                                alt={item.product_name} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-800 text-sm line-clamp-1 leading-snug">{item.product_name}</span>
                                            
                                            {/* Phân loại biến thể */}
                                            {(item.color || item.size) && (
                                                <span className="inline-block text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg mt-0.5 font-bold">
                                                    Phân loại: {[item.color, item.size].filter(Boolean).join(' - ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right text-sm">
                                        <span className="block text-xs text-slate-400 font-semibold">{item.quantity} x {Number(item.price).toLocaleString('vi-VN')}₫</span>
                                        <span className="block font-extrabold text-slate-800">{(Number(item.price) * item.quantity).toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tổng hóa đơn */}
                    <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-500">Tổng thanh toán:</span>
                        <span className="text-2xl font-black text-indigo-600">
                            {Number(orderData.order.total_price).toLocaleString('vi-VN')}₫
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
