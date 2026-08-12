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
    console.log('Bắt đầu tải ảnh cho sản phẩm ID 3...');
    
    const downloads = [
        // Quần Đen
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-010-1.jpg', name: 'quanden_id3.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-010-2.jpg', name: 'quandenanhphu_id3_1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-010-3.jpg', name: 'quandenanhphu_id3_2.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-010-4.jpg', name: 'quandenanhphu_id3_3.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-010-5.jpg', name: 'quandenanhphu_id3_4.jpg' },
        
        // Quần Xám
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-084-1.jpg', name: 'quanxam_id3.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-084-2.jpg', name: 'quanxamanhphu_id3_1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-084-3.jpg', name: 'quanxamanhphu_id3_2.jpg' },
        
        // Quần Nâu
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-213-1.jpg', name: 'quannau_id3.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-213-2.jpg', name: 'quannauanhphu_id3_1.jpg' },
        { url: 'https://supersports.com.vn/cdn/shop/files/IF2071-213-3.jpg', name: 'quannauanhphu_id3_2.jpg' }
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

    // 1. Cập nhật thông tin sản phẩm chính (Dùng quần đen làm mặc định)
    await db.query(`
        UPDATE products 
        SET name = ?, price = ?, price_sale = NULL, image = ?
        WHERE id = 3
    `, ['Quần Ngắn Thể Thao Nam Nike Dri-Fit Miler 7 Inch Briefs-Lined', 1029000.00, '/uploads/quanden_id3.jpg']);
    console.log('Đã cập nhật sản phẩm chính.');

    // 2. Xóa các biến thể và ảnh phụ cũ của product_id = 3
    await db.query('DELETE FROM product_variants WHERE product_id = 3');
    await db.query('DELETE FROM product_images WHERE product_id = 3');
    console.log('Đã xóa biến thể và ảnh phụ cũ.');

    // 3. Chèn các biến thể mới cho 3 màu
    const colors = [
        { name: 'Đen', image: '/uploads/quanden_id3.jpg' },
        { name: 'Xám', image: '/uploads/quanxam_id3.jpg' },
        { name: 'Nâu', image: '/uploads/quannau_id3.jpg' }
    ];
    const sizes = ['S', 'M', 'L', 'XL'];

    for (const color of colors) {
        // Chỉ thêm nếu ảnh đại diện màu đó tồn tại
        const imgName = path.basename(color.image);
        if (!fs.existsSync(path.join(uploadDir, imgName))) {
            console.log(`Bỏ qua màu ${color.name} do không tải được ảnh.`);
            continue;
        }

        for (const size of sizes) {
            const stock = Math.floor(Math.random() * 41) + 10; // random 10 - 50
            await db.query(`
                INSERT INTO product_variants (product_id, color, size, price, stock, image)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [3, color.name, size, 1029000.00, stock, color.image]);
            console.log(`Đã thêm biến thể: ${color.name} - Size ${size} (Tồn kho: ${stock})`);
        }
    }

    // 4. Chèn các ảnh phụ mới
    const extraImages = [
        '/uploads/quandenanhphu_id3_1.jpg',
        '/uploads/quandenanhphu_id3_2.jpg',
        '/uploads/quandenanhphu_id3_3.jpg',
        '/uploads/quandenanhphu_id3_4.jpg',
        '/uploads/quanxamanhphu_id3_1.jpg',
        '/uploads/quanxamanhphu_id3_2.jpg',
        '/uploads/quannauanhphu_id3_1.jpg',
        '/uploads/quannauanhphu_id3_2.jpg'
    ];

    for (const imgPath of extraImages) {
        const imgName = path.basename(imgPath);
        if (fs.existsSync(path.join(uploadDir, imgName))) {
            await db.query(`
                INSERT INTO product_images (product_id, image_url)
                VALUES (?, ?)
            `, [3, imgPath]);
            console.log(`Đã thêm ảnh phụ vào CSDL: ${imgPath}`);
        }
    }

    console.log('Hoàn thành cập nhật sản phẩm ID 3!');
    process.exit(0);
}

main().catch(err => {
    console.error('Lỗi nghiêm trọng:', err);
    process.exit(1);
});
