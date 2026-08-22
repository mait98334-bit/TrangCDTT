'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/authService';

export default function LoginPage() {
    const [formMode, setFormMode] = useState('login'); // 'login', 'register', 'forgot', 'reset'
    const [formData, setFormData] = useState({ name: '', email: '', password: '', code: '', newPassword: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formMode === 'login') {
            // Xử lý Đăng nhập
            const res = await AuthService.login(formData.email, formData.password);

            if (res.success) {
                localStorage.setItem('user', JSON.stringify(res.data));
                window.dispatchEvent(new Event('cartUpdate'));

                if (res.data.role === 'admin' || res.data.email.includes('admin')) {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
            } else {
                setError(res.message || 'Đăng nhập thất bại');
            }
        } else if (formMode === 'register') {
            // Xử lý Đăng ký
            const res = await AuthService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            if (res.success) {
                window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Đăng ký thành công! Vui lòng đăng nhập.', type: 'success' } }));
                setFormMode('login');
            } else {
                setError(res.message || 'Đăng ký thất bại');
            }
        } else if (formMode === 'forgot') {
            // Xử lý Quên mật khẩu
            const res = await AuthService.forgotPassword(formData.email);

            if (res.success) {
                window.dispatchEvent(new CustomEvent('showToast', { 
                    detail: { message: res.message || 'Mã xác thực đã được tạo!', type: 'success' } 
                }));
                // Auto-fill code if present in response
                if (res.demoCode) {
                    setFormData(prev => ({ ...prev, code: res.demoCode }));
                }
                setFormMode('reset');
            } else {
                setError(res.message || 'Yêu cầu thất bại');
            }
        } else if (formMode === 'reset') {
            // Xử lý Đặt lại mật khẩu
            const res = await AuthService.resetPassword(formData.email, formData.code, formData.newPassword);

            if (res.success) {
                window.dispatchEvent(new CustomEvent('showToast', { 
                    detail: { message: 'Đặt lại mật khẩu thành công! Hãy đăng nhập bằng mật khẩu mới.', type: 'success' } 
                }));
                setFormMode('login');
            } else {
                setError(res.message || 'Đặt lại mật khẩu thất bại');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    {formMode === 'login' && 'Đăng Nhập Hệ Thống'}
                    {formMode === 'register' && 'Đăng Ký Tài Khoản'}
                    {formMode === 'forgot' && 'Quên Mật Khẩu'}
                    {formMode === 'reset' && 'Đặt Lại Mật Khẩu'}
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    {formMode === 'login' && 'Chào mừng bạn quay trở lại với shop thời trang'}
                    {formMode === 'register' && 'Tạo tài khoản mới để trải nghiệm mua sắm'}
                    {formMode === 'forgot' && 'Nhập email đã đăng ký để nhận mã xác thực'}
                    {formMode === 'reset' && 'Nhập mã xác thực và mật khẩu mới của bạn'}
                </p>

                {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-lg text-center font-medium">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {formMode === 'register' && (
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
                    
                    {(formMode === 'login' || formMode === 'register' || formMode === 'forgot' || formMode === 'reset') && (
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
                    )}

                    {formMode === 'login' && (
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
                    )}

                    {formMode === 'login' && (
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={() => setFormMode('forgot')}
                                className="text-xs font-semibold text-indigo-650 hover:underline hover:text-indigo-700 cursor-pointer"
                            >
                                Quên mật khẩu?
                            </button>
                        </div>
                    )}

                    {formMode === 'reset' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã xác thực (OTP)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none tracking-widest text-center font-bold"
                                    placeholder="123456"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="••••••••"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow transition-all cursor-pointer"
                    >
                        {formMode === 'login' && 'Đăng Nhập'}
                        {formMode === 'register' && 'Đăng Ký Ngay'}
                        {formMode === 'forgot' && 'Gửi Yêu Cầu'}
                        {formMode === 'reset' && 'Đặt Lại Mật Khẩu'}
                    </button>
                </form>

                {/* Chuyển đổi qua lại giữa các Form Mode */}
                <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
                    {formMode === 'login' && (
                        <p>
                            Chưa có tài khoản?{' '}
                            <button onClick={() => setFormMode('register')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                                Đăng ký ngay nào bạn
                            </button>
                        </p>
                    )}
                    {formMode === 'register' && (
                        <p>
                            Đã có tài khoản?{' '}
                            <button onClick={() => setFormMode('login')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                                Đăng nhập tại đây
                            </button>
                        </p>
                    )}
                    {(formMode === 'forgot' || formMode === 'reset') && (
                        <p>
                            <button onClick={() => setFormMode('login')} className="text-indigo-600 font-semibold hover:underline cursor-pointer">
                                Quay lại Đăng nhập
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}