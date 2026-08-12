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
        const protocol = url.startsWith('https') ? https : require('http');
        protocol.get(url, (response) => {
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

function getFilePrefix(title) {
    const t = title.toLowerCase();
    if (t.includes('polo')) return 'aopolo';
    if (t.includes('áo thun') || t.includes('áo phông') || t.includes('t-shirt') || t.includes('tee')) return 'aothun';
    if (t.includes('áo khoác') || t.includes('jacket') || t.includes('hoodie') || t.includes('tracksuit')) return 'aokhoac';
    if (t.includes('quần dài') || t.includes('pants') || t.includes('parachute')) return 'quandai';
    if (t.includes('quần ngắn') || t.includes('shorts') || t.includes('quần đùi')) return 'quanngan';
    if (t.includes('thảm')) return 'tham';
    if (t.includes('vớ') || t.includes('tất') || t.includes('socks')) return 'vo';
    if (t.includes('ba lô') || t.includes('balo') || t.includes('backpack') || t.includes('túi')) return 'balo';
    if (t.includes('mũ') || t.includes('nón') || t.includes('cap') || t.includes('hat')) return 'mu';
    return 'sanpham';
}

function getColorSuffix(colorName) {
    if (!colorName) return '';
    const c = colorName.toLowerCase();
    if (c.includes('đen') || c.includes('black')) return 'den';
    if (c.includes('trắng') || c.includes('white')) return 'trang';
    if (c.includes('xanh dương') || c.includes('blue') || c.includes('navy') || c.includes('dark blue')) return 'navy';
    if (c.includes('xám') || c.includes('grey') || c.includes('gray') || c.includes('orbit grey')) return 'xam';
    if (c.includes('nâu') || c.includes('brown')) return 'nau';
    if (c.includes('đỏ') || c.includes('red')) return 'do';
    if (c.includes('vàng') || c.includes('yellow')) return 'vang';
    if (c.includes('hồng') || c.includes('pink') || c.includes('lilac')) return 'hong';
    return '';
}

function extractDescription(content) {
    const lines = content.split('\n');
    let specIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (line.includes('#### thông số') || line.includes('#### đặc điểm') || line.includes('#### chi tiết') || line.includes('#### thông tin')) {
            specIndex = i;
            break;
        }
    }
    
    if (specIndex === -1) {
        let metaDesc = '';
        for (let i = 0; i < Math.min(lines.length, 50); i++) {
            if (lines[i].startsWith('Description:')) {
                metaDesc = lines[i].replace('Description:', '').trim();
                break;
            }
        }
        return metaDesc;
    }
    
    let introParagraph = '';
    for (let i = specIndex - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line && !line.startsWith('[') && !line.startsWith('####') && !line.startsWith('-')) {
            introParagraph = line;
            break;
        }
    }
    
    const specs = [];
    for (let i = specIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('QUY ĐỊNH ĐỔI TRẢ') || line.includes('VỀ SUPERSPORTS') || line.startsWith('[...') || line.startsWith('...')) {
            break;
        }
        specs.push(line);
    }
    
    return [introParagraph, ...specs].filter(Boolean).join('\n\n');
}

function extractJSONArray(content, key) {
    const startIndex = content.indexOf(key);
    if (startIndex === -1) return null;
    
    const arrayStartIndex = content.indexOf('[', startIndex);
    if (arrayStartIndex === -1) return null;
    
    let depth = 0;
    for (let i = arrayStartIndex; i < content.length; i++) {
        if (content[i] === '[') {
            depth++;
        } else if (content[i] === ']') {
            depth--;
            if (depth === 0) {
                return content.substring(arrayStartIndex, i + 1);
            }
        }
    }
    return null;
}

