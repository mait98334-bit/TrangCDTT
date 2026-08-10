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
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            tag: "Nike Collection ⚡",
            title: "Định Hình Phong Cách Nike",
            description: "Khám phá bộ sưu tập quần áo và giày thể thao Nike Air Max, Dri-FIT chính hãng mới nhất. Tối ưu chất liệu cho trải nghiệm đỉnh cao.",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
            buttonText: "Mua Ngay Cực Hot",
            buttonLink: "/product?brand=1",
            bgColor: "from-slate-950 via-indigo-955 to-slate-900"
        },
        {
            id: 2,
            tag: "Adidas Originals ✨",
            title: "Đường Phố Cùng Adidas",
            description: "Khởi nguồn năng lượng tự do cùng dòng sản phẩm Adidas Originals kinh điển. Tối giản, cá tính và vô cùng phong cách cho giới trẻ.",
            image: "https://images.unsplash.com/photo-1518002171953-a080ee81be25?q=80&w=800&auto=format&fit=crop",
            buttonText: "Xem BST Adidas",
            buttonLink: "/product?brand=2",
            bgColor: "from-slate-955 via-emerald-955 to-slate-900"
        },
        {
            id: 3,
            tag: "Puma Motorsport 🏎️",
            title: "Bứt Phá Cùng Puma",
            description: "Sự kết hợp hoàn hảo giữa phong cách đường phố năng động và tinh thần thể thao tốc độ đầy cá tính. Khám phá ngay các mẫu Puma Suede mới nhất.",
            image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
            buttonText: "Khám Phá Puma",
            buttonLink: "/product?brand=3",
            bgColor: "from-slate-955 via-rose-955 to-slate-900"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

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
            {/* 1. Hero Banner Section (Sliding) */}
            <section className="relative overflow-hidden bg-slate-900 rounded-3xl h-[480px] sm:h-[500px] max-w-7xl mx-auto shadow-2xl group">
                {/* Slides wrapper */}
                <div className="relative w-full h-full">
                    {slides.map((slide, idx) => {
                        const isActive = idx === currentSlide;
                        return (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slide.bgColor} transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-20 py-8 md:py-0 ${
                                    isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                                }`}
                            >
                                {/* Left side content */}
                                <div className="max-w-xl text-left space-y-4 md:space-y-6 z-10 mt-8 md:mt-0">
                                    <span className="inline-block bg-white/10 text-indigo-300 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {slide.tag}
                                    </span>
                                    <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg line-clamp-3">
                                        {slide.description}
                                    </p>
                                    <div className="pt-2 flex flex-wrap gap-3">
                                        <Link
                                            href={slide.buttonLink}
                                            className="bg-white hover:bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm cursor-pointer"
                                        >
                                            {slide.buttonText}
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-2xl font-bold transition-all text-xs sm:text-sm backdrop-blur-sm cursor-pointer"
                                        >
                                            Liên Hệ Tư Vấn
                                        </Link>
                                    </div>
                                </div>

                                {/* Right side image */}
                                <div className="relative w-full md:w-1/2 h-[160px] md:h-full flex items-center justify-center overflow-hidden mt-4 md:mt-0">
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-slate-950/40 z-10"></div>
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover rounded-2xl md:rounded-none md:absolute md:inset-y-0 md:right-0 md:w-[90%] md:h-[80%] md:my-auto md:rounded-3xl shadow-2xl transition-transform duration-1000 scale-100 hover:scale-105"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Left Navigation Arrow */}
                <button
                    onClick={handlePrevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg border border-white/10 hover:scale-110"
                >
                    <span className="text-lg font-black">←</span>
                </button>

                {/* Right Navigation Arrow */}
                <button
                    onClick={handleNextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/25 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg border border-white/10 hover:scale-110"
                >
                    <span className="text-lg font-black">→</span>
                </button>

                {/* Slide Indicators / Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setCurrentSlide(idx); }}
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                idx === currentSlide ? 'w-8 bg-indigo-400' : 'w-2 bg-white/40 hover:bg-white/60'
                            }`}
                        ></button>
                    ))}
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
