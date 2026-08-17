'use client';
import { useState, useEffect, useRef } from 'react';
import { ChatService } from '@/services/chatService';

export default function AdminChatPage() {
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState('');
    const [selectedSessionName, setSelectedSessionName] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const chatEndRef = useRef(null);
    const sessionsPollingRef = useRef(null);
    const messagesPollingRef = useRef(null);

    // Phát sự kiện hiển thị Toast
    const showToast = (message, type = 'success') => {
        window.dispatchEvent(new CustomEvent('showToast', {
            detail: { message, type }
        }));
    };

    // 1. Tải danh sách các cuộc hội thoại
    const loadSessions = async (showLoading = false) => {
        if (showLoading) setLoadingSessions(true);
        const res = await ChatService.getSessions();
        if (res.success) {
            setSessions(res.data);
        }
        if (showLoading) setLoadingSessions(false);
    };

    // 2. Tải lịch sử tin nhắn của cuộc hội thoại đang chọn
    const loadMessages = async (sessionId, showLoading = false) => {
        if (!sessionId) return;
        if (showLoading) setLoadingMessages(true);

        const res = await ChatService.getMessages(sessionId);
        if (res.success) {
            setMessages(res.data);
        }

        if (showLoading) setLoadingMessages(false);
    };

    // 3. Khởi tạo Polling danh sách hội thoại
    useEffect(() => {
        loadSessions(true);

        // Polling danh sách chat mới sau mỗi 5 giây
        sessionsPollingRef.current = setInterval(() => {
            loadSessions(false);
        }, 5000);

        return () => {
            if (sessionsPollingRef.current) {
                clearInterval(sessionsPollingRef.current);
            }
        };
    }, []);

    // 4. Khởi tạo/thay đổi Polling tin nhắn phòng chat đang chọn
    useEffect(() => {
        if (selectedSessionId) {
            loadMessages(selectedSessionId, true);

            // Xóa interval cũ nếu có
            if (messagesPollingRef.current) {
                clearInterval(messagesPollingRef.current);
            }

            // Polling tin nhắn mới sau mỗi 2 giây
            messagesPollingRef.current = setInterval(() => {
                loadMessages(selectedSessionId, false);
            }, 2000);
        } else {
            setMessages([]);
            if (messagesPollingRef.current) {
                clearInterval(messagesPollingRef.current);
            }
        }

        return () => {
            if (messagesPollingRef.current) {
                clearInterval(messagesPollingRef.current);
            }
        };
    }, [selectedSessionId]);

    // 5. Tự động cuộn xuống dưới cùng khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 6. Admin gửi tin nhắn phản hồi
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedSessionId) return;

        const msgContent = newMessage;
        setNewMessage(''); // Xóa nhanh input

        const res = await ChatService.sendMessage({
            session_id: selectedSessionId,
            sender_name: 'Admin Store',
            message: msgContent,
            is_admin: true
        });

        if (res.success) {
            setMessages(prev => [...prev, res.data]);
            // Tải lại danh sách session để cập nhật tin nhắn mới nhất hiển thị ngoài danh sách
            loadSessions(false);
        } else {
            showToast('Không thể gửi tin nhắn. Vui lòng thử lại!', 'error');
        }
    };

    // Chọn một cuộc hội thoại từ danh sách bên trái
    const handleSelectSession = (session) => {
        setSelectedSessionId(session.session_id);
        setSelectedSessionName(session.sender_name);
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col">
            {/* Header */}
            <div className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-800">Tư vấn trực tuyến (Live Chat)</h1>
                <p className="text-sm text-gray-500 mt-1">Trò chuyện, hỗ trợ và phản hồi thắc mắc của khách hàng trong thời gian thực</p>
            </div>

            {/* Chat Room Layout */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-150 overflow-hidden flex h-[580px] flex-shrink-0">
                {/* 1. Left Sidebar: Chat Sessions List */}
                <div className="w-80 border-r border-gray-150 flex flex-col flex-shrink-0 bg-gray-50/30">
                    <div className="p-4 border-b border-gray-150 bg-white">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Danh sách hội thoại</span>
                    </div>

                    <div className="h-[530px] overflow-y-auto divide-y divide-gray-100 flex-shrink-0">
                        {loadingSessions && sessions.length === 0 ? (
                            <div className="p-8 text-center text-xs text-gray-400">Đang tải phòng chat...</div>
                        ) : sessions.length === 0 ? (
                            <div className="p-8 text-center text-xs text-gray-400">Chưa có cuộc hội thoại nào.</div>
                        ) : (
                            sessions.map((session) => {
                                const isSelected = session.session_id === selectedSessionId;
                                const isUser = session.session_id.startsWith('user_');
                                return (
                                    <button
                                        key={session.session_id}
                                        onClick={() => handleSelectSession(session)}
                                        className={`w-full text-left p-4 transition-all flex flex-col gap-1.5 cursor-pointer ${
                                            isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-gray-50/50 bg-white'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span className="font-extrabold text-xs text-gray-800 truncate max-w-[70%]">
                                                {session.sender_name}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                                isUser ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                                {isUser ? 'Thành viên' : 'Khách'}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-400 truncate w-full">
                                            {session.is_admin ? 'Bạn: ' : ''}{session.message}
                                        </p>
                                        <span className="text-[9px] text-gray-400 self-end mt-0.5">
                                            {new Date(session.created_at).toLocaleString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: 'numeric',
                                                month: 'numeric'
                                            })}
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* 2. Right Area: Messages Log & Reply Input */}
                <div className="flex-1 flex flex-col bg-white">
                    {selectedSessionId ? (
                        <>
                            {/* Chat Window Header */}
                            <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between bg-white flex-shrink-0 shadow-sm z-10">
                                <div>
                                    <h3 className="font-extrabold text-sm text-gray-800 leading-tight">
                                        {selectedSessionName}
                                    </h3>
                                    <p className="text-[10px] text-indigo-600 font-bold mt-1">
                                        Mã phòng: {selectedSessionId}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                    <span>Đang trò chuyện</span>
                                </div>
                            </div>

                            {/* Messages Body */}
                             <div className="h-[430px] p-6 overflow-y-auto space-y-4 bg-slate-50/50 flex-shrink-0">
                                {loadingMessages && messages.length === 0 ? (
                                    <div className="flex justify-center items-center h-full text-xs text-gray-400">
                                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Đang tải lịch sử tin nhắn...
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMe = !!msg.is_admin;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                            >
                                                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-gray-400 px-1">
                                                    <span>{msg.sender_name}</span>
                                                </div>
                                                <div
                                                    className={`max-w-[65%] px-4 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                                                        isMe
                                                            ? 'bg-indigo-600 text-white rounded-tr-none'
                                                            : 'bg-white text-slate-700 border border-gray-100 rounded-tl-none'
                                                    }`}
                                                >
                                                    {msg.message}
                                                </div>
                                                <span className="text-[9px] text-gray-400 mt-1 px-1">
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

                            {/* Reply Input Form */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-150 flex gap-3 items-center flex-shrink-0">
                                <input
                                    type="text"
                                    required
                                    placeholder="Nhập nội dung phản hồi tư vấn..."
                                    className="flex-1 bg-slate-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 py-3 text-xs focus:outline-none transition-all placeholder:text-gray-400 font-medium"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 disabled:opacity-50 disabled:shadow-none cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                                >
                                    <span>Gửi</span>
                                    <span>🚀</span>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
                            <span className="text-5xl">💬</span>
                            <h4 className="font-extrabold text-sm text-gray-700">Chưa chọn cuộc trò chuyện</h4>
                            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                                Hãy bấm chọn một khách hàng hoặc khách vãng lai ở danh sách bên trái để bắt đầu chat trực tiếp tư vấn thắc mắc.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
