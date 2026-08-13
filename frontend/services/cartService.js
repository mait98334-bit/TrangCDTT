import { fetchApi } from './apiService';

export const CartService = {
    get: () => fetchApi('/carts'),
    add: (userId, productId, quantity, variantId = null) => fetchApi('/carts/add', {
        method: 'POST',
        body: JSON.stringify({ userId, productId, quantity, variantId })
    }),
    getByUserId: (userId) => fetchApi(`/carts/${userId}`),
    update: (itemId, quantity, variantId = null) => {
        const body = {};
        if (quantity !== undefined) body.quantity = quantity;
        if (variantId !== null) body.variantId = variantId;
        return fetchApi(`/carts/item/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },
    removeItem: (itemId) => fetchApi(`/carts/item/${itemId}`, {
        method: 'DELETE'
    }),
    clear: (cartId) => fetchApi(`/carts/${cartId}`, {
        method: 'DELETE'
    }),
    getAllAdmin: () => fetchApi('/carts'),
    getDetailsAdmin: (cartId) => fetchApi(`/carts/details/${cartId}`),
    clearAdmin: (cartId) => fetchApi(`/carts/${cartId}`, {
        method: 'DELETE'
    })
};
