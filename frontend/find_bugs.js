const axios = require('axios');

const API_URL = 'http://localhost:8082/api';
let tenantToken = '';
let adminToken = '';

async function runTests() {
    console.log('=== BẮT ĐẦU CHẠY SCRIPT TÌM BUG & BẢO MẬT ===\n');

    // 1. Lấy Token Admin và Tenant
    try {
        const adminRes = await axios.post(`${API_URL}/auth/login`, { username: 'admin', password: 'admin123' });
        adminToken = adminRes.data.token;
        
        const tenantRes = await axios.post(`${API_URL}/auth/login`, { username: 'nguyenvana', password: '123' }); 
        // Thay pass nếu cần, dùng tạm pass của sql cũ
        tenantToken = tenantRes.data.token;
    } catch (e) {
        console.log('⚠️ Không thể đăng nhập lấy token, đảm bảo bạn đã tạo tài khoản admin và nguyenvana với pass là admin123 và 123');
        // Fallback login
    }

    // Nếu không lấy được token từ database mẫu, tạo user mới
    if (!tenantToken) {
        try {
            const user = { username: `test${Date.now()}`, password: '123', fullName: 'Test', email: `t${Date.now()}@a.com`, phone: '099' };
            await axios.post(`${API_URL}/auth/register`, user);
            const r = await axios.post(`${API_URL}/auth/login`, { username: user.username, password: user.password });
            tenantToken = r.data.token;
        } catch (e) {
            console.log('Lỗi tạo user fallback');
        }
    }

    const tenantConfig = { headers: { Authorization: `Bearer ${tenantToken}` } };
    const adminConfig = { headers: { Authorization: `Bearer ${adminToken}` } };

    let bugCount = 0;

    const report = (name, passed, bugMsg) => {
        if (passed) {
            console.log(`✅ [PASS] ${name}`);
        } else {
            console.log(`❌ [BUG PHÁT HIỆN] ${name} -> ${bugMsg}`);
            bugCount++;
        }
    };

    // TEST 1: Kiểm tra bảo mật đầu cuối (Không có token)
    try {
        await axios.get(`${API_URL}/tenant/me`);
        report('Bảo mật API', false, 'API /tenant/me có thể truy cập mà không cần Token (Lỗi 401 bị bỏ qua)');
    } catch (err) {
        report('Bảo mật API (Không token)', err.response?.status === 401 || err.response?.status === 403, `HTTP Status sai: ${err.response?.status}`);
    }

    // TEST 2: Phân quyền (Tenant truy cập Admin API)
    if (tenantToken) {
        try {
            await axios.get(`${API_URL}/admin/dashboard/stats`, tenantConfig);
            report('Lỗi Phân Quyền (IDOR)', false, 'Tài khoản Khách Thuê có thể xem thống kê của Admin!');
        } catch (err) {
            report('Lỗi Phân Quyền (Tenant -> Admin)', err.response?.status === 403, `Chưa chặn đúng mã 403, mã trả về: ${err.response?.status}`);
        }
    }

    // TEST 3: Đăng ký trùng Username
    try {
        const userDuplicate = { username: `admin`, password: '123', fullName: 'Hack', email: `h@a.com`, phone: '099' };
        await axios.post(`${API_URL}/auth/register`, userDuplicate);
        report('Lỗi Trùng Lặp User', false, 'Hệ thống cho phép đăng ký trùng username "admin"!');
    } catch (err) {
        report('Bảo vệ Trùng Lặp User', err.response?.status === 400 || err.response?.status === 409 || err.response?.status === 500, 'Bắt lỗi thành công');
    }

    // TEST 4: SQL Injection cơ bản ở Login
    try {
        const sqlInjRes = await axios.post(`${API_URL}/auth/login`, { username: "' OR 1=1 --", password: "123" });
        report('Lỗ hổng SQL Injection', false, 'Đăng nhập thành công bằng câu lệnh SQL Bypass!');
    } catch (err) {
        report('Bảo vệ SQL Injection', true, '');
    }

    // TEST 5: Thiếu dữ liệu (Validation)
    try {
        await axios.post(`${API_URL}/auth/register`, { username: "no_password" });
        report('Lỗi Validation', false, 'Hệ thống cho phép tạo tài khoản mà không cần password hoặc email!');
    } catch (err) {
        report('Validation Input', err.response?.status === 400 || err.response?.status === 500, 'Có bắt lỗi thiếu field');
    }

    console.log(`\n=== TỔNG KẾT: PHÁT HIỆN ${bugCount} BUGS ===`);
    if (bugCount === 0) {
        console.log("Chúc mừng! Backend của bạn rất vững chắc cơ bản.");
    } else {
        console.log("Vui lòng fix các bug được đánh dấu ❌ ở trên trong Spring Boot Backend.");
    }
}

runTests();
