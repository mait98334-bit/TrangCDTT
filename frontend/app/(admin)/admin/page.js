'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/services/apiService';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        productsCount: 0,
        ordersCount: 0,
        usersCount: 0,
        contactsCount: 0,
        revenue: 0,
    });
    const [orderStatusBreakdown, setOrderStatusBreakdown] = useState({});
    const [salesData, setSalesData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentContacts, setRecentContacts] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            const [productsRes, ordersRes, contactsRes, usersRes] = await Promise.all([
                fetchApi('/products'),
                fetchApi('/orders'),
                fetchApi('/contacts'),
                fetchApi('/users')
            ]);

            const products = productsRes.success ? productsRes.data : [];
            const orders = ordersRes.success ? ordersRes.data : [];
            const contacts = contactsRes.success ? contactsRes.data : [];
            const users = usersRes.success ? usersRes.data : [];

            // Tính tổng doanh thu từ các đơn hàng (không tính đơn đã hủy)
            const totalRevenue = orders
                .filter(order => order.status?.toLowerCase() !== 'cancelled')
                .reduce((sum, order) => sum + Number(order.total_price), 0);

            // Thống kê số lượng đơn theo trạng thái
            const breakdown = orders.reduce((acc, order) => {
                const status = order.status || 'Pending';
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});

            // Tính toán doanh thu 7 ngày gần nhất
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d;
            }).reverse();

            const salesByDay = last7Days.map(date => {
                const dayLabel = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                const dayOrders = orders.filter(order => {
                    const orderDate = new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                    return orderDate === dayLabel && order.status?.toLowerCase() !== 'cancelled';
                });
                const total = dayOrders.reduce((sum, order) => sum + Number(order.total_price), 0);
                return { day: dayLabel, total };
            });

            setStats({
                productsCount: products.length,
                ordersCount: orders.length,
                usersCount: users.length,
                contactsCount: contacts.length,
                revenue: totalRevenue,
            });
            setOrderStatusBreakdown(breakdown);
            setSalesData(salesByDay);

            // Sort and slice for recent items
            const sortedOrders = [...orders]
                .sort((a, b) => b.id - a.id)
                .slice(0, 5);

            const sortedContacts = [...contacts]
                .sort((a, b) => b.id - a.id)
                .slice(0, 4);

            const sortedUsers = [...users]
                .sort((a, b) => b.id - a.id)
                .slice(0, 4);

            setRecentOrders(sortedOrders);
            setRecentContacts(sortedContacts);
            setRecentUsers(sortedUsers);
            setLoading(false);
        }
        fetchDashboardData();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'delivered':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'processing':
            case 'shipping':
                return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-100';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Đang tải trang tổng quan...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trang Tổng Quan (Dashboard)</h1>
                    <p className="text-sm text-slate-500 mt-1">Hệ thống quản lý thông tin cửa hàng Trang Store</p>
                </div>
                <div className="flex items-center gap-2.5 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-2xl border border-emerald-100 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Hệ Thống Ổn Định
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doanh thu</span>
                        <h3 className="text-base font-black text-indigo-600 leading-tight">{formatPrice(stats.revenue)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">💰</div>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sản phẩm</span>
                        <h3 className="text-2xl font-black text-slate-800">{stats.productsCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">📦</div>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đơn hàng</span>
                        <h3 className="text-2xl font-black text-slate-800">{stats.ordersCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">🛍️</div>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Liên hệ</span>
                        <h3 className="text-2xl font-black text-slate-800">{stats.contactsCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">💬</div>
                </div>

                <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tài khoản</span>
                        <h3 className="text-2xl font-black text-slate-800">{stats.usersCount}</h3>
                    </div>
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">👤</div>
                </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Columns (2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Revenue Trend Chart */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Biểu đồ doanh thu</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Doanh thu cửa hàng trong 7 ngày gần đây</p>
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                                7 Ngày Qua
                            </span>
                        </div>

                        <div className="h-44 flex items-end gap-4 pt-6 border-b border-slate-100 pb-2">
                            {salesData.map(({ day, total }) => {
                                const maxTotal = Math.max(...salesData.map(s => s.total), 1);
                                const heightPercentage = (total / maxTotal) * 100;
                                return (
                                    <div key={day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                                        {/* Tooltip on hover */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded absolute -top-8 font-bold pointer-events-none shadow-lg z-10 whitespace-nowrap">
                                            {formatPrice(total)}
                                        </div>
                                        {/* Bar */}
                                        <div
                                            style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                                            className={`w-full rounded-t-lg transition-all duration-500 cursor-pointer ${
                                                total > 0
                                                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100'
                                                    : 'bg-slate-100 hover:bg-slate-200'
                                            }`}
                                        ></div>
                                        {/* Day label */}
                                        <span className="text-[10px] font-bold text-slate-400 mt-1">{day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Orders table */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Đơn hàng mới nhất</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Danh sách các đơn đặt hàng vừa phát sinh</p>
                            </div>
                            <Link href="/admin/order" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                                Xem tất cả
                            </Link>
                        </div>
                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Chưa có đơn hàng nào phát sinh.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                                            <th className="py-4 px-6">Mã Đơn</th>
                                            <th className="py-4 px-6">Khách Hàng</th>
                                            <th className="py-4 px-6">Ngày Tạo</th>
                                            <th className="py-4 px-6">Tổng Tiền</th>
                                            <th className="py-4 px-6 text-center">Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-4 px-6 font-bold text-slate-900">#ORD-{order.id}</td>
                                                <td className="py-4 px-6 text-slate-600">{order.fullname}</td>
                                                <td className="py-4 px-6 text-slate-400 text-xs">{formatDate(order.created_at)}</td>
                                                <td className="py-4 px-6 font-bold text-slate-700">{formatPrice(order.total_price)}</td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase ${getStatusColor(order.status)}`}>
                                                        {order.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Recent Contact messages */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Liên hệ phản hồi mới</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Ý kiến đóng góp và thắc mắc từ khách hàng</p>
                            </div>
                            <Link href="/admin/contact" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                                Xem tất cả
                            </Link>
                        </div>
                        {recentContacts.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">Chưa có liên hệ phản hồi nào.</div>
                        ) : (
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentContacts.map((contact) => (
                                    <div key={contact.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30 flex flex-col justify-between space-y-3 hover:border-slate-200 transition-colors">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-extrabold text-slate-800 text-sm">{contact.name}</h4>
                                                <span className="text-[10px] font-bold text-slate-400">{formatDate(contact.created_at)}</span>
                                            </div>
                                            <p className="text-xs text-slate-400">{contact.email}</p>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                            &ldquo;{contact.message}&rdquo;
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (1/3 width on large screens) */}
                <div className="space-y-8">
                    {/* Quick actions panel */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">Thao tác nhanh</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <Link href="/admin/product" className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 text-indigo-950 transition-colors">
                                <span className="text-xl">➕</span>
                                <div className="text-left">
                                    <h4 className="text-xs font-black">Thêm sản phẩm</h4>
                                    <p className="text-[10px] text-indigo-500 mt-0.5">Cập nhật sản phẩm thời trang mới</p>
                                </div>
                            </Link>

                            <Link href="/admin/order" className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/50 text-emerald-950 transition-colors">
                                <span className="text-xl">📋</span>
                                <div className="text-left">
                                    <h4 className="text-xs font-black">Duyệt đơn hàng</h4>
                                    <p className="text-[10px] text-emerald-500 mt-0.5">Xem trạng thái đơn và giao nhận</p>
                                </div>
                            </Link>

                            <Link href="/admin/contact" className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-100/50 text-amber-950 transition-colors">
                                <span className="text-xl">✉️</span>
                                <div className="text-left">
                                    <h4 className="text-xs font-black">Xem hộp thư phản hồi</h4>
                                    <p className="text-[10px] text-amber-500 mt-0.5">Tương tác trực tiếp với khách hàng</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Registered Users */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">Tài khoản mới nhất</h3>
                            <Link href="/admin/user" className="text-xs font-bold text-indigo-600 hover:underline">
                                Xem thêm
                            </Link>
                        </div>
                        {recentUsers.length === 0 ? (
                            <div className="text-center text-slate-400 text-xs py-4">Chưa có tài khoản nào đăng ký.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                                        <div className="space-y-0.5">
                                            <h4 className="text-xs font-bold text-slate-800">{user.name}</h4>
                                            <p className="text-[10px] text-slate-400">{user.email}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                                            user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Status Analysis */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">Phân tích đơn hàng</h3>
                        {stats.ordersCount === 0 ? (
                            <div className="text-center text-slate-400 text-xs py-4">Chưa có đơn hàng để phân tích.</div>
                        ) : (
                            <div className="space-y-4">
                                {Object.entries(orderStatusBreakdown).map(([status, count]) => {
                                    const percentage = stats.ordersCount > 0 ? (count / stats.ordersCount) * 100 : 0;
                                    let progressColor = 'bg-indigo-500';
                                    let textColor = 'text-indigo-600';
                                    let bgColor = 'bg-indigo-50';

                                    if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'delivered') {
                                        progressColor = 'bg-emerald-500';
                                        textColor = 'text-emerald-600';
                                        bgColor = 'bg-emerald-50';
                                    } else if (status.toLowerCase() === 'pending') {
                                        progressColor = 'bg-amber-500';
                                        textColor = 'text-amber-600';
                                        bgColor = 'bg-amber-50';
                                    } else if (status.toLowerCase() === 'cancelled') {
                                        progressColor = 'bg-rose-500';
                                        textColor = 'text-rose-600';
                                        bgColor = 'bg-rose-50';
                                    }

                                    return (
                                        <div key={status} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-xs font-semibold">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border border-current ${textColor} ${bgColor}`}>
                                                    {status}
                                                </span>
                                                <span className="text-slate-800 font-bold">{count} đơn ({percentage.toFixed(0)}%)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* System Info */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                        <h3 className="text-lg font-bold text-slate-800">Trạng thái hệ thống</h3>
                        <div className="space-y-3.5 text-xs text-slate-600">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Database (MySQL)</span>
                                <span className="font-bold text-emerald-600">Kết nối tốt ✅</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Node.js (Backend)</span>
                                <span className="font-bold text-emerald-600">Hoạt động ✅</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Next.js (Frontend)</span>
                                <span className="font-bold text-emerald-600">Hoạt động ✅</span>
                            </div>
                            <div className="pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                                Toàn bộ cổng kết nối API và cơ sở dữ liệu đã đồng bộ hoàn hảo, sẵn sàng hỗ trợ demo và bảo vệ đồ án!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}