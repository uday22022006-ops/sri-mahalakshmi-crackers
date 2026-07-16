import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  '15% Welcome Discount',
  'Early Access to Offers',
  'Festival Reminders',
  'Exclusive Products',
];

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setStatus('error'); return; }
    setStatus('loading');
    setTimeout(() => { setStatus('success'); setEmail(''); }, 1600);
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28" ref={ref}>
      {/* BG */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(91,10,26,0.35) 0%, rgba(11,11,11,1) 70%)',
      }} />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/25 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-luxury-gold/25 to-transparent" />

      {/* Floating sparkles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-luxury-gold/15 pointer-events-none select-none"
          style={{ left: `${8 + i * 9}%`, top: `${15 + (i % 4) * 22}%`, fontSize: '1.2rem' }}
          animate={{ y: [0, -16, 0], opacity: [0.08, 0.35, 0.08] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.35 }}
        >✦</motion.div>
      ))}

      <div className="container-luxury relative z-10" ref={ref}>
        <div className="max-w-2xl mx-auto text-center">
          {/* Mail icon */}
          <motion.div
            className="w-14 h-14 mx-auto mb-7 flex items-center justify-center rounded-full border border-luxury-gold/25"
            style={{ background: 'rgba(212,175,55,0.07)' }}
            animate={{ boxShadow: ['0 0 0 rgba(212,175,55,0)', '0 0 30px rgba(212,175,55,0.3)', '0 0 0 rgba(212,175,55,0)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <Mail className="w-5 h-5 text-luxury-gold" />
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.75 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-luxury-gold/50" />
              <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/65">Exclusive Access</span>
              <div className="h-px w-8 bg-luxury-gold/50" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">
              Join the <span className="gold-gradient-text">SMP Circle</span>
            </h2>
            <p className="font-body text-white/45 text-sm leading-relaxed mb-8">
              Be first for exclusive offers, new arrivals & festival deals.
              <br />
              <span className="text-luxury-gold/60">Get 15% off your first order instantly.</span>
            </p>

            {/* Form / Success */}
            {status === 'success' ? (
              <motion.div
                className="flex flex-col items-center gap-3 py-8"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="w-12 h-12 text-luxury-gold" />
                <h3 className="font-heading text-xl text-luxury-gold">Welcome to the Circle!</h3>
                <p className="font-body text-sm text-white/50">Your 15% discount code is heading to your inbox.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold/35" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setStatus('idle'); }}
                      placeholder="your@email.com"
                      className={`w-full bg-white/[0.04] border rounded-sm py-4 pl-11 pr-4 text-sm text-white placeholder-white/20 font-body focus:outline-none transition-all duration-300 ${
                        status === 'error'
                          ? 'border-red-500/50 focus:border-red-500/80'
                          : 'border-luxury-gold/15 focus:border-luxury-gold/50'
                      }`}
                      id="newsletter-email"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex items-center justify-center gap-2 px-7 py-4 bg-luxury-gold text-luxury-black rounded-sm font-body font-semibold text-xs tracking-widest uppercase whitespace-nowrap disabled:opacity-60 hover:bg-luxury-gold-light transition-colors"
                    whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {status === 'loading' ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-luxury-black/20 border-t-luxury-black rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : (
                      <>Subscribe <ArrowRight className="w-3.5 h-3.5" /></>
                    )}
                  </motion.button>
                </div>
                {status === 'error' && (
                  <p className="font-body text-xs text-red-400 mt-2 text-left">Please enter a valid email address.</p>
                )}
                <p className="font-body text-[11px] text-white/25 mt-3">No spam. Unsubscribe anytime.</p>
              </form>
            )}

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              {benefits.map(b => (
                <div key={b} className="flex items-center gap-1.5">
                  <span className="text-luxury-gold text-xs">✦</span>
                  <span className="font-body text-xs text-white/40">{b}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
