import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Calendar, Shield, Heart, Dumbbell, Zap, Trophy, Target } from 'lucide-react';
import { useState, useEffect } from 'react';

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroImages = [
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200'
    ];

    const services = [
        { icon: '🏋️‍♂️', name: 'Weight Lifting', desc: 'Modern equipment and expert guidance' },
        { icon: '🧘‍♀️', name: 'Yoga & Zen', desc: 'Find your balance and flexibility' },
        { icon: '🏃‍♂️', name: 'Cardio Pro', desc: 'Boost your endurance and heart health' },
        { icon: '🥗', name: 'Diet Plans', desc: 'Personalized nutrition for your goals' },
        { icon: '🤝', name: 'Personal Training', desc: 'One-on-one sessions for faster results' },
        { icon: '🏅', name: 'CrossFit', desc: 'High-intensity functional movements' }
    ];

    const testimonials = [
        { name: 'Mike Ross', rating: 5, text: 'The best gym I have ever joined. The trainers are top-notch!' },
        { name: 'Sarah Chen', rating: 5, text: 'Lost 15kg in 3 months. The diet plans and tracking are amazing.' },
        { name: 'James Wilson', rating: 5, text: 'Modern facility and very clean. Highly professional environment.' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            {/* Hero Section */}
            <section style={{ position: 'relative', height: '90vh', minHeight: '600px', overflow: 'hidden' }}>
                {/* Background Carousel */}
                {heroImages.map((img, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: currentSlide === idx ? 1 : 0,
                            transition: 'opacity 1s ease-in-out'
                        }}
                    />
                ))}

                {/* Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(239, 68, 68, 0.6))',
                    backdropFilter: 'blur(1px)'
                }} />

                {/* Content */}
                <div style={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '1rem',
                    color: 'white'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ maxWidth: '900px', width: '100%' }}
                    >
                        <Zap size={40} style={{ marginBottom: '1rem', color: 'var(--accent)' }} />
                        <h1 style={{
                            fontSize: 'clamp(2rem, 10vw, 4.5rem)',
                            fontWeight: '900',
                            marginBottom: '1rem',
                            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            lineHeight: 1.1
                        }}>
                            PUSH YOUR LIMITS<br /><span style={{ color: 'var(--primary)' }}>TRANSFORM LIVES</span>
                        </h1>
                        <p style={{
                            fontSize: 'clamp(0.875rem, 4vw, 1.25rem)',
                            marginBottom: '2rem',
                            maxWidth: '600px',
                            margin: '0 auto 2rem auto',
                            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                            opacity: 0.9
                        }}>
                            Join the elite fitness community. Connect with top trainers, track your progress, and reach your goals faster than ever.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Link to="/register" className="btn-primary" style={{
                                padding: '1rem 2rem',
                                fontSize: '1.125rem',
                                background: 'var(--primary)',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                textDecoration: 'none',
                                borderRadius: '1rem',
                                boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)'
                            }}>
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" style={{
                                padding: '1rem 2rem',
                                fontSize: '1.125rem',
                                background: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '1rem',
                                color: 'white',
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}>
                                Member Login
                            </Link>
                        </div>
                    </motion.div>

                    {/* Carousel Indicators */}
                    <div style={{ position: 'absolute', bottom: '2rem', display: 'flex', gap: '0.5rem' }}>
                        {heroImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                style={{
                                    width: currentSlide === idx ? '2rem' : '0.5rem',
                                    height: '0.5rem',
                                    borderRadius: '1rem',
                                    background: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '5rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: '900', marginBottom: '0.75rem' }}>
                        WHY CHOOSE <span className="gradient-text">OUR GYM?</span>
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)' }}>
                        Premium fitness solutions for every goal
                    </p>
                </motion.div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass card"
                            style={{
                                padding: '2.5rem',
                                textAlign: 'center',
                                border: '1px solid var(--border)',
                                borderRadius: '1.5rem'
                            }}
                            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        >
                            <div style={{
                                width: '60px', height: '60px', background: 'var(--muted)',
                                borderRadius: '1rem', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 1.5rem auto',
                                fontSize: '2rem'
                            }}>
                                {service.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                                {service.name}
                            </h3>
                            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{service.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Counter */}
            <section style={{
                padding: '5rem 1rem',
                background: 'var(--secondary)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
                    background: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")',
                    opacity: 0.2
                }} />
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '3rem',
                        textAlign: 'center'
                    }}>
                        {[
                            { icon: Users, value: '2000+', label: 'Active Members' },
                            { icon: Trophy, value: '50+', label: 'Expert Trainers' },
                            { icon: Target, value: '150+', label: 'Daily Classes' },
                            { icon: Star, value: '4.9', label: 'Member Rating' }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <div style={{ color: 'var(--primary)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                                    <stat.icon size={40} />
                                </div>
                                <h3 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '900', marginBottom: '0.5rem' }}>
                                    {stat.value}
                                </h3>
                                <p style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7 }}>
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ padding: '6rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: '900', marginBottom: '0.75rem' }}>
                        TRANSFORMATION <span style={{ color: 'var(--primary)' }}>STORIES</span>
                    </h2>
                    <p style={{ fontSize: '1.125rem', color: 'var(--muted-foreground)' }}>
                        Don't just take our word for it
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="card"
                            style={{ padding: '3rem', position: 'relative' }}
                        >
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--primary)', opacity: 0.2 }}>
                                <Star fill="currentColor" size={40} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem' }}>
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} size={18} fill="var(--accent)" color="var(--accent)" />
                                ))}
                            </div>
                            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic', opacity: 0.9 }}>
                                "{t.text}"
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px', height: '40px', background: 'var(--primary)',
                                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontWeight: 'bold', color: 'white'
                                }}>
                                    {t.name.charAt(0)}
                                </div>
                                <h4 style={{ fontWeight: '800', fontSize: '1.125rem' }}>{t.name}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={{
                padding: '7rem 1rem',
                background: 'linear-gradient(45deg, #000, #111)',
                textAlign: 'center',
                color: 'white'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{ maxWidth: '700px', margin: '0 auto' }}
                >
                    <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: '950', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        STOP WAITING.<br />START <span style={{ color: 'var(--primary)' }}>GRINDING.</span>
                    </h2>
                    <p style={{ fontSize: '1.25rem', opacity: 0.7, marginBottom: '3rem' }}>
                        Special 50% discount for the first 100 registrations this month.
                    </p>
                    <Link to="/register" className="btn-primary" style={{
                        padding: '1.25rem 3rem',
                        fontSize: '1.25rem',
                        borderRadius: '2rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none'
                    }}>
                        CLAIM YOUR OFFER <Zap size={24} />
                    </Link>
                </motion.div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '4rem 1rem',
                borderTop: '1px solid var(--border)',
                background: 'var(--card)',
                textAlign: 'center'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <Dumbbell style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-1px' }}>GYM<span style={{ color: 'var(--primary)' }}>PRO</span></span>
                </div>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9375rem' }}>
                    © 2024 GymPro Management System. All rights reserved. Built for champions.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
