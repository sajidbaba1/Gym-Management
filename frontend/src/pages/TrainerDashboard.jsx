import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WelcomeCard from '../components/WelcomeCard';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Plus, MapPin, DollarSign, Briefcase, Clock, CheckCircle, XCircle, Trash2, Edit3, Image as ImageIcon, TrendingUp, Dumbbell, Zap, Users } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TrainerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', address: '', price: '', type: 'PERSONAL_TRAINING', image: ''
    });

    const fetchMyServices = async () => {
        try {
            const response = await axios.get('/api/v1/services/my');
            setServices(response.data);
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        fetchMyServices();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/v1/services', formData);
            toast.success("Training program submitted for review!");
            setIsModalOpen(false);
            fetchMyServices();
            setFormData({ name: '', description: '', address: '', price: '', type: 'PERSONAL_TRAINING', image: '' });
        } catch (error) { toast.error('Failed to list program'); }
    };

    const statsData = [
        { name: 'Week 1', revenue: 4500 },
        { name: 'Week 2', revenue: 7200 },
        { name: 'Week 3', revenue: 6800 },
        { name: 'Week 4', revenue: 12400 },
        { name: 'Week 5', revenue: 9500 },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }} className="dashboard-container">
            <Navbar title="Trainer Studio" />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                {/* Welcome Card */}
                <WelcomeCard
                    user={user}
                    roleSpecificMessage="Inspire lives and build champions. Manage your sessions and track your professional growth!"
                    quickActions={[
                        { label: 'Create Session', icon: Plus, onClick: () => setIsModalOpen(true) },
                        { label: 'My Programs', icon: Dumbbell, onClick: () => { } },
                        { label: 'Earnings', icon: DollarSign, onClick: () => navigate('/revenue') },
                        { label: 'Clients', icon: Users, onClick: () => navigate('/chat') }
                    ]}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {/* Growth Chart */}
                    <div className="glass card" style={{ padding: '2rem', gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '950', letterSpacing: '-0.02em' }}>EARNINGS PERFORMANCE</h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>Your weekly revenue growth</p>
                            </div>
                            <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1.25rem' }}>
                                <Plus size={18} /> NEW PROGRAM
                            </button>
                        </div>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={statsData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: '700' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)', fontWeight: '700' }} />
                                    <Tooltip
                                        contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', fontWeight: '800' }}
                                        itemStyle={{ color: 'var(--primary)' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stats Vertical */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="glass card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', border: 'none', padding: '2rem' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', opacity: 0.9, letterSpacing: '1px' }}>Monthly Revenue</p>
                            <h2 style={{ fontSize: '3rem', fontWeight: '950', margin: '0.5rem 0', letterSpacing: '-0.03em' }}>₹42,800</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '0.75rem', width: 'fit-content' }}>
                                <TrendingUp size={16} />
                                <p style={{ fontSize: '0.875rem', fontWeight: '900' }}>+22% GROWTH</p>
                            </div>
                        </div>
                        <div className="glass card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '1px' }}>Active Athletes</p>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '950' }}>56</h2>
                                </div>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '1rem', borderRadius: '1.25rem' }}>
                                    <Users size={28} />
                                </div>
                            </div>
                        </div>
                        <div className="glass card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '1px' }}>Session Requests</p>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '950' }}>12</h2>
                                </div>
                                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '1.25rem' }}>
                                    <Zap size={28} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '950', letterSpacing: '-0.02em' }}>ACTIVE PROGRAMS</h2>
                        <div style={{ width: '40px', height: '4px', background: 'var(--primary)', borderRadius: '2px', marginTop: '0.4rem' }}></div>
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: '700' }}>TOTAL: {services.length}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2.5rem' }}>
                    {services.map(service => (
                        <div key={service.id} className="glass card shadow-xl" style={{ padding: 0, overflow: 'hidden', borderRadius: '2rem', border: '1px solid var(--border)' }}>
                            <div style={{ height: '220px', position: 'relative' }}>
                                {service.image ? (
                                    <img src={service.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Dumbbell size={60} color="white" />
                                    </div>
                                )}
                                <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                                    <span style={{
                                        padding: '0.5rem 1rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: '900',
                                        background: service.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.9)' : service.status === 'REJECTED' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(255, 193, 7, 0.9)',
                                        color: 'white',
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        backdropFilter: 'blur(10px)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {service.status === 'APPROVED' ? <CheckCircle size={14} /> : service.status === 'REJECTED' ? <XCircle size={14} /> : <Clock size={14} />}
                                        {service.status}
                                    </span>
                                </div>
                            </div>
                            <div style={{ padding: '1.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.375rem', fontWeight: '900', marginBottom: '0.25rem' }}>{service.name}</h3>
                                        <p style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{service.type}</p>
                                    </div>
                                    <p style={{ fontWeight: '950', color: 'var(--foreground)', fontSize: '1.5rem' }}>₹{service.price}</p>
                                </div>
                                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem', marginBottom: '1.75rem', minHeight: '3em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>{service.description}</p>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button style={{ flex: 4, padding: '0.875rem', borderRadius: '1rem', background: 'var(--muted)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', border: '1px solid var(--border)', fontSize: '0.875rem' }} className="hover:border-primary">
                                        <Edit3 size={18} /> EDIT PROGRAM
                                    </button>
                                    <button style={{ flex: 1, padding: '0.875rem', borderRadius: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }} className="hover:bg-primary hover:text-white">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div style={{
                        position: 'fixed', inset: 0, zIndex: 99999,
                        background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1.5rem'
                    }} onClick={() => setIsModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            onClick={e => e.stopPropagation()}
                            className="glass card shadow-2xl"
                            style={{
                                width: '100%',
                                maxWidth: '1000px',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                padding: 0,
                                overflow: 'hidden',
                                borderRadius: '2.5rem'
                            }}
                        >
                            <div style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
                                <h2 style={{ marginBottom: '2.5rem', fontSize: '2rem', fontWeight: '950', letterSpacing: '-0.02em' }}>LAUNCH PROGRAM</h2>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.25rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Program Name</label>
                                            <input name="name" onChange={handleChange} required placeholder="Ex: Advanced Powerlifting" style={{ borderRadius: '1rem', padding: '1rem' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <label style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Fee (₹)</label>
                                            <input name="price" type="number" onChange={handleChange} required placeholder="1499" style={{ borderRadius: '1rem', padding: '1rem' }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Training Category</label>
                                        <select name="type" onChange={handleChange} style={{ width: '100%', borderRadius: '1rem', padding: '1rem' }}>
                                            <option value="PERSONAL_TRAINING">Personal Training</option>
                                            <option value="WEIGHT_LIFTING">Weight Lifting</option>
                                            <option value="YOGA">Yoga & Mindfulness</option>
                                            <option value="CARDIO">High Octane Cardio</option>
                                            <option value="GROUP_CLASSES">Group Combat</option>
                                            <option value="DIET_PLAN">Elite Nutrition Plan</option>
                                            <option value="CROSSFIT">CrossFit Pro</option>
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Location / Floor Address</label>
                                        <input name="address" onChange={handleChange} required placeholder="Section A, Main Hall" style={{ borderRadius: '1rem', padding: '1rem' }} />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Program Description</label>
                                        <textarea name="description" onChange={handleChange} required style={{ height: '120px', borderRadius: '1rem', padding: '1rem' }} placeholder="Detail the workout splits, goals, and targets..." />
                                    </div>

                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'transparent', fontWeight: '800', color: 'var(--muted-foreground)' }}>CANCEL</button>
                                        <button type="submit" className="btn-primary" style={{ flex: 2, padding: '1.125rem', fontWeight: '950', fontSize: '1rem', letterSpacing: '1px' }}>LAUNCH NOW</button>
                                    </div>
                                </form>
                            </div>

                            <div style={{ background: 'var(--muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', borderLeft: '1px solid var(--border)' }}>
                                <div style={{
                                    width: '100%', aspectRatio: '4/3', borderRadius: '2rem',
                                    background: 'var(--card)', border: '2px dashed var(--border)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden', position: 'relative',
                                    boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.2)'
                                }}>
                                    {formData.image ? (
                                        <img src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ background: 'var(--muted)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                                <ImageIcon size={40} color="var(--muted-foreground)" />
                                            </div>
                                            <p style={{ color: 'var(--muted-foreground)', fontSize: '1rem', fontWeight: '800' }}>COVER IMAGE</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.5rem' }}>Preview of your training program</p>
                                        </div>
                                    )}
                                    <label style={{
                                        position: 'absolute', bottom: '1.5rem',
                                        padding: '0.75rem 1.5rem', background: 'var(--primary)',
                                        color: 'white',
                                        borderRadius: '1rem', fontSize: '0.875rem', fontWeight: '900', cursor: 'pointer',
                                        boxShadow: '0 8px 15px rgba(239, 68, 68, 0.4)'
                                    }}>
                                        UPDATE PHOTO
                                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--card)', borderRadius: '1.5rem', border: '1px solid var(--border)' }}>
                                    <p style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <TrendingUp size={20} color="var(--primary)" /> ELITE LISTING TIPS
                                    </p>
                                    <ul style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontWeight: '600' }}>
                                        <li>• Professional gym action shots increase conversion by 40%.</li>
                                        <li>• Clearly state the target muscle groups or fitness goals.</li>
                                        <li>• Mention your certifications to build instant athlete trust.</li>
                                        <li>• Detail any equipment requirements for the athletes.</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

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

export default TrainerDashboard;
