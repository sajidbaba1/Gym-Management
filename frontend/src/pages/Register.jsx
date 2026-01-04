import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Mail, Lock, User, Dumbbell, ShieldCheck } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        role: 'MEMBER'
    });

    const { register } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="register-page"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--background), var(--muted))',
                padding: '2rem',
                position: 'relative'
            }}
        >
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass card"
                style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', zIndex: 1 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex', padding: '1rem',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        borderRadius: '1rem', marginBottom: '1rem', color: 'white'
                    }}>
                        <Dumbbell size={32} />
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Join the Gym</h1>
                    <p style={{ color: 'var(--muted-foreground)' }}>Start your transformation today</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>First Name</label>
                        <input
                            type="text"
                            placeholder="John"
                            value={formData.firstname}
                            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Last Name</label>
                        <input
                            type="text"
                            placeholder="Doe"
                            value={formData.lastname}
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                            <input
                                type="email"
                                placeholder="name@gym.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                style={{ width: '100%', paddingLeft: '2.75rem' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Join as</label>
                        <div className="tab-container" style={{ display: 'flex', background: 'var(--muted)', padding: '0.25rem', borderRadius: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'MEMBER' })}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    background: formData.role === 'MEMBER' ? 'var(--card)' : 'transparent',
                                    fontWeight: formData.role === 'MEMBER' ? '600' : '400',
                                    color: formData.role === 'MEMBER' ? 'var(--primary)' : 'var(--muted-foreground)'
                                }}
                            >
                                <User size={18} /> Member
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'TRAINER' })}
                                style={{
                                    flex: 1, padding: '0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                    background: formData.role === 'TRAINER' ? 'var(--card)' : 'transparent',
                                    fontWeight: formData.role === 'TRAINER' ? '600' : '400',
                                    color: formData.role === 'TRAINER' ? 'var(--primary)' : 'var(--muted-foreground)'
                                }}
                            >
                                <ShieldCheck size={18} /> Trainer
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                    Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign in</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
