import { fetchApi } from './apiService';

export const ChatService = {
    // Admin lấy danh sách các phiên chat
    getSessions: () => fetchApi('/chat/sessions'),

    // Lấy tin nhắn của 1 phiên chat
    getMessages: (sessionId) => fetchApi(`/chat/messages?session_id=${sessionId}`),

    // Gửi tin nhắn mới (cho cả Khách hàng và Admin)
    sendMessage: (data) => fetchApi('/chat/message', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};
