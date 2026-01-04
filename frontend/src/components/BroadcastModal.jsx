import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Users, User, Dumbbell, Zap } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BroadcastModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        targetAudience: 'ALL',
        message: '',
        title: ''
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setSending(true);
            await axios.post('/api/v1/notifications/broadcast', formData);
            toast.success('Announcement broadcasted successfully!');
            onClose();
            setFormData({ targetAudience: 'ALL', message: '', title: '' });
        } catch (error) {
            toast.error('Failed to send announcement');
        } finally {
            setSending(false);
        }
    };

    const audiences = [
        { value: 'ALL', label: 'Everyone', icon: Users, desc: 'All platform athletes' },
        { value: 'MEMBER', label: 'Members', icon: User, desc: 'All gym members' },
        { value: 'TRAINER', label: 'Trainers', icon: Dumbbell, desc: 'All certified coaches' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 99999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(12px)'
                    }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass card shadow-2xl"
                        style={{ width: '100%', maxWidth: '650px', padding: '3rem', borderRadius: '2.5rem', border: '1px solid var(--border)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '950', display: 'flex', alignItems: 'center', gap: '0.75rem', letterSpacing: '-0.02em' }}>
                                <Zap size={32} color="var(--primary)" />
                                GLOBAL ANNOUNCEMENT
                            </h2>
                            <button onClick={onClose} style={{ background: 'transparent', color: 'var(--muted-foreground)' }}>
                                <X size={28} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Target Audience */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '1px' }}>
                                    TARGET ATHLETES
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                    {audiences.map((audience) => (
                                        <button
                                            key={audience.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, targetAudience: audience.value })}
                                            className="glass card"
                                            style={{
                                                padding: '1.5rem',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                border: formData.targetAudience === audience.value
                                                    ? '2px solid var(--primary)'
                                                    : '1px solid var(--border)',
                                                background: formData.targetAudience === audience.value
                                                    ? 'rgba(239, 68, 68, 0.1)'
                                                    : 'var(--card)',
                                                transition: 'all 0.3s'
                                            }}
                                        >
                                            <audience.icon
                                                size={32}
                                                style={{ margin: '0 auto 0.75rem', color: formData.targetAudience === audience.value ? 'var(--primary)' : 'var(--muted-foreground)' }}
                                            />
                                            <p style={{ fontWeight: '900', marginBottom: '0.25rem', color: formData.targetAudience === audience.value ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                                                {audience.label}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', opacity: 0.8 }}>
                                                {audience.desc}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '1px' }}>
                                    NOTIFICATION TITLE
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Heavy Equipment Maintenance / New Yoga Classes"
                                    required
                                    style={{ borderRadius: '1.25rem', padding: '1rem' }}
                                />
                            </div>

                            {/* Message */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '900', textTransform: 'uppercase', color: 'var(--muted-foreground)', letterSpacing: '1px' }}>
                                    DETAILED MESSAGE
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Type your official announcement here..."
                                    rows={5}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        borderRadius: '1.5rem',
                                        border: '1px solid var(--border)',
                                        background: 'var(--background)',
                                        resize: 'none',
                                        fontSize: '1rem',
                                        lineHeight: 1.6
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontWeight: '700' }}>
                                        {formData.message.length} characters
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', marginTop: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    style={{ background: 'transparent', fontWeight: '800', color: 'var(--muted-foreground)' }}
                                    disabled={sending}
                                >
                                    DISCARD
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={sending}
                                    style={{
                                        opacity: sending ? 0.6 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '1.125rem 2rem',
                                        fontWeight: '950',
                                        fontSize: '1rem',
                                        letterSpacing: '1px'
                                    }}
                                >
                                    <Send size={20} />
                                    {sending ? 'TRANSMITTING...' : 'BROADCAST NOW'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BroadcastModal;
