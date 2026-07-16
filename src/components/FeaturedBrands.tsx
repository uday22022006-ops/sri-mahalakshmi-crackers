import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award } from 'lucide-react';

const brands = [
  { name: 'Standard Fireworks', location: 'Sivakasi', desc: 'India\'s pioneer in premium sparks since 1942.', logo: '👑' },
  { name: 'Sri Krishna Fireworks', location: 'Sivakasi', desc: 'Renowned for high-decibel thunderous bombs.', logo: '⚡' },
  { name: 'Coronation Fireworks', location: 'Sivakasi', desc: 'Luxury multi-shot sky display specialists.', logo: '🌟' },
  { name: 'SMP Originals', location: 'Sivakasi', desc: 'Our factory-direct hand-crafted premium sparklers.', logo: '🔥' },
];

const FeaturedBrands = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-20 bg-luxury-black border-t border-luxury-gold/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 60%)',
      }} />

      <div className="container-luxury relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 35, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.65 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Award className="w-4 h-4 text-luxury-gold" />
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/70">Trusted Quality</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
            Featured Sivakasi <span className="gold-gradient-text">Brands</span>
          </h2>
          <p className="font-body text-white/40 text-xs md:text-sm mt-2 max-w-md mx-auto">
            Authorized direct partner distribution. 100% genuine products directly from Sivakasi\'s premium factories.
          </p>
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {brands.map((b, i) => (
            <motion.div
              key={b.name}
              className="glass-card p-6 rounded-sm text-center border-white/5 hover:border-luxury-gold/20 transition-all duration-400 group"
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: '0 15px 35px rgba(0,0,0,0.6)' }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-luxury-gold/5 flex items-center justify-center text-2xl group-hover:bg-luxury-gold/15 transition-all duration-300">
                {b.logo}
              </div>
              <h3 className="font-heading text-lg font-bold text-white group-hover:text-luxury-gold transition-colors duration-250">
                {b.name}
              </h3>
              <p className="font-body text-[10px] text-luxury-gold/60 tracking-widest uppercase mt-0.5 mb-3">
                {b.location}
              </p>
              <p className="font-body text-xs text-white/45 leading-relaxed">
                {b.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
