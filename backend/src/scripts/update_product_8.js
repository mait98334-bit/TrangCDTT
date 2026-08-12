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
    console.log('Bắt đầu tải ảnh cho sản phẩm ID 8...');
    
    const downloads = [
        // Áo khoác Nâu (Mặc định)
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2370-213-1.jpg', name: 'aokhoacnau_id8.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2370-213-2.jpg', name: 'aokhoacnauanhphu_id8_1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2370-213-3.jpg', name: 'aokhoacnauanhphu_id8_2.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2370-213-4.jpg', name: 'aokhoacnauanhphu_id8_3.jpg' },
        
        // Áo khoác Đen (Phụ)
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2370-010-1.jpg', name: 'aokhoacden_id8.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2370-010-2.jpg', name: 'aokhoacdenanhphu_id8_1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2370-010-3.jpg', name: 'aokhoacdenanhphu_id8_2.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2370-010-4.jpg', name: 'aokhoacdenanhphu_id8_3.jpg' }
    ];

    for (const dl of downloads) {
        const dest = path.join(uploadDir, dl.name);
        console.log(`Đang tải: ${dl.name} từ ${dl.url}...`);
        const ok = await downloadFile(dl.url, dest);
        if (ok) {
            console.log(`Đã tải xong: ${dl.name}`);
        } else {
            console.log(`Bỏ qua hoặc lỗi: ${dl.name}`);
        }
    }

    console.log('Đang cập nhật Cơ sở dữ liệu...');

    // 1. Cập nhật thông tin sản phẩm chính (Dùng màu Nâu làm mặc định cho ID 8)
    await db.query(`
        UPDATE products 
        SET name = ?, price = ?, price_sale = NULL, image = ?, category_id = 4
        WHERE id = 8
    `, ['Áo Khoác Nam Nike Miler Repel UV Protection Running - Nâu', 2289000.00, '/uploads/aokhoacnau_id8.jpg']);
    console.log('Đã cập nhật sản phẩm chính.');

    // 2. Xóa các biến thể và ảnh phụ cũ của product_id = 8
    await db.query('DELETE FROM product_variants WHERE product_id = 8');
    await db.query('DELETE FROM product_images WHERE product_id = 8');
    console.log('Đã xóa biến thể và ảnh phụ cũ.');

    // 3. Chèn các biến thể mới cho cả 2 màu
    const colors = [
        { name: 'Nâu', image: '/uploads/aokhoacnau_id8.jpg' },
        { name: 'Đen', image: '/uploads/aokhoacden_id8.jpg' }
    ];
    const sizes = ['S', 'M', 'L', 'XL'];

    for (const color of colors) {
        // Chỉ thêm nếu ảnh màu đó tồn tại
        const imgName = path.basename(color.image);
        if (!fs.existsSync(path.join(uploadDir, imgName))) {
            console.log(`Bỏ qua màu ${color.name} do không có ảnh đại diện.`);
            continue;
        }

        for (const size of sizes) {
            const stock = Math.floor(Math.random() * 41) + 10; // random 10 - 50
            await db.query(`
                INSERT INTO product_variants (product_id, color, size, price, stock, image)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [8, color.name, size, 2289000.00, stock, color.image]);
            console.log(`Đã thêm biến thể: ${color.name} - Size ${size} (Tồn kho: ${stock})`);
        }
    }

    // 4. Chèn các ảnh phụ mới
    const extraImages = [
        '/uploads/aokhoacnauanhphu_id8_1.jpg',
        '/uploads/aokhoacnauanhphu_id8_2.jpg',
        '/uploads/aokhoacnauanhphu_id8_3.jpg',
        '/uploads/aokhoacdenanhphu_id8_1.jpg',
        '/uploads/aokhoacdenanhphu_id8_2.jpg',
        '/uploads/aokhoacdenanhphu_id8_3.jpg'
    ];

    for (const imgPath of extraImages) {
        const imgName = path.basename(imgPath);
        if (fs.existsSync(path.join(uploadDir, imgName))) {
            await db.query(`
                INSERT INTO product_images (product_id, image_url)
                VALUES (?, ?)
            `, [8, imgPath]);
            console.log(`Đã thêm ảnh phụ vào CSDL: ${imgPath}`);
        }
    }

    console.log('Hoàn thành cập nhật sản phẩm ID 8!');
    process.exit(0);
}

main().catch(err => {
    console.error('Lỗi nghiêm trọng:', err);
    process.exit(1);
});
