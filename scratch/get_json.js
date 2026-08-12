const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://supersports.com.vn/products/ao-khoac-nam-nike-miler-repel-uv-protection-running-if2370-213-filbrt.js';
const dest = path.join(__dirname, 'product_31.json');

https.get(url, (res) => {
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            fs.writeFileSync(dest, JSON.stringify(data, null, 2), 'utf8');
            console.log('Successfully fetched and saved Shopify product JSON!');
        } catch (e) {
            console.log('Failed to parse JSON, raw body was:', body.substring(0, 500));
        }
        process.exit(0);
    });
}).on('error', (err) => {
    console.error(err);
    process.exit(1);
});
