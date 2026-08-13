import { fetchApi } from './apiService';

export const OrderService = {
    getAll: () => fetchApi('/orders'),
    getById: (id) => fetchApi(`/orders/${id}`),
    updateStatus: (id, status) => fetchApi(`/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
    }),
    delete: (id) => fetchApi(`/orders/${id}`, {
        method: 'DELETE'
    }),
    create: (data) => fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};
