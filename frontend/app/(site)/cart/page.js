'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartService } from '@/services/cartService';
import { OrderService } from '@/services/orderService';
import { ProductService } from '@/services/productService';
import { getImageUrl } from '@/services/imageHelper';

export default function CartPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [productVariantsMap, setProductVariantsMap] = useState({});

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    // Helper show toast
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // Form Checkout State
    const [shippingInfo, setShippingInfo] = useState({
        fullname: '',
        phone: '',
        address: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' hoặc 'qr'
    const [submittingOrder, setSubmittingOrder] = useState(false);

    // Modal QR Code State
    const [showQrModal, setShowQrModal] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [currentTotal, setCurrentTotal] = useState(0);

    // Kiểm tra đăng nhập và lấy giỏ hàng
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setLoading(false);
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setShippingInfo({
                fullname: parsedUser.name || '',
                phone: parsedUser.phone || '',
                address: parsedUser.address || ''
            });
            loadCart(parsedUser.id);
        } catch (e) {
            console.error('Lỗi load user:', e);
            setLoading(false);
        }
    }, []);

    // Tải biến thể của tất cả các sản phẩm có trong giỏ hàng
    const loadAllProductVariants = async (items) => {
        const uniqueProductIds = [...new Set(items.map(i => i.product_id))];
        const map = {};

        await Promise.all(uniqueProductIds.map(async (pId) => {
            const res = await ProductService.getExtraImages(pId);
            if (res.success && res.data.variants) {
                map[pId] = res.data.variants;
            }
        }));

        setProductVariantsMap(map);
    };

    // Tải dữ liệu giỏ hàng
    const loadCart = async (userId) => {
        setLoading(true);
        const res = await CartService.getByUserId(userId);
        if (res.success) {
            setCartId(res.data.cartId);
            const items = res.data.items || [];
            setCartItems(items);
            await loadAllProductVariants(items);
        }
        setLoading(false);
    };

    // Tăng/Giảm số lượng sản phẩm trong giỏ
    const handleQuantityChange = async (itemId, newQty) => {
        if (newQty <= 0) return;
        
        // Cập nhật tạm thời trên UI cho mượt mà
        setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));

        const res = await CartService.update(itemId, newQty);
        if (res.success) {
            window.dispatchEvent(new Event('cartUpdate'));
        } else {
            showToast('Cập nhật số lượng thất bại!', 'error');
            if (user) loadCart(user.id);
        }
    };

    // Thay đổi phân loại (Màu/Size) sản phẩm trực tiếp trong giỏ hàng
    const handleVariantChange = async (itemId, newVariantId) => {
        const vId = newVariantId ? Number(newVariantId) : null;
        
        // Cập nhật tạm thời trên UI
        setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, variant_id: vId } : item));

        const res = await CartService.update(itemId, undefined, vId);
        if (res.success) {
            showToast('Đã đổi phân loại sản phẩm!', 'success');
            // Load lại giỏ hàng để cập nhật ảnh sản phẩm và giá bán mới của biến thể đó
            if (user) loadCart(user.id);
            window.dispatchEvent(new Event('cartUpdate'));
        } else {
            showToast('Cập nhật phân loại thất bại!', 'error');
            if (user) loadCart(user.id);
        }
    };

    // Xóa sản phẩm khỏi giỏ hàng (Không cần confirm phiền phức)
    const handleRemoveItem = async (itemId) => {
        const res = await CartService.removeItem(itemId);
        if (res.success) {
            setCartItems(prev => prev.filter(item => item.id !== itemId));
            window.dispatchEvent(new Event('cartUpdate'));
            showToast('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
        } else {
            showToast('Xóa sản phẩm thất bại!', 'error');
        }
    };

    // Tính toán số tiền trong giỏ
    const calculateTotals = () => {
        let subtotal = 0;
        let discount = 0;

        cartItems.forEach(item => {
            const price = Number(item.price);
            const priceSale = item.price_sale ? Number(item.price_sale) : null;
            const finalPrice = priceSale !== null && priceSale < price ? priceSale : price;
            
            subtotal += price * item.quantity;
            if (priceSale !== null && priceSale < price) {
                discount += (price - priceSale) * item.quantity;
            }
        });

        const total = subtotal - discount;

        return { subtotal, discount, total };
    };

    const { subtotal, discount, total } = calculateTotals();

    // Xử lý gửi đặt hàng
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast('Vui lòng đăng nhập để tiến hành đặt hàng!', 'error');
            router.push('/login');
            return;
        }

        if (cartItems.length === 0) {
            showToast('Giỏ hàng của bạn đang trống!', 'error');
            return;
        }

        if (!shippingInfo.fullname.trim() || !shippingInfo.phone.trim() || !shippingInfo.address.trim()) {
            showToast('Vui lòng điền đầy đủ thông tin giao hàng!', 'error');
            return;
        }

        setSubmittingOrder(true);

        // Lấy danh sách sản phẩm chuẩn theo format order detail
        const orderItems = cartItems.map(item => {
            const price = Number(item.price);
            const priceSale = item.price_sale ? Number(item.price_sale) : null;
            const finalPrice = priceSale !== null && priceSale < price ? priceSale : price;
            return {
                product_id: item.product_id,
                variant_id: item.variant_id || null,
                quantity: item.quantity,
                price: finalPrice
            };
        });

        const orderPayload = {
            user_id: user.id,
            fullname: shippingInfo.fullname,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            total_price: total,
            items: orderItems
        };

        const res = await OrderService.create(orderPayload);
        setSubmittingOrder(false);

        if (res.success) {
            const orderId = res.data.orderId;
            setCurrentOrderId(orderId);
            setCurrentTotal(total);

            if (paymentMethod === 'qr') {
                // Gọi backend tạo link thanh toán VNPAY Sandbox
                try {
                    const payRes = await fetch('http://localhost:5000/api/payment/create_payment_url', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            orderId: orderId,
                            amount: total
                        })
                    });
                    const payData = await payRes.json();
                    if (payData.success && payData.paymentUrl) {
                        // Xóa giỏ hàng trước khi chuyển đi để tránh trùng đơn
                        if (cartId) await CartService.clear(cartId);
                        window.dispatchEvent(new Event('cartUpdate'));
                        // Chuyển hướng sang VNPAY
                        window.location.href = payData.paymentUrl;
                    } else {
                        showToast('Không thể kết nối cổng thanh toán VNPAY!', 'error');
                    }
                } catch (err) {
                    console.error('Lỗi thanh toán VNPAY:', err);
                    showToast('Lỗi kết nối cổng thanh toán!', 'error');
                }
            } else {
                // Thanh toán COD
                showToast('Đặt hàng thành công! Đơn hàng đang được xử lý.', 'success');
                // Xóa giỏ hàng
                if (cartId) await CartService.clear(cartId);
                window.dispatchEvent(new Event('cartUpdate'));
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            }
        } else {
            showToast(res.message || 'Đặt hàng thất bại, vui lòng thử lại sau.', 'error');
        }
    };

    // Xác nhận đã chuyển khoản
    const handleConfirmPayment = async () => {
        if (cartId) {
            await CartService.clear(cartId);
        }
        window.dispatchEvent(new Event('cartUpdate'));
        setShowQrModal(false);
        showToast('Đặt hàng thành công! Đơn hàng đang được kiểm tra thanh toán.', 'success');
        setTimeout(() => {
            router.push('/');
        }, 1500);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Đang tải giỏ hàng của bạn...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm">
                    <span className="text-5xl block mb-4">🛒</span>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Bạn chưa đăng nhập</h1>
                    <p className="text-slate-500 mb-6">Vui lòng đăng nhập để trải nghiệm trọn vẹn dịch vụ của cửa hàng!</p>
                    <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all inline-block">
                        Đăng Nhập Ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8 border-b border-slate-100 pb-4">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Giỏ Hàng Của Bạn</h1>
                <p className="text-slate-500 text-sm mt-1">Kiểm tra lại danh sách các món đồ thể thao và tiến hành đặt mua</p>
            </div>

            {cartItems.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center text-slate-500 shadow-sm max-w-lg mx-auto">
                    <span className="text-5xl block mb-4">🛍️</span>
                    <h2 className="text-xl font-bold text-slate-800 mb-1">Giỏ hàng trống</h2>
                    <p className="text-slate-500 text-sm mb-6">Hãy lướt quanh các danh mục sản phẩm và tìm kiếm món đồ ưa thích nhé.</p>
                    <Link href="/product" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all inline-block">
                        Tiếp Tục Mua Sắm
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Danh sách sản phẩm (Bên trái) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden p-6 space-y-6">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
                                <span>📦</span> Sản phẩm trong giỏ ({cartItems.length})
                            </h2>
                            <div className="divide-y divide-slate-50">
                                {cartItems.map((item) => {
                                    const price = Number(item.price);
                                    const priceSale = item.price_sale ? Number(item.price_sale) : null;
                                    const isSale = priceSale !== null && priceSale < price;
                                    const finalPrice = isSale ? priceSale : price;
                                    const variants = productVariantsMap[item.product_id] || [];

                                    return (
                                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            {/* Ảnh và thông tin */}
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex-shrink-0 relative">
                                                    <img 
                                                        src={getImageUrl(item.image)} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=200&auto=format&fit=crop';
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-slate-800 text-[15px] line-clamp-2 leading-snug">{item.name}</h3>
                                                    
                                                    {/* Sửa Phân loại / Biến thể sản phẩm (Dropdown sửa nhanh trực tiếp trong giỏ) */}
                                                    {variants.length > 0 && (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                                            <span>Phân loại:</span>
                                                            <select
                                                                value={item.variant_id || ''}
                                                                onChange={(e) => handleVariantChange(item.id, e.target.value)}
                                                                className="text-[11px] text-indigo-600 font-black bg-indigo-50/70 hover:bg-indigo-100/70 px-2 py-0.5 rounded-lg border border-indigo-100 focus:outline-none cursor-pointer"
                                                            >
                                                                <option value="">Chọn phân loại</option>
                                                                {variants.map(v => (
                                                                    <option key={v.id} value={v.id}>
                                                                        {v.color || ''} {v.size ? ` - Size ${v.size}` : ''}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {/* Hiển thị giá */}
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <span className="text-indigo-600 font-extrabold text-[15px]">{finalPrice.toLocaleString('vi-VN')}₫</span>
                                                        {isSale && (
                                                            <span className="text-slate-400 text-xs line-through">{price.toLocaleString('vi-VN')}₫</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Số lượng và nút Xóa */}
                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                                                {/* Tăng giảm số lượng */}
                                                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 text-slate-800 text-sm font-bold w-10 text-center select-none bg-white py-1">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Thành tiền & Nút xóa */}
                                                <div className="flex items-center gap-4 text-right">
                                                    <div className="hidden sm:block">
                                                        <span className="block text-xs text-slate-400 font-semibold">Thành tiền</span>
                                                        <span className="font-extrabold text-slate-800 text-[15px]">{(finalPrice * item.quantity).toLocaleString('vi-VN')}₫</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer border border-slate-100"
                                                        title="Xóa sản phẩm"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Hóa đơn & Form Checkout (Bên phải) */}
                    <div className="space-y-6">
                        {/* Summary Block */}
                        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-4">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">Tóm tắt đơn hàng</h2>
                            <div className="space-y-2.5 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span>Tổng tiền gốc</span>
                                    <span className="font-semibold text-slate-800">{subtotal.toLocaleString('vi-VN')}₫</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-rose-600">
                                        <span>Khuyến mãi giảm</span>
                                        <span className="font-semibold">- {discount.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>Phí giao hàng</span>
                                    <span className="font-semibold text-emerald-600">Miễn phí</span>
                                </div>
                                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-slate-800">
                                    <span className="font-bold text-[15px]">Tổng thanh toán</span>
                                    <span className="font-black text-xl text-indigo-600">{total.toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <form onSubmit={handlePlaceOrder} className="bg-white border border-slate-100 rounded-3xl shadow-sm p-6 space-y-5">
                            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-2">Thông tin giao hàng</h2>
                            
                            {/* Fullname */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 uppercase">Họ và tên người nhận</label>
                                <input 
                                    type="text" 
                                    required
                                    value={shippingInfo.fullname}
                                    onChange={(e) => setShippingInfo(prev => ({ ...prev, fullname: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 uppercase">Số điện thoại liên lạc</label>
                                <input 
                                    type="tel" 
                                    required
                                    value={shippingInfo.phone}
                                    onChange={(e) => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                    placeholder="0987654321"
                                />
                            </div>

                            {/* Address */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-500 uppercase">Địa chỉ nhận hàng</label>
                                <textarea 
                                    rows="2"
                                    required
                                    value={shippingInfo.address}
                                    onChange={(e) => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"
                                    placeholder="Số 12, ngõ 34, đường ABC, quận XYZ, Hà Nội"
                                />
                            </div>

                            {/* Payment Method Option */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase">Phương thức thanh toán</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`p-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                            paymentMethod === 'cod' 
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' 
                                                : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="text-xl">💵</span>
                                        <span>Thanh toán COD</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('qr')}
                                        className={`p-3 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                                            paymentMethod === 'qr' 
                                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700' 
                                                : 'border-slate-200 bg-slate-50/20 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <span className="text-xl">📱</span>
                                        <span>QR Code (VietQR)</span>
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submittingOrder}
                                className={`w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-100 hover:shadow-lg transition-all cursor-pointer text-[15px] flex items-center justify-center gap-2 ${
                                    submittingOrder ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                                {submittingOrder ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang đặt hàng...
                                    </>
                                ) : (
                                    <>Đặt hàng ngay ({total.toLocaleString('vi-VN')}₫)</>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal QR Code Thanh Toán VietQR */}
            {showQrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
                        {/* Title */}
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Thanh Toán Chuyển Khoản QR</h3>
                            <p className="text-slate-500 text-xs mt-1">Mở ứng dụng ngân hàng và quét mã để thanh toán đơn hàng</p>
                        </div>

                        {/* QR Image Frame */}
                        <div className="bg-slate-55 mb-4 p-4 rounded-3xl border border-slate-100 inline-block mx-auto max-w-[280px]">
                            <img 
                                src={`https://img.vietqr.io/image/mbbank-0987654321-compact.png?amount=${currentTotal}&addInfo=TrangStore%20DH${currentOrderId}&accountName=NGUYEN%20THI%20THU%20TRANG`} 
                                alt="Mã QR Chuyển khoản VietQR"
                                className="w-full h-auto rounded-2xl shadow-sm object-contain"
                            />
                        </div>

                        {/* Order Description Details */}
                        <div className="bg-slate-50 p-4 rounded-2xl text-left space-y-2 text-xs font-semibold text-slate-600">
                            <div className="flex justify-between">
                                <span>Chủ tài khoản:</span>
                                <span className="font-extrabold text-slate-800">NGUYEN THI THU TRANG</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ngân hàng:</span>
                                <span className="font-extrabold text-slate-800">MB Bank (Ngân hàng Quân Đội)</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Số tài khoản:</span>
                                <span className="font-extrabold text-slate-800">0987654321</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Số tiền chuyển:</span>
                                <span className="font-extrabold text-indigo-600 text-sm">{currentTotal.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Nội dung bắt buộc:</span>
                                <span className="font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">TrangStore DH{currentOrderId}</span>
                            </div>
                        </div>

                        {/* Instruction text */}
                        <p className="text-[11px] text-slate-400 italic">
                            ⚠️ Lưu ý: Vui lòng giữ nguyên nội dung chuyển khoản ở trên để hệ thống tự động nhận diện và hoàn tất đơn hàng nhanh nhất.
                        </p>

                        {/* Confirmation Buttons */}
                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={handleConfirmPayment}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-100 hover:shadow-emerald-200 transition-all cursor-pointer text-sm"
                            >
                                Tôi đã chuyển khoản thành công
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowQrModal(false);
                                    showToast('Đơn hàng đã được lưu trữ thanh toán sau.', 'success');
                                    setTimeout(() => {
                                        router.push('/');
                                    }, 1000);
                                }}
                                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer text-xs"
                            >
                                Đóng và thanh toán sau
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Premium Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-5 right-5 z-[9999] px-4 py-3 rounded-2xl shadow-xl border text-xs font-black transition-all transform translate-y-0 animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2 ${
                    toast.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-150 text-emerald-800' 
                        : 'bg-rose-50 border-rose-150 text-rose-800'
                }`}>
                    <span>{toast.type === 'success' ? '✅' : '❌'}</span>
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}
