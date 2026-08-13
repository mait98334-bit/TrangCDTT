import { fetchApi } from './apiService';

export const ReviewService = {
    getAllAdmin: () => fetchApi('/reviews?admin=true'),
    getByProductId: (productId) => fetchApi(`/reviews/product/${productId}`),
    create: (data) => fetchApi('/reviews', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchApi(`/reviews/${id}`, {
        method: 'DELETE'
    }),
    restore: (id) => fetchApi(`/reviews/${id}/restore`, {
        method: 'POST'
    }),
    hardDelete: (id) => fetchApi(`/reviews/${id}/hard`, {
        method: 'DELETE'
    })
};
