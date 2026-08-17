'use client';
import { useState, useEffect, useRef } from 'react';
import { ChatService } from '@/services/chatService';

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [senderName, setSenderName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showBubble, setShowBubble] = useState(false);

    const chatEndRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    // 1. Khởi tạo phiên chat (Session)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            let activeSessionId = '';
            let activeSenderName = '';

            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    activeSessionId = `user_${user.id}`;
                    activeSenderName = user.fullname || user.name || 'Khách hàng thành viên';
                } catch (e) {
                    console.error('Lỗi đọc user cho chat:', e);
                }
            }

            // Nếu không đăng nhập, kiểm tra session vãng lai
            if (!activeSessionId) {
                let guestId = localStorage.getItem('chat_guest_id');
                if (!guestId) {
                    guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                    localStorage.setItem('chat_guest_id', guestId);
                }
                activeSessionId = guestId;
                activeSenderName = `Khách hàng #${guestId.split('_')[2] || 'Vãng lai'}`;
            }

            setSessionId(activeSessionId);
            setSenderName(activeSenderName);
            setShowBubble(true);
        }
    }, []);

    // 2. Cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // 3. Tải tin nhắn
    const loadMessages = async (showLoading = false) => {
        if (!sessionId) return;
        if (showLoading) setLoading(true);

        const res = await ChatService.getMessages(sessionId);
        if (res.success) {
            setMessages(res.data);
        }

        if (showLoading) setLoading(false);
    };

    // 4. Bắt đầu/dừng Polling tin nhắn mới
    useEffect(() => {
        if (isOpen && sessionId) {
            loadMessages(true); // Load ngay khi mở

            // Thiết lập vòng lặp tải tin nhắn sau mỗi 3 giây
            pollingIntervalRef.current = setInterval(() => {
                loadMessages(false);
            }, 3000);
        } else {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        }

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, [isOpen, sessionId]);

    // 5. Gửi tin nhắn
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !sessionId) return;

        const msgContent = newMessage;
        setNewMessage(''); // Xóa nhanh input

        // Gửi lên backend
        const res = await ChatService.sendMessage({
            session_id: sessionId,
            sender_name: senderName,
            message: msgContent,
            is_admin: false
        });

        if (res.success) {
            // Cập nhật giao diện lập tức
            setMessages(prev => [...prev, res.data]);
        }
    };

    if (!showBubble) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* 1. Nút bong bóng Chat nổi */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer relative group"
                    title="Tư vấn trực tuyến"
                >
                    💬
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
                    {/* Tooltip */}
                    <span className="absolute right-16 scale-0 group-hover:scale-100 bg-slate-800 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl transition-all whitespace-nowrap shadow-md">
                        Hỗ trợ trực tuyến!
                    </span>
                </button>
            )}

            {/* 2. Hộp thoại Chat */}
            {isOpen && (
                <div className="w-80 sm:w-96 h-[480px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-4 flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2.5">
                            <span className="text-xl">💬</span>
                            <div>
                                <h3 className="font-extrabold text-sm tracking-tight leading-tight">Trang Store - Hỗ trợ</h3>
                                <p className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                                    <span>Đang online (Phản hồi ngay)</span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white font-bold text-base cursor-pointer w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                        {loading && messages.length === 0 ? (
                            <div className="flex justify-center items-center h-full text-xs text-slate-400">
                                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang kết nối tư vấn...
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-10 px-4 space-y-3">
                                <div className="text-3xl">👋</div>
                                <p className="text-xs font-bold text-slate-700">Xin chào!</p>
                                <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                                    Bạn cần tìm size, tư vấn phối đồ hay thắc mắc về đơn hàng? Hãy nhắn tin ngay để shop tư vấn nhé!
                                </p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isMe = !msg.is_admin;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                                                isMe
                                                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                                            }`}
                                        >
                                            {msg.message}
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1 px-1">
                                            {new Date(msg.created_at).toLocaleTimeString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center">
                        <input
                            type="text"
                            required
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:shadow-none cursor-pointer flex items-center justify-center"
                        >
                            🚀
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
