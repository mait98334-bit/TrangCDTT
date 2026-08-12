const fs = require('fs');
const path = require('path');

function extractDescription(content) {
    const lines = content.split('\n');
    let specIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if (line.includes('#### thông số') || line.includes('#### đặc điểm') || line.includes('#### chi tiết')) {
            specIndex = i;
            break;
        }
    }
    
    if (specIndex === -1) {
        return 'Không tìm thấy phần thông số';
    }
    
    // Find the paragraph before it
    let introParagraph = '';
    for (let i = specIndex - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line && !line.startsWith('[') && !line.startsWith('####') && !line.startsWith('-')) {
            introParagraph = line;
            break;
        }
    }
    
    // Find specs
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

// Test for product ID 8 (step 529) and product ID 6 (step 473)
const path8 = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\a2aefe3e-ae98-457c-9247-e8630461e702\\.system_generated\\steps\\529\\content.md';
const path6 = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\a2aefe3e-ae98-457c-9247-e8630461e702\\.system_generated\\steps\\473\\content.md';

if (fs.existsSync(path8)) {
    console.log('--- PRODUCT ID 8 DESCRIPTION ---');
    console.log(extractDescription(fs.readFileSync(path8, 'utf8')));
}
if (fs.existsSync(path6)) {
    console.log('--- PRODUCT ID 6 DESCRIPTION ---');
    console.log(extractDescription(fs.readFileSync(path6, 'utf8')));
}
