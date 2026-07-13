const crypto = require('crypto');

const CLIENT_ID = '07a3480e-65f6-481b-93c7-90bb3e01b28e';
const API_KEY = 'e31e1fcc-ba45-4460-bc0a-542a467706bb';
const CHECKSUM_KEY = '61f5c3b171e082eaa7cf4ecce1fb4d8f7a185e6b68cfd94260ddfb7d23ff6231';

async function testPayOS() {
    const orderCode = Math.floor(Math.random() * 1000000);
    const amount = 2000;
    const description = "Test API";
    const returnUrl = "http://localhost:3000";
    const cancelUrl = "http://localhost:3000";

    const dataForSignature = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
    const signature = crypto.createHmac('sha256', CHECKSUM_KEY).update(dataForSignature).digest('hex');

    const body = {
        orderCode, amount, description, returnUrl, cancelUrl, signature,
        items: [{ name: "Test Item", quantity: 1, price: amount }]
    };

    console.log("Request Body:", body);

    const res = await fetch("https://api-merchant.payos.vn/v2/payment-requests", {
        method: 'POST',
        headers: {
            'x-client-id': CLIENT_ID,
            'x-api-key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log("PayOS Response:", data);
}

testPayOS();
