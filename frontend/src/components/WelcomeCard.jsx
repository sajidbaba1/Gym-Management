import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

const WelcomeCard = ({ user, roleSpecificMessage, quickActions }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning ☀️';
        if (hour < 18) return 'Good Afternoon 🌤️';
        return 'Good Evening 🌙';
    };

    const getRoleTitle = () => {
        switch (user?.role) {
            case 'SUPER_ADMIN':
                return 'Super Administrator';
            case 'ADMIN':
                return 'Gym Administrator';
            case 'TRAINER':
                return 'Elite Fitness Coach';
            case 'MEMBER':
                return 'Premium Member';
            default:
                return 'Fitness Enthusiast';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white',
                marginBottom: '2rem',
                border: 'none',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Background pattern */}
            <div style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
                background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
                opacity: 0.1, pointerEvents: 'none'
            }} />

            <div className="welcome-card-content" style={{ padding: 'clamp(1rem, 5vw, 2.5rem)', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Dumbbell size={20} />
                            <span style={{ fontSize: '0.9375rem', opacity: 0.9, fontWeight: '500' }}>{getGreeting()},</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.75rem)', fontWeight: '900', marginBottom: '0.5rem', lineHeight: 1.1 }}>
                            {user?.firstname + ' ' + user?.lastname}
                        </h1>
                        <p style={{ fontSize: '0.875rem', opacity: 0.9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {getRoleTitle()}
                        </p>
                        {roleSpecificMessage && (
                            <p style={{ fontSize: 'clamp(0.9375rem, 3vw, 1.125rem)', marginTop: '1.25rem', lineHeight: '1.6', opacity: 0.95 }}>
                                {roleSpecificMessage}
                            </p>
                        )}
                    </div>

                    {quickActions && quickActions.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignSelf: 'center' }}>
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={action.onClick}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.25rem',
                                        fontSize: '0.875rem',
                                        borderRadius: '1rem',
                                        fontWeight: '700',
                                        transition: 'all 0.3s'
                                    }}
                                    className="hover:scale-105"
                                >
                                    {action.icon && <action.icon size={18} />}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default WelcomeCard;
