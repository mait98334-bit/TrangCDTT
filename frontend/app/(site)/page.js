'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductService } from '@/services/productService';
import { CategoryService } from '@/services/categoryService';
import { BrandService } from '@/services/brandService';
import { PostService } from '@/services/postService';
import { getImageUrl } from '@/services/imageHelper';

import { CartService } from '@/services/cartService';

export const dynamic = 'force-dynamic';

const BrandLogo = ({ name, slug }) => {
    const lowerSlug = (slug || name || '').toLowerCase();

    // Nếu dùng hình ảnh logo chuẩn (khuyên dùng để giống thực tế nhất)
    // Bạn có thể thay đường dẫn ảnh logo chuẩn vào đây nếu có sẵn trong thư mục public
    if (lowerSlug.includes('nike')) {
        return (
            <span className="text-base font-black tracking-wider text-slate-950 group-hover:text-indigo-600 transition-colors font-sans uppercase">
                NIKE
            </span>
        );
    }
    if (lowerSlug.includes('adidas')) {
        return (
            <span className="text-base font-black tracking-wider text-slate-950 group-hover:text-indigo-600 transition-colors font-sans uppercase">
                ADIDAS
            </span>
        );
    }
    if (lowerSlug.includes('puma')) {
        return (
            <span className="text-base font-black tracking-widest text-slate-950 group-hover:text-indigo-600 transition-colors font-sans uppercase">
                PUMA
            </span>
        );
    }
    if (lowerSlug.includes('jordan')) {
        return (
            <span className="text-[15px] font-black tracking-[0.15em] text-slate-950 group-hover:text-indigo-600 transition-colors font-sans uppercase">
                JORDAN
            </span>
        );
    }
    if (lowerSlug.includes('balenciaga')) {
        return (
            <span className="text-[10px] font-black tracking-[0.25em] text-slate-950 group-hover:text-indigo-600 transition-colors font-sans uppercase">
                BALENCIAGA
            </span>
        );
    }

    return (
        <span className="text-xs font-black tracking-wider text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">
            {name}
        </span>
    );
};

