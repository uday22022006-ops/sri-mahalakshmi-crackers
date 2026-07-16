import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ShieldCheck, Factory, Truck, PackageCheck, Headphones, Award,
} from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: "BIS Certified Quality",
    description: "Every product is BIS-certified and PESO-licensed. Tested to the highest safety standards before leaving our factory.",
    stat: "100%",
    statLabel: "Certified",
  },
  {
    icon: Factory,
    title: "Factory Direct Pricing",
    description: "We manufacture in Sivakasi — India's fireworks capital. No middlemen means unbeatable prices, every time.",
    stat: "0",
    statLabel: "Middlemen",
  },
  {
    icon: Truck,
    title: "Pan-India Fast Delivery",
    description: "2–5 day delivery across India. Priority express available for metro cities and festive rush orders.",
    stat: "2-5",
    statLabel: "Day Delivery",
  },
  {
    icon: PackageCheck,
    title: "Secure Packaging",
    description: "Military-grade shock-absorbing packing. Every order arrives intact — 100% delivery guarantee.",
    stat: "100%",
    statLabel: "Safe Arrival",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "WhatsApp, phone, and email support round the clock. Our team responds within minutes during peak seasons.",
    stat: "24/7",
    statLabel: "Support",
  },
  {
    icon: Award,
    title: "38 Years of Trust",
    description: "Serving families and businesses since 1985. South India's most trusted fireworks brand — for three generations.",
    stat: "38+",
    statLabel: "Years",
  },
];

const WhyChooseSMP = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="why-smp" className="section-padding relative overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0B0B0B 0%, #0d0608 50%, #0B0B0B 100%)',
    }}>
      {/* Subtle circle rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-luxury-gold/[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-luxury-gold/[0.05] pointer-events-none" />

      <div className="container-luxury relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.75 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-luxury-gold/50" />
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/65">Our Promise</span>
            <div className="h-px w-10 bg-luxury-gold/50" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            Why Choose <span className="gold-gradient-text">SMP</span>?
          </h2>
          <p className="font-body text-white/45 max-w-lg mx-auto text-sm leading-relaxed">
            Sri Mahalakshmi Crackers — three decades of excellence, factory-direct trust,
            and uncompromising quality in every spark.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                className="group relative rounded-sm p-7 overflow-hidden transition-all duration-400"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.65, delay: i * 0.1 }}
                whileHover={{
                  y: -5,
                  background: 'rgba(212,175,55,0.03)',
                  borderColor: 'rgba(212,175,55,0.22)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 25px rgba(212,175,55,0.06)',
                }}
              >
                {/* BG glow */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07), transparent)' }}
                />

                {/* Corner dec */}
                <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-luxury-gold/15 group-hover:border-luxury-gold/50 transition-colors duration-300" />

                {/* Stat badge */}
                <div className="absolute top-5 right-10 text-right">
                  <div className="font-heading text-sm font-bold text-luxury-gold/25 group-hover:text-luxury-gold/50 transition-colors duration-300">{f.stat}</div>
                  <div className="font-body text-[9px] text-white/20 tracking-wider uppercase">{f.statLabel}</div>
                </div>

                {/* Icon */}
                <div className="relative w-12 h-12 mb-5">
                  <div className="absolute inset-0 bg-luxury-gold/8 rounded-sm group-hover:bg-luxury-gold/15 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-luxury-gold" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="font-heading text-lg font-semibold text-white mb-2.5 group-hover:text-luxury-gold transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="font-body text-xs text-white/45 leading-relaxed">{f.description}</p>

                {/* Grow bar */}
                <div className="mt-5 pt-4 border-t border-white/[0.05]">
                  <div className="h-px w-0 group-hover:w-12 bg-luxury-gold transition-all duration-500 rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-14 pt-10 border-t border-luxury-gold/10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
        >
          {['BIS Certified', 'PESO Licensed', 'ISO 9001:2015', 'GST Registered', '10,000+ Reviews'].map(b => (
            <div key={b} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold/60" />
              <span className="font-body text-xs text-white/40 tracking-wide">{b}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseSMP;
