'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/apiService';
import { getImageUrl } from '@/services/imageHelper';

export default function AdminProductPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' hoặc 'trash'
    const [currentPage, setCurrentPage] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);

    // Modal state (Thêm/Sửa sản phẩm)
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' hoặc 'edit'
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        price_sale: '',
        image: '',
        description: '',
        category_id: '',
        brand_id: '',
        is_sale: 0,
        is_hot: 0,
        is_new: 0
    });

    // Modal state (Quản lý ảnh phụ và biến thể)
    const [showExtraModal, setShowExtraModal] = useState(false);
    const [selectedExtraProduct, setSelectedExtraProduct] = useState(null);
    const [extraImages, setExtraImages] = useState([]);
    const [extraVariants, setExtraVariants] = useState([]);
    const [activeExtraTab, setActiveExtraTab] = useState('images'); // 'images' hoặc 'variants'
    const [newVariantData, setNewVariantData] = useState({
        color: '',
        size: '',
        price: '',
        stock: '0',
        image: ''
    });
    const [newImageUrl, setNewImageUrl] = useState('');
    const [uploadingExtraFile, setUploadingExtraFile] = useState(false);

    // Load danh sách sản phẩm từ backend
    const loadProducts = async () => {
        setLoading(true);
        const res = await fetchApi('/products?admin=true');
        if (res.success) {
            setProducts(res.data);
        }
        setLoading(false);
    };

    // Load danh mục và thương hiệu để chọn trong select
    const loadFilters = async () => {
        const [resCat, resBrand] = await Promise.all([
            fetchApi('/categories'),
            fetchApi('/brands')
        ]);
        if (resCat.success) setCategories(resCat.data);
        if (resBrand.success) setBrands(resBrand.data);
    };

    useEffect(() => {
        loadProducts();
        loadFilters();
    }, []);

    // Mở modal Thêm sản phẩm chính
    const handleOpenAdd = () => {
        setModalType('add');
        setFormData({
            id: '',
            name: '',
            price: '',
            price_sale: '',
            image: '',
            description: '',
            category_id: '',
            brand_id: '',
            is_sale: 0,
            is_hot: 0,
            is_new: 0
        });
        setShowModal(true);
    };

    // Mở modal Sửa sản phẩm chính
    const handleOpenEdit = (product) => {
        setModalType('edit');
        setFormData({
            id: product.id,
            name: product.name,
            price: product.price,
            price_sale: product.price_sale || '',
            image: product.image || '',
            description: product.description || '',
            category_id: product.category_id || '',
            brand_id: product.brand_id || '',
            is_sale: product.is_sale || 0,
            is_hot: product.is_hot || 0,
            is_new: product.is_new || 0
        });
        setShowModal(true);
    };

    // Xử lý thay đổi input của form sản phẩm chính
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    // Xử lý upload file hình ảnh sản phẩm chính từ máy tính
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('image', file);

        setUploadingFile(true);
        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formDataObj
            });
            const data = await res.json();
            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    image: data.url
                }));
                alert('Tải ảnh lên thành công!');
            } else {
                alert(data.message || 'Tải ảnh thất bại!');
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Có lỗi xảy ra khi kết nối máy chủ để tải ảnh!');
        } finally {
            setUploadingFile(false);
        }
    };

    // Xử lý Submit form sản phẩm chính (Thêm/Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) {
            alert('Vui lòng điền tên và giá sản phẩm!');
            return;
        }

        setSubmitting(true);
        const endpoint = modalType === 'add' ? '/products' : `/products/${formData.id}`;
        const method = modalType === 'add' ? 'POST' : 'PUT';

        const res = await fetchApi(endpoint, {
            method,
            body: JSON.stringify({
                name: formData.name,
                price: Number(formData.price),
                price_sale: formData.price_sale ? Number(formData.price_sale) : null,
                image: formData.image,
                description: formData.description,
                category_id: formData.category_id ? Number(formData.category_id) : null,
                brand_id: formData.brand_id ? Number(formData.brand_id) : null,
                is_sale: Number(formData.is_sale || 0),
                is_hot: Number(formData.is_hot || 0),
                is_new: Number(formData.is_new || 0)
            })
        });

        setSubmitting(false);

        if (res.success) {
            alert(modalType === 'add' ? 'Thêm sản phẩm thành công!' : 'Cập nhật sản phẩm thành công!');
            setShowModal(false);
            loadProducts();
        } else {
            alert(res.message || 'Thao tác thất bại!');
        }
    };

    // Xử lý xóa mềm sản phẩm
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn đưa sản phẩm này vào thùng rác?')) return;

        const res = await fetchApi(`/products/${id}`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Đã chuyển sản phẩm vào Thùng rác!');
            loadProducts();
        } else {
            alert(res.message || 'Xóa thất bại!');
        }
    };

    // Xử lý khôi phục sản phẩm đã xóa mềm
    const handleRestore = async (id) => {
        const res = await fetchApi(`/products/${id}/restore`, {
            method: 'POST'
        });

        if (res.success) {
            alert('Khôi phục sản phẩm thành công!');
            loadProducts();
        } else {
            alert(res.message || 'Khôi phục thất bại!');
        }
    };

    // Xử lý xóa vĩnh viễn sản phẩm
    const handleHardDelete = async (id) => {
        if (!confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này khỏi hệ thống? Thao tác này sẽ xóa sạch tất cả dữ liệu biến thể, đánh giá, chi tiết đơn hàng... liên quan và KHÔNG thể hoàn tác!')) return;

        const res = await fetchApi(`/products/${id}/hard`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Đã xóa vĩnh viễn sản phẩm!');
            loadProducts();
        } else {
            alert(res.message || 'Xóa vĩnh viễn thất bại!');
        }
    };

    // ==========================================
    // CÁC HÀM XỬ LÝ EXTRA DETAILS (ẢNH PHỤ & BIẾN THỂ)
    // ==========================================

    // Mở modal quản lý ảnh phụ và biến thể
    const handleOpenExtra = async (product) => {
        setSelectedExtraProduct(product);
        setActiveExtraTab('images');
        setShowExtraModal(true);
        loadProductExtra(product.id);
    };

    // Load ảnh phụ và biến thể từ backend
    const loadProductExtra = async (productId) => {
        const res = await fetchApi(`/products/${productId}/extra`);
        if (res.success) {
            setExtraImages(res.data.images || []);
            setExtraVariants(res.data.variants || []);
        }
    };

    // Xử lý upload và thêm ảnh phụ
    const handleExtraImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('image', file);

        setUploadingExtraFile(true);
        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formDataObj
            });
            const data = await res.json();
            if (data.success) {
                // Thêm vào database
                const addRes = await fetchApi(`/products/${selectedExtraProduct.id}/images`, {
                    method: 'POST',
                    body: JSON.stringify({ image_url: data.url })
                });
                if (addRes.success) {
                    loadProductExtra(selectedExtraProduct.id);
                    alert('Thêm ảnh phụ thành công!');
                }
            } else {
                alert(data.message || 'Upload ảnh phụ thất bại!');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi tải ảnh lên máy chủ!');
        } finally {
            setUploadingExtraFile(false);
        }
    };

    const handleAddExtraImageUrl = async (e) => {
        e.preventDefault();
        if (!newImageUrl.trim()) return;
        const res = await fetchApi(`/products/${selectedExtraProduct.id}/images`, {
            method: 'POST',
            body: JSON.stringify({ image_url: newImageUrl })
        });
        if (res.success) {
            loadProductExtra(selectedExtraProduct.id);
            setNewImageUrl('');
            alert('Thêm ảnh phụ thành công!');
        } else {
            alert(res.message || 'Thêm ảnh phụ thất bại!');
        }
    };

    const handleDeleteExtraImage = async (imageId) => {
        if (!confirm('Bạn có chắc muốn xóa ảnh phụ này?')) return;
        const res = await fetchApi(`/products/images/${imageId}`, {
            method: 'DELETE'
        });
        if (res.success) {
            loadProductExtra(selectedExtraProduct.id);
        } else {
            alert(res.message || 'Xóa ảnh phụ thất bại!');
        }
    };

    // Xử lý biến thể
    const handleVariantInputChange = (e) => {
        const { name, value } = e.target;
        setNewVariantData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý upload ảnh cho biến thể
    const handleVariantImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataObj = new FormData();
        formDataObj.append('image', file);

        try {
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formDataObj
            });
            const data = await res.json();
            if (data.success) {
                setNewVariantData(prev => ({
                    ...prev,
                    image: data.url
                }));
                alert('Tải ảnh biến thể thành công!');
            } else {
                alert(data.message || 'Tải ảnh thất bại!');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi khi upload ảnh biến thể!');
        }
    };

    const handleAddVariant = async (e) => {
        e.preventDefault();
        if (!newVariantData.color && !newVariantData.size) {
            alert('Vui lòng điền Màu sắc hoặc Kích cỡ cho biến thể!');
            return;
        }

        const res = await fetchApi(`/products/${selectedExtraProduct.id}/variants`, {
            method: 'POST',
            body: JSON.stringify({
                color: newVariantData.color || null,
                size: newVariantData.size || null,
                price: newVariantData.price ? Number(newVariantData.price) : null,
                stock: Number(newVariantData.stock),
                image: newVariantData.image || null
            })
        });

        if (res.success) {
            loadProductExtra(selectedExtraProduct.id);
            setNewVariantData({ color: '', size: '', price: '', stock: '0', image: '' });
            alert('Thêm biến thể thành công!');
        } else {
            alert(res.message || 'Thêm biến thể thất bại!');
        }
    };

    const handleDeleteVariant = async (variantId) => {
        if (!confirm('Bạn có chắc muốn xóa biến thể này?')) return;
        const res = await fetchApi(`/products/variants/${variantId}`, {
            method: 'DELETE'
        });
        if (res.success) {
            loadProductExtra(selectedExtraProduct.id);
        } else {
            alert(res.message || 'Xóa biến thể thất bại!');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách sản phẩm...</div>;

    const filteredProducts = products.filter(p => activeTab === 'active' ? !p.is_deleted : p.is_deleted);

    // Phân trang
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header trang sản phẩm */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách toàn bộ sản phẩm thời trang trong hệ thống</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                    <span>+ Thêm sản phẩm mới</span>
                </button>
            </div>

            {/* Tab điều hướng: Hoạt động / Thùng rác */}
            <div className="flex gap-4 border-b border-gray-200 mb-6 text-sm">
                <button
                    onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
                    className={`pb-3 font-semibold px-2 cursor-pointer transition-all border-b-2 ${
                        activeTab === 'active'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    📦 Đang bán ({products.filter(p => !p.is_deleted).length})
                </button>
                <button
                    onClick={() => { setActiveTab('trash'); setCurrentPage(1); }}
                    className={`pb-3 font-semibold px-2 cursor-pointer transition-all border-b-2 ${
                        activeTab === 'trash'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    🗑️ Thùng rác ({products.filter(p => p.is_deleted).length})
                </button>
            </div>

            {/* Bảng hiển thị sản phẩm */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100 font-bold">
                            <th className="p-4 font-bold text-slate-800">ID</th>
                            <th className="p-4 font-bold text-slate-800">Hình ảnh</th>
                            <th className="p-4 font-bold text-slate-800">Tên sản phẩm</th>
                            <th className="p-4 font-bold text-slate-800">Danh mục</th>
                            <th className="p-4 font-bold text-slate-800">Thương hiệu</th>
                            <th className="p-4 font-bold text-slate-800">Giá bán</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-gray-500">
                                    {activeTab === 'trash' ? 'Thùng rác trống.' : 'Chưa có sản phẩm nào trong cơ sở dữ liệu.'}
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-medium">#{item.id}</td>
                                    <td className="p-4">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-lg border border-gray-100 shadow-sm"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=200&auto=format&fit=crop';
                                            }}
                                        />
                                    </td>
                                    <td className="p-4 font-bold text-gray-800">
                                        <div>{item.name}</div>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {Number(item.is_new) === 1 && (
                                                <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded border border-green-100">Mới</span>
                                            )}
                                            {Number(item.is_hot) === 1 && (
                                                <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-black uppercase rounded border border-rose-100">Hot</span>
                                            )}
                                            {Number(item.is_sale) === 1 && (
                                                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded border border-amber-100">Sale</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {item.category_name ? (
                                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-semibold text-xs border border-purple-100">
                                                {item.category_name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">Chưa phân loại</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {item.brand_name ? (
                                            <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md font-semibold text-xs border border-amber-100">
                                                {item.brand_name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">Chưa có thương hiệu</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {item.price_sale ? (
                                            <div className="flex flex-col">
                                                <span className="text-rose-600 font-extrabold">{Number(item.price_sale).toLocaleString('vi-VN')} đ</span>
                                                <span className="text-gray-400 line-through text-xs font-medium">{Number(item.price).toLocaleString('vi-VN')} đ</span>
                                            </div>
                                        ) : (
                                            <span className="text-rose-600 font-extrabold">{Number(item.price).toLocaleString('vi-VN')} đ</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1.5">
                                            {activeTab === 'trash' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRestore(item.id)}
                                                        className="bg-green-50 hover:bg-green-100 text-green-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        🔄 Khôi phục
                                                    </button>
                                                    <button
                                                        onClick={() => handleHardDelete(item.id)}
                                                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        💥 Xóa vĩnh viễn
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleOpenExtra(item)}
                                                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Chi tiết
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="bg-sky-50 hover:bg-sky-100 text-sky-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Điều khiển phân trang */}
            <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm mt-4 text-sm font-medium">
                <div className="text-gray-500">
                    {filteredProducts.length === 0 ? (
                        <span>Không có sản phẩm nào để hiển thị</span>
                    ) : (
                        <span>
                            Hiển thị <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> -{' '}
                            <span className="font-semibold text-gray-800">{Math.min(indexOfLastItem, filteredProducts.length)}</span> trên{' '}
                            <span className="font-semibold text-gray-800">{filteredProducts.length}</span> sản phẩm
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || filteredProducts.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang trước
                    </button>
                    {totalPages <= 1 ? (
                        <button
                            disabled
                            className="w-8 h-8 rounded-lg font-bold text-xs bg-indigo-600 text-white flex items-center justify-center"
                        >
                            1
                        </button>
                    ) : (
                        Array.from({ length: totalPages }, (_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentPage(idx + 1)}
                                className={`w-8 h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center ${
                                    currentPage === idx + 1
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {idx + 1}
                            </button>
                        ))
                    )}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || filteredProducts.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang sau
                    </button>
                </div>
            </div>

            {/* Modal Dialog Thêm/Sửa sản phẩm chính */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {modalType === 'add' ? 'Thêm sản phẩm mới' : 'Cập nhật sản phẩm'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form wrapper */}
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                            {/* Scrollable Form Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên sản phẩm *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ví dụ: Áo khoác Blazer Hàn Quốc"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Danh mục</label>
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white"
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thương hiệu</label>
                                    <select
                                        name="brand_id"
                                        value={formData.brand_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white"
                                    >
                                        <option value="">Chọn thương hiệu</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá bán gốc (đ) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Ví dụ: 350000"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giá khuyến mãi (đ)</label>
                                    <input
                                        type="number"
                                        name="price_sale"
                                        value={formData.price_sale}
                                        onChange={handleInputChange}
                                        placeholder="Ví dụ: 280000"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hình ảnh sản phẩm</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    {/* Upload file từ máy tính */}
                                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-indigo-500 rounded-2xl p-4 transition-all bg-gray-50/50 relative group min-h-[120px]">
                                        {uploadingFile ? (
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                                <span className="text-xs text-gray-500 font-medium">Đang tải ảnh lên...</span>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center py-2">
                                                <svg className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 mb-1.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                                <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">Chọn ảnh từ máy tính</span>
                                                <span className="text-[10px] text-gray-400 mt-0.5">Hỗ trợ JPG, PNG, WEBP, GIF</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>

                                    {/* Link ảnh & Preview */}
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleInputChange}
                                            placeholder="Hoặc dán URL ảnh trực tiếp"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                                        />
                                        
                                        {formData.image && (
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm mx-auto sm:mx-0">
                                                <img
                                                    src={getImageUrl(formData.image)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                                                    style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '10px' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả sản phẩm</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Mô tả chi tiết chất liệu, kích cỡ, form dáng..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm resize-none"
                                />
                            </div>

                            {/* Trạng thái đặc biệt */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Trạng thái đặc biệt</span>
                                <div className="grid grid-cols-3 gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm hover:bg-slate-100/50 transition-all">
                                        <input
                                            type="checkbox"
                                            name="is_sale"
                                            checked={Number(formData.is_sale) === 1}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-xs font-bold text-slate-700">Khuyến Mãi</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm hover:bg-slate-100/50 transition-all">
                                        <input
                                            type="checkbox"
                                            name="is_hot"
                                            checked={Number(formData.is_hot) === 1}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-xs font-bold text-slate-700">Bán Chạy (HOT)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm hover:bg-slate-100/50 transition-all">
                                        <input
                                            type="checkbox"
                                            name="is_new"
                                            checked={Number(formData.is_new) === 1}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-xs font-bold text-slate-700">Hàng Mới Về</span>
                                    </label>
                                </div>
                            </div>

                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 text-sm">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-indigo-400"
                                >
                                    {submitting ? 'Đang lưu...' : 'Lưu lại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Dialog Quản lý ảnh phụ và biến thể */}
            {showExtraModal && selectedExtraProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Chi tiết sản phẩm</h3>
                                <p className="text-xs text-gray-500 font-semibold mt-0.5">{selectedExtraProduct.name}</p>
                            </div>
                            <button
                                onClick={() => setShowExtraModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-gray-100 px-6 bg-gray-50/50">
                            <button
                                onClick={() => setActiveExtraTab('images')}
                                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                                    activeExtraTab === 'images'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                🖼️ Quản lý ảnh phụ ({extraImages.length})
                            </button>
                            <button
                                onClick={() => setActiveExtraTab('variants')}
                                className={`px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                                    activeExtraTab === 'variants'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                ⚙️ Quản lý biến thể ({extraVariants.length})
                            </button>
                        </div>

                        {/* Body content scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {activeExtraTab === 'images' ? (
                                <div className="space-y-6">
                                    {/* Form add image */}
                                    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-4">
                                        <h4 className="text-sm font-bold text-gray-700">Thêm ảnh phụ mới</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            {/* File Picker */}
                                            <div className="flex flex-col items-center justify-center border border-dashed border-gray-300 hover:border-indigo-500 rounded-xl p-3 transition-all bg-white relative group cursor-pointer">
                                                {uploadingExtraFile ? (
                                                    <div className="text-center py-2">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-1"></div>
                                                        <span className="text-[10px] text-gray-500 font-semibold">Đang tải lên...</span>
                                                    </div>
                                                ) : (
                                                    <label className="cursor-pointer text-center w-full h-full flex flex-col items-center justify-center py-1.5">
                                                        <span className="text-[11px] font-bold text-gray-600 group-hover:text-indigo-600">Chọn ảnh từ máy tính</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleExtraImageUpload}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>

                                            {/* Link input */}
                                            <form onSubmit={handleAddExtraImageUrl} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newImageUrl}
                                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                                    placeholder="Hoặc dán URL ảnh phụ..."
                                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                                >
                                                    Thêm URL
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Image List */}
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                        {extraImages.length === 0 ? (
                                            <div className="col-span-full py-8 text-center text-gray-400 text-xs font-medium">
                                                Chưa có ảnh phụ nào được thêm cho sản phẩm này.
                                            </div>
                                        ) : (
                                            extraImages.map((img) => (
                                                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group shadow-sm bg-gray-50">
                                                    <img src={img.image_url} alt="Extra sub" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => handleDeleteExtraImage(img.id)}
                                                        className="absolute top-1.5 right-1.5 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                                        style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifycontent: 'center', fontSize: '9px' }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Form add variant */}
                                    <form onSubmit={handleAddVariant} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Màu sắc</label>
                                                <input
                                                    type="text"
                                                    name="color"
                                                    value={newVariantData.color}
                                                    onChange={handleVariantInputChange}
                                                    placeholder="Đen, Trắng..."
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Kích cỡ</label>
                                                <input
                                                    type="text"
                                                    name="size"
                                                    value={newVariantData.size}
                                                    onChange={handleVariantInputChange}
                                                    placeholder="S, M, L, 39, 40..."
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Giá phụ thu (nếu có)</label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={newVariantData.price}
                                                    onChange={handleVariantInputChange}
                                                    placeholder="Ví dụ: 20000"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Số lượng kho *</label>
                                                <input
                                                    type="number"
                                                    name="stock"
                                                    value={newVariantData.stock}
                                                    onChange={handleVariantInputChange}
                                                    required
                                                    placeholder="0"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload/Link for variant */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-t border-gray-100 pt-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Ảnh biến thể (tùy chọn)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        name="image"
                                                        value={newVariantData.image}
                                                        onChange={handleVariantInputChange}
                                                        placeholder="Dán URL ảnh hoặc click tải ảnh..."
                                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs bg-white"
                                                    />
                                                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center">
                                                        📁 Tải lên
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleVariantImageUpload}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                {newVariantData.image ? (
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                        <img src={getImageUrl(newVariantData.image)} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewVariantData(prev => ({ ...prev, image: '' }))}
                                                            className="absolute top-0.5 right-0.5 bg-rose-600 text-white rounded-full p-0.5 text-[8px] leading-none"
                                                        >✕</button>
                                                    </div>
                                                ) : (
                                                    <div className="text-[10px] text-gray-400 italic">Chưa chọn ảnh cho biến thể</div>
                                                )}
                                                
                                                <button
                                                    type="submit"
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                                >
                                                    Thêm biến thể
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Variant List Table */}
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-100 font-bold">
                                                    <th className="p-3 font-bold">ID</th>
                                                    <th className="p-3 font-bold">Hình ảnh</th>
                                                    <th className="p-3 font-bold">Màu sắc</th>
                                                    <th className="p-3 font-bold">Kích cỡ</th>
                                                    <th className="p-3 font-bold">Giá phụ thu</th>
                                                    <th className="p-3 font-bold">Tồn kho</th>
                                                    <th className="p-3 font-bold text-center">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-xs">
                                                {extraVariants.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" className="p-4 text-center text-gray-400">Chưa cấu hình biến thể nào cho sản phẩm.</td>
                                                    </tr>
                                                ) : (
                                                    extraVariants.map((v) => (
                                                        <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="p-3 text-gray-400">#{v.id}</td>
                                                            <td className="p-3">
                                                                {v.image ? (
                                                                    <img src={getImageUrl(v.image)} className="w-8 h-8 object-cover rounded-md border border-gray-100 shadow-sm" />
                                                                ) : (
                                                                    <span className="text-gray-400 italic text-[10px]">Không có</span>
                                                                )}
                                                            </td>
                                                            <td className="p-3 font-semibold text-gray-700">{v.color || '-'}</td>
                                                            <td className="p-3 font-semibold text-gray-700">{v.size || '-'}</td>
                                                            <td className="p-3 text-rose-600 font-bold">
                                                                {v.price ? `${Number(v.price).toLocaleString('vi-VN')} đ` : 'Dùng giá gốc'}
                                                            </td>
                                                            <td className="p-3 text-gray-700 font-medium">{v.stock} sản phẩm</td>
                                                            <td className="p-3 text-center">
                                                                <button
                                                                    onClick={() => handleDeleteVariant(v.id)}
                                                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer"
                                                                >
                                                                    Xóa
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowExtraModal(false)}
                                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                            >
                                Đóng lại
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}