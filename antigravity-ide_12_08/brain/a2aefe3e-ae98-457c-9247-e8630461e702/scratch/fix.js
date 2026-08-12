const fs = require('fs');
const file = 'd:/TrangCDTT/frontend/app/(admin)/admin/product/page.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('className=" hidden\\', 'className="hidden"');
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed successfully!');
