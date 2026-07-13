import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8082') + '/api',
  // Không set Content-Type mặc định ở đây để tránh ghi đè khi gửi FormData (upload QR/image...)
});

// Attach JWT token cho cấu trúc Stateless
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    const url = String(config.url || '');
    const method = String(config.method || 'get').toLowerCase();
    const isAuthenticatedAuthRequest = url === '/auth/change-password';
    const isAuthRequest = url.startsWith('/auth/') && !isAuthenticatedAuthRequest;
    // Các request công khai không yêu cầu token
    const isPublicRoomsRequest = method === 'get' && (url === '/rooms' || url.startsWith('/rooms/'));
    const isPublicRequest = url.startsWith('/public/') || isPublicRoomsRequest;

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
    const url = String(error.config?.url || '');
    const method = String(error.config?.method || 'get').toLowerCase();
    // Các request công khai không nên bị điều hướng về login khi 401
    const isPublicRoomsRequest = method === 'get' && (url === '/rooms' || url.startsWith('/rooms/'));
    const isPublicRequest = url.startsWith('/public/') || isPublicRoomsRequest;

    if (status === 401) {
      if (!isLoginRequest && !isPublicRequest) { // Thêm !isPublicRequest vào điều kiện điều hướng
        sessionStorage.clear();
        toast.error('Phiên đăng nhập hết hạn');
        window.location.href = '/login';
      }
    }

    if (status === 403 && !isPublicRequest) {
      toast.error('Bạn không có quyền truy cập');
      if (window.location.pathname !== '/unauthorized') {
        window.location.href = '/unauthorized';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
