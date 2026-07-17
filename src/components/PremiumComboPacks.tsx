import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShoppingCart, Star, ArrowRight, Crown } from 'lucide-react';

const comboPacks = [
  {
    id: 1,
    badge: 'Most Popular',
    badgeColor: '#D4AF37',
    name: 'Diwali Supreme Bundle',
    tagline: 'The Complete Festival Experience',
    includes: ['20 Rockets', '10 Flower Pots', '10 Chakkars', '50 Sparklers', '5 Fancy Items'],
    originalPrice: 12000,
    salePrice: 3600,
    discount: 70,
    rating: 4.9,
    reviews: 412,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=700&q=75',
    highlight: true,
    glow: 'rgba(212,175,55,0.2)',
  },
  {
    id: 2,
    badge: 'Best for Families',
    badgeColor: '#5B0A1A',
    name: 'Family Celebration Pack',
    tagline: 'Safe & Stunning for Everyone',
    includes: ['30 Sparklers', '5 Flower Pots', '5 Chakkars', '10 Fancy Items', '2 Rockets'],
    originalPrice: 6000,
    salePrice: 1800,
    discount: 70,
    rating: 4.8,
    reviews: 287,
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=700&q=75',
    highlight: false,
    glow: 'rgba(91,10,26,0.3)',
  },
  {
    id: 3,
    badge: 'Premium Display',
    badgeColor: '#D4AF37',
    name: 'Royal Wedding Edition',
    tagline: 'Grand Display for Special Occasions',
    includes: ['50 Rockets', '20 Flower Pots', '5 Sky Shots', '10 Chakkars', 'Display Stand'],
    originalPrice: 25000,
    salePrice: 7500,
    discount: 70,
    rating: 5.0,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=700&q=75',
    highlight: false,
    glow: 'rgba(212,175,55,0.15)',
  },
];

interface PremiumComboPacksProps {
  addToCart: (item: any) => void;
}

const PremiumComboPacks = ({ addToCart }: PremiumComboPacksProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="combos" className="section-padding bg-luxury-black relative overflow-hidden">
      {/* Gold radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(212,175,55,0.06) 0%, transparent 60%)',
      }} />

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
            <Crown className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/65">Exclusive Bundles</span>
            <Crown className="w-3.5 h-3.5 text-luxury-gold" />
            <div className="h-px w-10 bg-luxury-gold/50" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            Premium <span className="gold-gradient-text">Combo Packs</span>
          </h2>
          <p className="font-body text-white/45 max-w-lg mx-auto text-sm leading-relaxed">
            Expertly curated bundles for every celebration — save more, celebrate more.
          </p>
        </motion.div>

        {/* Combo grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {comboPacks.map((pack, index) => (
            <motion.div
              key={pack.id}
              className={`group relative rounded-sm overflow-hidden transition-all duration-500 ${
                pack.highlight
                  ? 'ring-1 ring-luxury-gold/40'
                  : 'border border-white/8'
              }`}
              style={{
                background: pack.highlight
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(11,11,11,1) 50%)'
                  : 'rgba(255,255,255,0.02)',
              }}
              initial={{ y: 60, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -8, boxShadow: `0 30px 70px rgba(0,0,0,0.7), 0 0 40px ${pack.glow}` }}
            >
              {/* Most popular crown */}
              {pack.highlight && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />
              )}

              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={pack.image}
                  alt={pack.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/50 to-transparent" />

                {/* Badge */}
                <div
                  className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-sm"
                  style={{ background: `${pack.badgeColor}25`, border: `1px solid ${pack.badgeColor}60` }}
                >
                  <Crown className="w-3 h-3" style={{ color: pack.badgeColor }} />
                  <span className="font-body text-[10px] font-semibold tracking-wide text-white">{pack.badge}</span>
                </div>

                {/* Discount */}
                <div className="absolute top-4 right-4 bg-luxury-maroon border border-luxury-maroon-light/60 px-2.5 py-1.5 rounded-sm">
                  <span className="font-body text-xs font-black text-white">{pack.discount}% OFF</span>
                </div>

                {/* Rating overlay */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5">
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= Math.round(pack.rating) ? 'text-luxury-gold fill-luxury-gold' : 'text-white/20'}`} />
                    ))}
                  </div>
                  <span className="font-body text-[10px] text-white/50">({pack.reviews})</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="font-body text-[10px] tracking-widest uppercase text-luxury-gold/50 mb-1">{pack.tagline}</p>
                <h3 className="font-heading text-xl font-bold text-white mb-4 group-hover:text-luxury-gold transition-colors duration-300">
                  {pack.name}
                </h3>

                {/* Includes list */}
                <div className="mb-5">
                  <p className="font-body text-[10px] tracking-widest uppercase text-white/30 mb-2">Includes:</p>
                  <ul className="flex flex-col gap-1.5">
                    {pack.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 font-body text-xs text-white/55">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold/50 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Divider */}
                <div className="h-px bg-luxury-gold/10 mb-5" />

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-heading text-2xl font-bold text-luxury-gold">
                    ₹{pack.salePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-body text-sm text-white/30 line-through">
                    ₹{pack.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-body text-xs text-green-400 font-medium">
                    Save ₹{(pack.originalPrice - pack.salePrice).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* CTA */}
                <motion.button
                  onClick={() => addToCart({
                    id: 100 + pack.id,
                    name: pack.name,
                    category: 'Combo',
                    price: pack.salePrice,
                    original_price: pack.originalPrice,
                    image: pack.image,
                    discount: pack.discount,
                    description: pack.tagline
                  })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-sm font-body font-semibold text-xs tracking-widest uppercase transition-all duration-300 ${
                    pack.highlight
                      ? 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold-light'
                      : 'border border-luxury-gold/40 text-luxury-gold hover:bg-luxury-gold/10'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add Combo to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom combo CTA */}
        <motion.div
          className="mt-10 p-6 md:p-8 rounded-sm border border-luxury-gold/15 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(91,10,26,0.06) 100%)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
        >
          <div>
            <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
              Need a Custom Combo?
            </h3>
            <p className="font-body text-sm text-white/45">
              Contact us on WhatsApp and we'll curate a package just for you — any budget, any occasion.
            </p>
          </div>
          <motion.a
            href="https://wa.me/919876543210"
            target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-green-700/20 border border-green-700/40 text-green-400 font-body font-semibold text-xs tracking-widest uppercase px-7 py-3.5 rounded-sm hover:bg-green-700/30 transition-colors whitespace-nowrap"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <ArrowRight className="w-4 h-4" />
            WhatsApp Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumComboPacks;
