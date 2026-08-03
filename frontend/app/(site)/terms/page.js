'use client';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Cam Kết Pháp Lý ⚖️
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Điều Khoản Dịch Vụ</h1>
                    <p className="text-slate-500 text-sm max-w-xl mx-auto">
                        Chào mừng bạn đến với Trang Store. Khi truy cập và mua sắm tại website của chúng tôi, bạn đã đồng ý tuân thủ các điều khoản dịch vụ dưới đây.
                    </p>
                </div>

                {/* Core Terms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* General Rules */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">
                            🤝
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg">1. Thỏa Thuận Sử Dụng</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Trang Store có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản dịch vụ này vào bất cứ lúc nào mà không cần thông báo trước.
                        </p>
                    </div>

                    {/* Ordering and Pricing */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">
                            💳
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg">2. Đặt Hàng & Thanh Toán</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Chúng tôi cam kết cung cấp thông tin giá cả chính xác nhất. Tuy nhiên, nếu có sai sót kỹ thuật, hệ thống sẽ liên hệ để hủy đơn hoặc cập nhật lại giá tiền cho bạn.
                        </p>
                    </div>

                    {/* Intellectual Property */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl">
                            🎨
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg">3. Bản Quyền & Sở Hữu</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Mọi nội dung trên website bao gồm hình ảnh thiết kế, giao diện, logo, văn bản và mã nguồn đều thuộc quyền sở hữu trí tuệ độc quyền của Trang Store.
                        </p>
                    </div>

                    {/* User Conduct */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl">
                            🛡️
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg">4. Trách Nhiệm Thành Viên</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Khách hàng có trách nhiệm bảo mật thông tin tài khoản cá nhân, mật khẩu đăng nhập và không thực hiện các hành vi gây hại đến hệ thống kỹ thuật của website.
                        </p>
                    </div>
                </div>

                {/* Shopping Rules Section */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black text-slate-900 text-xl border-b border-slate-100 pb-4">Hướng Dẫn Mua Hàng An Toàn</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">1</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Chọn sản phẩm & Giỏ hàng</h4>
                                <p className="text-slate-500 text-xs mt-1">Lựa chọn đúng kích cỡ (size) sản phẩm theo bảng size quy chuẩn trước khi nhấn Thêm vào giỏ hàng.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">2</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Điền thông tin giao hàng</h4>
                                <p className="text-slate-500 text-xs mt-1">Cung cấp chính xác số điện thoại và địa chỉ nhận hàng để tránh tình trạng đơn hàng bị giao trễ hoặc thất lạc.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">3</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Xác nhận thanh toán</h4>
                                <p className="text-slate-500 text-xs mt-1">Lựa chọn hình thức COD (thanh toán khi nhận hàng) hoặc chuyển khoản ngân hàng qua cổng bảo mật của cửa hàng.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Banner */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-center text-white space-y-4 shadow-xl">
                    <h3 className="text-xl font-bold">Thắc Mắc Về Các Quy Định?</h3>
                    <p className="text-indigo-200 text-sm max-w-md mx-auto">
                        Hãy gửi ngay câu hỏi cho bộ phận quản trị viên của chúng tôi để được giải đáp cặn kẽ mọi quyền lợi mua sắm của bạn.
                    </p>
                    <div className="pt-2">
                        <Link href="/contact" className="inline-block bg-white text-indigo-950 font-bold px-6 py-3 rounded-2xl hover:bg-slate-100 transition-colors shadow-md text-sm">
                            Gửi Liên Hệ Thắc Mắc
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
