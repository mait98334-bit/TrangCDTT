'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/app/globals.css';
import { CategoryService } from '@/services/categoryService';
import { BrandService } from '@/services/brandService';
import { CartService } from '@/services/cartService';

export default function SiteLayout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        let currentUser = null;
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                currentUser = JSON.parse(storedUser);
                setUser(currentUser);
            } catch (e) {
                console.error('Lỗi parse user:', e);
            }
        }

        // Fetch categories, brands, and cart count
        const loadNavData = async () => {
            const promises = [
                CategoryService.getAll(),
                BrandService.getAll()
            ];
            if (currentUser) {
                promises.push(CartService.getByUserId(currentUser.id));
            }
            const [catRes, brandRes, cartRes] = await Promise.all(promises);
            if (catRes.success) setCategories(catRes.data);
            if (brandRes.success) setBrands(brandRes.data);
            if (cartRes && cartRes.success) {
                const totalQty = cartRes.data.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartCount(totalQty);
            }
        };

        loadNavData();

        // Listen for client cart update event
        const updateCartBadge = async () => {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const parsed = JSON.parse(userStr);
                    setUser(parsed);
                    const cartRes = await CartService.getByUserId(parsed.id);
                    if (cartRes.success) {
                        const totalQty = cartRes.data.items.reduce((sum, item) => sum + item.quantity, 0);
                        setCartCount(totalQty);
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                setUser(null);
                setCartCount(0);
            }
        };

        const showCartToast = (e) => {
            const message = e.detail?.message || 'Đã thêm sản phẩm vào giỏ hàng! 🛒';
            const type = e.detail?.type || 'success';
            setToast({ show: true, message, type });
            setTimeout(() => {
                setToast(prev => ({ ...prev, show: false }));
            }, 2500);
        };

        window.addEventListener('cartUpdate', updateCartBadge);
        window.addEventListener('cartToast', showCartToast);
        window.addEventListener('showToast', showCartToast);
        return () => {
            window.removeEventListener('cartUpdate', updateCartBadge);
            window.removeEventListener('cartToast', showCartToast);
            window.removeEventListener('showToast', showCartToast);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5 group">
                                <span className="bg-indigo-600 text-white w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-bold shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">T</span>
                                <span className="hover:text-indigo-600 transition-colors">TRANG STORE</span>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex space-x-8 text-sm font-semibold h-full items-center">
                            <Link href="/" className="text-slate-600 hover:text-indigo-600 transition-colors py-4">Trang Chủ</Link>
                            
                            {/* Mega Menu Dropdown */}
                            <div className="relative group h-full flex items-center py-4">
                                <Link href="/product" className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-0.5">
                                    Sản Phẩm <span className="text-[10px] group-hover:rotate-180 transition-transform duration-200">▼</span>
                                </Link>
                                
                                {/* Mega Dropdown Menu Panel */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white border border-slate-100 shadow-2xl rounded-3xl p-6 hidden group-hover:grid hover:grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                    {/* Column 1: Special Promotions & Collections */}
                                    <div className="space-y-3">
                                        <span className="block text-[10px] font-black text-indigo-600 tracking-wider uppercase">BỘ SƯU TẬP ĐẶC BIỆT</span>
                                        <div className="space-y-1.5 border-t border-slate-50 pt-2">
                                            <Link 
                                                href="/product?filter=sale"
                                                className="block text-[13px] font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50/80 px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between"
                                            >
                                                <span>Sản phẩm khuyến mãi</span>
                                                <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-black uppercase tracking-tight">SALE</span>
                                            </Link>
                                            <Link 
                                                href="/product?filter=hot"
                                                className="block text-[13px] font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50/80 px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between"
                                            >
                                                <span>Sản phẩm bán chạy</span>
                                                <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-black uppercase tracking-tight">HOT</span>
                                            </Link>
                                            <Link 
                                                href="/product?filter=new"
                                                className="block text-[13px] font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50/80 px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between"
                                            >
                                                <span>Hàng mới về</span>
                                                <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-black uppercase tracking-tight">NEW</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Column 2: Categories */}
                                    <div className="space-y-3">
                                        <span className="block text-[10px] font-black text-indigo-600 tracking-wider uppercase">PHÂN LOẠI DANH MỤC</span>
                                        <div className="space-y-1.5 border-t border-slate-50 pt-2">
                                            {categories.length === 0 ? (
                                                <span className="text-[13px] text-slate-400 block font-normal italic">Đang cập nhật...</span>
                                            ) : (
                                                categories.map((cat) => (
                                                    <Link 
                                                        key={cat.id} 
                                                        href={`/product?category=${cat.id}`}
                                                        className="block text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50/80 px-2 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Column 3: Brands */}
                                    <div className="space-y-3">
                                        <span className="block text-[10px] font-black text-indigo-600 tracking-wider uppercase">THƯƠNG HIỆU NỔI BẬT</span>
                                        <div className="space-y-1.5 border-t border-slate-50 pt-2">
                                            {brands.length === 0 ? (
                                                <span className="text-[13px] text-slate-400 block font-normal italic">Đang cập nhật...</span>
                                            ) : (
                                                brands.map((brand) => (
                                                    <Link 
                                                        key={brand.id} 
                                                        href={`/product?brand=${brand.id}`}
                                                        className="block text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50/80 px-2 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        {brand.name}
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Footer block in Mega Menu */}
                                    <div className="col-span-3 border-t border-slate-100 pt-3 flex justify-between items-center text-[13px]">
                                        <span className="text-slate-400 font-medium">Tìm sản phẩm phù hợp nhanh chóng</span>
                                        <Link href="/product" className="text-indigo-600 hover:text-indigo-700 font-extrabold flex items-center gap-0.5">
                                            Xem tất cả sản phẩm <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <Link href="/post" className="text-slate-600 hover:text-indigo-600 transition-colors py-4">Tin Tức</Link>
                            <Link href="/contact" className="text-slate-600 hover:text-indigo-600 transition-colors py-4">Liên Hệ</Link>
                        </nav>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {/* Shopping Cart Icon with Badge */}
                            <Link 
                                href="/cart" 
                                className="relative p-2.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                            >
                                <span className="text-xl">🛒</span>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Admin Shortcut link (Chỉ hiển thị cho admin) */}
                            {user && (user.role === 'admin' || user.email?.includes('admin')) && (
                                <Link href="/admin" className="hidden sm:inline-flex items-center text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition-all cursor-pointer">
                                    ⚙️ Admin Panel
                                </Link>
                            )}

                            {/* Login / Logout Button */}
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <span className="hidden lg:inline text-xs font-bold text-slate-500">Xin chào, <span className="text-indigo-600">{user.name}</span></span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border border-slate-200/50"
                                    >
                                        Đăng Xuất
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer">
                                    Đăng Nhập
                                </Link>
                            )}

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                            >
                                <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
                        <Link
                            href="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                        >
                            Trang Chủ
                        </Link>
                        <Link
                            href="/product"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                        >
                            Sản Phẩm
                        </Link>
                        <Link
                            href="/post"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                        >
                            Tin Tức
                        </Link>
                        <Link
                            href="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                        >
                            Liên Hệ
                        </Link>
                        {user && (user.role === 'admin' || user.email?.includes('admin')) && (
                            <Link
                                href="/admin"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 transition-all"
                            >
                                ⚙️ Admin Panel
                            </Link>
                        )}
                        {user ? (
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full text-left block px-3 py-2 rounded-xl text-base font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            >
                                Đăng Xuất ({user.name})
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="block px-3 py-2 rounded-xl text-base font-medium text-indigo-600 hover:bg-indigo-50 transition-all font-bold"
                            >
                                Đăng Nhập
                            </Link>
                        )}
                    </div>
                )}
            </header>

            {/* Main Content Area */}
            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <span className="text-xl font-black text-white flex items-center gap-1.5">
                                <span className="bg-indigo-600 text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold">T</span>
                                TRANG STORE
                            </span>
                            <p className="text-sm leading-relaxed text-slate-400">
                                Cửa hàng thời trang chính hãng, xu hướng thời trang Nike, Adidas chính hãng chất lượng cao tại Việt Nam.
                            </p>
                        </div>

                        {/* Quick links */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Danh mục chính</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/product" className="hover:text-indigo-400 transition-colors">Thời Trang Thể Thao</Link></li>
                                <li><Link href="/product" className="hover:text-indigo-400 transition-colors">Giày Dép Nike</Link></li>
                                <li><Link href="/product" className="hover:text-indigo-400 transition-colors">Mũ Nón Phụ Kiện</Link></li>
                            </ul>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Hỗ trợ khách hàng</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Liên hệ góp ý</Link></li>
                                <li><Link href="/warranty" className="hover:text-indigo-400 transition-colors">Chính sách bảo hành</Link></li>
                                <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Điều khoản dịch vụ</Link></li>
                            </ul>
                        </div>

                        {/* Contact details */}
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Liên hệ với chúng tôi</h4>
                            <p className="text-sm text-slate-400">📍 127 Hồ Chí Minh, Việt Nam</p>
                            <p className="text-sm text-slate-400 mt-2">📞 Hotline: 0912 345 678</p>
                            <p className="text-sm text-slate-400 mt-2">✉️ Email: contact@trangstore.com</p>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
                        <p>© {new Date().getFullYear()} TRANG STORE. Tất cả bản quyền được bảo lưu.</p>
                        <p className="mt-1">Thiết kế bởi Mai Thị Trang - 2123110340</p>
                    </div>
                </div>
            </footer>

            {/* Custom Global Toast Notification */}
            {toast.show && (
                <div className={`fixed bottom-5 right-5 z-[9999] px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold transition-all transform animate-in slide-in-from-bottom-5 duration-300 flex items-center gap-2 ${
                    toast.type === 'error' 
                        ? 'bg-rose-50 border-rose-150 text-rose-800' 
                        : toast.type === 'warning'
                        ? 'bg-amber-50 border-amber-150 text-amber-800'
                        : 'bg-emerald-50 border-emerald-150 text-emerald-800'
                }`}>
                    <span>{toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : '✅'}</span>
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}