const axios = require('axios');

async function testBackend() {
  try {
    // Authenticate as a user or admin to get a token
    const loginRes = await axios.post('http://localhost:8082/api/auth/login', {
      username: 'admin', // assuming admin/admin exists
      password: 'admin'
    });
    
    const token = loginRes.data.token;
    
    // Call the payment API
    const payRes = await axios.post('http://localhost:8082/api/payments/payos/19', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("Success:", payRes.data);
  } catch (err) {
    if (err.response) {
      console.error("Backend Error Response:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

testBackend();
