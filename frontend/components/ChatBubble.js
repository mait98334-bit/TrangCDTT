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
    
    // Đa luồng chat
    const [sessions, setSessions] = useState([]);
    const [view, setView] = useState('sessions'); // 'sessions' or 'chat'

    const chatEndRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    // Lấy session từ localStorage theo user
    const getStoredSessions = (user) => {
        const stored = localStorage.getItem('my_chat_sessions');
        if (!stored) return [];
        try {
            const all = JSON.parse(stored);
            if (!Array.isArray(all)) return [];
            
            if (user) {
                const prefix = `user_${user.id}_`;
                return all.filter(s => s.id.startsWith(prefix));
            } else {
                return all.filter(s => s.id.startsWith('guest_'));
            }
        } catch (e) {
            console.error(e);
            return [];
        }
    };

    // Ghi session vào localStorage
    const saveStoredSessions = (user, updatedSessions) => {
        const stored = localStorage.getItem('my_chat_sessions');
        let all = [];
        if (stored) {
            try {
                all = JSON.parse(stored);
                if (!Array.isArray(all)) all = [];
            } catch (e) {
                all = [];
            }
        }
        
        const prefix = user ? `user_${user.id}_` : 'guest_';
        const filteredOther = all.filter(s => !s.id.startsWith(prefix));
        
        const newAll = [...filteredOther, ...updatedSessions];
        localStorage.setItem('my_chat_sessions', JSON.stringify(newAll));
    };

    // 1. Khởi tạo phiên chat (Session)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            let currentUser = null;
            let activeSenderName = 'Khách hàng vãng lai';

            if (storedUser) {
                try {
                    currentUser = JSON.parse(storedUser);
                    activeSenderName = currentUser.fullname || currentUser.name || 'Khách hàng thành viên';
                } catch (e) {
                    console.error('Lỗi đọc user cho chat:', e);
                }
            }

            setSenderName(activeSenderName);

            // Load các sessions cũ
            const userSessions = getStoredSessions(currentUser);
            setSessions(userSessions);
            
            if (userSessions.length > 0) {
                setView('sessions');
                // Chọn mặc định session cuối cùng nhưng không đi thẳng vào chat
                setSessionId(userSessions[userSessions.length - 1].id);
            } else {
                // Tạo session đầu tiên tự động
                const newId = currentUser 
                    ? `user_${currentUser.id}_${Date.now()}` 
                    : `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
                const newSession = {
                    id: newId,
                    title: `Cuộc trò chuyện #1`,
                    createdAt: new Date().toISOString()
                };
                const updated = [newSession];
                setSessions(updated);
                saveStoredSessions(currentUser, updated);
                setSessionId(newId);
                setView('chat'); // Đi thẳng vào chat
            }
            
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
    const loadMessages = async (sessionIdToLoad, showLoading = false) => {
        if (!sessionIdToLoad) return;
        if (showLoading) setLoading(true);

        const res = await ChatService.getMessages(sessionIdToLoad);
        if (res.success) {
            setMessages(res.data);
        }

        if (showLoading) setLoading(false);
    };

    // 4. Bắt đầu/dừng Polling tin nhắn mới
    useEffect(() => {
        if (isOpen && sessionId && view === 'chat') {
            loadMessages(sessionId, true); // Load ngay khi mở phòng

            // Thiết lập vòng lặp tải tin nhắn sau mỗi 3 giây
            pollingIntervalRef.current = setInterval(() => {
                loadMessages(sessionId, false);
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
    }, [isOpen, sessionId, view]);

    // 5. Gửi tin nhắn
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !sessionId) return;

        const msgContent = newMessage;
        setNewMessage(''); // Xóa nhanh input

        const activeSession = sessions.find(s => s.id === sessionId);
        const activeTitle = activeSession ? activeSession.title : 'Cuộc trò chuyện';
        const displayName = `${senderName} (${activeTitle})`;

        const res = await ChatService.sendMessage({
            session_id: sessionId,
            sender_name: displayName,
            message: msgContent,
            is_admin: false
        });

        if (res.success) {
            setMessages(prev => [...prev, res.data]);
        }
    };

    // Bắt đầu cuộc trò chuyện mới
    const handleStartNewChat = () => {
        const storedUser = localStorage.getItem('user');
        let currentUser = null;
        if (storedUser) {
            try {
                currentUser = JSON.parse(storedUser);
            } catch (e) {}
        }
        
        const currentSessions = getStoredSessions(currentUser);
        const newIndex = currentSessions.length + 1;
        const newId = currentUser 
            ? `user_${currentUser.id}_${Date.now()}` 
            : `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            
        const newSession = {
            id: newId,
            title: `Cuộc trò chuyện #${newIndex}`,
            createdAt: new Date().toISOString()
        };
        
        const updated = [...currentSessions, newSession];
        setSessions(updated);
        saveStoredSessions(currentUser, updated);
        setSessionId(newId);
        setMessages([]); // Xóa tin nhắn cũ
        setView('chat'); // Chuyển sang màn hình chat
    };

    const handleSelectSession = (id) => {
        setSessionId(id);
        setMessages([]); // Xóa tin nhắn hiển thị cũ trước khi load mới
        setView('chat');
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
                    
                    {/* CHẾ ĐỘ XEM DANH SÁCH CUỘC TRÒ CHUYỆN */}
                    {view === 'sessions' && (
                        <>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-4 flex justify-between items-center shadow-md animate-fade-in">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-xl">💬</span>
                                    <div>
                                        <h3 className="font-extrabold text-sm tracking-tight leading-tight">Hỗ trợ trực tuyến</h3>
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

                            {/* Sessions List */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
                                <div className="text-center py-3 px-2">
                                    <p className="text-xs font-bold text-slate-700">Các cuộc trò chuyện của bạn</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Chọn một cuộc trò chuyện bên dưới để tiếp tục tư vấn</p>
                                </div>
                                
                                <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
                                    {sessions.map((s, index) => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleSelectSession(s.id)}
                                            className="w-full text-left p-3.5 bg-white hover:bg-indigo-50/40 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md cursor-pointer flex items-center gap-3 group"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-xs shadow-sm group-hover:scale-105 transition-all">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-extrabold text-xs text-slate-700 truncate">{s.title}</h4>
                                                <p className="text-[9px] text-slate-400 mt-0.5">
                                                    Bắt đầu: {new Date(s.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(s.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-all font-bold text-xs">➔</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Start New Chat Button */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <button
                                    onClick={handleStartNewChat}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-150 hover:shadow-indigo-250 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
                                >
                                    <span>💬</span>
                                    <span>Bắt đầu cuộc trò chuyện mới</span>
                                </button>
                            </div>
                        </>
                    )}

                    {/* CHẾ ĐỘ XEM PHÒNG CHAT CHI TIẾT */}
                    {view === 'chat' && (
                        <>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-4 flex justify-between items-center shadow-md">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setView('sessions')}
                                        className="text-white hover:bg-white/10 font-bold w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-all mr-0.5 flex-shrink-0"
                                        title="Quay lại danh sách"
                                    >
                                        ←
                                    </button>
                                    <span className="text-xl">💬</span>
                                    <div className="min-w-0">
                                        <h3 className="font-extrabold text-sm tracking-tight leading-tight truncate">
                                            {sessions.find(s => s.id === sessionId)?.title || 'Trang Store - Hỗ trợ'}
                                        </h3>
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
                                            Hãy gửi tin nhắn đầu tiên để bắt đầu trò chuyện trực tiếp với shop nhé!
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
                        </>
                    )}

                </div>
            )}
        </div>
    );
}
