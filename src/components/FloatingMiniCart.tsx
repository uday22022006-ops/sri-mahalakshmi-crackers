import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

interface FloatingMiniCartProps {
  cartItems: CartItem[];
  finalTotal: number;
  onOpenCart: () => void;
}

export default function FloatingMiniCart({
  cartItems,
  finalTotal,
  onOpenCart,
}: FloatingMiniCartProps) {
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // If there are no items in the cart, do not show the floating widget
  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      {/* ── Desktop Floating Card View (hidden lg:block) ── */}
      <motion.div
        className="hidden lg:flex fixed bottom-5 right-5 w-[280px] z-45 bg-[#0B0B0B]/85 backdrop-blur-xl border border-luxury-gold/20 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6),_0_0_20px_rgba(212,175,55,0.05)] flex-col p-5 font-body"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        whileHover={{
          y: -4,
          boxShadow: '0 20px 45px rgba(0,0,0,0.8), 0 0 25px rgba(212,175,55,0.12)',
          borderColor: 'rgba(212,175,55,0.4)',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Floating Animation Wrapper */}
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Header Area */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/25">
                <ShoppingCart className="w-4 h-4 text-luxury-gold" />
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-luxury-gold text-luxury-black text-[9px] font-extrabold rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              </div>
              <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                Cart Summary
              </span>
            </div>
            <span className="text-[10px] text-white/40 tracking-wider">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="h-px bg-white/[0.08] w-full my-3" />

          {/* Grand Total Pricing Display */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/50 text-xs uppercase tracking-widest font-medium">Grand Total</span>
            <motion.span
              key={finalTotal}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="text-xl font-heading font-black text-green-400 font-mono tracking-tight"
              style={{
                textShadow: '0 0 10px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)',
              }}
            >
              ₹{finalTotal.toLocaleString('en-IN')}
            </motion.span>
          </div>

          {/* Checkout/View Cart Button */}
          <motion.button
            onClick={onOpenCart}
            className="w-full py-3 bg-gradient-to-r from-luxury-gold to-luxury-gold/80 text-luxury-black font-body text-xs font-bold tracking-widest uppercase rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-300 flex items-center justify-center gap-1.5"
            whileTap={{ scale: 0.98 }}
          >
            <span>View Cart</span>
            <ShoppingCart className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ── Mobile Sticky Bottom bar View (lg:hidden) ── */}
      <motion.div
        className="lg:hidden fixed bottom-[56px] left-0 right-0 z-45 bg-[#0B0B0B]/95 backdrop-blur-xl border-t border-luxury-gold/25 px-6 py-4 flex items-center justify-between shadow-[0_-8px_30px_rgba(0,0,0,0.8)] font-body"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <ShoppingCart className="w-4.5 h-4.5 text-luxury-gold" />
            <motion.span
              key={totalItems}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-luxury-gold text-luxury-black text-[9px] font-bold rounded-full flex items-center justify-center"
            >
              {totalItems}
            </motion.span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/40 uppercase tracking-widest leading-none mb-0.5">
              {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
            </span>
            <motion.span
              key={finalTotal}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="text-base font-bold text-green-400 font-mono leading-none"
              style={{
                textShadow: '0 0 8px rgba(34, 197, 94, 0.3)',
              }}
            >
              ₹{finalTotal.toLocaleString('en-IN')}
            </motion.span>
          </div>
        </div>

        <motion.button
          onClick={onOpenCart}
          className="px-5 py-2.5 bg-luxury-gold text-luxury-black font-body text-xs font-bold tracking-widest uppercase rounded-lg shadow-gold flex items-center gap-1"
          whileTap={{ scale: 0.96 }}
        >
          <span>View Cart</span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
