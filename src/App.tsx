import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, MessageCircle, Flame } from 'lucide-react';

import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CategoryIconSection from './components/CategoryIconSection';
import TodaysOffers from './components/TodaysOffers';
import BestSellingProducts from './components/BestSellingProducts';
import PremiumComboPacks from './components/PremiumComboPacks';
import QuickOrderSheet from './components/QuickOrderSheet';
import WhyChooseSMP from './components/WhyChooseSMP';
import FestivalBanner from './components/FestivalBanner';
import FeaturedBrands from './components/FeaturedBrands';
import CustomerReviews from './components/CustomerReviews';
import FAQSection from './components/FAQSection';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CategoriesPage from './components/CategoriesPage';
import ProductsPage from './components/ProductsPage';
import FloatingActions from './components/FloatingActions';
import MobileBottomNav from './components/MobileBottomNav';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

import { supabase } from './lib/supabase';
import productsData from './data/products.json';
import type { Product } from './types';

interface CartItem {
  id: number;
  name: string;
  category: string;
  original_price: number;
  price: number;
  image: string;
  qty: number;
}

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'categories' | 'products' | 'admin' | 'dashboard'>('home');
  const [adminSession, setAdminSession] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminSession(session ? session.user.id : null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminSession(session ? session.user.id : null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(productsData as any);
      }
    } catch (err: any) {
      console.error("Supabase Error:", JSON.stringify(err, null, 2));
      setError(err.message || 'Failed to connect to database');
      setProducts(productsData as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (path === '/admin/login' || hash === '#admin' || hash === '#/admin/login') {
        if (adminSession) {
          window.location.hash = '#dashboard';
        } else {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        }
      } else if (path === '/admin/dashboard' || hash === '#dashboard' || hash === '#/admin/dashboard') {
        if (!adminSession && !authLoading) {
          window.location.hash = '#admin';
        } else {
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'instant' as any });
        }
      } else if (hash.startsWith('#categories')) {
        setCurrentView('categories');
        window.scrollTo({ top: 0, behavior: 'instant' as any });
      } else if (hash.startsWith('#products')) {
        setCurrentView('products');
        window.scrollTo({ top: 0, behavior: 'instant' as any });
      } else {
        setCurrentView('home');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, [adminSession, authLoading]);

  const handleNavigateHome = () => {
    window.location.hash = '#home';
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    window.location.hash = '#products';
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const addToCart = (product: any, qty: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        category: product.category,
        price: Number(product.price),
        original_price: Number(product.original_price),
        image: product.image,
        qty
      }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  };

  const originalTotal = cartItems.reduce((acc, item) => acc + Number(item.original_price) * item.qty, 0);
  const finalTotal = cartItems.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
  const savings = originalTotal - finalTotal;
  const discountPct = originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0;

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPincode, setCustomerPincode] = useState("");
  const [checkoutStatus, setCheckoutStatus] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  } | null>(null);

  // Formatting WhatsApp text (Monospace-friendly alignment)
  const generateWhatsAppLink = (orderId?: string) => {
    if (cartItems.length === 0) {
      return 'https://wa.me/918344112220';
    }


    let text = "🏵️ *SRI MAHALAKSHMI CRACKERS*\n";
    if (orderId) {
      text += `🆔 *Order ID: ${orderId}*\n`;
    }

    text += `👤 Customer: ${customerName}\n`;
    text += `📞 Phone: ${customerPhone}\n`;
    text += `📍 Address: ${customerAddress}\n`;
    text += `📮 Pincode: ${customerPincode}\n\n`;
    text += "📋 *ORDER INVOICE*\n\n";

    text += "```";
    text += "\n";
    text += "-------------------------------------------------\n";
    text += "Item                 Qty      Amount\n";
    text += "-------------------------------------------------\n";

    cartItems.forEach((item) => {
      const name = item.name.substring(0, 20).padEnd(20, " ");
      const qty = String(item.qty).padStart(3, " ");
      const amount = `₹${(item.price * item.qty).toLocaleString("en-IN")}`.padStart(10, " ");

      text += `${name} ${qty} ${amount}\n`;
    });

    text += "-------------------------------------------------\n";
    text += `Original Total : ₹${originalTotal.toLocaleString("en-IN")}\n`;
    text += `Offer Total    : ₹${finalTotal.toLocaleString("en-IN")}\n`;
    text += `You Save       : ₹${savings.toLocaleString("en-IN")}\n`;
    text += "-------------------------------------------------\n";
    text += "```";

    text += "\n\n📝 *DELIVERY DETAILS*\n";
    text += "----------------------------------\n";
    text += "👤 Name          : \n";
    text += "📞 Mobile No.    : \n";
    text += "🏠 Address       : \n";
    text += "📍 Landmark      : \n";
    text += "🏙️ City          : \n";
    text += "📮 Pincode       : \n";
    text += "📅 Delivery Date : \n";
    text += "----------------------------------\n\n";
    text += "🙏 Please confirm my order and delivery availability. Thank you!";

    return `https://wa.me/918344112220?text=${encodeURIComponent(text)}`;
  };

  // Validate form fields, insert order + items in database, then redirect to WhatsApp and clear cart
  const handlePlaceOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCheckoutStatus(null);

    // Form fields validation
    if (!customerName.trim()) {
      setCheckoutStatus({ status: 'error', message: 'Please enter your name.' });
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 10) {
      setCheckoutStatus({ status: 'error', message: 'Please enter a valid 10-digit phone number.' });
      return;
    }
    if (!customerAddress.trim()) {
      setCheckoutStatus({ status: 'error', message: 'Please enter your delivery address.' });
      return;
    }
    if (!customerPincode.trim() || customerPincode.trim().length < 6) {
      setCheckoutStatus({ status: 'error', message: 'Please enter a valid 6-digit pincode.' });
      return;
    }

    setCheckoutStatus({ status: 'loading', message: 'Saving your order to database...' });

    try {
      const uniqueOrderNo = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Insert order into public.orders table
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_id: uniqueOrderNo,
          customer_name: customerName.trim(),
          phone: customerPhone.trim(),
          address: customerAddress.trim(),
          pincode: customerPincode.trim(),
          total_amount: finalTotal,
          order_details: JSON.stringify(cartItems),
          payment_method: 'WhatsApp Checkout',
          status: 'Pending'
        }])
        .select();

      if (orderError) throw orderError;
      if (!orderData || orderData.length === 0) {
        throw new Error('Could not create order records.');
      }

      // 3. Open WhatsApp link dynamically only after saving is fully complete
      const waUrl = generateWhatsAppLink(uniqueOrderNo);
      const newWin = window.open(waUrl, '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = waUrl;
      }

      // 4. Update status, clear inputs and cart
      setCheckoutStatus({ status: 'success', message: 'Order saved! Opening WhatsApp to complete...' });
      setCartItems([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerPincode("");

      // Automatically clean notifications and drawer state
      setTimeout(() => {
        setCartOpen(false);
        setCheckoutStatus(null);
      }, 3500);

    } catch (err: any) {
      console.error('Database checkout error:', err);
      // Keep cart items, update error text
      setCheckoutStatus({
        status: 'error',
        message: err.message || 'Database saving failed. Please check connection and try again.'
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    setAdminSession(null);
    window.location.hash = '#admin';
  };

  if (authLoading && (currentView === 'admin' || currentView === 'dashboard')) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-luxury-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminLogin
        onLoginSuccess={() => { window.location.hash = '#dashboard'; }}
        onBackToStore={handleNavigateHome}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <AdminDashboard
        productsList={products}
        onRefreshProducts={fetchProducts}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black font-body overflow-x-hidden pb-16 lg:pb-0">
      <div className="relative z-50">
        <AnnouncementBar />
      </div>

      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.qty, 0)}
        onCartOpen={() => setCartOpen(true)}
        wishlistCount={wishlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        isAdmin={!!adminSession}
      />

      <main>
        {currentView === 'home' ? (
          <>
            <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <CategoryIconSection setSelectedCategory={handleSelectCategory} />
            <TodaysOffers addToCart={addToCart} />
            <BestSellingProducts
              products={products}
              loading={loading}
              addToCart={addToCart}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              setSearchQuery={setSearchQuery}
            />
            <PremiumComboPacks addToCart={addToCart} />
            <QuickOrderSheet products={products} loading={loading} addToCart={addToCart} />
            <WhyChooseSMP />
            <FestivalBanner />
            <FeaturedBrands />
            <CustomerReviews />
            <FAQSection />
            <Newsletter />
          </>
        ) : currentView === 'categories' ? (
          <CategoriesPage
            onNavigateHome={handleNavigateHome}
            onSelectCategory={handleSelectCategory}
          />
        ) : (
          <ProductsPage
            products={products}
            loading={loading}
            error={error}
            addToCart={addToCart}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNavigateHome={handleNavigateHome}
          />
        )}
      </main>

      <Footer />
      <ScrollToTop />
      <FloatingActions cartItems={cartItems} generateWhatsAppLink={generateWhatsAppLink} />
      <MobileBottomNav />

      {/* ── Shopping Cart Drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[100] overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
              <motion.div
                className="w-full sm:w-screen sm:max-w-md bg-luxury-black border-l border-luxury-gold/20 flex flex-col shadow-luxury"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-luxury-gold/15 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-luxury-gold" />
                    <h2 className="font-heading text-xl font-bold text-white">Your Celebration Cart</h2>
                  </div>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Flame className="w-10 h-10 text-luxury-gold/20 mb-3 animate-pulse" />
                      <p className="font-body text-sm text-white/45 mb-4">Your cart is empty.</p>
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-luxury-gold text-luxury-black font-body text-xs font-semibold tracking-wider uppercase rounded-sm"
                      >
                        Shop Best Sellers
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Monospace Invoice Preview Table inside Drawer */}
                      <div className="p-4 bg-black/60 border border-luxury-gold/20 rounded-sm font-mono text-xs text-white/90">
                        <div className="text-center font-bold text-luxury-gold border-b border-dashed border-white/20 pb-2 mb-2 uppercase">
                          🧾 Digital Invoice Preview
                        </div>
                        <div className="flex justify-between font-bold border-b border-white/10 pb-1 mb-2 text-[11px]">
                          <span className="w-1/2 text-left">ITEM</span>
                          <span className="w-1/6 text-center">QTY</span>
                          <span className="w-1/3 text-right">TOTAL(₹)</span>
                        </div>

                        <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-[11px]">
                              <span className="w-1/2 text-left truncate pr-1">{item.name}</span>
                              <span className="w-1/6 text-center text-luxury-gold">{item.qty}</span>
                              <span className="w-1/3 text-right">{(item.price * item.qty).toLocaleString('en-IN')}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-dashed border-white/20 mt-3 pt-2 space-y-1 text-[11px]">
                          <div className="flex justify-between text-white/50">
                            <span>Gross Amt:</span>
                            <span className="line-through">₹{originalTotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-green-400">
                            <span>Discount:</span>
                            <span>-₹{savings.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Visual Qty Editor Panel */}
                      <div className="space-y-3 pt-2">
                        <p className="text-white/40 text-[11px] uppercase tracking-wider font-semibold">Modify Quantities:</p>
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-4 p-3 rounded-sm bg-white/[0.02] border border-white/[0.06] hover:border-luxury-gold/10 transition-colors">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-sm border border-white/10" />
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-heading font-semibold text-white truncate text-sm leading-tight">{item.name}</h4>
                                <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-400 text-[11px] transition-colors">
                                  Remove
                                </button>
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <span className="font-body text-xs font-bold text-luxury-gold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                <div className="flex items-center border border-white/10 rounded-sm bg-black/40 overflow-hidden">
                                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-5 h-5 flex items-center justify-center hover:bg-white/5 text-white/50">
                                    <Minus className="w-2 h-2" />
                                  </button>
                                  <span className="w-6 text-center text-xs text-white font-semibold font-mono">{item.qty}</span>
                                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-5 h-5 flex items-center justify-center hover:bg-white/5 text-white/50">
                                    <Plus className="w-2 h-2" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Summary Footer */}
                {cartItems.length > 0 && (
                  <div className="p-6 border-t border-luxury-gold/15 bg-white/[0.02]">
                    <div className="space-y-2.5 mb-6">
                      <div className="flex justify-between text-sm text-white/50 font-body">
                        <span>Subtotal</span>
                        <span className="line-through font-mono">₹{originalTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm text-green-400 font-body">
                        <span>Diwali Discount Savings</span>
                        <span className="font-mono">-₹{savings.toLocaleString('en-IN')} ({discountPct}% OFF)</span>
                      </div>
                      <div className="h-px bg-luxury-gold/15 my-2" />
                      <div className="flex justify-between text-base text-white font-body font-semibold">
                        <span className="text-luxury-gold">Grand Total</span>
                        <span className="text-xl font-heading font-bold text-luxury-gold font-mono">₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {finalTotal < 2000 ? (
                      <div className="mb-4 text-center">
                        <p className="font-body text-[11px] text-red-400 bg-red-950/20 border border-red-900/30 py-2 px-3 rounded-sm">
                          ⚠️ Minimum order value of <b>₹2,000</b> required. Please add ₹{(2000 - finalTotal).toLocaleString('en-IN')} more to checkout.
                        </p>
                      </div>
                    ) : null}
                    
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white font-body text-xs placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors" />

                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white font-body text-xs placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors" />

                      <textarea
                        placeholder="Delivery Address"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white font-body text-xs placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors resize-none" />

                      <input
                        type="text"
                        placeholder="Pincode"
                        value={customerPincode}
                        onChange={(e) => setCustomerPincode(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-sm py-3 px-4 text-white font-body text-xs placeholder:text-white/20 focus:outline-none focus:border-luxury-gold transition-colors" />
                    </div>

                    {checkoutStatus && (
                      <div className={`p-3 rounded-sm text-xs font-body mb-4 border ${checkoutStatus.status === 'error'
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
                      className={`w-full py-4 rounded-sm font-body font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-gold transition-all duration-300 ${finalTotal >= 2000 && checkoutStatus?.status !== 'loading'
                        ? 'bg-[#25D366] hover:bg-[#20ba59] text-white cursor-pointer'
                        : 'bg-white/10 text-white/30 cursor-not-allowed border border-white/5'
                        }`}
                      whileHover={finalTotal >= 2000 && checkoutStatus?.status !== 'loading' ? { scale: 1.02 } : {}}
                      whileTap={finalTotal >= 2000 && checkoutStatus?.status !== 'loading' ? { scale: 0.98 } : {}}
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      {checkoutStatus?.status === 'loading' ? 'Saving Order...' : 'Checkout via WhatsApp'}
                    </motion.button>

                    <div className="mt-3 text-center">
                      <span className="font-body text-[10px] text-white/30">Free shipping on all orders above ₹2,000 direct from Sivakasi</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;