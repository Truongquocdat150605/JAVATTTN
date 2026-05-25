import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:8082/api',
  // Không set Content-Type mặc định ở đây để tránh ghi đè khi gửi FormData (upload QR/image...)
});

// Attach JWT token cho cấu trúc Stateless
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isAuthRequest = String(config.url || '').startsWith('/auth/');
    // Các request công khai không yêu cầu token
    const isPublicRequest = String(config.url || '').startsWith('/public/') || String(config.url || '').startsWith('/rooms/');

    if (token && !isAuthRequest && !isPublicRequest) { // Thêm !isPublicRequest vào điều kiện gửi token
      // đảm bảo headers tồn tại
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const isLoginRequest = String(error.config?.url || '').includes('/auth/login');
    // Các request công khai không nên bị điều hướng về login khi 401
    const isPublicRequest = String(error.config?.url || '').startsWith('/public/') || String(error.config?.url || '').startsWith('/rooms/');

    if (status === 401) {
      if (!isLoginRequest && !isPublicRequest) { // Thêm !isPublicRequest vào điều kiện điều hướng
        localStorage.clear();
        toast.error('Phiên đăng nhập hết hạn');
        window.location.href = '/login';
      }
    }

    if (status === 403) {
      toast.error('Bạn không có quyền truy cập');
      if (window.location.pathname !== '/unauthorized') {
        window.location.href = '/unauthorized';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
