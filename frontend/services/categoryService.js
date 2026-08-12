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
    })
};