function parseShopifyData(content) {
    // 1. Parse Title
    const titleMatch = content.match(/Title:\s*(.*?)(?:\r?\n|–)/i);
    let title = titleMatch ? titleMatch[1].trim() : '';

    // 2. Parse Variants Array
    let variants = [];
    // Try format A (KiwiSizing)
    const variantsStrA = extractJSONArray(content, 'variants:');
    if (variantsStrA) {
        try {
            variants = JSON.parse(variantsStrA);
        } catch(e) {
            console.error('Lỗi parse variants định dạng A:', e.message);
        }
    }
    // Try format B (Standard JSON array matching)
    if (variants.length === 0) {
        const variantsStrB = extractJSONArray(content, '[{"id":');
        if (variantsStrB) {
            try {
                variants = JSON.parse(variantsStrB);
            } catch(e) {
                console.error('Lỗi parse variants định dạng B:', e.message);
            }
        }
    }

    // Try finding title in variants JSON if title is generic like "Live Content"
    const jsonTitleMatch = content.match(/title:\s*\"(.*?)\"/);
    if (jsonTitleMatch && (!title || title.toLowerCase().includes('live content'))) {
        title = jsonTitleMatch[1].trim();
    }

    // 3. Parse Images
    let images = [];
    const imagesStr = extractJSONArray(content, 'images:');
    if (imagesStr) {
        try {
            images = JSON.parse(imagesStr);
        } catch(e) {}
    }
    // If not found in JSON, extract unique Shopify image URLs using regex
    if (images.length === 0) {
        const imgRegex = /\/\/supersports\.com\.vn\/cdn\/shop\/(files|products)\/[a-zA-Z0-9_\-\.]+?\.jpg/g;
        const matches = content.match(imgRegex) || [];
        const uniqueUrls = [...new Set(matches)];
        images = uniqueUrls.map(url => {
            return url.replace(/_(1024x1024|1200x1200|480x480|grande|100x100)\.jpg/, '.jpg');
        });
        images = [...new Set(images)]; // Re-de-duplicate
    }

    return { title, images, variants };
}

async function processProduct(productId, filePath) {
    console.log(`\n==================================================`);
    console.log(`Đang xử lý sản phẩm ID: ${productId} từ file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
        console.error(`Lỗi: Tệp ${filePath} không tồn tại!`);
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const { title, images, variants } = parseShopifyData(content);
    
    if (!title || variants.length === 0) {
        console.error('Lỗi: Không parse được tiêu đề hoặc biến thể của sản phẩm!');
        return;
    }

    console.log(`Tiêu đề gốc: ${title}`);
    const prefix = getFilePrefix(title);
    console.log(`Prefix file xác định được: ${prefix}`);
    
    const desc = extractDescription(content);
    console.log(`Mô tả trích xuất được (độ dài: ${desc.length} ký tự).`);

    // Lấy thông tin về giá từ variant đầu tiên
    const mainVariant = variants[0];
    const price = mainVariant.price / 100;
    console.log(`Giá sản phẩm: ${price.toLocaleString('vi-VN')} VND`);

    // 1. Tải ảnh đại diện cho các màu
    const colorImages = {};
    for (const variant of variants) {
        const colorName = variant.option1 || 'Default';
        if (!colorImages[colorName] && variant.featured_image && variant.featured_image.src) {
            colorImages[colorName] = variant.featured_image.src;
        }
    }

    // Nếu các variant không chứa featured_image, gán ảnh đầu tiên của danh sách hình ảnh cho màu đầu tiên
    const colorsList = [...new Set(variants.map(v => v.option1 || 'Default'))];
    if (Object.keys(colorImages).length === 0 && images.length > 0) {
        colorImages[colorsList[0]] = images[0];
    }

    const colorLocalPaths = {};
    for (const [colorName, imgUrl] of Object.entries(colorImages)) {
        const suffix = getColorSuffix(colorName);
        const colorFilename = `${prefix}${suffix ? '_' + suffix : ''}_id${productId}.jpg`;
        const fullUrl = imgUrl.startsWith('http') ? imgUrl : `https:${imgUrl}`;
        const destPath = path.join(uploadDir, colorFilename);
        
        console.log(`Tải ảnh màu [${colorName}]: ${colorFilename} từ ${fullUrl}...`);
        const ok = await downloadFile(fullUrl, destPath);
        if (ok) {
            console.log(`Đã tải xong ảnh màu: ${colorFilename}`);
            colorLocalPaths[colorName] = `/uploads/${colorFilename}`;
        } else {
            console.error(`Không tải được ảnh màu: ${colorFilename}`);
        }
    }

    // Xác định ảnh chính cho sản phẩm (sử dụng ảnh của màu đầu tiên tải thành công)
    const mainColor = Object.keys(colorLocalPaths)[0] || colorsList[0];
    const mainProductImage = colorLocalPaths[mainColor] || '';
    console.log(`Ảnh chính sản phẩm: ${mainProductImage}`);

    // Xác định danh mục sản phẩm (category_id)
    const t = title.toLowerCase();
    let categoryId = 3; // Mặc định là Phụ Kiện
    const isNu = t.includes('nữ') || t.includes('women');
    
    if (t.includes('áo thun') || t.includes('áo phông') || t.includes('áo polo') || t.includes('t-shirt') || t.includes('tee') || t.includes('áo tanktop') || t.includes('áo hai dây')) {
        categoryId = isNu ? 7 : 1; // Áo Nữ (7) hoặc Áo Nam (1)
    } else if (t.includes('áo khoác') || t.includes('jacket') || t.includes('hoodie') || t.includes('tracksuit')) {
        categoryId = isNu ? 9 : 4; // Áo Khoác Nữ (9) hoặc Áo Khoác Nam (4)
    } else if (t.includes('quần')) {
        categoryId = isNu ? 8 : 2; // Quần Nữ (8) hoặc Quần Nam (2)
    }

    console.log(`Đã xác định category_id: ${categoryId}`);

    // Xác định thương hiệu (brand_id) động từ vendor
    const vendorMatch = content.match(/vendor:\s*"(.*?)"/);
    const vendorName = vendorMatch ? vendorMatch[1].trim() : 'Adidas';
    
    const [brands] = await db.query('SELECT id FROM brands WHERE LOWER(name) = ?', [vendorName.toLowerCase()]);
    let brandId;
    if (brands.length > 0) {
        brandId = brands[0].id;
    } else {
        const slug = vendorName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const [result] = await db.query('INSERT INTO brands (name, slug) VALUES (?, ?)', [vendorName, slug]);
        brandId = result.insertId;
        console.log(`Đã tự động tạo thương hiệu mới: ${vendorName} (brand_id: ${brandId})`);
    }
    
    // 2. Cập nhật bảng products
    await db.query(`
        UPDATE products 
        SET name = ?, price = ?, price_sale = NULL, image = ?, description = ?, category_id = ?, brand_id = ?
        WHERE id = ?
    `, [title, price, mainProductImage, desc, categoryId, brandId, productId]);
    console.log(`Đã cập nhật thông tin sản phẩm chính trong DB.`);

    // 3. Xóa các biến thể và ảnh phụ cũ của sản phẩm này
    await db.query('DELETE FROM product_variants WHERE product_id = ?', [productId]);
    await db.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
    console.log('Đã làm sạch các biến thể và ảnh phụ cũ.');

    // 4. Chèn các biến thể mới
    for (const variant of variants) {
        const colorName = variant.option1 || 'Default';
        const sizeName = variant.option2 || 'Standard';
        const variantPrice = variant.price / 100;
        const stock = Math.floor(Math.random() * 41) + 10; // random 10 - 50
        const variantImage = colorLocalPaths[colorName] || mainProductImage;

        await db.query(`
            INSERT INTO product_variants (product_id, color, size, price, stock, image)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [productId, colorName, sizeName, variantPrice, stock, variantImage]);
        console.log(`Đã thêm biến thể DB: ${colorName} - Size ${sizeName} (Tồn kho: ${stock})`);
    }

    // 5. Tải ảnh phụ
    const mainImgUrls = Object.values(colorImages).map(url => url.replace(/_(1024x1024|1200x1200|480x480|grande|100x100)\.jpg/, '.jpg'));
    const extraImgUrls = images.filter(img => {
        const cleanedImg = img.replace(/_(1024x1024|1200x1200|480x480|grande|100x100)\.jpg/, '.jpg');
        return !mainImgUrls.includes(cleanedImg);
    });
    
    console.log(`Tìm thấy ${extraImgUrls.length} ảnh phụ cần tải.`);
    
    let extraCount = 1;
    for (const imgUrl of extraImgUrls) {
        if (extraCount > 5) break;

        const mainColorName = Object.keys(colorImages)[0] || 'Default';
        const suffix = getColorSuffix(mainColorName);
        const extraFilename = `${prefix}${suffix ? '_' + suffix : ''}anhphu_id${productId}_${extraCount}.jpg`;
        const fullUrl = imgUrl.startsWith('http') ? imgUrl : `https:${imgUrl}`;
        const destPath = path.join(uploadDir, extraFilename);

        console.log(`Tải ảnh phụ [${extraCount}]: ${extraFilename} từ ${fullUrl}...`);
        const ok = await downloadFile(fullUrl, destPath);
        if (ok) {
            console.log(`Đã tải xong ảnh phụ: ${extraFilename}`);
            const dbPath = `/uploads/${extraFilename}`;
            await db.query(`
                INSERT INTO product_images (product_id, image_url)
                VALUES (?, ?)
            `, [productId, dbPath]);
            extraCount++;
        } else {
            console.log(`Bỏ qua ảnh phụ do lỗi.`);
        }
    }

    console.log(`Hoàn thành cập nhật sản phẩm ID: ${productId}`);
}

async function mainBatch() {
    const productsToProcess = [
        { id: 14, path: 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\a2aefe3e-ae98-457c-9247-e8630461e702\\.system_generated\\steps\\682\\content.md' },
        { id: 15, path: 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\a2aefe3e-ae98-457c-9247-e8630461e702\\.system_generated\\steps\\684\\content.md' },
        { id: 16, path: 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\a2aefe3e-ae98-457c-9247-e8630461e702\\.system_generated\\steps\\686\\content.md' },
        { id: 32, path: 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\a2aefe3e-ae98-457c-9247-e8630461e702\\.system_generated\\steps\\688\\content.md' },
        { id: 38, path: 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\a2aefe3e-ae98-457c-9247-e8630461e702\\.system_generated\\steps\\690\\content.md' }
    ];

    for (const p of productsToProcess) {
        await processProduct(p.id, p.path);
    }
    
    console.log('\n==================================================');
    console.log('HOÀN THÀNH TOÀN BỘ BATCH UPDATE CHO SẢN PHẨM MỚI!');
    process.exit(0);
}

mainBatch().catch(err => {
    console.error('Lỗi nghiêm trọng:', err);
    process.exit(1);
});
