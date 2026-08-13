'use client';
import { useState, useEffect } from 'react';
import { ContactService } from '@/services/contactService';

export default function AdminContactPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active'); // 'active' hoặc 'trash'
    const [currentPage, setCurrentPage] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const loadContacts = async () => {
        setLoading(true);
        const res = await ContactService.getAllAdmin();
        if (res.success) {
            setContacts(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadContacts();
    }, []);

    // Mở modal xem chi tiết tin nhắn liên hệ
    const handleOpenDetails = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    // Xóa mềm liên hệ
    const handleDeleteContact = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn đưa tin nhắn liên hệ này vào thùng rác?')) return;

        const res = await ContactService.delete(id);

        if (res.success) {
            alert('Đã chuyển liên hệ vào Thùng rác!');
            loadContacts();
        } else {
            alert(res.message || 'Xóa liên hệ thất bại!');
        }
    };

    // Khôi phục liên hệ đã xóa mềm
    const handleRestoreContact = async (id) => {
        const res = await ContactService.restore(id);

        if (res.success) {
            alert('Khôi phục liên hệ thành công!');
            loadContacts();
        } else {
            alert(res.message || 'Khôi phục liên hệ thất bại!');
        }
    };

    // Xóa vĩnh viễn liên hệ khỏi database
    const handleHardDeleteContact = async (id) => {
        if (!confirm('CẢNH BÁO: Bạn có chắc muốn xóa vĩnh viễn tin nhắn liên hệ này? Thao tác này sẽ xóa sạch bản ghi khỏi database và KHÔNG thể hoàn tác!')) return;

        const res = await ContactService.hardDelete(id);

        if (res.success) {
            alert('Đã xóa vĩnh viễn liên hệ khỏi hệ thống!');
            loadContacts();
        } else {
            alert(res.message || 'Xóa vĩnh viễn thất bại!');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách liên hệ...</div>;

    const filteredContacts = contacts.filter(c => activeTab === 'active' ? !c.is_deleted : c.is_deleted);

    // Phân trang
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Liên hệ</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách ý kiến phản hồi, tin nhắn từ khách hàng gửi qua Storefront</p>
                </div>
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
                    📦 Hoạt động ({contacts.filter(c => !c.is_deleted).length})
                </button>
                <button
                    onClick={() => { setActiveTab('trash'); setCurrentPage(1); }}
                    className={`pb-3 font-semibold px-2 cursor-pointer transition-all border-b-2 ${
                        activeTab === 'trash'
                            ? 'border-rose-600 text-rose-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    🗑️ Thùng rác ({contacts.filter(c => c.is_deleted).length})
                </button>
            </div>

            {/* Bảng danh sách liên hệ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider border-b border-gray-100 font-bold">
                            <th className="p-4 font-bold text-slate-800">ID</th>
                            <th className="p-4 font-bold text-slate-800">Khách hàng</th>
                            <th className="p-4 font-bold text-slate-800">Email</th>
                            <th className="p-4 font-bold text-slate-800">Số điện thoại</th>
                            <th className="p-4 font-bold text-slate-800">Nội dung liên hệ</th>
                            <th className="p-4 font-bold text-slate-800">Ngày gửi</th>
                            <th className="p-4 font-bold text-slate-800 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {currentContacts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-gray-500">
                                    {activeTab === 'trash' ? 'Thùng rác trống.' : 'Chưa nhận được tin nhắn liên hệ nào.'}
                                </td>
                            </tr>
                        ) : (
                            currentContacts.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-gray-500 font-medium">#{item.id}</td>
                                    <td className="p-4 font-bold text-gray-800">{item.name}</td>
                                    <td className="p-4 text-gray-600">{item.email}</td>
                                    <td className="p-4 text-gray-600">{item.phone || 'Chưa cung cấp'}</td>
                                    <td className="p-4 text-gray-500 max-w-[200px] truncate">{item.message}</td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1.5">
                                            {activeTab === 'trash' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRestoreContact(item.id)}
                                                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Khôi phục
                                                    </button>
                                                    <button
                                                        onClick={() => handleHardDeleteContact(item.id)}
                                                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Xóa vĩnh viễn
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleOpenDetails(item)}
                                                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2.5 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                                                    >
                                                        Chi tiết
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteContact(item.id)}
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
                    {filteredContacts.length === 0 ? (
                        <span>Không có liên hệ nào để hiển thị</span>
                    ) : (
                        <span>
                            Hiển thị <span className="font-semibold text-gray-800">{indexOfFirstItem + 1}</span> -{' '}
                            <span className="font-semibold text-gray-800">{Math.min(indexOfLastItem, filteredContacts.length)}</span> trên{' '}
                            <span className="font-semibold text-gray-800">{filteredContacts.length}</span> liên hệ
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1 || filteredContacts.length === 0}
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
                        disabled={currentPage === totalPages || filteredContacts.length === 0}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                    >
                        Trang sau
                    </button>
                </div>
            </div>

            {/* Modal Chi tiết tin nhắn liên hệ */}
            {showModal && selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Tin nhắn liên hệ #{selectedContact.id}</h3>
                                <p className="text-xs text-gray-500 font-semibold mt-0.5">Gửi lúc: {new Date(selectedContact.created_at).toLocaleString('vi-VN')}</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400">Khách hàng</span>
                                    <span className="font-bold text-gray-800">{selectedContact.name}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-semibold text-gray-400">Số điện thoại</span>
                                    <span className="font-bold text-gray-800">{selectedContact.phone || 'Chưa cung cấp'}</span>
                                </div>
                                <div className="col-span-2 pt-2 border-t border-gray-100">
                                    <span className="block text-xs font-semibold text-gray-400">Email liên hệ</span>
                                    <span className="font-bold text-indigo-600">{selectedContact.email}</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nội dung tin nhắn</span>
                                <div className="p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl text-gray-700 leading-relaxed italic whitespace-pre-line">
                                    "{selectedContact.message}"
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
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
