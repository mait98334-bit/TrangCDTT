'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/authService';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true); // true: form đăng nhập, false: form đăng ký
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            // Xử lý Đăng nhập
            const res = await AuthService.login(formData.email, formData.password);

            if (res.success) {
                // Lưu thông tin user vào localStorage để quản lý phân quyền
                localStorage.setItem('user', JSON.stringify(res.data));

                // Phân quyền: nếu là admin (ví dụ role === 'admin' hoặc kiểm tra email/id)
                if (res.data.role === 'admin' || res.data.email.includes('admin')) {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(res.message || 'Đăng nhập thất bại');
            }
        } else {
            // Xử lý Đăng ký
            const res = await AuthService.register(formData);

            if (res.success) {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                setIsLogin(true);
            } else {
                setError(res.message || 'Đăng ký thất bại');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    {isLogin ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    {isLogin ? 'Chào mừng bạn quay trở lại với shop thời trang' : 'Tạo tài khoản mới để trải nghiệm mua sắm'}
                </p>

                {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg text-center font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                placeholder="Nguyễn Văn A"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow transition-all"
                    >
                        {isLogin ? 'Đăng Nhập' : 'Đăng Ký Ngay'}
                    </button>
                </form>

                {/* Chuyển đổi qua lại giữa Đăng nhập và Đăng ký */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? (
                        <p>
                            Chưa có tài khoản?{' '}
                            <button onClick={() => setIsLogin(false)} className="text-indigo-600 font-semibold hover:underline">
                                Đăng ký ngay nào bạn
                            </button>
                        </p>
                    ) : (
                        <p>
                            Đã có tài khoản?{' '}
                            <button onClick={() => setIsLogin(true)} className="text-indigo-600 font-semibold hover:underline">
                                Đăng nhập tại đây
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}