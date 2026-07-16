import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote, BadgeCheck } from 'lucide-react';

const reviews = [
  {
    id: 1, name: 'Priya Ramasubramanian', location: 'Chennai, Tamil Nadu', rating: 5,
    comment: 'Absolutely stunning quality! The Maharaja Gift Box lit up our entire street. The packing was pristine and delivery was faster than expected. Our Diwali was truly magical this year.',
    date: 'Diwali 2024', avatar: 'PR', color: '#D4AF37', order: 'Maharaja Gift Box',
  },
  {
    id: 2, name: 'Arjun Venkatesh', location: 'Bangalore, Karnataka', rating: 5,
    comment: 'Ordered 5 gift boxes for our office Diwali party. Delivery was super fast and every item was perfectly packed. The Golden Sky Rockets were an absolute showstopper — everyone was speechless.',
    date: 'Oct 2024', avatar: 'AV', color: '#5B0A1A', order: 'Office Diwali Bundle',
  },
  {
    id: 3, name: 'Meenakshi Iyer', location: 'Coimbatore, Tamil Nadu', rating: 5,
    comment: 'SMP has been our family\'s fireworks brand for 15 years. The fancy items collection this year was exceptional — even better than last year. Never going anywhere else.',
    date: 'Nov 2024', avatar: 'MI', color: '#D4AF37', order: 'Fancy Items Premium',
  },
  {
    id: 4, name: 'Karthik Subramaniam', location: 'Madurai, Tamil Nadu', rating: 5,
    comment: 'Factory direct prices are unbeatable. I compared with 4 other vendors and SMP gave the best quality at the lowest price. The Galaxy Chakkars spun for almost 3 full minutes!',
    date: 'Diwali 2024', avatar: 'KS', color: '#5B0A1A', order: 'Galaxy Chakkar Set',
  },
  {
    id: 5, name: 'Divya Krishnaswamy', location: 'Hyderabad, Telangana', rating: 5,
    comment: 'The 24/7 WhatsApp support is a game-changer. They helped me build a custom bundle within minutes. The website is premium, the products are premium — the complete luxury experience.',
    date: 'Dec 2024', avatar: 'DK', color: '#D4AF37', order: 'Custom Bundle',
  },
  {
    id: 6, name: 'Ravi Shankar Pillai', location: 'Thrissur, Kerala', rating: 5,
    comment: 'Ordered for my daughter\'s wedding. The display was beyond magical — over 200 guests were left breathless. The wedding photographer said it was the best fireworks backdrop he has ever seen.',
    date: 'Jan 2025', avatar: 'RS', color: '#5B0A1A', order: 'Royal Wedding Edition',
  },
];

const Stars = ({ r }: { r: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={`w-3.5 h-3.5 ${s <= r ? 'fill-luxury-gold text-luxury-gold' : 'text-white/15'}`} />
    ))}
  </div>
);

const CustomerReviews = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section-padding bg-luxury-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="container-luxury relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ y: 40, opacity: 0 }} animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.75 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-luxury-gold/50" />
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/65">Testimonials</span>
            <div className="h-px w-10 bg-luxury-gold/50" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            What Customers <span className="gold-gradient-text">Say</span>
          </h2>

          {/* Overall rating strip */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-luxury-gold text-luxury-gold" />)}
            </div>
            <span className="font-heading text-3xl font-bold text-luxury-gold">4.9</span>
            <span className="font-body text-white/35 text-sm">/ 5.0</span>
            <span className="font-body text-white/25 text-xs">from 10,000+ reviews</span>
          </div>
        </motion.div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              className="group relative rounded-sm p-6 flex flex-col transition-all duration-400"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(8px)',
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: i * 0.09 }}
              whileHover={{
                y: -5,
                borderColor: 'rgba(212,175,55,0.25)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.05)',
              }}
            >
              {/* Glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
                style={{ background: r.color }}
              />

              {/* Quote */}
              <Quote className="w-7 h-7 text-luxury-gold/15 mb-4 flex-shrink-0" />

              {/* Stars */}
              <Stars r={r.rating} />

              {/* Comment */}
              <p className="font-body text-sm text-white/55 leading-relaxed mt-4 mb-5 flex-grow">
                "{r.comment}"
              </p>

              {/* Order badge */}
              <div className="mb-4 inline-flex items-center gap-1.5 bg-luxury-gold/8 border border-luxury-gold/15 px-2.5 py-1 rounded-sm self-start">
                <BadgeCheck className="w-3 h-3 text-luxury-gold/60" />
                <span className="font-body text-[10px] text-luxury-gold/60 tracking-wide">{r.order}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-body text-xs font-bold text-white flex-shrink-0"
                  style={{ background: r.color }}
                >
                  {r.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-body text-sm font-medium text-white truncate">{r.name}</span>
                    <span className="flex-shrink-0 text-[9px] text-luxury-gold font-body border border-luxury-gold/30 px-1.5 py-0.5 rounded-sm">✓ Verified</span>
                  </div>
                  <div className="font-body text-xs text-white/30 truncate">{r.location} · {r.date}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
