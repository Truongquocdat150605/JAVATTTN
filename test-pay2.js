const crypto = require('crypto');
const axios = require('axios');

function base64url(source) {
  return Buffer.from(source).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}
const secret = 'coffee-shop-jwt-secret-key-2024-lab06-spring-boot';
const h = base64url(JSON.stringify({alg:'HS256',typ:'JWT'}));
const p = base64url(JSON.stringify({sub:'admin',roles:['ROLE_ADMIN'],iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+3600}));
const s = crypto.createHmac('sha256', secret).update(h+'.'+p).digest('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const token = `${h}.${p}.${s}`;

async function testPay() {
  try {
    const res = await axios.post('http://localhost:8082/api/payments/payos/19', {}, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log("SUCCESS:", res.status, res.data);
  } catch (e) {
    if (e.response) {
      console.log("HTTP STATUS:", e.response.status);
      console.log("RAW RESPONSE DATA:", JSON.stringify(e.response.data));
    } else {
      console.log("ERROR:", e.message);
    }
  }
}
testPay();
