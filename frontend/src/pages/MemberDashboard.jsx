import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WelcomeCard from '../components/WelcomeCard';
import ServiceCarousel from '../components/ServiceCarousel';
import ServiceDetailModal from '../components/ServiceDetailModal';
import ReviewModal from '../components/ReviewModal';
import BookingCalendar from '../components/BookingCalendar';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Search, Heart, Calendar as CalendarIcon, Star, MapPin, DollarSign, Dumbbell, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MemberDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('explore');
    const [services, setServices] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [search, setSearch] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Modal states
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Booking form
    const [bookingDate, setBookingDate] = useState('');

    useEffect(() => {
        fetchServices();
        fetchFavorites();
        if (activeTab === 'bookings' || activeTab === 'calendar') {
            fetchMyBookings();
        }
    }, [activeTab]);

    const fetchServices = async () => {
        try {
            const response = await axios.get('/api/v1/services');
            setServices(response.data.filter(s => s.status === 'APPROVED'));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const res = await axios.get('/api/v1/favorites');
            setFavorites(new Set(res.data.map(s => s.id)));
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMyBookings = async () => {
        try {
            const response = await axios.get('/api/v1/bookings/my');
            setMyBookings(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async (e, id) => {
        e.stopPropagation();
        try {
            const res = await axios.post(`/api/v1/favorites/${id}`);
            if (res.data.status) {
                setFavorites(new Set([...favorites, id]));
                toast.success("Added to favorites!", { icon: '❤️' });
            } else {
                const newFavorites = new Set(favorites);
                newFavorites.delete(id);
                setFavorites(newFavorites);
                toast.success("Removed from favorites", { icon: '💔' });
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleServiceClick = (service) => {
        setSelectedService(service);
        setIsDetailsModalOpen(true);
    };

    const handleBookNow = (service) => {
        setSelectedService(service);
        setIsBookingModalOpen(true);
        setBookingDate('');
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!bookingDate) {
            toast.error('Please select a training slot');
            return;
        }

        const toastId = toast.loading('Securing your spot...');

        try {
            const response = await axios.post('/api/v1/bookings', {
                serviceId: selectedService.id,
                bookingDate: new Date(bookingDate).toISOString(),
                totalAmount: selectedService.price
            });

            toast.success('Session Booked! Get ready to sweat.', { id: toastId });
            setIsBookingModalOpen(false);
            fetchMyBookings();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Booking failed';

            if (msg.toLowerCase().includes('insufficient funds') || error.response?.status === 500) {
                toast.error('Insufficient Wallet Balance! Add funds to continue.', { id: toastId });
                setTimeout(() => navigate('/wallet'), 2000);
            } else {
                toast.error(msg, { id: toastId });
            }
        }
    };

    const handleReviewClick = (booking) => {
        setSelectedBooking(booking);
        setIsReviewModalOpen(true);
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())
    );

    const quickActions = [
        { label: 'Explore Training', icon: Search, onClick: () => setActiveTab('explore') },
        { label: 'My Schedule', icon: CalendarIcon, onClick: () => setActiveTab('calendar') },
        { label: 'Saved Plans', icon: Heart, onClick: () => navigate('/favorites') },
        { label: 'Top-up Wallet', icon: DollarSign, onClick: () => navigate('/wallet') }
    ];

    return (
        <div className="min-h-screen bg-black transition-colors duration-300 dashboard-container">
            <Navbar title="Member Portal" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Card */}
                <WelcomeCard
                    user={user}
                    roleSpecificMessage="Push past your limits today. Your transformation starts with the next rep!"
                    quickActions={quickActions}
                />

                {/* Performance Stats (Member Specific) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {[
                        { label: 'Total Sessions', value: myBookings.length, icon: Dumbbell, color: 'var(--primary)' },
                        { label: 'Current Streak', value: '5 Days', icon: Zap, color: 'var(--accent)' },
                        { label: 'Wallet Balance', value: `₹${user?.walletBalance || 0}`, icon: DollarSign, color: '#10b981' },
                        { label: 'Fitness Level', value: 'Elite', icon: TrendingUp, color: '#6366f1' }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass card"
                            style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
                        >
                            <div style={{ padding: '0.875rem', background: stat.color, borderRadius: '1rem', color: 'white' }}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: '950' }}>{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2.5rem',
                    borderBottom: '1px solid var(--border)',
                    overflowX: 'auto',
                    paddingBottom: '2px'
                }} className="no-scrollbar">
                    {[
                        { id: 'explore', label: 'Explore Programs', icon: Search },
                        { id: 'bookings', label: 'My Sessions', icon: Dumbbell },
                        { id: 'calendar', label: 'Training Calendar', icon: CalendarIcon }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.625rem',
                                padding: '1rem 1.5rem',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab.id ? '4px solid var(--primary)' : '4px solid transparent',
                                color: activeTab === tab.id ? 'var(--foreground)' : 'var(--muted-foreground)',
                                fontWeight: '900',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                                fontSize: '0.875rem',
                                letterSpacing: '1px',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'explore' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Search */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <div style={{ position: 'relative', maxWidth: '650px', width: '100%' }}>
                                    <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-foreground)' }} size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search for trainers, yoga, crossfit..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '1.125rem 1.25rem 1.125rem 3.5rem',
                                            borderRadius: '1.5rem',
                                            border: '1px solid var(--border)',
                                            background: 'var(--card)',
                                            fontSize: '1rem',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                                            fontWeight: '600'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Featured Programs */}
                            <div style={{ marginBottom: '4rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: '950', letterSpacing: '-0.02em' }}>TOP-RATED PROGRAMS</h2>
                                        <div style={{ width: '40px', height: '4px', background: 'var(--primary)', borderRadius: '2px', marginTop: '0.25rem' }}></div>
                                    </div>
                                    <button style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.875rem' }}>SEE ALL</button>
                                </div>
                                <ServiceCarousel services={services.slice(0, 10)} onServiceClick={handleServiceClick} />
                            </div>

                            {/* All Programs Grid */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 0.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '950', letterSpacing: '-0.02em' }}>ALL TRAINING PROGRAMS</h2>
                                    <div style={{ width: '40px', height: '4px', background: 'var(--primary)', borderRadius: '2px', marginTop: '0.25rem' }}></div>
                                </div>
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 100%, 360px), 1fr))',
                                gap: '2rem',
                                width: '100%'
                            }}>
                                {filteredServices.map(service => (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -10 }}
                                        className="glass card"
                                        onClick={() => handleServiceClick(service)}
                                        style={{
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            padding: 0,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: '1.75rem',
                                            border: '1px solid var(--border)'
                                        }}
                                    >
                                        <button
                                            onClick={(e) => toggleFavorite(e, service.id)}
                                            style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
                                                background: 'rgba(0, 0, 0, 0.4)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '0.75rem',
                                                width: '42px',
                                                height: '42px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                zIndex: 10,
                                            }}
                                        >
                                            <Heart
                                                size={20}
                                                fill={favorites.has(service.id) ? 'var(--primary)' : 'none'}
                                                color={favorites.has(service.id) ? 'var(--primary)' : 'white'}
                                            />
                                        </button>

                                        <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                                            {service.image ? (
                                                <img src={service.image} alt={service.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                                                    <Dumbbell size={50} color="white" />
                                                </div>
                                            )}
                                            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'var(--primary)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '0.625rem', fontSize: '0.875rem', fontWeight: '900' }}>
                                                ₹{service.price}
                                            </div>
                                        </div>

                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, lineHeight: 1.2 }}>{service.name}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(255,193,7,0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                                                    <Star size={14} fill="#ffc107" color="#ffc107" />
                                                    <span style={{ fontWeight: '900', fontSize: '0.8125rem', color: '#ffc107' }}>4.9</span>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                <Zap size={14} />
                                                <span>{service.category}</span>
                                            </div>

                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleBookNow(service); }}
                                                    className="btn-primary"
                                                    style={{ flex: 1, padding: '0.875rem', fontSize: '0.875rem', fontWeight: '900', borderRadius: '1rem' }}
                                                >
                                                    BOOK SESSION
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'bookings' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.75rem', fontWeight: '950' }}>MY TRAINING HISTORY</h2>
                                    <div style={{ width: '40px', height: '4px', background: 'var(--primary)', borderRadius: '2px', marginTop: '0.4rem' }}></div>
                                </div>
                            </div>

                            {myBookings.length === 0 ? (
                                <div className="glass card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                                    <Dumbbell size={60} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>NO SESSIONS YET</h3>
                                    <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>Ready to start your journey? Explore our training programs.</p>
                                    <button onClick={() => setActiveTab('explore')} className="btn-primary" style={{ padding: '0.875rem 2rem' }}>Find Training</button>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(300px, 100%, 450px), 1fr))', gap: '2rem' }}>
                                    {myBookings.filter(b => b.service).map(booking => (
                                        <div key={booking.id} className="glass card shadow-xl" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', borderRadius: '1.75rem', border: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '950', marginBottom: '0.5rem' }}>
                                                        {booking.service?.name}
                                                    </h3>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', fontWeight: '700', fontSize: '0.875rem' }}>
                                                        <CalendarIcon size={16} />
                                                        {new Date(booking.bookingDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                    </div>
                                                </div>
                                                <span style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.75rem',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '900',
                                                    background: booking.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: booking.status === 'CONFIRMED' ? '#10b981' : 'var(--primary)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '1px'
                                                }}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div style={{ padding: '1.25rem', background: 'var(--muted)', borderRadius: '1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.625rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Investment</p>
                                                    <p style={{ fontWeight: '950', fontSize: '1.25rem' }}>₹{booking.totalAmount}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <p style={{ fontSize: '0.625rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Time Slot</p>
                                                    <p style={{ fontWeight: '800', fontSize: '0.875rem' }}>{new Date(booking.bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleReviewClick(booking)}
                                                className="btn-primary"
                                                style={{ width: '100%', fontSize: '0.875rem', padding: '1rem', fontWeight: '900' }}
                                            >
                                                RATE SESSION
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'calendar' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '950' }}>TRAINING SCHEDULE</h2>
                                <div style={{ width: '40px', height: '4px', background: 'var(--primary)', borderRadius: '2px', marginTop: '0.4rem' }}></div>
                            </div>
                            <div className="glass card" style={{ padding: '1rem', overflow: 'hidden', borderRadius: '2rem' }}>
                                <BookingCalendar userId={user?.id} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ServiceDetailModal
                service={selectedService}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
            />

            <ReviewModal
                booking={selectedBooking}
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onReviewSubmitted={() => {
                    fetchMyBookings();
                    setIsReviewModalOpen(false);
                }}
            />

            {/* Booking Modal */}
            <AnimatePresence>
                {isBookingModalOpen && selectedService && (
                    <div
                        style={{
                            position: 'fixed', inset: 0, zIndex: 99999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '1rem', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(12px)'
                        }}
                        onClick={() => setIsBookingModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass card shadow-2xl"
                            style={{ width: '100%', maxWidth: '500px', padding: '3rem', borderRadius: '2rem', border: '1px solid var(--border)' }}
                        >
                            <h2 style={{ fontSize: '2rem', fontWeight: '950', marginBottom: '2rem', letterSpacing: '-0.02em' }}>RESERVE SESSION</h2>

                            <div style={{ padding: '1.5rem', background: 'var(--muted)', borderRadius: '1.5rem', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <p style={{ fontWeight: '950', fontSize: '1.375rem' }}>{selectedService.name}</p>
                                    <Dumbbell size={24} color="var(--primary)" />
                                </div>
                                <p style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '1.125rem' }}>₹{selectedService.price}</p>
                            </div>

                            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.875rem', fontWeight: '900', marginBottom: '0.75rem', display: 'block', color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Select Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            borderRadius: '1.25rem',
                                            padding: '1rem',
                                            background: 'var(--background)',
                                            border: '1px solid var(--border)',
                                            color: 'var(--foreground)',
                                            fontWeight: '700',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsBookingModalOpen(false)} style={{ flex: 1, background: 'transparent', fontWeight: '800', color: 'var(--muted-foreground)' }}>
                                        CANCEL
                                    </button>
                                    <button type="submit" className="btn-primary" style={{ flex: 2, padding: '1.125rem', fontWeight: '950', fontSize: '1rem', letterSpacing: '1px' }}>
                                        CONFIRM & PAY
                                    </button>
                                </div>
                            </form>
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
                @media (max-width: 640px) {
                    .tab-content { padding-top: 1rem; }
                }
            `}</style>
        </div>
    );
};

export default MemberDashboard;
