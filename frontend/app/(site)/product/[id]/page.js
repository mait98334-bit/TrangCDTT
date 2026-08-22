'use client';
import { useState, useEffect, use } from 'react';
import { ProductService } from '@/services/productService';
import { ReviewService } from '@/services/reviewService';
import { CartService } from '@/services/cartService';
import Link from 'next/link';
import { getImageUrl } from '@/services/imageHelper';

export const dynamic = 'force-dynamic';

export default function ProductDetailPage({ params }) {
    // Giải nén params bằng React.use() để tương thích tốt với Next.js App Router
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const [product, setProduct] = useState(null);
    const [extraData, setExtraData] = useState({ variants: [], images: [] });
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    // Trạng thái cho Form viết đánh giá mới
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    // Thông tin user đăng nhập
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setCurrentUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }, []);

    // Load tất cả dữ liệu sản phẩm, biến thể, ảnh phụ và đánh giá
    const loadProductDetails = async () => {
        setLoading(true);
        const [prodRes, extraRes, reviewsRes] = await Promise.all([
            ProductService.getById(productId),
            ProductService.getExtraImages(productId),
            ReviewService.getByProductId(productId)
        ]);

        if (prodRes.success) {
            setProduct(prodRes.data);
            setActiveImage(prodRes.data.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop');
        }

        if (extraRes.success) {
            setExtraData(extraRes.data);
            if (extraRes.data.variants.length > 0) {
                const initialVariant = extraRes.data.variants[0];
                setSelectedVariant(initialVariant);
                setSelectedColor(initialVariant.color || '');
                setSelectedSize(initialVariant.size ? initialVariant.size.split('.')[0] : '');
                if (initialVariant.image) {
                    setActiveImage(initialVariant.image);
                }
            }
        }

        if (reviewsRes.success) {
            setReviews(reviewsRes.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (productId) {
            loadProductDetails();
        }
    }, [productId]);

    // Lấy danh sách màu sắc duy nhất
    const getUniqueColors = () => {
        const list = [];
        extraData.variants.forEach(v => {
            if (v.color && !list.some(item => item.color === v.color)) {
                list.push({
                    color: v.color,
                    image: v.image || null
                });
            }
        });
        return list;
    };

    // Lấy danh sách kích thước duy nhất
    const getAllSizes = () => {
        const list = [];
        extraData.variants.forEach(v => {
            if (v.size) {
                v.size.split('.').forEach(s => {
                    const trimmed = s.trim();
                    if (trimmed && !list.includes(trimmed)) {
                        list.push(trimmed);
                    }
                });
            }
        });
        return list;
    };

    // Tìm biến thể phù hợp nhất với Màu + Size đã chọn
    const findMatchingVariant = (color, size) => {
        return extraData.variants.find(v => {
            const matchColor = !v.color || v.color === color;
            const matchSize = !v.size || v.size === size || v.size.split('.').includes(size);
            return matchColor && matchSize;
        });
    };

    // Chọn Màu sắc
    const handleSelectColor = (color) => {
        setSelectedColor(color);
        
        // Đổi ảnh lớn sang ảnh của màu này nếu có
        const variantWithImage = extraData.variants.find(v => v.color === color && v.image);
        if (variantWithImage && variantWithImage.image) {
            setActiveImage(variantWithImage.image);
        }

        // Tìm size tiếp theo cho màu này
        const sizesForNewColor = [];
        extraData.variants.forEach(v => {
            if ((!v.color || v.color === color) && v.size) {
                v.size.split('.').forEach(s => {
                    if (!sizesForNewColor.includes(s.trim())) {
                        sizesForNewColor.push(s.trim());
                    }
                });
            }
        });

        let nextSize = selectedSize;
        if (!sizesForNewColor.includes(selectedSize)) {
            nextSize = sizesForNewColor.length > 0 ? sizesForNewColor[0] : '';
        }
        setSelectedSize(nextSize);

        const matching = findMatchingVariant(color, nextSize);
        setSelectedVariant(matching || null);
    };

    // Chọn Kích thước
    const handleSelectSize = (size) => {
        setSelectedSize(size);
        const matching = findMatchingVariant(selectedColor, size);
        setSelectedVariant(matching || null);
    };

    // Xử lý thêm vào giỏ hàng
    const handleAddToCart = async () => {
        if (!currentUser) {
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', type: 'warning' } }));
            return;
        }

        if (extraData.variants.length > 0) {
            if (!selectedVariant) {
                window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Vui lòng chọn màu sắc và kích cỡ!', type: 'warning' } }));
                return;
            }
            if (selectedVariant.stock <= 0) {
                window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Xin lỗi, phiên bản sản phẩm này hiện đã hết hàng!', type: 'warning' } }));
                return;
            }
        }

        setAddingToCart(true);
        const res = await CartService.add(currentUser.id, Number(productId), quantity, selectedVariant ? selectedVariant.id : null);
        setAddingToCart(false);

        if (res.success) {
            window.dispatchEvent(new CustomEvent('cartToast', { detail: { message: 'Đã thêm sản phẩm vào giỏ hàng! 🛒' } }));
            window.dispatchEvent(new Event('cartUpdate'));
        } else {
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: res.message || 'Thêm vào giỏ hàng thất bại!', type: 'error' } }));
        }
    };

    // Xử lý gửi đánh giá mới
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Vui lòng đăng nhập để viết đánh giá!', type: 'warning' } }));
            return;
        }
        if (!newComment.trim()) {
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Vui lòng nhập nội dung đánh giá!', type: 'warning' } }));
            return;
        }

        setSubmittingReview(true);
        const res = await ReviewService.create({
            product_id: Number(productId),
            user_id: currentUser.id,
            rating: newRating,
            comment: newComment
        });
        setSubmittingReview(false);

        if (res.success) {
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: 'Cảm ơn bạn đã gửi đánh giá! ⭐', type: 'success' } }));
            setNewComment('');
            // Load lại danh sách đánh giá
            const reviewsRes = await ReviewService.getByProductId(productId);
            if (reviewsRes.success) {
                setReviews(reviewsRes.data);
            }
        } else {
            window.dispatchEvent(new CustomEvent('showToast', { detail: { message: res.message || 'Không thể gửi đánh giá!', type: 'error' } }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Đang tải thông tin chi tiết sản phẩm...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy sản phẩm</h2>
                <p className="text-gray-500 mt-2">Sản phẩm này có thể đã bị xóa hoặc không tồn tại trong hệ thống.</p>
                <Link href="/" className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                    Quay lại Trang chủ
                </Link>
            </div>
        );
    }

    const uniqueColors = getUniqueColors();
    const allSizes = getAllSizes();

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-8 font-medium">
                    <Link href="/" className="hover:text-indigo-600 transition-colors">Trang chủ</Link>
                    <span className="text-gray-400">›</span>
                    
                    {product.category_id && (
                        <>
                            <Link href={`/product?category=${product.category_id}`} className="hover:text-indigo-600 transition-colors">
                                {product.category_name}
                            </Link>
                            <span className="text-gray-400">›</span>
                        </>
                    )}

                    {product.brand_id && (
                        <>
                            <Link href={`/product?brand=${product.brand_id}`} className="hover:text-indigo-600 transition-colors">
                                {product.brand_name}
                            </Link>
                            <span className="text-gray-400">›</span>
                        </>
                    )}
                    
                    <span className="text-gray-800 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
                </nav>

                {/* Main Product Layout */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 sm:p-10 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Side: Image Gallery */}
                        <div className="space-y-6">
                            {/* Main Image */}
                            <div className="aspect-square w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative shadow-inner group">
                                <img
                                    src={getImageUrl(activeImage)}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop';
                                    }}
                                />
                            </div>

                            {/* Thumbnails */}
                            {(extraData.images.length > 0 || product.image) && (
                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                                    {/* Thumbnail of Main Image */}
                                    <button
                                        onClick={() => setActiveImage(product.image || '')}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all ${
                                            activeImage === product.image ? 'border-indigo-600 shadow-md scale-95' : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <img src={getImageUrl(product.image)} alt="Thumbnail main" className="w-full h-full object-cover" />
                                    </button>

                                    {/* Extra Images */}
                                    {extraData.images.map((img) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setActiveImage(img.image_url)}
                                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all ${
                                                activeImage === img.image_url ? 'border-indigo-600 shadow-md scale-95' : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img src={getImageUrl(img.image_url)} alt="Thumbnail extra" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Side: Product Details Info */}
                        <div className="flex flex-col justify-between space-y-8">
                            <div className="space-y-6">
                                {/* Badges Category & Brand */}
                                <div className="flex flex-wrap gap-2.5">
                                    {product.category_name && (
                                        <span className="px-3.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-full font-bold text-xs border border-indigo-100 uppercase tracking-wider">
                                            {product.category_name}
                                        </span>
                                    )}
                                    {product.brand_name && (
                                        <span className="px-3.5 py-1.5 bg-amber-50 text-amber-700 rounded-full font-bold text-xs border border-amber-100 uppercase tracking-wider">
                                            {product.brand_name}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                                    {product.name}
                                </h1>

                                {/* Price tag - Tự động cộng giá phụ thu của biến thể nếu có */}
                                <div className="space-y-1.5">
                                     {product.price_sale ? (
                                         <div className="flex items-baseline gap-3 flex-wrap">
                                             <div className="text-4xl font-black text-rose-600 flex items-baseline gap-1">
                                                 {Math.round(Number(
                                                     selectedVariant && selectedVariant.price
                                                         ? (Number(product.price_sale) + Number(selectedVariant.price))
                                                         : product.price_sale
                                                 )).toLocaleString('vi-VN')}
                                                 <span className="text-lg font-bold">đ</span>
                                             </div>
                                             <div className="text-lg text-slate-400 line-through font-bold flex items-baseline gap-1">
                                                 {Math.round(Number(
                                                     selectedVariant && selectedVariant.price
                                                         ? (Number(product.price) + Number(selectedVariant.price))
                                                         : product.price
                                                 )).toLocaleString('vi-VN')}
                                                 <span className="text-xs font-bold">đ</span>
                                             </div>
                                             <span className="bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-tight px-2 py-0.5 rounded-lg">
                                                 Giảm {Math.round((1 - (product.price_sale / product.price)) * 100)}%
                                             </span>
                                         </div>
                                     ) : (
                                         <div className="text-4xl font-black text-rose-600 flex items-baseline gap-1">
                                             {Math.round(Number(
                                                 selectedVariant && selectedVariant.price
                                                     ? (Number(product.price) + Number(selectedVariant.price))
                                                     : product.price
                                             )).toLocaleString('vi-VN')}
                                             <span className="text-lg font-bold">đ</span>
                                         </div>
                                     )}
                                </div>

                                {/* Description */}
                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Mô tả sản phẩm</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                        {product.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
                                    </p>
                                </div>
                                    {/* Variants selection (Dạng hình ảnh/text phân nhóm Màu sắc & Size giống Supersports) */}
                                {extraData.variants.length > 0 && (
                                    <div className="border-t border-gray-100 pt-6 space-y-5">
                                        {/* Chọn Màu Sắc */}
                                        {uniqueColors.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Màu sắc: <span className="text-gray-900 font-extrabold">{selectedColor || 'Chưa chọn'}</span>
                                                </h4>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {uniqueColors.map((c) => {
                                                        const isSelected = selectedColor === c.color;
                                                        return (
                                                            <button
                                                                key={c.color}
                                                                type="button"
                                                                onClick={() => handleSelectColor(c.color)}
                                                                className={`relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                                                                    isSelected
                                                                        ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md scale-105'
                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                                style={{ width: '56px', height: '56px' }}
                                                                title={c.color}
                                                            >
                                                                {c.image ? (
                                                                    <img src={getImageUrl(c.image)} alt={c.color} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-700 uppercase p-1 text-center">
                                                                        {c.color}
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Chọn Kích Thước */}
                                        {allSizes.length > 0 && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                    Kích thước: <span className="text-gray-900 font-extrabold">{selectedSize || 'Chưa chọn'}</span>
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {allSizes.map((sz) => {
                                                        const isSelected = selectedSize === sz;
                                                        
                                                        // Kiểm tra xem size này có sẵn hàng cho màu đang chọn hay không
                                                        const matchingVar = findMatchingVariant(selectedColor, sz);
                                                        const isAvailable = matchingVar && matchingVar.stock > 0;

                                                        return (
                                                            <button
                                                                key={sz}
                                                                type="button"
                                                                onClick={() => isAvailable && handleSelectSize(sz)}
                                                                disabled={!isAvailable}
                                                                className={`min-w-[44px] h-11 px-3.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-center relative ${
                                                                    isSelected
                                                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                                                        : isAvailable
                                                                            ? 'bg-white border-gray-200 text-gray-800 hover:border-gray-400 cursor-pointer'
                                                                            : 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                                                                }`}
                                                            >
                                                                {sz}
                                                                {/* Đường gạch chéo chéo nếu hết hàng */}
                                                                {!isAvailable && (
                                                                    <span className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                                                                        <span className="w-[150%] h-[1px] bg-gray-300 rotate-45 transform"></span>
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Purchase Stepper & Add to Cart */}
                            <div className="border-t border-gray-100 pt-8 space-y-6">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    {/* Stepper */}
                                    <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50 sm:w-36">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="text-gray-500 hover:text-gray-900 font-extrabold text-lg select-none w-8 text-center cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold text-gray-800 text-base">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(prev => prev + 1)}
                                            className="text-gray-500 hover:text-gray-900 font-extrabold text-lg select-none w-8 text-center cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={addingToCart}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 hover:-translate-y-0.5 transition-all text-center cursor-pointer disabled:bg-indigo-400 flex items-center justify-center gap-2"
                                    >
                                        <span>🛒</span>
                                        <span>{addingToCart ? 'Đang thêm vào giỏ...' : 'Thêm vào giỏ hàng'}</span>
                                    </button>

                                    {/* Tư vấn sản phẩm Button */}
                                    <a
                                        href={`/contact?productId=${productId}`}
                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold px-6 py-4 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2 cursor-pointer text-xs"
                                    >
                                        <span>💬</span>
                                        <span>Tư vấn sản phẩm</span>
                                    </a>
                                </div>

                                {/* Extra trust features */}
                                <div className="grid grid-cols-3 gap-4 text-center pt-2">
                                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-xl mb-1">🚚</div>
                                        <div className="text-[10px] font-bold text-gray-700 uppercase">Miễn phí ship</div>
                                        <div className="text-[9px] text-gray-400 mt-0.5">Đơn hàng từ 500k</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-xl mb-1">🛡️</div>
                                        <div className="text-[10px] font-bold text-gray-700 uppercase">Chính hãng</div>
                                        <div className="text-[9px] text-gray-400 mt-0.5">Cam kết 100%</div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-xl mb-1">🔄</div>
                                        <div className="text-[10px] font-bold text-gray-700 uppercase">Đổi trả dễ dàng</div>
                                        <div className="text-[9px] text-gray-400 mt-0.5">Trong vòng 7 ngày</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                        <span>⭐</span>
                        <span>Đánh giá từ khách hàng ({reviews.length})</span>
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left: Review Statistics & Form */}
                        <div className="space-y-6 lg:border-r lg:border-gray-100 lg:pr-8">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100/50 text-center">
                                <h4 className="text-sm font-bold text-indigo-900/60 uppercase tracking-wider mb-2">Đánh giá trung bình</h4>
                                <div className="text-5xl font-black text-indigo-700">
                                    {reviews.length > 0
                                        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
                                        : '0.0'}
                                </div>
                                <div className="text-yellow-500 text-lg mt-2">
                                    {'★'.repeat(Math.round(reviews.length > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0)) || '☆☆☆☆☆'}
                                </div>
                                <p className="text-xs text-gray-500 mt-3 font-medium">Lượt đánh giá chân thực từ khách đã mua sản phẩm</p>
                            </div>

                            {/* Write Review Form */}
                            {currentUser ? (
                                <form onSubmit={handleSubmitReview} className="space-y-4">
                                    <h3 className="text-base font-bold text-gray-800">Viết đánh giá của bạn</h3>
                                    
                                    {/* Star Rating Buttons */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Số sao đánh giá</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setNewRating(star)}
                                                    className={`text-2xl transition-all cursor-pointer hover:scale-110 ${
                                                        newRating >= star ? 'text-yellow-500' : 'text-gray-200'
                                                    }`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Comment Textarea */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nội dung bình luận</label>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            rows="3"
                                            placeholder="Chất vải thế nào, phom dáng mặc lên có đẹp không ní ơi..."
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs sm:text-sm resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer disabled:bg-indigo-400"
                                    >
                                        {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                                    </button>
                                </form>
                            ) : (
                                <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center bg-gray-50/50">
                                    <p className="text-sm text-gray-500">Vui lòng đăng nhập để gửi đánh giá và nhận xét cho sản phẩm này.</p>
                                    <Link href="/login" className="mt-4 inline-block px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs sm:text-sm rounded-xl transition-all">
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Right: Review List */}
                        <div className="lg:col-span-2 space-y-6 max-h-[500px] overflow-y-auto pr-2">
                            {reviews.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <div className="text-4xl mb-2">💬</div>
                                    <p className="text-sm font-medium">Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên nhận xét!</p>
                                </div>
                            ) : (
                                reviews.map((rev) => (
                                    <div key={rev.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0 space-y-2.5">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="font-bold text-gray-800 text-sm">{rev.user_name || 'Khách hàng'}</h5>
                                                <div className="text-yellow-500 text-xs mt-1">
                                                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                                                </div>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {new Date(rev.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
