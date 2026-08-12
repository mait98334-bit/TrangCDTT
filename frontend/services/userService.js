import { fetchApi } from './apiService';

export const UserService = {
    getAllAdmin: () => fetchApi('/users?admin=true'),
    getById: (id) => fetchApi(`/users/${id}`),
    create: (data) => fetchApi('/users', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchApi(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchApi(`/users/${id}`, {
        method: 'DELETE'
    }),
    restore: (id) => fetchApi(`/users/${id}/restore`, {
        method: 'PUT'
    }),
    hardDelete: (id) => fetchApi(`/users/${id}/hard`, {
        method: 'DELETE'
    })
};
