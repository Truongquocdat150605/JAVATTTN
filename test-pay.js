const crypto = require('crypto');
const axios = require('axios');

// Basic Base64Url encode function
function base64url(source) {
  let encodedSource = Buffer.from(source).toString('base64');
  encodedSource = encodedSource.replace(/=+$/, '');
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');
  return encodedSource;
}

const secret = 'coffee-shop-jwt-secret-key-2024-lab06-spring-boot';

const header = {
  alg: 'HS256',
  typ: 'JWT'
};

const payload = {
  sub: 'admin',
  roles: ['ROLE_ADMIN'],
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (60 * 60)
};

const encodedHeader = base64url(JSON.stringify(header));
const encodedPayload = base64url(JSON.stringify(payload));

const signature = crypto.createHmac('sha256', secret)
  .update(encodedHeader + "." + encodedPayload)
  .digest('base64')
  .replace(/=+$/, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

const token = `${encodedHeader}.${encodedPayload}.${signature}`;

async function testPay() {
  try {
    const res = await axios.post('http://localhost:8082/api/payments/payos/19', {}, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log("Success:", res.data);
  } catch (e) {
    if (e.response) {
      console.log("Error Response Data:", e.response.data);
    } else {
      console.log("Error:", e.message);
    }
  }
}

testPay();
