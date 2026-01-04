import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, DollarSign, Star, User, Dumbbell, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceDetailModal = ({ service, isOpen, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && service) {
            fetchReviews();
        }
    }, [isOpen, service]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/v1/reviews/service/${service.id}`);
            setReviews(res.data);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    if (!service) return null;

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 99999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'min(1rem, 2vw)',
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(12px)'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass card shadow-2xl"
                        style={{
                            width: '100%',
                            maxWidth: '900px',
                            maxHeight: 'min(95vh, 850px)',
                            overflowY: 'auto',
                            padding: '0',
                            borderRadius: '2rem',
                            border: '1px solid var(--border)',
                        }}
                    >
                        {/* Header with Image */}
                        <div style={{ position: 'relative', height: 'clamp(250px, 45vh, 400px)', overflow: 'hidden' }}>
                            {service.image ? (
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', color: 'white' }}>
                                    <Dumbbell size={80} />
                                </div>
                            )}
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))' }} />
                            <button
                                onClick={onClose}
                                style={{
                                    position: 'absolute',
                                    top: '1.5rem',
                                    right: '1.5rem',
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    zIndex: 20
                                }}
                                className="hover:scale-110 transition-transform"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div style={{ padding: 'clamp(1.5rem, 5vw, 3rem)' }}>
                            {/* Title and Badge */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ flex: 1, minWidth: '300px' }}>
                                    <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: '950', marginBottom: '0.75rem', lineHeight: 1, letterSpacing: '-0.02em' }}>
                                        {service.name}
                                    </h2>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={18}
                                                    fill={i < Math.round(averageRating) ? 'var(--accent)' : 'none'}
                                                    color={i < Math.round(averageRating) ? 'var(--accent)' : 'var(--muted-foreground)'}
                                                />
                                            ))}
                                            <span style={{ fontWeight: '900', fontSize: '1.125rem', marginLeft: '0.5rem' }}>{averageRating}</span>
                                        </div>
                                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border)' }} />
                                        <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', fontWeight: '600' }}>
                                            {reviews.length} total reviews
                                        </span>
                                    </div>
                                </div>
                                <span
                                    style={{
                                        padding: '0.625rem 1.25rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.8125rem',
                                        fontWeight: '900',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        color: 'var(--primary)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px',
                                        border: '1px solid rgba(239, 68, 68, 0.2)'
                                    }}
                                >
                                    {service.category}
                                </span>
                            </div>

                            {/* Info Grid */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1.25rem',
                                marginBottom: '3rem'
                            }}>
                                <div style={{ padding: '1.5rem', background: 'var(--muted)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', borderRadius: '1rem', background: 'var(--primary)', color: 'white' }}>
                                        <DollarSign size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '700', textTransform: 'uppercase' }}>Session Cost</p>
                                        <p style={{ fontWeight: '900', fontSize: '1.375rem' }}>₹{service.price}</p>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'var(--muted)', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', borderRadius: '1rem', background: 'var(--accent)', color: 'white' }}>
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '700', textTransform: 'uppercase' }}>Energy Level</p>
                                        <p style={{ fontWeight: '900', fontSize: '1.375rem' }}>High Intensity</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '3.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    <div style={{ width: '30px', height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                                    <h3 style={{ fontSize: '1.375rem', fontWeight: '900' }}>Program Overview</h3>
                                </div>
                                <p style={{ lineHeight: '1.8', color: 'var(--foreground)', opacity: 0.9, fontSize: '1.0625rem' }}>
                                    {service.description || 'Experience a world-class training program tailored to push your boundaries and achieve your fitness goals. This comprehensive session includes personalized coaching, state-of-the-art equipment usage, and professional monitoring of your progress.'}
                                </p>
                            </div>

                            {/* Reviews Section */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.375rem', fontWeight: '900' }}>Athlete Testimonials</h3>
                                    {reviews.length > 0 && <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)' }}>View All</span>}
                                </div>

                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div className="loader" style={{ margin: '0 auto 1rem' }} />
                                        <p style={{ fontWeight: '700' }}>Fetching testimonials...</p>
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {reviews.map((review) => (
                                            <motion.div
                                                key={review.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                style={{ padding: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1.5rem' }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{
                                                            width: '44px', height: '44px', borderRadius: '12px',
                                                            background: 'var(--primary)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'white', fontWeight: '900', fontSize: '1rem',
                                                            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)'
                                                        }}>
                                                            {review.userName?.charAt(0) || <User size={20} />}
                                                        </div>
                                                        <div>
                                                            <p style={{ fontWeight: '800', fontSize: '1rem' }}>{review.userName}</p>
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '600' }}>
                                                                Verified Gym Member
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.25rem', padding: '0.4rem 0.8rem', background: 'var(--muted)', borderRadius: '0.75rem' }}>
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={14}
                                                                fill={i < review.rating ? 'var(--accent)' : 'none'}
                                                                color={i < review.rating ? 'var(--accent)' : 'var(--muted-foreground)'}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p style={{ lineHeight: '1.6', color: 'var(--foreground)', opacity: 0.85, fontSize: '0.9375rem', fontStyle: 'italic' }}>
                                                    "{review.comment}"
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--muted)', borderRadius: '2rem', border: '2px dashed var(--border)' }}>
                                        <div style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                                            <MessageSquare size={48} style={{ margin: '0 auto' }} />
                                        </div>
                                        <p style={{ color: 'var(--muted-foreground)', fontWeight: '700' }}>
                                            No reviews yet. Be the first athlete to rate this program!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ServiceDetailModal;
