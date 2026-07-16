import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AnnouncementBar = () => {
  const items = [
    '✨ Festival Offer - Up to 80% Discount on Premium Crackers',
    '🚀 Free Shipping on Orders Above ₹2,000',
    '🎆 Exclusive Diwali Gift Boxes Now Available',
    '⭐ Factory Direct Prices - No Middlemen',
  ];

  return (
    <div className="bg-luxury-maroon border-b border-luxury-gold/20 py-2 overflow-hidden">
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: [0, -2000] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 text-xs font-body font-medium text-white/90 tracking-wider"
          >
            <Sparkles className="w-3 h-3 text-luxury-gold flex-shrink-0" />
            {item}
            <span className="mx-6 text-luxury-gold/40">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBar;
