import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign, Dumbbell } from 'lucide-react';
import axios from 'axios';

const BookingCalendar = ({ userId }) => {
    const [bookings, setBookings] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/v1/bookings/my');
            setBookings(res.data.filter(b => b.service));
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const getBookingsForDate = (date) => {
        return bookings.filter(booking => {
            if (!booking.bookingDate) return false;
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate.toDateString() === date.toDateString();
        });
    };

    const hasBookingOnDate = (date) => {
        return bookings.some(booking => {
            const bookingDate = new Date(booking.bookingDate);
            return bookingDate.toDateString() === date.toDateString();
        });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedDate);
    const monthBookings = getBookingsForDate(selectedDate);

    const changeMonth = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setSelectedDate(newDate);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '1rem'
        }}>
            {/* Calendar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{
                    padding: 'clamp(1rem, 4vw, 2.5rem)',
                    borderRadius: '2rem',
                    border: '1px solid var(--border)'
                }}
            >
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    marginBottom: '2.5rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ padding: '0.625rem', background: 'var(--primary)', borderRadius: '0.875rem', color: 'white' }}>
                                <CalendarIcon size={22} />
                            </div>
                            Training Schedule
                        </h3>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--muted)',
                        padding: '0.75rem',
                        borderRadius: '1.25rem'
                    }}>
                        <button
                            onClick={() => changeMonth(-1)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                borderRadius: '1rem',
                                background: 'var(--card)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground)',
                                fontWeight: '900'
                            }}
                        >
                            ←
                        </button>
                        <span style={{ fontWeight: '900', fontSize: '1.125rem', color: 'var(--foreground)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => changeMonth(1)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                borderRadius: '1rem',
                                background: 'var(--card)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground)',
                                fontWeight: '900'
                            }}
                        >
                            →
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '0.5rem'
                }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                        <div key={idx} style={{
                            textAlign: 'center',
                            fontWeight: '900',
                            padding: '0.5rem 0',
                            color: 'var(--muted-foreground)',
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {day}
                        </div>
                    ))}

                    {[...Array(startingDayOfWeek)].map((_, i) => (
                        <div key={`empty-${i}`} />
                    ))}

                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                        const hasBooking = hasBookingOnDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = date.toDateString() === selectedDate.toDateString();

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(date)}
                                style={{
                                    aspectRatio: '1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '1rem',
                                    background: isSelected
                                        ? 'var(--primary)'
                                        : hasBooking
                                            ? 'rgba(239, 68, 68, 0.1)'
                                            : 'var(--muted)',
                                    color: isSelected ? 'white' : hasBooking ? 'var(--primary)' : 'inherit',
                                    border: isSelected ? 'none' : isToday ? '2px solid var(--primary)' : '1px solid transparent',
                                    cursor: 'pointer',
                                    fontWeight: '900',
                                    position: 'relative',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                                className="calendar-day-btn"
                            >
                                {day}
                                {hasBooking && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '6px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: '4px',
                                        height: '4px',
                                        borderRadius: '50%',
                                        background: isSelected ? 'white' : 'var(--primary)'
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </motion.div>

            {/* Bookings for Selected Date */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card shadow-xl"
                style={{
                    padding: '2rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--border)',
                    background: 'var(--card)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Date Schedule</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '950' }}>
                            {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h3>
                    </div>
                    {monthBookings.length > 0 && (
                        <div style={{
                            padding: '0.5rem 1.25rem',
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '1rem',
                            fontSize: '0.875rem',
                            fontWeight: '900',
                            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                        }}>
                            {monthBookings.length} {monthBookings.length === 1 ? 'Session' : 'Sessions'}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loader" style={{ margin: '0 auto' }} />
                    </div>
                ) : monthBookings.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {monthBookings.map(booking => (
                            <div key={booking.id} style={{
                                padding: '1.5rem',
                                background: 'var(--muted)',
                                borderRadius: '1.5rem',
                                border: '1px solid var(--border)',
                                transition: 'all 0.3s'
                            }} className="hover:border-primary">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                                    <h4 style={{ fontWeight: '900', fontSize: '1.125rem', color: 'var(--foreground)' }}>
                                        {booking.service?.name || 'Training Session'}
                                    </h4>
                                    <span style={{
                                        padding: '0.4rem 1rem',
                                        borderRadius: '0.75rem',
                                        fontSize: '0.75rem',
                                        fontWeight: '900',
                                        background: booking.status === 'CONFIRMED' ? 'rgba(5, 150, 105, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: booking.status === 'CONFIRMED' ? '#059669' : 'var(--primary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--muted-foreground)', fontWeight: '700' }}>
                                        <div style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'var(--card)' }}>
                                            <Clock size={16} />
                                        </div>
                                        {new Date(booking.bookingDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '900' }}>
                                        <div style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'var(--card)' }}>
                                            <DollarSign size={16} />
                                        </div>
                                        ₹{booking.totalAmount}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'var(--muted)',
                        borderRadius: '2rem',
                        color: 'var(--muted-foreground)',
                        border: '2px dashed var(--border)'
                    }}>
                        <div style={{ background: 'var(--card)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Dumbbell size={32} style={{ opacity: 0.3 }} />
                        </div>
                        <p style={{ fontSize: '1rem', fontWeight: '800' }}>Rest Day! No sessions scheduled.</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Select another date to view training.</p>
                    </div>
                )}
            </motion.div>

            <style>{`
                @media (min-width: 1024px) {
                    div[style*="display: flex; flexDirection: column"] {
                        display: grid !important;
                        grid-template-columns: 1.5fr 1fr !important;
                        flex-direction: row !important;
                    }
                }
                .calendar-day-btn:hover {
                    transform: scale(1.1);
                    z-index: 10;
                }
            `}</style>
        </div>
    );
};

export default BookingCalendar;
