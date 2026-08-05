'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            router.push('/login');
        } else {
            try {
                const user = JSON.parse(storedUser);
                const isAdmin = user.role === 'admin' || (user.email && String(user.email).includes('admin'));
                if (!isAdmin) {
                    alert('Bạn không có quyền truy cập trang quản trị!');
                    router.push('/');
                } else {
                    setAuthorized(true);
                }
            } catch {
                router.push('/login');
            }
        }
    }, [router]);

    const menuItems = [
        { href: '/admin', label: 'Tổng quan (Dashboard)', icon: '📊' },
        { href: '/admin/product', label: 'Sản phẩm (Products)', icon: '📦' },
        { href: '/admin/category', label: 'Danh mục (Categories)', icon: '📑' },
        { href: '/admin/brand', label: 'Thương hiệu (Brands)', icon: '🏷️' },
        { href: '/admin/order', label: 'Đơn hàng (Orders)', icon: '🛍️' },
        { href: '/admin/user', label: 'Tài khoản (Users)', icon: '👤' },
        { href: '/admin/post', label: 'Bài viết (Posts)', icon: '📰' },
        { href: '/admin/review', label: 'Đánh giá (Reviews)', icon: '⭐' },
        { href: '/admin/cart', label: 'Giỏ hàng (Carts)', icon: '🛒' },
        { href: '/admin/contact', label: 'Liên hệ (Contacts)', icon: '💬' },
    ];

    const isActive = (href) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    if (!mounted || !authorized) {
        return <div className="min-h-screen flex items-center justify-center font-medium text-gray-500">Đang kiểm tra quyền truy cập...</div>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar bên trái */}
            <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
                <div className="p-7 border-b border-slate-800">
                    <h2 className="text-2xl font-extrabold tracking-wider text-indigo-400">ADMIN PANEL</h2>
                    <p className="text-sm text-slate-400 mt-1">Quản lý Website Thời Trang</p>
                </div>

                <nav className="flex-1 p-5 space-y-1.5 text-sm overflow-y-auto">
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform ${
                                    active
                                        ? 'bg-indigo-600 text-white shadow-lg font-semibold scale-[1.02]'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span> {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-5 border-t border-slate-800">
                    <Link href="/" className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl text-base font-semibold transition-colors">
                        <span>🌐</span> Về trang chủ Web
                    </Link>
                </div>
            </aside>

            {/* Nội dung bên phải */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm">
                    <span className="text-base font-medium text-gray-500">Hệ thống quản trị đồ án tốt nghiệp</span>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-semibold text-base shadow-sm">
                            AD
                        </div>
                        <span className="text-base font-bold text-gray-800">Admin</span>
                        <button
                            onClick={() => { localStorage.removeItem('user'); router.push('/login'); }}
                            className="ml-4 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}