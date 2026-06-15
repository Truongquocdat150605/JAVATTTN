import api from './api';

const AuthService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.token) {
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('user', JSON.stringify(response));
        }
        return response;
    },
    
    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },
    
    logout: () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default AuthService;
