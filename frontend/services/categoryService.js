import { fetchApi } from './apiService';

export const CategoryService = {
    getAll: () => fetchApi('/categories'),
    getById: (id) => fetchApi(`/categories/${id}`),
    create: (data) => fetchApi('/categories', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchApi(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchApi(`/categories/${id}`, {
        method: 'DELETE'
    }),
    getAllAdmin: () => fetchApi('/categories?admin=true'),
    restore: (id) => fetchApi(`/categories/${id}/restore`, {
        method: 'POST'
    }),
    hardDelete: (id) => fetchApi(`/categories/${id}/hard`, {
        method: 'DELETE'
    })
};
