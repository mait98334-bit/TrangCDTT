'use client';
import { useState, useEffect } from 'react';
import { BrandService } from '@/services/brandService';

export default function AdminBrandPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('active'); // 'active' hoặc 'trash'
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add'); // 'add' hoặc 'edit'
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        slug: ''
    });

    // Load danh sách thương hiệu từ backend
    const loadBrands = async () => {
        setLoading(true);
        const res = await BrandService.getAllAdmin();
        if (res.success) {
            setBrands(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadBrands();
    }, []);

    // Mở modal Thêm
    const handleOpenAdd = () => {
        setModalType('add');
        setFormData({
            id: '',
            name: '',
            slug: ''
        });
        setShowModal(true);
    };

    // Mở modal Sửa
    const handleOpenEdit = (brand) => {
        setModalType('edit');
        setFormData({
            id: brand.id,
            name: brand.name,
            slug: brand.slug || ''
        });
        setShowModal(true);
    };

    // Tự động tạo slug khi đổi tên
    const handleNameChange = (e) => {
        const nameVal = e.target.value;
        const slugVal = nameVal
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/([^0-9a-z-\s])/g, '')
            .replace(/(\s+)/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        setFormData((prev) => ({
            ...prev,
            name: nameVal,
            slug: slugVal
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý Thêm/Sửa thương hiệu
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            alert('Vui lòng điền tên thương hiệu!');
            return;
        }

        setSubmitting(true);
        const payload = {
            name: formData.name,
            slug: formData.slug
        };
        const res = modalType === 'add'
            ? await BrandService.create(payload)
            : await BrandService.update(formData.id, payload);

        setSubmitting(false);

        if (res.success) {
            alert(modalType === 'add' ? 'Thêm thương hiệu thành công!' : 'Cập nhật thương hiệu thành công!');
            setShowModal(false);
            loadBrands();
        } else {
            alert(res.message || 'Thao tác thất bại!');
        }
    };

    // Xử lý xóa mềm thương hiệu
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn đưa thương hiệu này vào thùng rác?')) return;

        const res = await BrandService.delete(id);

        if (res.success) {
            alert('Đã chuyển thương hiệu vào Thùng rác!');
            loadBrands();
        } else {
            alert(res.message || 'Xóa thất bại!');
        }
    };

    // Xử lý khôi phục thương hiệu
    const handleRestore = async (id) => {
        const res = await BrandService.restore(id);

        if (res.success) {
            alert('Khôi phục thương hiệu thành công!');
            loadBrands();
        } else {
            alert(res.message || 'Khôi phục thất bại!');
        }
    };

    // Xử lý xóa vĩnh viễn thương hiệu
    const handleHardDelete = async (id) => {
        if (!confirm('CẢNH BÁO: Bạn có chắc muốn xóa vĩnh viễn thương hiệu này? Thao tác này sẽ xóa sạch thương hiệu khỏi database và KHÔNG thể hoàn tác!')) return;

        const res = await BrandService.hardDelete(id);

        if (res.success) {
            alert('Đã xóa vĩnh viễn thương hiệu khỏi hệ thống!');
            loadBrands();
        } else {
            alert(res.message || 'Xóa vĩnh viễn thất bại!');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách thương hiệu...</div>;

    const filteredBrands = brands.filter(b => activeTab === 'active' ? !b.is_deleted : b.is_deleted);

    // Phân trang
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Thương hiệu</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách nhãn hàng thời trang đối tác trong hệ thống</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                    <span>+ Thêm thương hiệu mới</span>
                </button>
            </div>

            {/* Tab điều hướng */}
            <div className="flex gap-4 border-b border-gray-200 mb-6 text-sm">
                <button
                    onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
                    className={`pb-3 font-semibold px-2 cursor-pointer transition-all border-b-2 ${
                        activeTab === 'active'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    📦 Hoạt động ({brands.filter(b => !b.is_deleted).length})
                </button>
                <button
                    onClick={() => { setActiveTab('trash'); setCurrentPage(1); }}
                    className={`pb-3 font-semibold px-2 cursor-pointer transition-all border-b-2 ${
                        activeTab === 'trash'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    🗑️ Thùng rác ({brands.filter(b => b.is_deleted).length})
                </button>
            </div>

            {/* Bảng */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100 font-bold">
                            <th className="p-4 font-bold text-slate-800">ID</th>
                            <th className="p-4 font-bold text-slate-800">Tên thương hiệu</th>
                            <th className="p-4 font-bold text-slate-800">Đường dẫn thân thiện (Slug)</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {currentBrands.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-6 text-center text-gray-500">
                                    {activeTab === 'trash' ? 'Thùng rác trống.' : 'Chưa có thương hiệu nào.'}
                                </td>
                            </tr>
                        ) : (
                            currentBrands.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-medium">#{item.id}</td>
                                    <td className="p-4 font-bold text-amber-600">{item.name}</td>
                                    <td className="p-4 text-gray-600">{item.slug}</td>
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
                    {filteredBrands.length === 0 ? (
                        <span>Không có thương hiệu nào để hiển thị</span>
                    ) : (
                        <span>
                            Hiển thị <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> -{' '}
                            <span className="font-semibold text-gray-800">{Math.min(indexOfLastItem, filteredBrands.length)}</span> trên{' '}
                            <span className="font-semibold text-gray-800">{filteredBrands.length}</span> thương hiệu
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || filteredBrands.length === 0}
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
                        disabled={currentPage === totalPages || filteredBrands.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang sau
                    </button>
                </div>
            </div>

            {/* Modal Dialog */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {modalType === 'add' ? 'Thêm thương hiệu mới' : 'Cập nhật thương hiệu'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên thương hiệu *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    required
                                    placeholder="Ví dụ: Nike"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Đường dẫn thân thiện (Slug)</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    placeholder="nike"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-gray-50/50"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3 text-sm">
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
                                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer disabled:bg-indigo-400"
                                >
                                    {submitting ? 'Đang lưu...' : 'Lưu lại'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
