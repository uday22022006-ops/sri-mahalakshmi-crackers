import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';

interface FloatingActionsProps {
  cartItems: any[];
  generateWhatsAppLink: () => string;
}

const FloatingActions = ({ cartItems, generateWhatsAppLink }: FloatingActionsProps) => {
  const hasCartItems = cartItems.length > 0;
  return (
    <div className={`fixed right-4 sm:right-6 flex flex-col gap-3.5 z-40 transition-all duration-300 ${
      hasCartItems ? 'bottom-32 sm:bottom-60' : 'bottom-20 sm:bottom-8'
    }`}>
      {/* WhatsApp Button */}
      <motion.a
        href={generateWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact via WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-[#25D366] text-white shadow-lg border border-[#25D366]/30 relative group"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {/* Glow effect */}
        <motion.span
          className="absolute inset-0 rounded-full bg-[#25D366]/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />

        {/* Hover label */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-sm bg-luxury-black border border-luxury-gold/20 text-luxury-gold font-body text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-luxury">
          {cartItems.length > 0 ? 'Send Cart Order' : 'WhatsApp Us'}
        </span>
      </motion.a>

      {/* Call Button */}
      <motion.a
        href="tel:+918344112220"
        aria-label="Call Customer Support"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-luxury-gold text-luxury-black shadow-lg border border-luxury-gold/30 relative group"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {/* Glow effect */}
        <motion.span
          className="absolute inset-0 rounded-full bg-luxury-gold/30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 fill-current" />

        {/* Hover label */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-sm bg-luxury-black border border-luxury-gold/20 text-luxury-gold font-body text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-luxury">
          Call Support
        </span>
      </motion.a>
    </div>
  );
};

export default FloatingActions;
