import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WelcomeCard from '../components/WelcomeCard';
import BroadcastModal from '../components/BroadcastModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, Calendar, CreditCard, CheckCircle, XCircle, Clock, Trash2, Shield, TrendingUp, DollarSign, Send, Dumbbell, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('analytics');
    const [pendingServices, setPendingServices] = useState([]);
    const [users, setUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalServices: 0, totalBookings: 0, totalRevenue: 0 });
    const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

    const fetchStats = async () => {
        try { const res = await axios.get('/api/v1/admin/analytics/stats'); setStats(res.data); } catch (e) { }
    };
    const fetchUsers = async () => {
        try { const res = await axios.get('/api/v1/users'); setUsers(res.data); } catch (e) { }
    };
    const fetchPending = async () => {
        try { const res = await axios.get('/api/v1/services/pending'); setPendingServices(res.data); } catch (e) { }
    };
    const fetchTransactions = async () => {
        try { const res = await axios.get('/api/v1/admin/transactions'); setTransactions(res.data); } catch (e) { }
    };

    useEffect(() => {
        if (activeTab === 'analytics') fetchStats();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'pending') fetchPending();
        if (activeTab === 'transactions') fetchTransactions();
    }, [activeTab]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/api/v1/services/${id}/status?status=${status}`);
            fetchPending();
            toast.success(`Training program ${status.toLowerCase()}!`);
        } catch (error) { toast.error("Update failed"); }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Erase this athlete from the records?')) {
            try {
                await axios.delete(`/api/v1/users/${id}`);
                toast.success('Member removed');
                fetchUsers();
            } catch (e) { toast.error('Failed to remove member'); }
        }
    };

    const chartData = transactions.slice(0, 7).reverse().map(t => ({
        date: new Date(t.createdAt).toLocaleDateString(),
        amount: t.amount
    }));

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }} className="dashboard-container">
            <Navbar title="HQ Dashboard" />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {/* Welcome Card */}
                <WelcomeCard
                    user={user}
                    roleSpecificMessage="Oversee the empire. Monitor session volume, approve elite trainers, and ensure peak performance."
                    quickActions={[
                        { label: 'Push Alert', icon: Send, onClick: () => setIsBroadcastModalOpen(true) },
                        { label: 'High Command', icon: Shield, onClick: () => navigate('/manage-admins') },
                        { label: 'Revenue HQ', icon: DollarSign, onClick: () => navigate('/revenue') },
                        { label: 'Global Insights', icon: TrendingUp, onClick: () => setActiveTab('analytics') }
                    ]}
                />

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2.5rem',
                    borderBottom: '1px solid var(--border)',
                    overflowX: 'auto',
                    paddingBottom: '2px'
                }} className="no-scrollbar">
                    {[
                        { id: 'analytics', label: 'ANALYTICS HQ', icon: TrendingUp },
                        { id: 'users', label: 'ATHLETE ROSTER', icon: Users },
                        { id: 'pending', label: 'PENDING APPROVALS', icon: Clock, count: pendingServices.length },
                        { id: 'transactions', label: 'LEDGER', icon: CreditCard }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.75rem',
                                background: 'transparent', border: 'none',
                                borderBottom: activeTab === tab.id ? '4px solid var(--primary)' : '4px solid transparent',
                                color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)',
                                fontWeight: '950', cursor: 'pointer', whiteSpace: 'nowrap',
                                fontSize: '0.875rem', letterSpacing: '1px', transition: 'all 0.3s'
                            }}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                            {tab.count > 0 && <span style={{ background: 'var(--primary)', color: 'white', padding: '0.1rem 0.6rem', borderRadius: '2rem', fontSize: '0.7rem' }}>{tab.count}</span>}
                        </button>
                    ))}
                </div>

                <div className="glass card shadow-2xl" style={{ minHeight: '600px', padding: 0, overflow: 'hidden', borderRadius: '2.5rem', border: '1px solid var(--border)' }}>
                    {activeTab === 'analytics' && (
                        <div style={{ padding: '3rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                                {[
                                    { label: 'TOTAL ATHLETES', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
                                    { label: 'TRAINING PROGRAMS', value: stats.totalServices, icon: Dumbbell, color: '#8b5cf6' },
                                    { label: 'SESSION VOLUME', value: stats.totalBookings, icon: Calendar, color: '#10b981' },
                                    { label: 'REVENUE HQ', value: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'var(--primary)' }
                                ].map((s, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass card"
                                        style={{ background: 'var(--muted)', padding: '2rem' }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                            <div style={{ padding: '0.75rem', borderRadius: '1rem', background: 'var(--card)', color: s.color, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                                <s.icon size={24} />
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
                                        <h3 style={{ fontSize: '2.25rem', fontWeight: '950', letterSpacing: '-0.03em', marginTop: '0.5rem' }}>{s.value}</h3>
                                    </motion.div>
                                ))}
                            </div>

                            <div style={{ height: '350px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                                    <div style={{ width: '30px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '950', letterSpacing: '-0.02em' }}>NETWORK INCOME DYNAMICS</h3>
                                </div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="date" hide />
                                        <Tooltip
                                            contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', fontWeight: '800' }}
                                            itemStyle={{ color: 'var(--primary)' }}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="var(--primary)" fill="url(#adminRev)" strokeWidth={4} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--muted)', textAlign: 'left' }}>
                                    <tr>
                                        <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>ATHLETE</th>
                                        <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>RANK / ROLE</th>
                                        <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>SECURE EMAIL</th>
                                        <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'right' }}>OPERATIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-muted/50">
                                            <td style={{ padding: '1.5rem 2.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                                    <div style={{
                                                        width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '1rem', fontWeight: '950', color: 'white', overflow: 'hidden',
                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                                    }}>
                                                        {u.avatar ? <img src={u.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : u.firstname[0]}
                                                    </div>
                                                    <span style={{ fontWeight: '800', fontSize: '1rem' }}>{u.firstname} {u.lastname}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.5rem 2.5rem' }}>
                                                <span style={{
                                                    padding: '0.4rem 1rem', borderRadius: '0.875rem', fontSize: '0.75rem', fontWeight: '900',
                                                    background: u.role === 'ADMIN' ? 'rgba(126, 34, 206, 0.1)' : u.role === 'TRAINER' ? 'rgba(29, 78, 216, 0.1)' : 'rgba(21, 128, 61, 0.1)',
                                                    color: u.role === 'ADMIN' ? '#7e22ce' : u.role === 'TRAINER' ? '#1d4ed8' : '#15803d',
                                                    textTransform: 'uppercase', letterSpacing: '1px'
                                                }}>{u.role}</span>
                                            </td>
                                            <td style={{ padding: '1.5rem 2.5rem', fontSize: '0.9375rem', fontWeight: '600', color: 'var(--muted-foreground)' }}>{u.email}</td>
                                            <td style={{ padding: '1.5rem 2.5rem', textAlign: 'right' }}>
                                                <button onClick={() => handleDeleteUser(u.id)} style={{ padding: '0.75rem', borderRadius: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--primary)', border: 'none', transition: 'all 0.2s' }} className="hover:bg-primary hover:text-white"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'pending' && (
                        <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {pendingServices.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--muted)', borderRadius: '2rem', border: '2px dashed var(--border)' }}>
                                    <CheckCircle size={60} style={{ margin: '0 auto 1.5rem', opacity: 0.2, color: '#10b981' }} />
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>HQ CLEARED</h3>
                                    <p style={{ color: 'var(--muted-foreground)', fontWeight: '600' }}>No training programs currently awaiting approval.</p>
                                </div>
                            ) : (
                                pendingServices.map(p => (
                                    <div key={p.id} className="glass card" style={{ display: 'flex', gap: '2rem', background: 'var(--muted)', padding: '2rem', borderRadius: '2rem' }}>
                                        <div style={{ width: '200px', height: '140px', borderRadius: '1.25rem', overflow: 'hidden', position: 'relative' }}>
                                            {p.image ? (
                                                <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Dumbbell size={40} color="white" />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '950', marginBottom: '0.25rem' }}>{p.name}</h3>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.type}</p>
                                                </div>
                                                <span style={{ fontWeight: '950', fontSize: '1.75rem' }}>₹{p.price}</span>
                                            </div>
                                            <p style={{ fontSize: '0.9375rem', color: 'var(--muted-foreground)', margin: '1rem 0', lineHeight: 1.6, fontWeight: '600' }}>{p.description}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontWeight: '700', fontSize: '0.875rem' }}>
                                                    <Shield size={16} />
                                                    PROPOSED BY TRAINER
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <button onClick={() => handleStatusUpdate(p.id, 'APPROVED')} className="btn-primary" style={{ padding: '0.75rem 1.75rem', background: '#10b981', fontSize: '0.875rem', fontWeight: '900' }}>GRANT PERMISSION</button>
                                                    <button onClick={() => handleStatusUpdate(p.id, 'REJECTED')} style={{ padding: '0.75rem 1.75rem', borderRadius: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--primary)', fontWeight: '900', border: '1px solid var(--primary)', fontSize: '0.875rem' }}>DENY ACCESS</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: 'var(--muted)', textAlign: 'left' }}>
                                    <tr>
                                        <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>LOG ID</th>
                                        <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>ENTRY TYPE</th>
                                        <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>CAPITAL VOLUME</th>
                                        <th style={{ padding: '1.5rem 2.5rem', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>TIMESTAMP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-muted/50">
                                            <td style={{ padding: '1.5rem 2.5rem', fontFamily: 'monospace', fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)' }}>{t.transactionId || t.id.slice(0, 8).toUpperCase()}</td>
                                            <td style={{ padding: '1.5rem 2.5rem' }}>
                                                <span style={{
                                                    padding: '0.4rem 0.8rem', borderRadius: '0.75rem', fontSize: '0.7rem', fontWeight: '950',
                                                    background: 'var(--card)', color: 'var(--foreground)', border: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '1px'
                                                }}>{t.type}</span>
                                            </td>
                                            <td style={{ padding: '1.5rem 2.5rem', fontWeight: '950', fontSize: '1.125rem' }}>₹{t.amount}</td>
                                            <td style={{ padding: '1.5rem 2.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>{new Date(t.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <BroadcastModal
                isOpen={isBroadcastModalOpen}
                onClose={() => setIsBroadcastModalOpen(false)}
            />

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .dashboard-container {
                    max-width: 100vw;
                    overflow-x: hidden;
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
