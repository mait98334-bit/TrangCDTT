'use client';
import { useState, useEffect } from 'react';
import { UserService } from '@/services/userService';

export default function AdminUserPage() {
    const [users, setUsers] = useState([]);
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
        email: '',
        password: '',
        role: 'customer'
    });

    const loadUsers = async () => {
        setLoading(true);
        const res = await UserService.getAllAdmin();
        if (res.success) {
            setUsers(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Mở modal Thêm
    const handleOpenAdd = () => {
        setModalType('add');
        setFormData({
            id: '',
            name: '',
            email: '',
            password: '',
            role: 'customer'
        });
        setShowModal(true);
    };

    // Mở modal Sửa
    const handleOpenEdit = (user) => {
        setModalType('edit');
        setFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '', // Rỗng để giữ nguyên mật khẩu cũ trừ khi nhập mới
            role: user.role || 'customer'
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý Gửi form Thêm/Sửa
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert('Vui lòng nhập tên và email!');
            return;
        }

        if (modalType === 'add' && !formData.password) {
            alert('Vui lòng nhập mật khẩu cho tài khoản mới!');
            return;
        }

        setSubmitting(true);
        const endpoint = modalType === 'add' ? '/users' : `/users/${formData.id}`;
        const method = modalType === 'add' ? 'POST' : 'PUT';

        const bodyData = {
            name: formData.name,
            email: formData.email,
            role: formData.role
        };

        if (formData.password) {
            bodyData.password = formData.password;
        }

        const res = modalType === 'add'
            ? await UserService.create(bodyData)
            : await UserService.update(formData.id, bodyData);

        setSubmitting(false);

        if (res.success) {
            alert(modalType === 'add' ? 'Tạo tài khoản mới thành công!' : 'Cập nhật tài khoản thành công!');
            setShowModal(false);
            loadUsers();
        } else {
            alert(res.message || 'Thao tác thất bại!');
        }
    };

    // Xử lý Xóa mềm tài khoản
    const handleDeleteUser = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này? Tài khoản sẽ tạm thời bị khóa và chuyển vào Thùng rác.')) return;

        const res = await UserService.delete(id);

        if (res.success) {
            alert('Đã vô hiệu hóa tài khoản và chuyển vào Thùng rác!');
            loadUsers();
        } else {
            alert(res.message || 'Khóa tài khoản thất bại!');
        }
    };

    // Xử lý khôi phục tài khoản
    const handleRestoreUser = async (id) => {
        const res = await UserService.restore(id);

        if (res.success) {
            alert('Khôi phục tài khoản thành công!');
            loadUsers();
        } else {
            alert(res.message || 'Khôi phục tài khoản thất bại!');
        }
    };

    // Xử lý xóa vĩnh viễn tài khoản
    const handleHardDeleteUser = async (id) => {
        if (!confirm('CẢNH BÁO CỰC KỲ QUAN TRỌNG: Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này? Mọi thông tin đơn hàng, đánh giá liên quan đến tài khoản này cũng có thể bị ảnh hưởng. Thao tác này KHÔNG THỂ HOÀN TÁC!')) return;

        const res = await UserService.hardDelete(id);

        if (res.success) {
            alert('Đã xóa vĩnh viễn tài khoản khỏi hệ thống!');
            loadUsers();
        } else {
            alert(res.message || 'Xóa vĩnh viễn tài khoản thất bại!');
        }
    };

    // Style cho badge vai trò
    const getRoleBadgeClass = (role) => {
        if (role === 'admin') {
            return 'bg-purple-50 text-purple-700 border-purple-100';
        }
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách tài khoản...</div>;

    const filteredUsers = users.filter(u => activeTab === 'active' ? !u.is_deleted : u.is_deleted);

    // Phân trang
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Tài khoản</h1>
                    <p className="text-sm text-gray-500 mt-1">Quản lý phân quyền và người dùng trong hệ thống</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                    <span>+ Thêm tài khoản mới</span>
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
                    📦 Hoạt động ({users.filter(u => !u.is_deleted).length})
                </button>
                <button
                    onClick={() => { setActiveTab('trash'); setCurrentPage(1); }}
                    className={`pb-3 font-semibold px-2 cursor-pointer transition-all border-b-2 ${
                        activeTab === 'trash'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    🗑️ Vô hiệu hóa ({users.filter(u => u.is_deleted).length})
                </button>
            </div>

            {/* Bảng danh sách tài khoản */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100 font-bold">
                            <th className="p-4 font-bold text-slate-800">ID</th>
                            <th className="p-4 font-bold text-slate-800">Họ và tên</th>
                            <th className="p-4 font-bold text-slate-800">Email</th>
                            <th className="p-4 font-bold text-slate-800">Vai trò</th>
                            <th className="p-4 font-bold text-slate-800">Ngày tạo</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">
                                    {activeTab === 'trash' ? 'Không có tài khoản nào bị vô hiệu hóa.' : 'Chưa có người dùng nào.'}
                                </td>
                            </tr>
                        ) : (
                            currentUsers.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-medium">#{item.id}</td>
                                    <td className="p-4 font-bold text-gray-800">{item.name}</td>
                                    <td className="p-4 text-gray-600">{item.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-md font-semibold text-xs border uppercase tracking-wider ${getRoleBadgeClass(item.role)}`}>
                                            {item.role || 'customer'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1.5">
                                            {activeTab === 'trash' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRestoreUser(item.id)}
                                                        className="bg-green-50 hover:bg-green-100 text-green-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        🔄 Mở khóa
                                                    </button>
                                                    <button
                                                        onClick={() => handleHardDeleteUser(item.id)}
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
                                                        onClick={() => handleDeleteUser(item.id)}
                                                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Khóa
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
                    {filteredUsers.length === 0 ? (
                        <span>Không có tài khoản nào để hiển thị</span>
                    ) : (
                        <span>
                            Hiển thị <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> -{' '}
                            <span className="font-semibold text-gray-800">{Math.min(indexOfLastItem, filteredUsers.length)}</span> trên{' '}
                            <span className="font-semibold text-gray-800">{filteredUsers.length}</span> tài khoản
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || filteredUsers.length === 0}
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
                        disabled={currentPage === totalPages || filteredUsers.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang sau
                    </button>
                </div>
            </div>

            {/* Modal dialog Thêm/Sửa */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">
                                {modalType === 'add' ? 'Thêm tài khoản mới' : 'Cập nhật tài khoản'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email liên hệ *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="email@example.com"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    {modalType === 'add' ? 'Mật khẩu đăng nhập *' : 'Mật khẩu mới (để trống nếu giữ nguyên)'}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={modalType === 'add'}
                                    placeholder="Nhập mật khẩu..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vai trò hệ thống</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white"
                                >
                                    <option value="customer">Khách hàng (customer)</option>
                                    <option value="admin">Quản trị viên (admin)</option>
                                </select>
                            </div>

                            {/* Buttons */}
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
