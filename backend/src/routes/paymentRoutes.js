const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/db');

// VNPAY Sandbox Configuration
const tmnCode = '2QX1X161';
const hashSecret = '99797779777777777777777777777777';
const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const returnUrl = 'http://localhost:5000/api/payment/vnpay_return';

// Pure JS Date Formatter (YYYYMMDDHHmmss)
function getVnpayDateFormat(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return date.getFullYear() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds());
}

// Helper to sort parameters alphabetically (VNPAY requirement)
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
}

// 1. POST /api/payment/create_payment_url -> Tạo đường dẫn thanh toán VNPAY
router.post('/create_payment_url', async (req, res) => {
    try {
        const { orderId, amount, ipAddr } = req.body;
        if (!orderId || !amount) {
            return res.status(400).json({ success: false, message: 'Thiếu orderId hoặc amount' });
        }

        const clientIp = ipAddr || req.ip || '127.0.0.1';
        const date = new Date();
        const createDate = getVnpayDateFormat(date);

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = 'VND';
        vnp_Params['vnp_TxnRef'] = orderId + '_' + createDate; // Tránh trùng mã giao dịch VNPAY nếu thanh toán lại
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang TrangStore #' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100; // Đơn vị tiền tệ nhân 100 theo yêu cầu VNPAY
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = clientIp;
        vnp_Params['vnp_CreateDate'] = createDate;

        // Sắp xếp tham số theo alphabet
        vnp_Params = sortObject(vnp_Params);

        // Tạo chuỗi truy vấn ký dữ liệu
        let signData = Object.keys(vnp_Params)
            .map(key => `${key}=${vnp_Params[key]}`)
            .join('&');

        // Tạo chữ ký bảo mật SHA512
        const hmac = crypto.createHmac("sha512", hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        vnp_Params['vnp_SecureHash'] = signed;

        // Đường dẫn đầy đủ để chuyển hướng
        const paymentUrl = vnpUrl + '?' + Object.keys(vnp_Params)
            .map(key => `${key}=${vnp_Params[key]}`)
            .join('&');

        res.status(200).json({ success: true, paymentUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi tạo URL thanh toán', error: error.message });
    }
});

// 2. GET /api/payment/vnpay_return -> Điểm nhận phản hồi chuyển hướng từ VNPAY (Trang trung gian xử lý)
router.get('/vnpay_return', async (req, res) => {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let signData = Object.keys(vnp_Params)
            .map(key => `${key}=${vnp_Params[key]}`)
            .join('&');

        const hmac = crypto.createHmac("sha512", hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const orderIdWithDate = vnp_Params['vnp_TxnRef'];
            const orderId = orderIdWithDate.split('_')[0];
            const responseCode = vnp_Params['vnp_ResponseCode'];

            if (responseCode === '00') {
                // Thanh toán thành công -> Cập nhật CSDL
                await db.query("UPDATE orders SET status = 'Đã thanh toán' WHERE id = ?", [orderId]);
                // Điều hướng về trang Success của Frontend Next.js
                return res.redirect(`http://localhost:3000/order-success?orderId=${orderId}&vnp_ResponseCode=${responseCode}`);
            } else {
                // Thanh toán không thành công
                return res.redirect(`http://localhost:3000/order-success?orderId=${orderId}&vnp_ResponseCode=${responseCode}&error=true`);
            }
        } else {
            // Sai chữ ký bảo mật
            return res.status(400).send('Chữ ký bảo mật không hợp lệ (Checksum failed)');
        }
    } catch (error) {
        res.status(500).send('Lỗi xử lý phản hồi từ VNPAY: ' + error.message);
    }
});

// 3. GET /api/payment/vnpay_ipn -> Cổng Webhook gọi ngầm (IPN) từ VNPAY
router.get('/vnpay_ipn', async (req, res) => {
    try {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let signData = Object.keys(vnp_Params)
            .map(key => `${key}=${vnp_Params[key]}`)
            .join('&');

        const hmac = crypto.createHmac("sha512", hashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            const orderIdWithDate = vnp_Params['vnp_TxnRef'];
            const orderId = orderIdWithDate.split('_')[0];
            const responseCode = vnp_Params['vnp_ResponseCode'];

            // Lấy thông tin đơn hàng trong CSDL để đối chiếu
            const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
            if (orders.length === 0) {
                return res.status(200).json({ RspCode: '01', Message: 'Order not found' });
            }

            const order = orders[0];
            
            // So khớp số tiền (ở VNPAY là vnp_Amount = amount * 100)
            if (Number(order.total_price) * 100 !== Number(vnp_Params['vnp_Amount'])) {
                return res.status(200).json({ RspCode: '04', Message: 'Amount mismatch' });
            }

            // Kiểm tra trạng thái đơn hàng (Đã thanh toán chưa)
            if (order.status === 'Đã thanh toán') {
                return res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' });
            }

            // Cập nhật trạng thái
            if (responseCode === '00') {
                await db.query("UPDATE orders SET status = 'Đã thanh toán' WHERE id = ?", [orderId]);
            } else {
                await db.query("UPDATE orders SET status = 'Thanh toán thất bại' WHERE id = ?", [orderId]);
            }

            res.status(200).json({ RspCode: '00', Message: 'Confirm success' });
        } else {
            res.status(200).json({ RspCode: '97', Message: 'Invalid Checksum' });
        }
    } catch (error) {
        res.status(200).json({ RspCode: '99', Message: 'Uncaught Error: ' + error.message });
    }
});

module.exports = router;
