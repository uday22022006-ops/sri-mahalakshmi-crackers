import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';

const useCountdown = (target: Date) => {
  const calc = () => {
    const diff = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
    return {
      d: Math.floor(diff / 86400),
      h: Math.floor((diff % 86400) / 3600),
      m: Math.floor((diff % 3600) / 60),
      s: diff % 60,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  });
  return time;
};

const Pad = ({ val, label }: { val: number; label: string }) => (
  <div className="text-center">
    <div
      className="font-heading text-2xl md:text-4xl font-bold text-luxury-gold flex items-center justify-center"
      style={{
        width: 'clamp(52px, 8vw, 80px)',
        height: 'clamp(52px, 8vw, 80px)',
        background: 'rgba(212,175,55,0.06)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '2px',
      }}
    >
      {String(val).padStart(2, '0')}
    </div>
    <div className="font-body text-[9px] md:text-[10px] text-white/35 tracking-[0.3em] uppercase mt-1.5">{label}</div>
  </div>
);

const FestivalBanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  // Count to next Diwali (Oct 2025)
  const diwali = new Date('2025-10-20T18:00:00');
  const { d, h, m, s } = useCountdown(diwali);

  return (
    <section id="festival-banner" className="relative overflow-hidden" ref={ref}>
      {/* BG layers */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514912885225-5a8b78e21c3c?w=1920&q=75')` }}
      />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, rgba(91,10,26,0.94) 0%, rgba(11,11,11,0.88) 50%, rgba(91,10,26,0.94) 100%)'
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 65%)'
      }} />

      {/* Top / bottom gold bars */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent" />

      <div className="relative z-10 container-luxury py-20 md:py-32 lg:py-40 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Eyebrow */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ y: 20, opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-body text-[10px] tracking-[0.5em] uppercase text-luxury-gold/80">Diwali 2025 Countdown</span>
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="font-heading font-bold leading-[0.9] mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6.5rem)' }}
            initial={{ y: 30, opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="shimmer-text block">Light Up The</span>
            <span className="text-white italic block" style={{ fontSize: '85%' }}>Sky This</span>
            <span className="shimmer-text block">Diwali</span>
          </motion.h2>

          <motion.p
            className="font-body text-white/55 text-sm md:text-base max-w-xl mx-auto mb-8"
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Shop our exclusive Diwali collection — premium crackers, display sets & luxury gift boxes.
          </motion.p>

          {/* Discount */}
          <motion.div
            className="inline-flex items-center gap-3 border border-luxury-gold/35 px-8 py-3.5 rounded-sm mb-10"
            style={{ background: 'rgba(212,175,55,0.06)' }}
            initial={{ scale: 0.85, opacity: 0 }} animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <Gift className="w-4 h-4 text-luxury-gold" />
            <span className="font-heading text-3xl md:text-4xl font-bold text-luxury-gold">80% OFF</span>
            <span className="font-body text-white/40 text-sm">on select items</span>
          </motion.div>

          {/* Countdown */}
          <motion.div
            className="flex items-center justify-center gap-3 md:gap-5 mb-12"
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            <Pad val={d} label="Days" />
            <span className="font-heading text-2xl md:text-3xl text-luxury-gold/30 pb-5">:</span>
            <Pad val={h} label="Hours" />
            <span className="font-heading text-2xl md:text-3xl text-luxury-gold/30 pb-5">:</span>
            <Pad val={m} label="Mins" />
            <span className="font-heading text-2xl md:text-3xl text-luxury-gold/30 pb-5">:</span>
            <Pad val={s} label="Secs" />
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.75 }}
          >
            <motion.a
              href="/offers"
              className="inline-flex items-center gap-2 bg-luxury-gold text-luxury-black font-body font-semibold text-sm tracking-widest uppercase px-9 py-4 rounded-sm min-w-[220px] justify-center"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212,175,55,0.65)' }}
              whileTap={{ scale: 0.97 }}
            >
              Shop Diwali Offers <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="https://wa.me/919876543210"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-body font-semibold text-sm tracking-widest uppercase px-9 py-4 rounded-sm min-w-[220px] justify-center hover:bg-white/8 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              WhatsApp Order
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FestivalBanner;