const ProductSlider = ({ items, renderCard, id }) => {
    const scrollLeft = () => {
        const el = document.getElementById(id);
        if (el) el.scrollBy({ left: -320, behavior: 'smooth' });
    };

    const scrollRight = () => {
        const el = document.getElementById(id);
        if (el) el.scrollBy({ left: 320, behavior: 'smooth' });
    };

    return (
        <div className="relative group/slider">
            <button
                onClick={scrollLeft}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-slate-50 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all opacity-0 group-hover/slider:opacity-100 cursor-pointer hover:scale-110"
            >
                <span className="text-lg font-black">←</span>
            </button>

            <button
                onClick={scrollRight}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-slate-50 text-slate-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-slate-100 transition-all opacity-0 group-hover/slider:opacity-100 cursor-pointer hover:scale-110"
            >
                <span className="text-lg font-black">→</span>
            </button>

            <div
                id={id}
                className="flex gap-6 overflow-x-auto scrollbar-none pb-4 scroll-smooth snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {items.map((item) => (
                    <div key={item.id} className="w-[280px] sm:w-[300px] flex-shrink-0 snap-start">
                        {renderCard(item)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isListeningHome, setIsListeningHome] = useState(false);

    const slides = [
        {
            id: 1,
            tag: "NIKE RUNNING / TRAINING ⚡",
            title: "BỨT PHÁ GIỚI HẠN BẢN THÂN",
            description: "Khám phá các dòng sản phẩm giày chạy bộ Nike Pegasus, Nike Air Max, và dòng quần áo Dri-FIT công nghệ mới nhất giúp nâng tầm hiệu năng vận động.",
            image: "/uploads/slide_1.jpg",
            buttonText: "MUA NGAY (SALE 30%)",
            buttonLink: "/product?brand=1",
            bgColor: "from-slate-955 via-slate-900 to-indigo-950",
            tagBg: "bg-indigo-600 text-white",
            btnBg: "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-650/40 text-white"
        },
        {
            id: 2,
            tag: "ADIDAS PERFORMANCE 🌟",
            title: "BẬT PHONG CÁCH, CHẠY ĐAM MÊ",
            description: "Trải nghiệm các dòng giày chạy bộ Adidas Ultraboost, giày đá bóng Predator, cùng dòng sản phẩm thể thao mang đậm dấu ấn đường phố kinh điển.",
            image: "/uploads/slide_2.jpg",
            buttonText: "KHÁM PHÁ BỘ SƯU TẬP",
            buttonLink: "/product?brand=2",
            bgColor: "from-slate-955 via-slate-900 to-emerald-950",
            tagBg: "bg-emerald-600 text-white",
            btnBg: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-650/40 text-white"
        },
        {
            id: 3,
            tag: "PUMA SPEED / MOTORSPORT 🏎️",
            title: "NHANH HƠN, BỀN BỈ HƠN",
            description: "Sự giao thoa hoàn hảo giữa tốc độ bứt tốc và phong cách đường phố năng động. Khám phá các dòng giày Puma Nitro và bộ sưu tập Motorsport cá tính.",
            image: "/uploads/slide_3.jpg",
            buttonText: "XEM NGAY ƯU ĐÃI",
            buttonLink: "/product?brand=3",
            bgColor: "from-slate-955 via-slate-900 to-rose-950",
            tagBg: "bg-rose-600 text-white",
            btnBg: "bg-rose-600 hover:bg-rose-500 shadow-rose-650/40 text-white"
        },
        {
            id: 4,
            tag: "JORDAN RETRO 🏀",
            title: "HUYỀN THOẠI SÂN ĐẤU JORDAN",
            description: "Định hình phong cách bóng rổ đường phố cùng các thiết kế Air Jordan kinh điển chính hãng, tối ưu êm ái trên từng bước nhảy.",
            image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=800&auto=format&fit=crop",
            buttonText: "MUA NGAY JORDAN",
            buttonLink: "/product?brand=4",
            bgColor: "from-slate-955 via-slate-900 to-red-950",
            tagBg: "bg-red-600 text-white",
            btnBg: "bg-red-600 hover:bg-red-500 shadow-red-650/40 text-white"
        },
        {
            id: 5,
            tag: "BALENCIAGA LUXURY ✈️",
            title: "ĐỘT PHÁ BẢN THÂN CÙNG BALENCIAGA",
            description: "Khẳng định phong cách thời trang phi giới tính độc bản cùng các sản phẩm cao cấp, mang đậm tinh thần tự do phóng khoáng.",
            image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
            buttonText: "XEM BST BALENCIAGA",
            buttonLink: "/product?brand=5",
            bgColor: "from-slate-955 via-slate-900 to-zinc-900",
            tagBg: "bg-slate-700 text-white",
            btnBg: "bg-white hover:bg-slate-100 text-slate-900 shadow-white/10"
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
                ProductService.getAll(),
                CategoryService.getAll(),
                BrandService.getAll(),
                PostService.getAll()
            ]);

            if (prodRes.success) setProducts(prodRes.data); // Lấy toàn bộ sản phẩm để phân loại ở trang chủ
            if (catRes.success) setCategories(catRes.data); // Lấy toàn bộ danh mục
            if (brandRes.success) setBrands(brandRes.data);
            if (postRes.success) setPosts(postRes.data.slice(0, 3)); // Lấy 3 bài viết mới nhất

            setLoading(false);
        };

        loadHomeData();
    }, []);

    const handleHomeVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            window.dispatchEvent(new CustomEvent('cartToast', { 
                detail: { message: '❌ Trình duyệt không hỗ trợ Voice Search. Vui lòng dùng Chrome!', type: 'warning' } 
            }));
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListeningHome(true);
        window.dispatchEvent(new CustomEvent('cartToast', { 
            detail: { message: '🎙️ Đang lắng nghe giọng nói của bạn...', type: 'info' } 
        }));

        recognition.start();

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            setIsListeningHome(false);
            window.dispatchEvent(new CustomEvent('cartToast', { 
                detail: { message: `🎙️ Đã nhận diện: "${result}"`, type: 'success' } 
            }));
            setTimeout(() => {
                window.location.href = `/product?q=${encodeURIComponent(result)}`;
            }, 500);
        };

        recognition.onerror = (event) => {
            console.error('Lỗi giọng nói:', event.error);
            setIsListeningHome(false);
            window.dispatchEvent(new CustomEvent('cartToast', { 
                detail: { message: '❌ Không nhận diện được giọng nói hoặc thiếu quyền micro.', type: 'warning' } 
            }));
        };

        recognition.onend = () => {
            setIsListeningHome(false);
        };
    };

    // Xử lý thêm vào giỏ hàng từ nút nhanh
    const handleAddToCart = async (productId) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', type: 'warning' } }));
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
            return;
        }

        try {
            const userObj = JSON.parse(storedUser);
            const res = await CartService.add(userObj.id, Number(productId), 1);
            if (res.success) {
                window.dispatchEvent(new CustomEvent('cartToast', { detail: { message: 'Đã thêm sản phẩm vào giỏ hàng! 🛒' } }));
                window.dispatchEvent(new Event('cartUpdate'));
            } else {
                window.dispatchEvent(new CustomEvent('showToast', { detail: { message: res.message || 'Thêm vào giỏ hàng thất bại!', type: 'error' } }));
            }
        } catch (e) {
            console.error('Lỗi add to cart:', e);
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Thao tác thất bại!', type: 'error' } }));
        }
    };

    // Phân loại các nhóm sản phẩm ở trang chủ
    const saleProducts = products.filter(item => Number(item.is_sale) === 1).slice(0, 10);
    const hotProducts = products.filter(item => Number(item.is_hot) === 1).slice(0, 10);
    const newProducts = products.filter(item => Number(item.is_new) === 1).slice(0, 10);

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
                    src={getImageUrl(item.image)}
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
                    {/* Rating and Sold info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold pt-1.5">
                        <span className="flex items-center gap-0.5 text-amber-500">★ {(item.average_rating > 0 ? Number(item.average_rating) : 5.0).toFixed(1)}</span>
                        <span>Đã bán {item.total_sold || 0}</span>
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-between mt-auto w-full border-t border-slate-50 mt-4 pt-3">
                    <div className="flex flex-col">
                        {item.price_sale ? (
                            <>
                                <span className="font-extrabold text-indigo-600 text-[14px] sm:text-[15px] whitespace-nowrap">
                                    {Math.round(Number(item.price_sale)).toLocaleString('vi-VN')} đ
                                </span>
                                <span className="text-slate-400 line-through text-[10px] font-bold whitespace-nowrap">
                                    {Math.round(Number(item.price)).toLocaleString('vi-VN')} đ
                                </span>
                            </>
                        ) : (
                            <span className="font-extrabold text-indigo-600 text-[14px] sm:text-[15px] whitespace-nowrap">
                                {Math.round(Number(item.price)).toLocaleString('vi-VN')} đ
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1.5 items-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                window.dispatchEvent(new CustomEvent('askProductAdvice', {
                                    detail: { productId: item.id, productName: item.name }
                                }));
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
                            title="Tư vấn sản phẩm"
                        >
                            💬
                        </button>
                        <button
                            onClick={() => handleAddToCart(item.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shadow-sm shadow-indigo-100 hover:shadow-md"
                            title="Thêm vào giỏ hàng"
                        >
                            🛒 +
                        </button>
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
                                className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slide.bgColor} transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row items-center justify-between px-6 sm:px-12 md:px-20 py-8 md:py-0 ${isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                                    }`}
                            >
                                {/* Left side content */}
                                <div className="max-w-xl text-left space-y-4 md:space-y-6 z-10 mt-8 md:mt-0">
                                    <span className={`inline-block ${slide.tagBg} text-[10px] font-black tracking-widest px-4 py-2 rounded-full uppercase shadow-sm`}>
                                        {slide.tag}
                                    </span>
                                    <Link href={slide.buttonLink} className="block group/title">
                                        <h1 className="text-4xl sm:text-6xl font-black text-white leading-none italic tracking-tighter uppercase hover:text-indigo-200 transition-colors">
                                            {slide.title}
                                        </h1>
                                    </Link>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg line-clamp-3">
                                        {slide.description}
                                    </p>
                                    <div className="pt-2 flex flex-wrap gap-3">
                                        <Link
                                            href={slide.buttonLink}
                                            className={`${slide.btnBg} px-8 py-4 rounded-2xl font-black shadow-lg transition-all transform hover:-translate-y-0.5 text-xs sm:text-sm tracking-wider uppercase cursor-pointer flex items-center gap-1.5`}
                                        >
                                            <span>{slide.buttonText}</span>
                                            <span>→</span>
                                        </Link>
                                        <Link
                                            href="/contact"
                                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-4 rounded-2xl font-black transition-all text-xs sm:text-sm backdrop-blur-sm cursor-pointer uppercase tracking-wider"
                                        >
                                            Liên Hệ Tư Vấn
                                        </Link>
                                    </div>
                                </div>

                                {/* Right side image */}
                                <Link 
                                    href={slide.buttonLink}
                                    className="relative w-full md:w-1/2 h-[160px] md:h-full flex items-center justify-center overflow-hidden mt-4 md:mt-0 cursor-pointer group/img"
                                >
                                    <div className="absolute w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none z-0"></div>
                                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-slate-950/40 z-10"></div>
                                    <img
                                        src={getImageUrl(slide.image)}
                                        alt={slide.title}
                                        className="w-full h-full object-cover rounded-2xl md:rounded-none md:absolute md:inset-y-0 md:right-0 md:w-[90%] md:h-[80%] md:my-auto md:rounded-3xl shadow-2xl transition-transform duration-1000 scale-100 group-hover/img:scale-105 z-10"
                                    />
                                </Link>
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
                            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide ? 'w-8 bg-indigo-400' : 'w-2 bg-white/40 hover:bg-white/60'
                                }`}
                        ></button>
                    ))}
                </div>
            </section>

            {/* 1.5. Store Benefits / Policy Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                <div className="bg-white border border-slate-100 rounded-3xl py-6 px-8 shadow-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3.5">
                            <span className="text-3xl">🚚</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Giao Hàng Miễn Phí</h4>
                                <p className="text-slate-400 text-xs mt-0.5 font-medium">Đơn hàng toàn quốc từ 500K</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3.5">
                            <span className="text-3xl">🔄</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">30 Ngày Đổi Trả</h4>
                                <p className="text-slate-400 text-xs mt-0.5 font-medium">Đổi trả cực kỳ nhanh chóng</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3.5">
                            <span className="text-3xl">🛡️</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Chính Hãng 100%</h4>
                                <p className="text-slate-400 text-xs mt-0.5 font-medium">Hoàn tiền x2 nếu phát hiện fake</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3.5">
                            <span className="text-3xl">📞</span>
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm">Hỗ Trợ Tận Tâm</h4>
                                <p className="text-slate-400 text-xs mt-0.5 font-medium">Tổng đài hỗ trợ 24/7</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 1.8. Search and Trending Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                <div className="bg-slate-900 border border-slate-850 rounded-3xl py-10 px-8 shadow-xl text-center space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="max-w-xl mx-auto space-y-2 relative z-10">
                        <h3 className="text-xl sm:text-2xl font-black text-white italic tracking-tight uppercase">BẠN ĐANG TÌM KIẾM GÌ?</h3>
                        <p className="text-slate-400 text-xs font-semibold">Tìm kiếm nhanh chóng các dòng sản phẩm thể thao xu hướng hàng đầu</p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = e.target.search.value.trim();
                            if (query) window.location.href = `/product?q=${encodeURIComponent(query)}`;
                        }}
                        className="max-w-xl mx-auto flex gap-3 relative z-10"
                    >
                        <div className="relative flex-1">
                            <input
                                type="text"
                                name="search"
                                placeholder="Nhập tên giày, áo, thương hiệu..."
                                className="w-full px-5 py-4 pl-12 pr-12 bg-white/5 border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all font-semibold"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                            <button
                                type="button"
                                onClick={handleHomeVoiceSearch}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-all ${
                                    isListeningHome 
                                        ? 'text-rose-500 bg-rose-500/10 animate-pulse' 
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                                title="Tìm kiếm bằng giọng nói"
                            >
                                🎙️
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-4 rounded-2xl text-xs sm:text-sm transition-all shadow-lg shadow-indigo-650/30 cursor-pointer uppercase tracking-wider"
                        >
                            Tìm Kiếm
                        </button>
                    </form>

                    <div className="max-w-xl mx-auto flex flex-wrap items-center justify-center gap-2.5 text-xs relative z-10 pt-2">
                        <span className="text-slate-400 font-black uppercase tracking-wider text-[10px] mr-1.5 flex items-center gap-1">
                            🔥 Xu hướng:
                        </span>
                        {[
                            { label: 'Nike Pegasus', query: 'Pegasus' },
                            { label: 'Ultraboost', query: 'Ultraboost' },
                            { label: 'Jordan Retro', query: 'Jordan' },
                            { label: 'Puma Nitro', query: 'Puma' },
                            { label: 'Balenciaga', query: 'Balenciaga' },
                            { label: 'Áo Khoác', query: 'áo khoác' },
                            { label: 'Áo Polo', query: 'polo' }
                        ].map((tag, idx) => (
                            <Link
                                key={idx}
                                href={`/product?q=${encodeURIComponent(tag.query)}`}
                                className="bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500 text-slate-300 hover:text-indigo-400 border border-white/5 px-3 py-1.5 rounded-xl font-bold transition-all text-[11px]"
                            >
                                {tag.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Shop by Category Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Khám Phá Danh Mục</h2>
                    <p className="text-slate-500 text-sm mt-2">Dễ dàng lựa chọn nhóm sản phẩm thời trang bạn yêu thích</p>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-6">
                    {categories.map((cat, index) => {
                        const colors = [
                            'from-purple-500 to-indigo-600',
                            'from-pink-500 to-rose-600',
                            'from-blue-500 to-sky-600',
                            'from-teal-500 to-emerald-600',
                            'from-amber-500 to-orange-600',
                            'from-cyan-500 to-blue-600',
                            'from-indigo-500 to-purple-600',
                            'from-rose-500 to-red-600',
                            'from-emerald-500 to-teal-600'
                        ];
                        const selectColor = colors[index % colors.length];

                        const getCategoryIcon = (name) => {
                            if (!name) return '🛍️';
                            const lower = name.toLowerCase();
                            if (lower.includes('áo nam') || lower.includes('ao nam')) return '👕';
                            if (lower.includes('quần nam') || lower.includes('quan nam')) return '🩳';
                            if (lower.includes('áo khoác nam') || lower.includes('ao khoac nam')) return '🧥';
                            if (lower.includes('áo nữ') || lower.includes('ao nu')) return '👚';
                            if (lower.includes('quần nữ') || lower.includes('quan nu')) return '👖';
                            if (lower.includes('áo khoác nữ') || lower.includes('ao khoac nu')) return '🧥';
                            if (lower.includes('giày') || lower.includes('giay')) return '👟';
                            if (lower.includes('bộ đồ') || lower.includes('bo do')) return '🏃‍♂️';
                            if (lower.includes('phụ kiện') || lower.includes('phu kien')) return '🎒';
                            return '🛍️';
                        };

                        return (
                            <Link key={cat.id} href={`/product?category=${cat.id}`} className="group block text-center space-y-3">
                                <div className={`w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br ${selectColor} flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100/50 group-hover:scale-110 transition-transform duration-200`}>
                                    {getCategoryIcon(cat.name)}
                                </div>
                                <h3 className="font-bold text-slate-800 text-[11px] sm:text-xs group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">{cat.name}</h3>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* 2.5. Promotional Campaign Banners */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Banner 1 */}
                    <div className="relative h-64 rounded-3xl overflow-hidden shadow-md group">
                        <img
                            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop"
                            alt="Jordan Collection"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent z-10 flex flex-col justify-center p-8 text-white space-y-3">
                            <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-950/60 px-3 py-1 rounded-lg w-max font-sans">Jordan Retro 🏀</span>
                            <h3 className="text-xl sm:text-2xl font-black leading-tight max-w-xs">Huyền Thoại Sân Đấu Jordan</h3>
                            <p className="text-slate-350 text-xs max-w-xs leading-relaxed">Định hình lại phong cách bóng rổ đường phố cùng các thiết kế Air Jordan kinh điển.</p>
                            <Link href="/product?brand=4" className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold w-max shadow transition-all hover:scale-105">
                                Khám Phá Ngay
                            </Link>
                        </div>
                    </div>

                    {/* Banner 2 */}
                    <div className="relative h-64 rounded-3xl overflow-hidden shadow-md group">
                        <img
                            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
                            alt="Balenciaga Campaign"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent z-10 flex flex-col justify-center p-8 text-white space-y-3">
                            <span className="text-xs font-black text-rose-400 uppercase tracking-widest bg-rose-950/60 px-3 py-1 rounded-lg w-max">Balenciaga Luxury ✨</span>
                            <h3 className="text-xl sm:text-2xl font-black leading-tight max-w-xs">Đột Phá Bản Thân Cùng Balenciaga</h3>
                            <p className="text-slate-350 text-xs max-w-xs leading-relaxed">Khẳng định phong cách thời trang phi giới tính độc bản cùng các sản phẩm cao cấp.</p>
                            <Link href="/product?brand=5" className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-xl text-xs font-bold w-max shadow transition-all hover:scale-105">
                                Xem Bộ Sưu Tập
                            </Link>
                        </div>
                    </div>
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

                {saleProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 font-medium bg-white border border-slate-100 rounded-3xl">Chưa có sản phẩm khuyến mãi nào.</div>
                ) : (
                    <ProductSlider
                        items={saleProducts}
                        renderCard={renderProductCard}
                        id="slider-sale"
                    />
                )}
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

                {hotProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 font-medium bg-white border border-slate-100 rounded-3xl">Chưa có sản phẩm bán chạy nào.</div>
                ) : (
                    <ProductSlider
                        items={hotProducts}
                        renderCard={renderProductCard}
                        id="slider-hot"
                    />
                )}
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

                {newProducts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 font-medium bg-white border border-slate-100 rounded-3xl">Chưa có sản phẩm mới nào.</div>
                ) : (
                    <ProductSlider
                        items={newProducts}
                        renderCard={renderProductCard}
                        id="slider-new"
                    />
                )}
            </section>

            {/* 3.5. Store Milestones / Stats */}
            <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl py-12 px-6 max-w-7xl mx-auto shadow-xl my-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="space-y-1">
                        <span className="block text-3xl sm:text-4xl font-black text-indigo-400">2.000+</span>
                        <span className="block text-slate-300 text-xs font-bold uppercase tracking-wider">Đơn hàng hoàn tất</span>
                    </div>
                    <div className="space-y-1">
                        <span className="block text-3xl sm:text-4xl font-black text-indigo-400">6+</span>
                        <span className="block text-slate-300 text-xs font-bold uppercase tracking-wider">Thương hiệu phân phối</span>
                    </div>
                    <div className="space-y-1">
                        <span className="block text-3xl sm:text-4xl font-black text-indigo-400">3+</span>
                        <span className="block text-slate-300 text-xs font-bold uppercase tracking-wider">Chi nhánh toàn quốc</span>
                    </div>
                    <div className="space-y-1">
                        <span className="block text-3xl sm:text-4xl font-black text-indigo-400">100%</span>
                        <span className="block text-slate-300 text-xs font-bold uppercase tracking-wider">Chính hãng & Uy tín</span>
                    </div>
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
                                        src={getImageUrl(item.image)}
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

            {/* 4.5. Thương Hiệu Nổi Bật */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Thương Hiệu Nổi Bật</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Đối tác cung cấp trang phục thể thao chính hãng</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                    {brands.map((b) => (
                        <Link
                            key={b.id}
                            href={`/product?brand=${b.id}`}
                            className="bg-white border border-slate-100 hover:border-slate-350 hover:shadow-xl rounded-3xl p-6 flex flex-col items-center justify-center min-h-[120px] transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="h-10 w-full flex items-center justify-center relative z-10">
                                <BrandLogo name={b.name} slug={b.slug} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 5. Newsletter Subscription */}
            <section className="bg-white border border-slate-100 rounded-3xl py-10 px-6 sm:px-12 max-w-7xl mx-auto text-center space-y-6 shadow-sm my-6">
                <div className="max-w-xl mx-auto space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800">Đăng Ký Nhận Bản Tin Ưu Đãi</h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên và cập nhật sớm nhất các ưu đãi từ TRANG STORE.</p>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        window.dispatchEvent(new CustomEvent('cartToast', { detail: { message: 'Đăng ký nhận tin thành công! Ưu đãi đã gửi qua email 📧' } }));
                        e.target.reset();
                    }}
                    className="max-w-md mx-auto flex gap-3"
                >
                    <input
                        type="email"
                        required
                        placeholder="Nhập địa chỉ email của bạn..."
                        className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-indigo-100 cursor-pointer"
                    >
                        Đăng Ký
                    </button>
                </form>
            </section>
        </div>
    );
}
