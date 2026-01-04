import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ReviewModal = ({ booking, isOpen, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        try {
            setSubmitting(true);
            await axios.post(`/api/v1/reviews/${booking.service.id}`, {
                rating,
                comment
            });
            toast.success('Review submitted successfully!');
            onReviewSubmitted?.();
            onClose();
            setRating(0);
            setComment('');
        } catch (error) {
            console.error(error);
            const msg = typeof error.response?.data === 'string'
                ? error.response.data
                : (error.response?.data?.message || 'Failed to submit review');
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (!booking) return null;

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
                        padding: '1rem',
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(8px)'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass card shadow-2xl"
                        style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '1.5rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '900' }}>Rate Your Training</h2>
                            <button onClick={onClose} style={{ background: 'transparent', color: 'var(--muted-foreground)' }}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Service Info */}
                        <div style={{ padding: '1.25rem', marginBottom: '2rem', background: 'var(--muted)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                                Program Name
                            </p>
                            <p style={{ fontWeight: '800', fontSize: '1.25rem' }}>{booking.service.name}</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Star Rating */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                                    Overall Experience
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                transform: (hoverRating >= star || rating >= star) ? 'scale(1.2)' : 'scale(1)'
                                            }}
                                        >
                                            <Star
                                                size={48}
                                                fill={(hoverRating >= star || rating >= star) ? 'var(--accent)' : 'none'}
                                                color={(hoverRating >= star || rating >= star) ? 'var(--accent)' : 'var(--muted-foreground)'}
                                                strokeWidth={2}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {rating > 0 && (
                                    <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent)' }}>
                                        {rating === 1 && 'Need Improvement'}
                                        {rating === 2 && 'Fair Effort'}
                                        {rating === 3 && 'Decent Session'}
                                        {rating === 4 && 'Great Workout'}
                                        {rating === 5 && 'Legendary Training!'}
                                    </p>
                                )}
                            </div>

                            {/* Comment */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                                    Athlete Feedback (Optional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about the session, the coach, and the facility..."
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '1rem',
                                        border: '1px solid var(--border)',
                                        background: 'var(--background)',
                                        resize: 'none',
                                        fontSize: '0.9375rem',
                                        lineHeight: 1.5
                                    }}
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    style={{ flex: 1, background: 'transparent', fontWeight: '800', color: 'var(--muted-foreground)' }}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={submitting || rating === 0}
                                    style={{ flex: 2, padding: '1rem', fontWeight: '900', fontSize: '1rem', borderRadius: '1rem' }}
                                >
                                    {submitting ? 'Submitting...' : 'Post Review'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ReviewModal;
