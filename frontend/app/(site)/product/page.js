'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ProductService } from '@/services/productService';
import { getImageUrl } from '@/services/imageHelper';
import { CartService } from '@/services/cartService';

export const dynamic = 'force-dynamic';

function ProductsContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Xử lý thêm nhanh vào giỏ hàng
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

    // Filter states driven entirely by URL search params from Header Mega Menu
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedFilter, setSelectedFilter] = useState(''); // 'sale', 'hot', 'new' or ''
    const [selectedSearch, setSelectedSearch] = useState('');

    const searchParams = useSearchParams();

    // Lắng nghe thay đổi từ query params ở Header Mega Menu
    useEffect(() => {
        const catParam = searchParams.get('category');
        const brandParam = searchParams.get('brand');
        const filterParam = searchParams.get('filter');
        const qParam = searchParams.get('q');
        
        setSelectedCategory(catParam || '');
        setSelectedBrand(brandParam || '');
        setSelectedFilter(filterParam || '');
        setSelectedSearch(qParam || '');
    }, [searchParams]);

    useEffect(() => {
        const loadProductsData = async () => {
            setLoading(true);
            const res = await ProductService.getAll();
            if (res.success) {
                setProducts(res.data);
            }
            setLoading(false);
        };
        loadProductsData();
    }, []);

    // Lọc sản phẩm ở client-side theo lựa chọn từ Mega Menu
    const filteredProducts = products.filter((item) => {
        const matchesCategory = selectedCategory === '' || Number(item.category_id) === Number(selectedCategory);
        const matchesBrand = selectedBrand === '' || Number(item.brand_id) === Number(selectedBrand);
        const matchesSearch = selectedSearch === '' || 
            item.name.toLowerCase().includes(selectedSearch.toLowerCase()) || 
            (item.brand_name && item.brand_name.toLowerCase().includes(selectedSearch.toLowerCase()));
        
        let matchesFilter = true;
        if (selectedFilter === 'sale') matchesFilter = Number(item.is_sale) === 1;
        else if (selectedFilter === 'hot') matchesFilter = Number(item.is_hot) === 1;
        else if (selectedFilter === 'new') matchesFilter = Number(item.is_new) === 1;

        return matchesCategory && matchesBrand && matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Đang tải danh sách sản phẩm...</p>
                </div>
            </div>
        );
    }

    const getBreadcrumbText = () => {
        if (selectedSearch) {
            return `Kết quả tìm kiếm cho "${selectedSearch}"`;
        }
        if (selectedCategory) {
            const found = products.find(p => Number(p.category_id) === Number(selectedCategory));
            return found?.category_name || 'Danh mục sản phẩm';
        }
        if (selectedBrand) {
            const found = products.find(p => Number(p.brand_id) === Number(selectedBrand));
            return found?.brand_name || 'Thương hiệu';
        }
        if (selectedFilter === 'sale') return 'Sản phẩm khuyến mãi';
        if (selectedFilter === 'hot') return 'Sản phẩm bán chạy';
        if (selectedFilter === 'new') return 'Hàng mới về';
        return 'Tất cả sản phẩm';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-6 font-medium">
                <Link href="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                <span className="text-gray-400">›</span>
                <span className="text-gray-800 font-semibold">
                    {getBreadcrumbText()}
                </span>
            </nav>

            {/* Page Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-5">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        {getBreadcrumbText()}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Khám phá bộ sưu tập thời trang thể thao cao cấp chính hãng</p>
                </div>
                <div className="mt-4 md:mt-0 text-slate-400 text-xs font-bold bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl">
                    Hiển thị <span className="text-indigo-600 font-black">{filteredProducts.length}</span> sản phẩm
                </div>
            </div>

            {/* Product Grid - Full width 4 columns, no filter bar */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center text-slate-500 font-medium shadow-sm">
                    <span className="text-5xl block mb-4">🔍</span>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy sản phẩm nào</h3>
                    <p className="text-slate-400 text-xs">Không có sản phẩm nào phù hợp với danh mục hoặc trạng thái này.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((item) => (
                        <div key={item.id} className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
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
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 font-medium">Đang tải danh sách sản phẩm...</p>
                </div>
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
