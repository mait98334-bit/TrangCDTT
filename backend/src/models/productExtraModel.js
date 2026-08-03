const db = require('../config/db');

const ProductExtra = {
    getVariantsByProductId: async (productId) => {
        const [rows] = await db.query('SELECT * FROM product_variants WHERE product_id = ?', [productId]);
        return rows;
    },
    getImagesByProductId: async (productId) => {
        const [rows] = await db.query('SELECT * FROM product_images WHERE product_id = ?', [productId]);
        return rows;
    },
    addVariant: async (productId, data) => {
        const { color, size, price, stock, image } = data;
        const [result] = await db.query(
            'INSERT INTO product_variants (product_id, color, size, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
            [productId, color || null, size || null, price || null, stock || 0, image || null]
        );
        return result;
    },
    deleteVariant: async (variantId) => {
        const [result] = await db.query('DELETE FROM product_variants WHERE id = ?', [variantId]);
        return result;
    },
    addImage: async (productId, imageUrl) => {
        const [result] = await db.query(
            'INSERT INTO product_images (product_id, image_url) VALUES (?, ?)',
            [productId, imageUrl]
        );
        return result;
    },
    deleteImage: async (imageId) => {
        const [result] = await db.query('DELETE FROM product_images WHERE id = ?', [imageId]);
        return result;
    }
};

module.exports = ProductExtra;