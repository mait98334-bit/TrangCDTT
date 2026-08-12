import { fetchApi } from './apiService';

export const CartService = {
    get: () => fetchApi('/carts'),
    add: (variantId, quantity) => fetchApi('/carts/add', {
        method: 'POST',
        body: JSON.stringify({ variant_id: variantId, quantity })
    }),
    update: (itemId, quantity) => fetchApi(`/carts/update/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
    }),
    remove: (itemId) => fetchApi(`/carts/remove/${itemId}`, {
        method: 'DELETE'
    }),
    clear: () => fetchApi('/carts/clear', {
        method: 'DELETE'
    })
};
