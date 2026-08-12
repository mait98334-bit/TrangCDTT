import { fetchApi } from './apiService';

export const PostService = {
    getAll: () => fetchApi('/posts'),
    getAllAdmin: () => fetchApi('/posts?admin=true'),
    getById: (id) => fetchApi(`/posts/${id}`),
    create: (data) => fetchApi('/posts', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchApi(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchApi(`/posts/${id}`, {
        method: 'DELETE'
    }),
    restore: (id) => fetchApi(`/posts/${id}/restore`, {
        method: 'PUT'
    }),
    hardDelete: (id) => fetchApi(`/posts/${id}/hard`, {
        method: 'DELETE'
    })
};
