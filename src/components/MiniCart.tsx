import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, MessageCircle, Flame } from 'lucide-react';

export interface CartItem {
  id: number;
  name: string;
  category: string;
  original_price: number;
  price: number;
  image: string;
  qty: number;
}

interface MiniCartProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartItems: CartItem[];
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  originalTotal: number;
  finalTotal: number;
  savings: number;
  discountPct: number;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerAddress: string;
  setCustomerAddress: (address: string) => void;
  customerPincode: string;
  setCustomerPincode: (pincode: string) => void;
  customerLandmark: string;
  setCustomerLandmark: (landmark: string) => void;
  customerCity: string;
  setCustomerCity: (city: string) => void;
  customerDeliveryDate: string;
  setCustomerDeliveryDate: (date: string) => void;
  checkoutStatus: {
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  } | null;
  handlePlaceOrder: (e: React.MouseEvent) => void;
}

export default function MiniCart({
  cartOpen,
  setCartOpen,
  cartItems,
  removeFromCart,
  updateQty,
  originalTotal,
  finalTotal,
  savings,
  discountPct,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  customerAddress,
  setCustomerAddress,
  customerPincode,
  setCustomerPincode,
  customerLandmark,
  setCustomerLandmark,
  customerCity,
  setCustomerCity,
  customerDeliveryDate,
  setCustomerDeliveryDate,
  checkoutStatus,
  handlePlaceOrder,
}: MiniCartProps) {
  // Shared Cart Content Renderer
  const renderCartContent = (isMobile: boolean) => {
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
      <div className={isMobile 
        ? "flex flex-col h-full bg-[#0A0A0A] text-white" 
        : "flex flex-col h-screen bg-[#0A0A0A] text-white overflow-hidden"
      }>
        {/* Header (flex-shrink-0) */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-luxury-gold/15 bg-[#0A0A0A]/95 backdrop-blur-md flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛒</span>
              <h2 className="font-heading text-xl font-bold tracking-wide text-white">
                Shopping Cart
              </h2>
            </div>
            <p className="text-[11px] text-luxury-gold/75 tracking-wide mt-1.5 font-medium">
              Celebrate this Diwali with Premium Crackers
            </p>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all duration-300 border border-white/10 hover:border-luxury-gold/35"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Content Body Area */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Flame className="w-12 h-12 text-luxury-gold/20 mb-4 animate-pulse" />
            <p className="text-sm text-white/40 mb-6">Your cart is empty.</p>
            <button
              onClick={() => {
                setCartOpen(false);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-gradient-to-r from-luxury-gold to-luxury-gold/80 text-luxury-black font-body text-xs font-bold tracking-widest uppercase rounded-sm hover:scale-105 transition-all duration-300 shadow-gold"
            >
              Shop Best Sellers
            </button>
          </div>
        ) : (
          <>
            {/* 1. Products List (max-h-[180px] overflow-y-auto flex-shrink-0) */}
            <div className="max-h-[180px] overflow-y-auto p-6 space-y-6 border-b border-luxury-gold/10 scrollbar-thin scrollbar-thumb-luxury-gold/20 flex-shrink-0">
              {/* Digital Invoice Preview */}
              <div className="p-4 bg-black/60 border border-luxury-gold/20 rounded-lg font-mono text-xs text-white/90 shadow-inner">
                <div className="text-center font-bold text-luxury-gold border-b border-dashed border-white/20 pb-2 mb-2 uppercase tracking-wider">
                  🧾 Digital Invoice Preview
                </div>
                <div className="flex justify-between font-bold border-b border-white/10 pb-1 mb-2 text-[11px] text-white/50">
                  <span className="w-1/2 text-left">ITEM</span>
                  <span className="w-1/6 text-center">QTY</span>
                  <span className="w-1/3 text-right">TOTAL(₹)</span>
                </div>

                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 no-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-[11px]">
                      <span className="w-1/2 text-left truncate pr-1">{item.name}</span>
                      <span className="w-1/6 text-center text-luxury-gold font-bold">{item.qty}</span>
                      <span className="w-1/3 text-right">{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-white/20 mt-3 pt-2 space-y-1 text-[11px]">
                  <div className="flex justify-between text-white/40">
                    <span>Gross Amt:</span>
                    <span className="line-through">₹{originalTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Discount:</span>
                    <span>-₹{savings.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Product Cards */}
              <div className="space-y-4">
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                  Shopping Cart Items ({totalItems})
                </p>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-md border border-luxury-gold/20 hover:border-luxury-gold/45 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.08)] transition-all duration-300 group relative"
                  >
                    {/* Left: Large Image */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Center: Details & Circular Qty Buttons */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <span className="text-luxury-gold/60 font-body text-[9px] tracking-wider uppercase font-semibold block mb-0.5">{item.category}</span>
                        <h4 className="font-heading font-bold text-white truncate text-sm leading-snug group-hover:text-luxury-gold transition-colors duration-250">{item.name}</h4>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all duration-200 border border-white/10"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs text-white font-bold font-mono">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition-all duration-200 border border-white/10"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Right: Pricing & Remove */}
                    <div className="flex flex-col justify-between items-end py-1 flex-shrink-0 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-luxury-gold font-bold text-sm font-mono">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                        <span className="line-through text-white/30 text-[10px] font-mono mt-0.5">₹{(item.original_price * item.qty).toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-white/40 hover:text-red-400 p-1.5 hover:bg-red-500/10 rounded-full transition-all duration-200 border border-transparent hover:border-red-500/20"
                        title="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Order Summary Panel (flex-shrink-0) */}
            <div className="px-6 py-4 bg-black/40 border-b border-luxury-gold/10 flex-shrink-0 space-y-2.5">
              <div className="flex justify-between text-xs text-white/50 font-body">
                <span>Subtotal</span>
                <span className="line-through font-mono">₹{originalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-green-400 font-body">
                <span>Diwali Savings</span>
                <span className="font-mono">-₹{savings.toLocaleString('en-IN')} ({discountPct}% OFF)</span>
              </div>
              <div className="h-px bg-luxury-gold/15 my-1" />
              <div className="flex justify-between items-center text-sm text-white font-body font-semibold">
                <span className="text-luxury-gold uppercase tracking-wider text-xs">Grand Total</span>
                <motion.span
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [1, 0.9, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-2xl font-heading font-extrabold text-green-400 font-mono"
                  style={{
                    textShadow: "0 0 8px rgba(34,197,94,0.6), 0 0 20px rgba(34,197,94,0.4)",
                  }}
                >
                  ₹{finalTotal.toLocaleString('en-IN')}
                </motion.span>
              </div>
            </div>

            {/* 3. Scrollable Content - Delivery Form inputs (flex-1 overflow-y-auto min-h-0) */}
            <div className={isMobile 
              ? "flex-1 overflow-y-auto min-h-0 px-4 pb-32 no-scrollbar" 
              : "flex-1 min-h-0 overflow-y-auto pr-2 no-scrollbar px-4 py-4"
            }>
              <p className="text-luxury-gold/60 text-[10px] uppercase tracking-widest font-bold mb-3 px-2">
                Delivery Details
              </p>
              <div className="space-y-3 px-2">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-luxury-gold rounded-lg py-2.5 px-3.5 text-white font-body text-xs placeholder:text-white/20 focus:outline-none transition-all duration-300"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-luxury-gold rounded-lg py-2.5 px-3.5 text-white font-body text-xs placeholder:text-white/20 focus:outline-none transition-all duration-300"
                />
                <textarea
                  placeholder="Delivery Address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-luxury-gold rounded-lg py-2.5 px-3.5 text-white font-body text-xs placeholder:text-white/20 focus:outline-none transition-all duration-300 resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City / Town"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-luxury-gold rounded-lg py-2.5 px-3.5 text-white font-body text-xs placeholder:text-white/20 focus:outline-none transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={customerPincode}
                    onChange={(e) => setCustomerPincode(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-luxury-gold rounded-lg py-2.5 px-3.5 text-white font-body text-xs placeholder:text-white/20 focus:outline-none transition-all duration-300"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={customerLandmark}
                  onChange={(e) => setCustomerLandmark(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-luxury-gold rounded-lg py-2.5 px-3.5 text-white font-body text-xs placeholder:text-white/20 focus:outline-none transition-all duration-300"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-white/40 font-body uppercase tracking-wider pl-1">Preferred Delivery Date (Optional)</label>
                  <input
                    type="date"
                    value={customerDeliveryDate}
                    onChange={(e) => setCustomerDeliveryDate(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 hover:border-white/20 focus:border-luxury-gold rounded-lg py-2.5 px-3.5 text-white font-body text-xs placeholder:text-white/20 focus:outline-none transition-all duration-300 [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* 4. Sticky Checkout Section (placed outside scrollable content, sticky bottom, flex-shrink-0) */}
            <div className="sticky bottom-0 flex-shrink-0 bg-[#0A0A0A] border-t border-yellow-500/20 p-4 z-10 space-y-3">
              {finalTotal < 2000 && (
                <div className="text-center">
                  <p className="font-body text-[10px] text-red-400 bg-red-950/20 border border-red-900/30 py-2 px-3 rounded-md">
                    ⚠️ Minimum order: <b>₹2,000</b>. Add ₹{(2000 - finalTotal).toLocaleString('en-IN')} more to checkout.
                  </p>
                </div>
              )}

              {checkoutStatus && (
                <div className={`p-3 rounded-lg text-xs font-body border ${
                  checkoutStatus.status === 'error'
                    ? 'bg-red-950/20 border-red-900/40 text-red-200'
                    : checkoutStatus.status === 'success'
                      ? 'bg-green-950/20 border-green-900/40 text-green-200'
                      : 'bg-luxury-gold/10 border-luxury-gold/20 text-luxury-gold animate-pulse'
                }`}>
                  {checkoutStatus.message}
                </div>
              )}

              <motion.button
                onClick={handlePlaceOrder}
                disabled={finalTotal < 2000 || checkoutStatus?.status === 'loading'}
                className={`w-full py-3.5 rounded-lg font-body font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
                  finalTotal >= 2000 && checkoutStatus?.status !== 'loading'
                    ? 'bg-[#25D366] hover:bg-[#20ba59] text-white hover:shadow-[#25D366]/20 cursor-pointer hover:scale-[1.02]'
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                }`}
                whileTap={finalTotal >= 2000 && checkoutStatus?.status !== 'loading' ? { scale: 0.98 } : {}}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                {checkoutStatus?.status === 'loading' ? 'Saving Order...' : 'Checkout via WhatsApp'}
              </motion.button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ── Custom Style Override to Offset Header/Navbar and Hide Scrollbars ── */}
      <style>{`
        @media (min-width: 1024px) {
          .cart-open-active nav.fixed {
            right: 380px !important;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ── Mobile Cart slide drawer (lg:hidden) ── */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[100] overflow-hidden lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                className="w-full sm:w-screen sm:max-w-md bg-[#0A0A0A] border-l border-luxury-gold/20 flex flex-col shadow-luxury"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              >
                {renderCartContent(true)}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Desktop Mini Fixed Side Cart (hidden lg:flex) ── */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="hidden lg:flex fixed top-0 right-0 h-screen w-[380px] z-[51] border-l border-luxury-gold/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex-col font-body overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {renderCartContent(false)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
