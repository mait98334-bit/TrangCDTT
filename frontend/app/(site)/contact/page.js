'use client';
import { useState, useEffect, Suspense } from 'react';
import { ContactService } from '@/services/contactService';
import { ProductService } from '@/services/productService';
import { useSearchParams } from 'next/navigation';
import { getImageUrl } from '@/services/imageHelper';

export default function ContactPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Đang tải biểu mẫu liên hệ...</p>
                </div>
            </div>
        }>
            <ContactForm />
        </Suspense>
    );
}

function ContactForm() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const [product, setProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Phát sự kiện hiển thị Toast
    const showToast = (message, type = 'success') => {
        window.dispatchEvent(new CustomEvent('showToast', {
            detail: { message, type }
        }));
    };

    // Load thông tin sản phẩm liên kết nếu có productId
    useEffect(() => {
        if (productId) {
            ProductService.getById(productId).then(res => {
                if (res.success) {
                    setProduct(res.data);
                    // Tự động điền nội dung mẫu
                    setFormData(prev => ({
                        ...prev,
                        message: prev.message || `Tôi muốn nhận tư vấn thêm về sản phẩm: ${res.data.name} (Mã sản phẩm: #${res.data.id}).`
                    }));
                }
            }).catch(err => {
                console.error("Lỗi khi tải thông tin sản phẩm liên hệ:", err);
            });
        }
    }, [productId]);

    // Gợi ý thông tin tài khoản đang đăng nhập từ localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    setFormData(prev => ({
                        ...prev,
                        name: user.name || user.fullname || prev.name,
                        email: user.email || prev.email,
                        phone: user.phone || prev.phone
                    }));
                } catch (e) {
                    console.error('Lỗi phân tích user từ localStorage:', e);
                }
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            showToast('Vui lòng nhập đầy đủ Họ tên, Email và Nội dung lời nhắn!', 'warning');
            return;
        }

        setSubmitting(true);
        const payload = {
            ...formData,
            product_id: productId ? parseInt(productId, 10) : null
        };
        const res = await ContactService.create(payload);
        setSubmitting(false);

        if (res.success) {
            showToast(res.message || 'Gửi liên hệ thành công! Cửa hàng sẽ phản hồi bạn sớm nhất.', 'success');
            
            // Giữ lại thông tin tài khoản, chỉ xóa nội dung lời nhắn
            if (typeof window !== 'undefined') {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const user = JSON.parse(storedUser);
                        setFormData({
                            name: user.name || user.fullname || '',
                            email: user.email || '',
                            phone: user.phone || '',
                            message: ''
                        });
                        setProduct(null); // Clear sản phẩm sau khi gửi thành công
                        return;
                    } catch (e) {}
                }
            }
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: ''
            });
            setProduct(null);
        } else {
            showToast(res.message || 'Gửi liên hệ thất bại. Vui lòng thử lại!', 'error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-6 font-medium">
                <Link href="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                <span className="text-gray-400">›</span>
                <span className="text-gray-800 font-semibold">Liên hệ</span>
            </nav>

            {/* Title Section */}
            <div className="mb-10 border-b border-slate-100 pb-4 text-center max-w-xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Liên Hệ Với Chúng Tôi</h1>
                <p className="text-slate-500 text-sm mt-1">Đóng góp ý kiến hoặc gửi thắc mắc để nhận được sự tư vấn chu đáo nhất</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-stretch">
                {/* Left Side: Contact Information Cards */}
                <div className="space-y-6 flex flex-col justify-between">
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-between space-y-6">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl -z-10"></div>

                        <div>
                            <span className="bg-white/15 text-white border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider block w-max mb-4">THỜI GIAN LÀM VIỆC</span>
                            <h3 className="text-2xl font-black leading-tight">Luôn Sẵn Sàng <br/>Hỗ Trợ Khách Hàng</h3>
                            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed mt-2">
                                Chúng tôi trân trọng mọi phản hồi của bạn để nâng cấp chất lượng sản phẩm dịch vụ tốt nhất.
                            </p>
                        </div>

                        {/* Thẻ hiển thị sản phẩm đang liên kết tư vấn */}
                        {product && (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex gap-4 items-center">
                                <img 
                                    src={getImageUrl(product.image)} 
                                    alt={product.name} 
                                    className="w-16 h-16 object-cover rounded-xl bg-white"
                                />
                                <div className="text-xs">
                                    <p className="font-bold text-white mb-0.5 line-clamp-1">{product.name}</p>
                                    <p className="text-indigo-200 font-medium mb-1">Mã sản phẩm: #{product.id}</p>
                                    <p className="text-rose-300 font-extrabold text-sm">{Number(product.price).toLocaleString('vi-VN')} đ</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 pt-4 border-t border-indigo-500/30 text-xs sm:text-sm font-medium">
                            <p className="flex items-center gap-2">📍 <span className="text-indigo-100">Địa chỉ:</span> 127 Hồ Chí Minh, Việt Nam</p>
                            <p className="flex items-center gap-2">📞 <span className="text-indigo-100">Điện thoại:</span> 0912 345 678</p>
                            <p className="flex items-center gap-2">✉️ <span className="text-indigo-100">Email:</span> contact@trangstore.com</p>
                            <p className="flex items-center gap-2">⏰ <span className="text-indigo-100">Thời gian:</span> 8:00 - 21:00 (Hàng ngày)</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Contact Submit Form */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-between h-full">
                        <div className="space-y-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">GỬI LỜI NHẮN CHO SHOP</span>
                            
                            {product && (
                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between">
                                    <div className="text-xs">
                                        <span className="text-indigo-600 font-bold">📌 Liên kết sản phẩm:</span>
                                        <span className="font-semibold text-slate-700 ml-1.5 line-clamp-1">{product.name}</span>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setProduct(null);
                                            // Reset lời nhắn mẫu
                                            setFormData(prev => ({ ...prev, message: '' }));
                                        }}
                                        className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                                    >
                                        Bỏ liên kết
                                    </button>
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Họ tên của bạn *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="Nguyễn Văn A"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Email and Phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Địa chỉ Email *</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                                        placeholder="a@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                                        placeholder="0912345678"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Nội dung liên hệ *</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                                    placeholder="Nhập ý kiến đóng góp hoặc thắc mắc của bạn..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-xs shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer ${
                                submitting ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {submitting ? 'Đang gửi...' : 'Gửi liên hệ ngay'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
