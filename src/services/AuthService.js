import api from './api';

const AuthService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
        }
        return response;
    },
    
    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default AuthService;
