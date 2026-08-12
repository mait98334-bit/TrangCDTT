import { fetchApi } from './apiService';

export const BrandService = {
    getAll: () => fetchApi('/brands'),
    getById: (id) => fetchApi(`/brands/${id}`),
    create: (data) => fetchApi('/brands', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchApi(`/brands/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchApi(`/brands/${id}`, {
        method: 'DELETE'
    })
};
