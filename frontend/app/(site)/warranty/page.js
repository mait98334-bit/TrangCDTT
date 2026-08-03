'use client';
import Link from 'next/link';

export default function WarrantyPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        Trang Tin Cậy & Hỗ Trợ 🛡️
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Chính Sách Bảo Hành & Đổi Trả</h1>
                    <p className="text-slate-500 text-sm max-w-xl mx-auto">
                        Trang Store cam kết cung cấp các sản phẩm thời trang thể thao chính hãng Nike, Adidas, Puma chất lượng cao nhất đi kèm dịch vụ hỗ trợ chu đáo.
                    </p>
                </div>

                {/* Core Policies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Time limit */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">
                            ⏱️
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg">1. Thời Hạn Đổi Trả</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Khách hàng được quyền đổi size hoặc đổi sang mẫu sản phẩm mới trong vòng <strong>7 ngày</strong> kể từ thời điểm nhận được hàng đối với đơn đặt hàng trực tuyến hoặc mua tại cửa hàng.
                        </p>
                    </div>

                    {/* Conditions */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">
                            🏷️
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg">2. Điều Kiện Áp Dụng</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Sản phẩm phải còn nguyên nhãn mác, tem niêm phong, chưa qua sử dụng, giặt ủi, không bị vấy bẩn, ám mùi nước hoa hoặc có vết trầy xước từ tác nhân bên ngoài.
                        </p>
                    </div>

                    {/* Warranty Scope */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl">
                            🔩
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg">3. Phạm Vi Bảo Hành</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Hỗ trợ sửa chữa miễn phí các lỗi kỹ thuật từ phía nhà sản xuất như: bung keo đế giày, tuột chỉ may áo khoác, hư hỏng khóa kéo hoặc phai màu logo bất thường trong vòng <strong>30 ngày</strong>.
                        </p>
                    </div>

                    {/* Exclusions */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl">
                            ❌
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-lg">4. Trường Hợp Từ Chối</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Không hỗ trợ bảo hành lỗi phát sinh do người dùng bảo quản sai cách (phơi nắng trực tiếp, sử dụng chất tẩy rửa mạnh, để ẩm mốc) hoặc sản phẩm đã quá hạn thời gian bảo hành quy định.
                        </p>
                    </div>
                </div>

                {/* Procedure Accordion / Steps */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black text-slate-900 text-xl border-b border-slate-100 pb-4">Quy Trình Đổi Trả & Bảo Hành Nhanh Chóng</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">1</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Liên hệ thông báo</h4>
                                <p className="text-slate-500 text-xs mt-1">Gửi thông tin mô tả kèm hình ảnh/video sản phẩm lỗi thông qua trang liên hệ hoặc gọi điện hotline.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">2</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Gửi sản phẩm về shop</h4>
                                <p className="text-slate-500 text-xs mt-1">Đóng gói hàng cẩn thận và gửi về địa chỉ shop ghi dưới chân trang. Khách hàng vui lòng giữ lại vận đơn của bưu điện.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center">3</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Xử lý & Phản hồi</h4>
                                <p className="text-slate-500 text-xs mt-1">Shop tiếp nhận kiểm định tình trạng sản phẩm và tiến hành đổi mới hoặc sửa chữa gửi lại bạn trong vòng 3-5 ngày làm việc.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-center text-white space-y-4 shadow-xl">
                    <h3 className="text-xl font-bold">Bạn Cần Hỗ Trợ Trực Tiếp?</h3>
                    <p className="text-indigo-200 text-sm max-w-md mx-auto">
                        Đừng ngần ngại liên hệ ngay với bộ phận chăm sóc khách hàng của Trang Store để được xử lý thắc mắc nhanh nhất có thể.
                    </p>
                    <div className="pt-2">
                        <Link href="/contact" className="inline-block bg-white text-indigo-950 font-bold px-6 py-3 rounded-2xl hover:bg-slate-100 transition-colors shadow-md text-sm">
                            Gửi Yêu Cầu Liên Hệ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
