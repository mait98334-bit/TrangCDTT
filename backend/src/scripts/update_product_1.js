const https = require('https');
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

function downloadFile(url, dest) {
    return new Promise((resolve) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(dest, () => {});
                return resolve(false);
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => resolve(true));
            });
        }).on('error', (err) => {
            console.error(`Lỗi tải file từ ${url}:`, err.message);
            fs.unlink(dest, () => {});
            resolve(false);
        });
    });
}

async function main() {
    console.log('Bắt đầu tải ảnh...');
    
    const downloads = [
        // Áo xanh
        { url: 'https://supersports.com.vn/cdn/shop/files/AR5005-417-1.jpg', name: 'aoxanh_id1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/AR5005-417-2.jpg', name: 'aoxanhanhphu_id1_1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/AR5005-417-3.jpg', name: 'aoxanhanhphu_id1_2.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/AR5005-417-4.jpg', name: 'aoxanhanhphu_id1_3.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/AR5005-417-5.jpg', name: 'aoxanhanhphu_id1_4.jpg' },
        
        // Áo đen
        { url: 'https://supersports.com.vn/cdn/shop/products/AR5005-010.jpg', name: 'aoden_id1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/products/AR5005-010-2.jpg', name: 'aodenanhphu_id1_1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/products/AR5005-010-3.jpg', name: 'aodenanhphu_id1_2.jpg' },
        
        // Áo trắng
        { url: 'https://supersports.com.vn/cdn/shop/files/AR5005-101-1.jpg', name: 'aotrang_id1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/AR5005-101-2.jpg', name: 'aotranganhphu_id1_1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/AR5005-101-3.jpg', name: 'aotranganhphu_id1_2.jpg' }
    ];

    for (const dl of downloads) {
        const dest = path.join(uploadDir, dl.name);
        console.log(`Đang tải: ${dl.name} từ ${dl.url}...`);
        const ok = await downloadFile(dl.url, dest);
        if (ok) {
            console.log(`Đã tải xong: ${dl.name}`);
        } else {
            console.log(`Bỏ qua (không tồn tại hoặc lỗi): ${dl.name}`);
        }
    }

    console.log('Đang cập nhật Cơ sở dữ liệu...');

    // 1. Cập nhật thông tin sản phẩm chính
    await db.query(`
        UPDATE products 
        SET name = ?, price = ?, price_sale = NULL, image = ?
        WHERE id = 1
    `, ['Áo Thun Nam Nike Sportswear Icon Futura', 879000.00, '/uploads/aoxanh_id1.jpg']);
    console.log('Đã cập nhật sản phẩm chính.');

    // 2. Xóa các biến thể và ảnh phụ cũ của product_id = 1
    await db.query('DELETE FROM product_variants WHERE product_id = 1');
    await db.query('DELETE FROM product_images WHERE product_id = 1');
    console.log('Đã xóa biến thể và ảnh phụ cũ.');

    // 3. Chèn các biến thể mới
    const colors = [
        { name: 'Xanh Dương', image: '/uploads/aoxanh_id1.jpg' },
        { name: 'Đen', image: '/uploads/aoden_id1.jpg' },
        { name: 'Trắng', image: '/uploads/aotrang_id1.jpg' }
    ];
    const sizes = ['S', 'M', 'L', 'XL'];

    for (const color of colors) {
        // Chỉ chèn nếu ảnh đại diện màu đó đã tải thành công
        const imgName = path.basename(color.image);
        if (!fs.existsSync(path.join(uploadDir, imgName))) {
            console.log(`Bỏ qua biến thể màu ${color.name} do không có ảnh đại diện.`);
            continue;
        }

        for (const size of sizes) {
            const stock = Math.floor(Math.random() * 41) + 10; // random 10 - 50
            await db.query(`
                INSERT INTO product_variants (product_id, color, size, price, stock, image)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [1, color.name, size, 879000.00, stock, color.image]);
            console.log(`Đã thêm biến thể: ${color.name} - Size ${size} (Tồn kho: ${stock})`);
        }
    }

    // 4. Chèn các ảnh phụ mới
    const extraImages = [
        '/uploads/aoxanhanhphu_id1_1.jpg',
        '/uploads/aoxanhanhphu_id1_2.jpg',
        '/uploads/aoxanhanhphu_id1_3.jpg',
        '/uploads/aoxanhanhphu_id1_4.jpg',
        '/uploads/aodenanhphu_id1_1.jpg',
        '/uploads/aodenanhphu_id1_2.jpg',
        '/uploads/aotranganhphu_id1_1.jpg',
        '/uploads/aotranganhphu_id1_2.jpg'
    ];

    for (const imgPath of extraImages) {
        const imgName = path.basename(imgPath);
        if (fs.existsSync(path.join(uploadDir, imgName))) {
            await db.query(`
                INSERT INTO product_images (product_id, image_url)
                VALUES (?, ?)
            `, [1, imgPath]);
            console.log(`Đã thêm ảnh phụ vào CSDL: ${imgPath}`);
        }
    }

    console.log('Hoàn thành cập nhật sản phẩm ID 1!');
    process.exit(0);
}

main().catch(err => {
    console.error('Lỗi nghiêm trọng:', err);
    process.exit(1);
});
