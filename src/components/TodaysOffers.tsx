import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, ArrowRight, Clock, ShoppingCart, Flame } from 'lucide-react';

const offers = [
  {
    id: 1,
    tag: '🔥 Flash Deal',
    name: 'Royal Sparkler Combo',
    originalPrice: 3500,
    salePrice: 875,
    discount: 75,
    description: '50-piece premium sparkler bundle — golden rain & silver fountain mix.',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=500&q=75',
    stock: 'Only 8 left!',
    badgeColor: '#D4AF37',
    expiresIn: 14400,
  },
  {
    id: 2,
    tag: '⭐ Best Value',
    name: 'Diwali Mega Box',
    originalPrice: 8000,
    salePrice: 2400,
    discount: 70,
    description: '120+ pieces — rockets, chakkars, flower pots, sparklers, fancy items.',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=75',
    stock: 'Only 15 left!',
    badgeColor: '#5B0A1A',
    expiresIn: 28800,
  },
  {
    id: 3,
    tag: '🚀 New Arrival',
    name: 'Sky Rocket Pack (10)',
    originalPrice: 2000,
    salePrice: 580,
    discount: 71,
    description: 'High-altitude artillery shells — 200ft burst radius, 5 colours.',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500&q=75',
    stock: 'Only 20 left!',
    badgeColor: '#D4AF37',
    expiresIn: 7200,
  },
  {
    id: 4,
    tag: '💥 Top Seller',
    name: 'Peacock Fountain Set',
    originalPrice: 4500,
    salePrice: 1350,
    discount: 70,
    description: '8 premium flower-pot fountains — 90-second show each, 7-colour layers.',
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=500&q=75',
    stock: 'Only 12 left!',
    badgeColor: '#5B0A1A',
    expiresIn: 21600,
  },
];

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') };
};

const CountdownTimer = ({ seconds }: { seconds: number }) => {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setRemaining(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const t = formatTime(remaining);
  return (
    <div className="flex items-center gap-1">
      {[t.h, t.m, t.s].map((val, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="font-body text-xs font-bold tabular-nums text-luxury-gold bg-luxury-gold/10 border border-luxury-gold/20 px-1.5 py-0.5 rounded-sm">
            {val}
          </span>
          {i < 2 && <span className="text-luxury-gold/50 text-xs font-bold">:</span>}
        </div>
      ))}
    </div>
  );
};

interface TodaysOffersProps {
  addToCart: (item: any) => void;
}

const TodaysOffers = ({ addToCart }: TodaysOffersProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [addedIds, setAddedIds] = useState<number[]>([]);

  const handleAdd = (offer: typeof offers[0]) => {
    addToCart({
      id: 200 + offer.id,
      name: offer.name,
      category: 'Offer',
      originalPrice: offer.originalPrice,
      discountPrice: offer.salePrice,
      image: offer.image,
      discount: offer.discount,
      description: offer.description
    });
    setAddedIds(prev => [...prev, offer.id]);
    setTimeout(() => setAddedIds(prev => prev.filter(i => i !== offer.id)), 2200);
  };

  return (
    <section id="offers" className="section-padding bg-[#060406] relative overflow-hidden">
      {/* Maroon glow background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(91,10,26,0.3) 0%, transparent 70%)',
      }} />

      <div className="container-luxury relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.75 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-10 bg-luxury-gold/50" />
              <Flame className="w-3.5 h-3.5 text-luxury-gold" />
              <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/65">Limited Time</span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Today's <span className="gold-gradient-text">Offers</span>
            </h2>
            <p className="font-body text-white/45 text-sm mt-2 max-w-sm">
              Flash deals on premium crackers — prices reset at midnight.
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 bg-luxury-maroon/20 border border-luxury-maroon/30 px-4 py-3 rounded-sm"
            animate={{ borderColor: ['rgba(91,10,26,0.3)', 'rgba(212,175,55,0.4)', 'rgba(91,10,26,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Clock className="w-4 h-4 text-luxury-gold flex-shrink-0" />
            <span className="font-body text-xs text-white/50 mr-2">Offer ends in:</span>
            <CountdownTimer seconds={14400} />
          </motion.div>
        </motion.div>

        {/* Offers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              className="group relative bg-white/[0.02] border border-white/8 rounded-sm overflow-hidden hover:border-luxury-gold/25 transition-all duration-400"
              initial={{ y: 50, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: index * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(212,175,55,0.08)' }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img
                  src={offer.image}
                  alt={offer.name}
                  className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-luxury-black/30 group-hover:bg-luxury-black/10 transition-colors duration-400" />

                {/* Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-luxury-black/80 border rounded-sm"
                  style={{ borderColor: `${offer.badgeColor}50` }}>
                  <span className="font-body text-[10px] font-semibold tracking-wide text-white">{offer.tag}</span>
                </div>

                {/* Discount badge */}
                <div className="absolute top-3 right-3 w-11 h-11 bg-luxury-maroon border border-luxury-maroon-light rounded-full flex flex-col items-center justify-center">
                  <span className="font-body text-[11px] font-black text-white leading-none">{offer.discount}%</span>
                  <span className="font-body text-[8px] text-white/70 leading-none">OFF</span>
                </div>

                {/* Stock warning */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-luxury-black/80 px-2 py-1 rounded-sm">
                  <Zap className="w-3 h-3 text-luxury-gold" />
                  <span className="font-body text-[10px] text-luxury-gold/80">{offer.stock}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <h3 className="font-heading text-base font-semibold text-white mb-1 group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                  {offer.name}
                </h3>
                <p className="font-body text-xs text-white/40 leading-relaxed mb-3">{offer.description}</p>

                {/* Countdown */}
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3 h-3 text-luxury-gold/50 flex-shrink-0" />
                  <CountdownTimer seconds={offer.expiresIn} />
                </div>

                {/* Prices */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-heading text-xl font-bold text-luxury-gold">
                    ₹{offer.salePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-body text-xs text-white/30 line-through">
                    ₹{offer.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Add to cart */}
                <motion.button
                  onClick={() => handleAdd(offer)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-sm font-body text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                    addedIds.includes(offer.id)
                      ? 'bg-green-700/80 text-white border-transparent'
                      : 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold-light'
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  {addedIds.includes(offer.id) ? (
                    <><Zap className="w-3.5 h-3.5" />Added!</>
                  ) : (
                    <><ShoppingCart className="w-3.5 h-3.5" />Grab Offer</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all offers */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
        >
          <motion.a
            href="#products"
            className="inline-flex items-center gap-2 border border-luxury-gold/30 text-luxury-gold font-body text-xs font-semibold tracking-widest uppercase px-8 py-3.5 rounded-sm hover:bg-luxury-gold/8 transition-colors"
            whileHover={{ scale: 1.03, borderColor: 'rgba(212,175,55,0.7)' }}
            whileTap={{ scale: 0.97 }}
          >
            View All Offers <ArrowRight className="w-3.5 h-3.5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default TodaysOffers;
