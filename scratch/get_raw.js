const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://supersports.com.vn/collections/all/products/ao-thun-nu-nike-sportswear-classic-oversized-im6430-010-black';
const dest = path.join(__dirname, 'raw_31.html');

https.get(url, (res) => {
    let html = '';
    res.on('data', (chunk) => { html += chunk; });
    res.on('end', () => {
        fs.writeFileSync(dest, html, 'utf8');
        console.log('Saved raw HTML to raw_31.html');
        process.exit(0);
    });
}).on('error', (err) => {
    console.error(err);
    process.exit(1);
});
