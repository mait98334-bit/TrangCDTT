const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDb() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'trangcdtt'
    });

    try {
        console.log('Adding columns is_sale, is_hot, is_new to products table...');
        
        // Check if columns already exist
        const [columns] = await connection.query('SHOW COLUMNS FROM products');
        const columnNames = columns.map(col => col.Field);

        if (!columnNames.includes('is_sale')) {
            await connection.query('ALTER TABLE products ADD COLUMN is_sale TINYINT DEFAULT 0');
            console.log('Added is_sale column.');
        } else {
            console.log('is_sale column already exists.');
        }

        if (!columnNames.includes('is_hot')) {
            await connection.query('ALTER TABLE products ADD COLUMN is_hot TINYINT DEFAULT 0');
            console.log('Added is_hot column.');
        } else {
            console.log('is_hot column already exists.');
        }

        if (!columnNames.includes('is_new')) {
            await connection.query('ALTER TABLE products ADD COLUMN is_new TINYINT DEFAULT 0');
            console.log('Added is_new column.');
        } else {
            console.log('is_new column already exists.');
        }

        // Let's set some default products as hot, new, or sale to test
        await connection.query('UPDATE products SET is_new = 1 WHERE id IN (1, 3)');
        await connection.query('UPDATE products SET is_hot = 1 WHERE id IN (2, 4)');
        await connection.query('UPDATE products SET is_sale = 1 WHERE id IN (1, 4)');
        console.log('Updated some products to have is_new, is_hot, is_sale for demonstration.');

        console.log('Database updated successfully!');
    } catch (err) {
        console.error('Error updating database:', err);
    } finally {
        await connection.end();
    }
}

updateDb();
