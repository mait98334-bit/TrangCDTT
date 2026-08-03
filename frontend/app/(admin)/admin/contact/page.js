'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/apiService';

export default function AdminContactPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const loadContacts = async () => {
        setLoading(true);
        const res = await fetchApi('/contacts');
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

    // Xóa liên hệ
    const handleDeleteContact = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tin nhắn liên hệ này? Thao tác này không thể hoàn tác.')) return;

        const res = await fetchApi(`/contacts/${id}`, {
            method: 'DELETE'
        });

        if (res.success) {
            alert('Xóa liên hệ thành công!');
            loadContacts();
        } else {
            alert(res.message || 'Xóa liên hệ thất bại!');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải danh sách liên hệ...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Liên hệ</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách ý kiến phản hồi, tin nhắn từ khách hàng gửi qua Storefront</p>
                </div>
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
                        {contacts.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-6 text-center text-gray-500">Chưa nhận được tin nhắn liên hệ nào.</td>
                            </tr>
                        ) : (
                            contacts.map((item) => (
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
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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
