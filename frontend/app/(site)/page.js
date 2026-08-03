'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchApi } from '@/services/apiService';

export const dynamic = 'force-dynamic';

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHomeData = async () => {
            setLoading(true);
            const [prodRes, catRes, brandRes, postRes] = await Promise.all([
                fetchApi('/products'),
                fetchApi('/categories'),
                fetchApi('/brands'),
                fetchApi('/posts')
            ]);

            if (prodRes.success) setProducts(prodRes.data); // Lấy toàn bộ sản phẩm để phân loại ở trang chủ
            if (catRes.success) setCategories(catRes.data.slice(0, 6)); // Lấy các danh mục chính
            if (brandRes.success) setBrands(brandRes.data);
            if (postRes.success) setPosts(postRes.data.slice(0, 3)); // Lấy 3 bài viết mới nhất

            setLoading(false);
        };

        loadHomeData();
    }, []);

    // Phân loại các nhóm sản phẩm ở trang chủ
    const saleProducts = products.filter(item => Number(item.is_sale) === 1).slice(0, 4);
    const hotProducts = products.filter(item => Number(item.is_hot) === 1).slice(0, 4);
    const newProducts = products.filter(item => Number(item.is_new) === 1).slice(0, 4);

    const renderProductCard = (item) => (
        <div key={item.id} className="group relative bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            {/* Product Status Labels */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
                {Number(item.is_new) === 1 && (
                    <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">NEW</span>
                )}
                {Number(item.is_hot) === 1 && (
                    <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">HOT</span>
                )}
                {Number(item.is_sale) === 1 && (
                    <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">SALE</span>
                )}
            </div>

            {/* Image container */}
            <Link href={`/product/${item.id}`} className="relative aspect-[4/3] bg-slate-50 overflow-hidden block">
                {item.price_sale && (
                    <span className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg shadow-md">
                        -{Math.round((1 - (item.price_sale / item.price)) * 100)}%
                    </span>
                )}
                <img
                    src={item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=400&auto=format&fit=crop';
                    }}
                />
            </Link>

            {/* Content info */}
            <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{item.brand_name || 'Chính hãng'}</span>
                    <Link href={`/product/${item.id}`} className="font-extrabold text-slate-800 hover:text-indigo-600 transition-colors block text-sm line-clamp-2 h-10 leading-tight">
                        {item.name}
                    </Link>
                </div>

                <div className="pt-4 flex items-baseline justify-between mt-auto w-full">
                    <div className="flex items-baseline gap-2 flex-wrap">
                        {item.price_sale ? (
                            <>
                                <span className="font-extrabold text-rose-600 text-sm sm:text-base whitespace-nowrap">
                                    {Math.round(Number(item.price_sale)).toLocaleString('vi-VN')} đ
                                </span>
                                <span className="text-slate-400 line-through text-[11px] font-bold whitespace-nowrap">
                                    {Math.round(Number(item.price)).toLocaleString('vi-VN')} đ
                                </span>
                            </>
                        ) : (
                            <span className="font-extrabold text-rose-600 text-sm sm:text-base whitespace-nowrap">
                                {Math.round(Number(item.price)).toLocaleString('vi-VN')} đ
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Đang tải trang chủ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16 pb-20">
            {/* 1. Hero Banner Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl py-20 px-6 sm:px-12 max-w-7xl mx-auto shadow-2xl">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-2xl text-left space-y-6">
                    <span className="inline-block bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        BST Thu Đông 2026 🔥
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight">
                        Định Hình <br className="hidden sm:inline"/>
                        <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-rose-400 bg-clip-text text-transparent">Phong Cách</span> Mới
                    </h1>
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                        Khám phá bộ sưu tập quần áo và phụ kiện thể thao Nike, Adidas chính hãng mới nhất. Đa dạng kiểu dáng, tối ưu chất liệu cho trải nghiệm tập luyện tuyệt vời nhất.
                    </p>
                    <div className="pt-4 flex flex-wrap gap-4">
                        <Link
                            href="/product"
                            className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 text-sm"
                        >
                            Mua Ngay Cực Hot
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-2xl font-bold transition-all text-sm backdrop-blur-sm"
                        >
                            Liên Hệ Tư Vấn
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Shop by Category Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Khám Phá Danh Mục</h2>
                    <p className="text-slate-500 text-sm mt-2">Dễ dàng lựa chọn nhóm sản phẩm thời trang bạn yêu thích</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, index) => {
                        const colors = [
                            'from-purple-500 to-indigo-600',
                            'from-pink-500 to-rose-600',
                            'from-blue-500 to-sky-600',
                            'from-teal-500 to-emerald-600',
                            'from-amber-500 to-orange-600',
                            'from-cyan-500 to-blue-600'
                        ];
                        const selectColor = colors[index % colors.length];

                        return (
                            <Link key={cat.id} href={`/product?category=${cat.id}`} className="group block text-center space-y-3">
                                <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${selectColor} flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-100/50 group-hover:scale-110 transition-transform duration-200`}>
                                    {cat.name.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 3. Sản Phẩm Khuyến Mãi */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Sản Phẩm Khuyến Mãi</h2>
                        <p className="text-slate-500 text-sm mt-1">Cơ hội sở hữu trang phục thể thao chính hãng với mức giá hấp dẫn</p>
                    </div>
                    <Link href="/product?filter=sale" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Xem tất cả ưu đãi <span>→</span>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {saleProducts.length === 0 ? (
                        <div className="col-span-4 text-center text-gray-500 py-10 font-medium">Chưa có sản phẩm khuyến mãi nào.</div>
                    ) : (
                        saleProducts.map(renderProductCard)
                    )}
                </div>
            </section>

            {/* 3.2. Sản Phẩm Bán Chạy */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Sản Phẩm Bán Chạy</h2>
                        <p className="text-slate-500 text-sm mt-1">Những mẫu thiết kế thời trang thể thao HOT nhất mùa này</p>
                    </div>
                    <Link href="/product?filter=hot" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Xem sản phẩm HOT <span>→</span>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {hotProducts.length === 0 ? (
                        <div className="col-span-4 text-center text-gray-500 py-10 font-medium">Chưa có sản phẩm bán chạy nào.</div>
                    ) : (
                        hotProducts.map(renderProductCard)
                    )}
                </div>
            </section>

            {/* 3.3. Hàng Mới Về */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Hàng Mới Về</h2>
                        <p className="text-slate-500 text-sm mt-1">Khám phá các sản phẩm thể thao xu hướng mới nhất vừa cập bến</p>
                    </div>
                    <Link href="/product?filter=new" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Xem hàng mới về <span>→</span>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {newProducts.length === 0 ? (
                        <div className="col-span-4 text-center text-gray-500 py-10 font-medium">Chưa có sản phẩm mới nào.</div>
                    ) : (
                        newProducts.map(renderProductCard)
                    )}
                </div>
            </section>

            {/* 4. Latest News Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Bài Viết & Xu Hướng</h2>
                        <p className="text-slate-500 text-sm mt-1">Cập nhật tin tức và các bài viết chia sẻ phong cách thời trang thể thao</p>
                    </div>
                    <Link href="/post" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                        Xem tất cả tin tức <span>→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.length === 0 ? (
                        <div className="col-span-3 text-center text-gray-500 py-10 font-medium">Chưa có bài viết tin tức nào được đăng.</div>
                    ) : (
                        posts.map((item) => (
                            <div key={item.id} className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
                                    <img
                                        src={item.image || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400&auto=format&fit=crop'}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=400&auto=format&fit=crop';
                                        }}
                                    />
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase block w-max">Thời Trang</span>
                                        <h3 className="font-extrabold text-slate-800 hover:text-indigo-600 transition-colors text-base line-clamp-2 leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                                            {item.content || 'Khám phá bài viết hướng dẫn phối đồ và tin tức thời trang thể thao hấp dẫn nhất...'}
                                        </p>
                                    </div>
                                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-semibold border-t border-slate-50">
                                        <span>{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                                        <Link href={`/post`} className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5">
                                            Đọc tiếp <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
