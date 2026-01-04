import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Mail, Lock, Dumbbell } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isOtpMode, setIsOtpMode] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const { login, loginWithOtp } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    const handleRedirect = () => {
        const role = localStorage.getItem('role');
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') navigate('/admin-dashboard');
        else if (role === 'TRAINER') navigate('/trainer-dashboard');
        else navigate('/member-dashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isOtpMode) {
                if (!otpSent) {
                    await axios.post('/api/v1/auth/send-otp', { email });
                    setOtpSent(true);
                } else {
                    await loginWithOtp(email, otp);
                    handleRedirect();
                }
            } else {
                await login(email, password);
                handleRedirect();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="login-page"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--background), var(--muted))',
                padding: '1rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative background elements */}
            <div style={{
                position: 'absolute', top: '-10%', left: '-10%',
                width: '40%', height: '40%', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                opacity: 0.1, zIndex: 0
            }}></div>
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-10%',
                width: '40%', height: '40%', borderRadius: '50%',
                background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)',
                opacity: 0.1, zIndex: 0
            }}></div>

            <button
                onClick={toggleDarkMode}
                className="theme-toggle glass"
                style={{
                    position: 'absolute', top: '2rem', right: '2rem',
                    padding: '0.75rem', borderRadius: '50%',
                    color: darkMode ? '#fbbf24' : '#ef4444',
                    zIndex: 10
                }}
            >
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass card"
                style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', zIndex: 1, position: 'relative' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex', padding: '1rem',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        borderRadius: '1rem', marginBottom: '1rem', color: 'white'
                    }}>
                        <Dumbbell size={32} />
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Your fitness journey continues here</p>
                </div>

                <div className="tab-container" style={{
                    display: 'flex', background: 'var(--muted)',
                    padding: '0.25rem', borderRadius: '0.75rem', marginBottom: '1.5rem'
                }}>
                    <button
                        onClick={() => { setIsOtpMode(false); setOtpSent(false); }}
                        style={{
                            flex: 1, padding: '0.5rem', borderRadius: '0.5rem',
                            background: !isOtpMode ? 'var(--card)' : 'transparent',
                            fontWeight: !isOtpMode ? '600' : '400',
                            color: !isOtpMode ? 'var(--primary)' : 'var(--muted-foreground)'
                        }}
                    >
                        Password
                    </button>
                    <button
                        onClick={() => setIsOtpMode(true)}
                        style={{
                            flex: 1, padding: '0.5rem', borderRadius: '0.5rem',
                            background: isOtpMode ? 'var(--card)' : 'transparent',
                            fontWeight: isOtpMode ? '600' : '400',
                            color: isOtpMode ? 'var(--primary)' : 'var(--muted-foreground)'
                        }}
                    >
                        OTP
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                            <input
                                type="email"
                                placeholder="name@gym.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                    </div>

                    {!isOtpMode ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', paddingLeft: '2.75rem' }}
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        otpSent && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Enter OTP</label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{ width: '100%', textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.25rem' }}
                                    required
                                />
                            </div>
                        )
                    )}

                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                        {isOtpMode ? (otpSent ? 'Login' : 'Send OTP') : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    Ready to transform? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Join the gym</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
