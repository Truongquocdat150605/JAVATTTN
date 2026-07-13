const axios = require('axios');
const crypto = require('crypto');

const CLIENT_ID = '07a3480e-65f6-481b-93c7-90bb3e01b28e';
const API_KEY = 'e31e1fcc-ba45-4460-bc0a-542a467706bb';
const CHECKSUM_KEY = '61f5c3b171e082eaa7cf4ecce1fb4d8f7a185e6b68cfd94260ddfb7d23ff6231';

async function runTest() {
    const invoiceId = 19;
    const orderCode = 46; // hardcode an ID that might be similar to DB
    const amount = 2001;
    let desc = "Thanh toan HD " + invoiceId;
    
    const returnUrl = "http://localhost:3000/my-invoices?status=PAID&invoiceId=" + invoiceId + "&paymentId=" + orderCode;
    const cancelUrl = "http://localhost:3000/my-invoices?status=CANCELED&invoiceId=" + invoiceId;

    const body = {
        orderCode, amount, description: desc, returnUrl, cancelUrl,
        items: [{ name: "Hoa don phong tro #" + invoiceId, quantity: 1, price: amount }]
    };

    const dataForSignature = `amount=${amount}&cancelUrl=${cancelUrl}&description=${desc}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
    const signature = crypto.createHmac('sha256', CHECKSUM_KEY).update(dataForSignature).digest('hex');
    body.signature = signature;

    try {
        console.log("Sending to PayOS:", body);
        const res = await axios.post("https://api-merchant.payos.vn/v2/payment-requests", body, {
            headers: {
                'x-client-id': CLIENT_ID,
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log("SUCCESS:", res.data);
    } catch (e) {
        if (e.response) {
            console.error("PAYOS REJECTED (400) WITH EXACT ERROR:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.error("OTHER ERROR:", e.message);
        }
    }
}
runTest();
