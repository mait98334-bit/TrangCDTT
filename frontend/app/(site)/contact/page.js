'use client';
import { useState, useEffect } from 'react';
import { ContactService } from '@/services/contactService';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Gợi ý thông tin tài khoản đang đăng nhập
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
            alert('Vui lòng nhập đầy đủ Họ tên, Email và Nội dung lời nhắn!');
            return;
        }

        setSubmitting(true);
        const res = await ContactService.create(formData);
        setSubmitting(false);

        if (res.success) {
            alert(res.message || 'Gửi liên hệ thành công! Cửa hàng sẽ phản hồi bạn sớm nhất.');
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
        } else {
            alert(res.message || 'Gửi liên hệ thất bại. Vui lòng thử lại!');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
