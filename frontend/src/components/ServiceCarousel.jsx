import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import { Star, MapPin, Dumbbell } from 'lucide-react';

const ServiceCarousel = ({ services, onServiceClick }) => {
    if (!services || services.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted-foreground)' }}>
                No services available at the moment
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem 0' }}>
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                coverflowEffect={{
                    rotate: 20,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation={false}
                breakpoints={{
                    320: {
                        slidesPerView: 1.2,
                        spaceBetween: 20
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 30
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 40
                    },
                }}
                style={{ padding: '2rem 1rem' }}
                className="service-swiper"
            >
                {services.map((service) => (
                    <SwiperSlide key={service.id} className="service-slide">
                        <div
                            className="card"
                            onClick={() => onServiceClick?.(service)}
                            style={{
                                cursor: 'pointer',
                                overflow: 'hidden',
                                height: 'auto',
                                minHeight: '420px',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 0,
                                borderRadius: '1.5rem',
                                border: '1px solid var(--border)',
                                background: 'var(--card)',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Service Image */}
                            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '3rem'
                                    }}>
                                        <Dumbbell size={60} />
                                    </div>
                                )}

                                {/* Price Badge */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '1rem',
                                    right: '1rem',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '0.75rem',
                                    fontSize: '0.875rem',
                                    fontWeight: '900',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                                }}>
                                    ₹{service.price}
                                </div>
                            </div>

                            {/* Service Details */}
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, color: 'var(--foreground)' }}>
                                        {service.name}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'var(--muted)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem' }}>
                                        <Star size={14} fill="var(--accent)" color="var(--accent)" />
                                        <span style={{ fontWeight: '800', fontSize: '0.8125rem' }}>4.8</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <MapPin size={14} />
                                    <span>{service.category || 'Gym Session'}</span>
                                </div>

                                <p style={{
                                    color: 'var(--muted-foreground)',
                                    fontSize: '0.9375rem',
                                    marginBottom: '1.5rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: '1.6'
                                }}>
                                    {service.description || 'Premium fitness training program designed to help you reach your maximum potential.'}
                                </p>

                                <button className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: 'auto', fontWeight: '800' }}>
                                    Reserve Now
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style>{`
                .service-slide {
                    width: clamp(280px, 85vw, 380px) !important;
                }
                .service-swiper .swiper-pagination-bullet-active {
                    background: var(--primary);
                    width: 24px;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default ServiceCarousel;
