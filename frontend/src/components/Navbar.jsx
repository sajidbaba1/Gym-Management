import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Heart, MessageSquare, Wallet, User, LogOut, Settings, Sun, Moon, Home, Dumbbell, Shield, Menu, X } from 'lucide-react';
import axios from 'axios';

const Navbar = ({ title = "GymPro" }) => {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/v1/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`/api/v1/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const NavLink = ({ to, label, icon: Icon, onClick }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} onClick={onClick} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem', borderRadius: '2rem',
                textDecoration: 'none', fontSize: '0.875rem', fontWeight: '700',
                background: isActive ? 'var(--primary)' : 'transparent',
                color: isActive ? 'white' : 'var(--muted-foreground)',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
            }}>
                <Icon size={18} />
                <span className="nav-label">{label}</span>
            </Link>
        );
    };

    const navItems = [
        { to: "/member-dashboard", label: "Dashboard", icon: Home },
        user?.role === 'MEMBER' && { to: "/favorites", label: "My Favorites", icon: Heart },
        (user?.role === 'MEMBER' || user?.role === 'TRAINER') && { to: "/chat", label: "Messages", icon: MessageSquare },
        (user?.role === 'MEMBER' || user?.role === 'TRAINER') && { to: "/wallet", label: "Wallet", icon: Wallet },
        (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && { to: "/admin-dashboard", label: "Admin Panel", icon: Settings },
        user?.role === 'SUPER_ADMIN' && { to: "/manage-admins", label: "Staff", icon: Shield }
    ].filter(Boolean);

    return (
        <>
            <nav className="glass" style={{
                position: 'sticky', top: 0, zIndex: 100,
                height: '80px', display: 'flex', alignItems: 'center',
                padding: '0 1.5rem', borderBottom: '1px solid var(--border)',
                background: 'var(--card)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginRight: 'auto' }}>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="mobile-only"
                        style={{ background: 'transparent', color: 'var(--foreground)', padding: '0.25rem' }}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
                        <div style={{
                            width: '40px', height: '40px', background: 'var(--primary)',
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                        }}>
                            <Dumbbell size={22} />
                        </div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.02em', textTransform: 'uppercase' }} className="nav-title">
                            GYM<span style={{ color: 'var(--primary)' }}>PRO</span>
                        </h1>
                    </Link>
                </div>

                <div className="nav-links desktop-only" style={{ alignItems: 'center', gap: '0.5rem', margin: '0 1.5rem' }}>
                    {navItems.map(item => (
                        <NavLink key={item.to} {...item} />
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
                    <button onClick={toggleDarkMode} style={{
                        background: 'var(--muted)', padding: '0.625rem',
                        borderRadius: '0.75rem', color: 'var(--foreground)',
                        border: '1px solid var(--border)', transition: 'all 0.2s'
                    }} className="hover:scale-110">
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button onClick={() => setIsNotifOpen(!isNotifOpen)} style={{
                            background: 'var(--muted)', padding: '0.6125rem',
                            borderRadius: '0.75rem', color: 'var(--foreground)',
                            position: 'relative', border: '1px solid var(--border)',
                            transition: 'all 0.2s'
                        }} className="hover:scale-110">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-6px', right: '-6px',
                                    background: 'var(--primary)', color: 'white', fontSize: '10px',
                                    width: '18px', height: '18px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: '900', border: '2px solid var(--card)'
                                }}>{unreadCount}</span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="glass card shadow-xl"
                                    style={{
                                        position: 'absolute', right: 0, top: '100%', marginTop: '1rem',
                                        width: '320px', maxHeight: '450px', overflowY: 'auto', zIndex: 100,
                                        padding: '1.25rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '800' }}>Notifications</h3>
                                        <span style={{ fontSize: '0.75rem', background: 'var(--muted)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>{unreadCount} New</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {notifications.length === 0 ? <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textAlign: 'center', padding: '1rem' }}>No new notifications</p> : (
                                            notifications.map(n => (
                                                <div key={n.id} onClick={() => markAsRead(n.id)} style={{
                                                    padding: '1rem', borderRadius: '1rem',
                                                    background: n.read ? 'transparent' : 'var(--muted)',
                                                    cursor: 'pointer', border: '1px solid var(--border)',
                                                    transition: 'all 0.2s'
                                                }} className="hover:border-primary">
                                                    <p style={{ fontSize: '0.875rem', lineHeight: 1.4, marginBottom: '0.5rem' }}>{n.message}</p>
                                                    <small style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>{new Date(n.createdAt).toLocaleTimeString()}</small>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <div style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                background: 'var(--muted)', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', overflow: 'hidden',
                                border: '2px solid var(--border)', transition: 'all 0.2s'
                            }} className="hover:border-primary">
                                {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={22} />}
                            </div>
                        </div>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="glass card shadow-xl"
                                    style={{ position: 'absolute', right: 0, top: '100%', marginTop: '1rem', width: '220px', padding: '0.75rem', zIndex: 100 }}
                                >
                                    <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                                        <p style={{ fontWeight: '800', fontSize: '0.9375rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.firstname} {user?.lastname}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email}</p>
                                    </div>
                                    <button style={{
                                        width: '100%', textAlign: 'left', padding: '0.75rem',
                                        background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '0.75rem',
                                        fontSize: '0.875rem', fontWeight: '600'
                                    }} className="hover:bg-muted">
                                        <Settings size={18} /> Settings
                                    </button>
                                    <button onClick={logout} style={{
                                        width: '100%', textAlign: 'left', padding: '0.75rem',
                                        background: 'transparent', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '0.75rem',
                                        fontSize: '0.875rem', fontWeight: '700'
                                    }} className="hover:bg-muted">
                                        <LogOut size={18} /> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <style>{`
                    .desktop-only { display: flex !important; }
                    .mobile-only { display: none !important; }
                    
                    @media (max-width: 1024px) {
                        .nav-label { display: none !important; }
                    }

                    @media (max-width: 768px) {
                        .desktop-only { display: none !important; }
                        .mobile-only { display: block !important; }
                    }
                `}</style>
            </nav>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                        display: 'flex'
                    }} onClick={() => setIsMobileMenuOpen(false)}>
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                            style={{
                                width: 'min(300px, 85vw)',
                                height: '100%',
                                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                                boxShadow: '20px 0 50px rgba(0,0,0,0.5)',
                                padding: '2rem 1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                borderRight: '1px solid var(--border)',
                                position: 'relative'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px', height: '40px', background: 'var(--primary)',
                                        borderRadius: '12px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', color: 'white',
                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                                    }}>
                                        <Dumbbell size={24} />
                                    </div>
                                    <span style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-1px', color: 'var(--foreground)' }}>GYM<span style={{ color: 'var(--primary)' }}>PRO</span></span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'var(--muted)', color: 'var(--foreground)', padding: '0.5rem', borderRadius: '0.875rem' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            {user && (
                                <div style={{
                                    padding: '1.25rem',
                                    background: 'var(--muted)',
                                    borderRadius: '1.5rem',
                                    marginBottom: '1rem',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                                            {user?.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={24} />}
                                        </div>
                                        <div style={{ overflow: 'hidden' }}>
                                            <p style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--foreground)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.firstname} {user.lastname}</p>
                                            <p style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {navItems.map(item => (
                                    <NavLink key={item.to} {...item} onClick={() => setIsMobileMenuOpen(false)} />
                                ))}
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                <button onClick={logout} style={{
                                    width: '100%', textAlign: 'left', padding: '1.125rem',
                                    background: 'rgba(239, 68, 68, 0.1)', color: 'var(--primary)',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    borderRadius: '1.25rem', fontWeight: '800'
                                }}>
                                    <LogOut size={20} /> Logout
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
