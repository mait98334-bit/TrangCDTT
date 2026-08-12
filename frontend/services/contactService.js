import { fetchApi } from './apiService';

export const ContactService = {
    getAllAdmin: () => fetchApi('/contacts?admin=true'),
    create: (name, email, subject, message) => fetchApi('/contacts', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message })
    }),
    reply: (id, replyMessage) => fetchApi(`/contacts/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply: replyMessage })
    }),
    delete: (id) => fetchApi(`/contacts/${id}`, {
        method: 'DELETE'
    })
};
