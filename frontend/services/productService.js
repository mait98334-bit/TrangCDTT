import { fetchApi } from './apiService';

export const ProductService = {
    // Basic CRUD
    getAll: () => fetchApi('/products'),
    getAllAdmin: () => fetchApi('/products?admin=true'),
    getById: (id) => fetchApi(`/products/${id}`),
    create: (data) => fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    update: (id, data) => fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    delete: (id) => fetchApi(`/products/${id}`, {
        method: 'DELETE'
    }),
    restore: (id) => fetchApi(`/products/${id}/restore`, {
        method: 'PUT'
    }),
    hardDelete: (id) => fetchApi(`/products/${id}/hard`, {
        method: 'DELETE'
    }),

    // Extra Images (Gallery)
    getExtraImages: (productId) => fetchApi(`/products/${productId}/extra`),
    addExtraImage: (productId, imagePath) => fetchApi(`/products/${productId}/images`, {
        method: 'POST',
        body: JSON.stringify({ image: imagePath })
    }),
    deleteExtraImage: (imageId) => fetchApi(`/products/images/${imageId}`, {
        method: 'DELETE'
    }),

    // Variants
    getVariants: (productId) => fetchApi(`/products/${productId}/variants`),
    addVariant: (productId, data) => fetchApi(`/products/${productId}/variants`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateVariant: (variantId, data) => fetchApi(`/products/variants/${variantId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteVariant: (variantId) => fetchApi(`/products/variants/${variantId}`, {
        method: 'DELETE'
    }),

    // File Upload (Admin Panel)
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            body: formData,
        });
        return response.json();
    }
};
