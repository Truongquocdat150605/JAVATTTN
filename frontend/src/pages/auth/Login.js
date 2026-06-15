import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, Login as LoginIcon, Home as HomeIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import AuthService from '../../services/AuthService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

// Login.js - phần handleLogin
const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
        const user = await AuthService.login(username, password);
        // AuthService.login đã tự lưu token và user vào sessionStorage
        const role = String(user.role || '').toUpperCase();

        toast.success(`Chào mừng ${user.fullName || user.username} trở lại!`);

        if (role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else if (role === 'TENANT') {
            navigate('/');
        } else {
            setError('Tài khoản chưa có quyền hợp lệ');
        }
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
        setError(errorMessage);
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
};    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                width: '600px',
                height: '600px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                top: '-300px',
                left: '-300px',
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
                bottom: '-250px',
                right: '-250px',
            }
        }}>
            <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Paper elevation={0} sx={{ 
                        p: 4, 
                        borderRadius: 4, 
                        backdropFilter: 'blur(20px)',
                        background: 'rgba(255, 255, 255, 0.98)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        {/* Logo */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Box sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                boxShadow: '0 10px 25px -5px rgba(15,118,110,0.3)'
                            }}>
                                <HomeIcon sx={{ fontSize: 32, color: 'white' }} />
                            </Box>
                            <Typography variant="h4" sx={{ 
                                fontWeight: 900, 
                                background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 1
                            }}>
                                Smart Phòng Trọ
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Đăng nhập để quản lý phòng trọ của bạn
                            </Typography>
                        </Box>
                        
                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}
                        
                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth
                                label="Tên đăng nhập / Email"
                                margin="normal"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                                disabled={loading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: '#0f766e',
                                        },
                                    }
                                }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                margin="normal"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                disabled={loading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: '#0f766e',
                                        },
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                required
                            />
                            
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={!loading && <LoginIcon />}
                                sx={{ 
                                    mt: 4, 
                                    py: 1.5, 
                                    borderRadius: 2,
                                    background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 10px 20px rgba(15,118,110,0.3)'
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                            </Button>

                            <Box sx={{ mt: 2, textAlign: 'right' }}>
                                <Typography variant="body2">
                                    <Link
                                        to="/forgot-password"
                                        style={{
                                            color: '#0f766e',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </Typography>
                            </Box>
                        </form>
                        
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Chưa có tài khoản?{' '}
                                <Link to="/register" style={{ 
                                    color: '#0f766e', 
                                    fontWeight: 'bold',
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' }
                                }}>
                                    Đăng ký ngay
                                </Link>
                            </Typography>
                        </Box>

                        {/* Demo credentials hint */}
                        <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                                🔐 Demo tài khoản:
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                                Admin: admin / admin123
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                                Tenant: tenant / tenant123
                            </Typography>
                        </Box>
                    </Paper>
                </motion.div>
            </Container>
        </Box>
    );
};

export default Login;