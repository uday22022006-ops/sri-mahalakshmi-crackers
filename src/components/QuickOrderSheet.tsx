import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ClipboardList, ShoppingCart, Plus, Minus, Info } from 'lucide-react';
import type { Product } from '../types';

const fmt = (n?: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="py-4 px-6 flex items-center gap-4">
      <div className="w-12 h-12 bg-white/5 rounded-sm" />
      <div className="space-y-2 flex-1">
        <div className="h-4 w-1/3 bg-white/5 rounded-sm" />
        <div className="h-3 w-2/3 bg-white/5 rounded-sm" />
      </div>
    </td>
    <td className="py-4 px-4"><div className="h-6 w-16 bg-white/5 rounded-sm mx-auto" /></td>
    <td className="py-4 px-4"><div className="h-4 w-12 bg-white/5 rounded-sm ml-auto" /></td>
    <td className="py-4 px-4"><div className="h-4 w-12 bg-white/5 rounded-sm ml-auto" /></td>
    <td className="py-4 px-6"><div className="h-8 w-24 bg-white/5 rounded-sm mx-auto" /></td>
    <td className="py-4 px-6"><div className="h-4 w-16 bg-white/5 rounded-sm ml-auto" /></td>
  </tr>
);

interface QuickOrderSheetProps {
  products: Product[];
  loading: boolean;
  addToCart: (product: any, qty: number) => void;
}

const QuickOrderSheet = ({ products, loading, addToCart }: QuickOrderSheetProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const handleQtyChange = (id: number, val: number) => {
    if (val < 0) return;
    setQuantities(prev => ({
      ...prev,
      [id]: val,
    }));
  };

  const increment = (id: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decrement = (id: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      if (current <= 0) return prev;
      return {
        ...prev,
        [id]: current - 1,
      };
    });
  };

  // Calculate stats for selected items
  let totalQty = 0;
  let originalTotal = 0;
  let discountTotal = 0;

  products.forEach(p => {
    const qty = quantities[p.id] || 0;
    if (qty > 0) {
      totalQty += qty;
      originalTotal += p.original_price * qty;
      discountTotal += p.price * qty;
    }
  });

  const savings = originalTotal - discountTotal;
  const discountPct = originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0;

  const handleAddAll = () => {
    products.forEach(p => {
      const qty = quantities[p.id] || 0;
      if (qty > 0) {
        addToCart(p, qty);
      }
    });
    // Clear quantities after adding to cart
    setQuantities({});
  };

  return (
    <section id="quick-order" className="section-padding bg-luxury-black relative overflow-hidden border-t border-luxury-gold/10">
      {/* Background flare */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 60%)',
      }} />

      <div className="container-luxury relative z-10" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.75 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-luxury-gold/50" />
            <ClipboardList className="w-4 h-4 text-luxury-gold" />
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/65">Quick checkout</span>
            <div className="h-px w-10 bg-luxury-gold/50" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            Interactive <span className="gold-gradient-text">Price List</span>
          </h2>
          <p className="font-body text-white/45 max-w-lg mx-auto text-sm leading-relaxed">
            Fill in the quantities next to each cracker below to instantly calculate your bulk savings and build your cart.
          </p>
        </motion.div>

        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-sm bg-luxury-gold/5 border border-luxury-gold/20 flex items-start gap-3">
          <Info className="w-5 h-5 text-luxury-gold flex-shrink-0 mt-0.5" />
          <p className="font-body text-xs text-white/60 leading-relaxed">
            <b className="text-luxury-gold">Sivakasi Price Policy:</b> Get direct factory prices with up to 80% wholesale discount automatically calculated. Minimum order value of ₹2,000 required for checkout on WhatsApp.
          </p>
        </div>

        {/* Table/List Container */}
        <div className="glass-card rounded-sm overflow-hidden border border-white/10 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-body text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-xs font-semibold text-white/40 tracking-wider uppercase">
                  <th className="py-4.5 px-6">Product details</th>
                  <th className="py-4.5 px-4 text-center">Category</th>
                  <th className="py-4.5 px-4 text-right">Original price</th>
                  <th className="py-4.5 px-4 text-right text-luxury-gold">Diwali price</th>
                  <th className="py-4.5 px-6 text-center w-36">Quantity</th>
                  <th className="py-4.5 px-6 text-right w-36">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {loading ? (
                  [1, 2, 3, 4, 5].map((s) => <SkeletonRow key={s} />)
                ) : (
                  products.map((p) => {
                    const qty = quantities[p.id] || 0;
                    const itemSubtotal = p.price * qty;
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                        {/* Image & Name */}
                        <td className="py-4 px-6 flex items-center gap-4">
                          <img src={p.image ?? undefined} alt={p.name} className="w-12 h-12 object-cover rounded-sm border border-white/10" />
                          <div>
                            <span className="font-medium text-white group-hover:text-luxury-gold transition-colors block">{p.name}</span>
                            <span className="text-[10px] text-white/30 italic">{p.description}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 text-center text-white/50 text-xs">
                          <span className="px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded-sm uppercase tracking-wide">
                            {p.category}
                          </span>
                        </td>

                        {/* Original Price */}
                        <td className="py-4 px-4 text-right text-white/30 line-through">
                          {fmt(p.original_price)}
                        </td>

                        {/* Discount Price */}
                        <td className="py-4 px-4 text-right text-luxury-gold font-bold">
                          {fmt(p.price)}
                          <span className="block text-[9px] text-green-400 font-semibold">{p.discount}% OFF</span>
                        </td>

                        {/* Qty Counter */}
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center border border-white/10 rounded-sm bg-black/40 overflow-hidden w-28 mx-auto">
                            <button
                              onClick={() => decrement(p.id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              value={qty || ''}
                              onChange={(e) => handleQtyChange(p.id, parseInt(e.target.value) || 0)}
                              placeholder="0"
                              className="w-12 text-center bg-transparent text-white font-semibold text-xs border-none focus:outline-none focus:ring-0"
                              style={{ MozAppearance: 'textfield' }}
                            />
                            <button
                              onClick={() => increment(p.id)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Subtotal */}
                        <td className="py-4 px-6 text-right font-semibold text-white">
                          {qty > 0 ? fmt(itemSubtotal) : '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Savings Calculator Sticky Summary Panel */}
        {totalQty > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-6 rounded-sm border border-luxury-gold/30 bg-gradient-to-r from-luxury-black via-[#160e10] to-luxury-black shadow-gold flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-heading text-xl font-bold text-white">Bulk Order Summary</span>
                <span className="text-[10px] bg-luxury-maroon text-white font-bold px-2 py-0.5 rounded-sm">
                  {totalQty} items selected
                </span>
              </div>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <div className="text-sm font-body text-white/50">
                  Original Price: <span className="line-through">{fmt(originalTotal)}</span>
                </div>
                <div className="text-base font-body text-luxury-gold">
                  Diwali Price: <b className="text-xl font-heading font-bold text-luxury-gold">{fmt(discountTotal)}</b>
                </div>
                <div className="text-sm font-body text-green-400">
                  Total Savings: <b>{fmt(savings)} ({discountPct}% OFF)</b>
                </div>
              </div>
            </div>
            <motion.button
              onClick={handleAddAll}
              className="px-8 py-4 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-black font-body font-semibold text-xs tracking-widest uppercase rounded-sm flex items-center justify-center gap-2 shadow-gold whitespace-nowrap self-stretch md:self-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingCart className="w-4 h-4" />
              Add Selected Items to Cart
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default QuickOrderSheet;
