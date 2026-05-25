import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AuthService from '../../services/AuthService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await AuthService.login(username, password);
            const role = String(user.role || '').toUpperCase();

            localStorage.setItem('token', user.token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Đăng nhập thành công');

            if (role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (role === 'TENANT') {
                navigate('/');
            } else {
                setError('Tài khoản chưa có quyền hợp lệ');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng');
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' 
        }}>
            <Container maxWidth="xs">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Paper elevation={10} sx={{ p: 4, borderRadius: 4, backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.95)' }}>
                        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            QUẢN LÝ PHÒNG TRỌ
                        </Typography>
                        <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
                            Đăng nhập để quản lý tài khoản của bạn
                        </Typography>
                        
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        
                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Tên đăng nhập"
                                margin="normal"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Mật khẩu"
                                type="password"
                                margin="normal"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{ 
                                    mt: 3, 
                                    py: 1.5, 
                                    borderRadius: 3, 
                                    background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
                                    fontWeight: 'bold'
                                }}
                            >
                                ĐĂNG NHẬP
                            </Button>
                        </form>
                        
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                Chưa có tài khoản? <Link to="/register" style={{ color: '#2563eb', fontWeight: 'bold' }}>Đăng ký ngay</Link>
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;
