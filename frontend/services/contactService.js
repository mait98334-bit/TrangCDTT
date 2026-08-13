import { fetchApi } from './apiService';

export const ContactService = {
    getAllAdmin: () => fetchApi('/contacts?admin=true'),
    create: (data) => fetchApi('/contacts', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    reply: (id, replyMessage) => fetchApi(`/contacts/${id}/reply`, {
        method: 'POST',
        body: JSON.stringify({ reply: replyMessage })
    }),
    delete: (id) => fetchApi(`/contacts/${id}`, {
        method: 'DELETE'
    }),
    restore: (id) => fetchApi(`/contacts/${id}/restore`, {
        method: 'POST'
    }),
    hardDelete: (id) => fetchApi(`/contacts/${id}/hard`, {
        method: 'DELETE'
    })
};
