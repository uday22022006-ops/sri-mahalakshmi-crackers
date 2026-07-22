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
import SafetyGuidelines from './components/SafetyGuidelines';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CategoriesPage from './components/CategoriesPage';
import ProductsPage from './components/ProductsPage';
import FloatingActions from './components/FloatingActions';
import MobileBottomNav from './components/MobileBottomNav';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import MiniCart from './components/MiniCart';
import FloatingMiniCart from './components/FloatingMiniCart';

import { supabase } from './lib/supabase';
import productsData from './data/products.json';
import type { Product } from './types';
import { updateSEO } from './lib/seo';

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
  const [autoOpenProductId, setAutoOpenProductId] = useState<number | null>(null);

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

  // Global click interceptor to enable client-side navigation for clean URLs
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Only handle standard left clicks without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      // Skip external links or target="_blank"
      if (anchor.target === '_blank') return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Intercept local clean paths starting with '/'
      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        window.history.pushState(null, '', href);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      // Ensure seo lib is loaded before attempting to update SEO
      const applySEO = (view: string, extra?: { category?: string }) => {
        if (view === 'offers') {
          updateSEO({
            title: 'Cracker Offers | Sri Mahalakshmi Crackers',
            description: 'Find the best offers on premium Sivakasi crackers and fireworks.'
          });
        } else if (view === 'home') {
          updateSEO({
            title: 'Sri Mahalakshmi Crackers | Premium Sivakasi Crackers',
            description: 'Buy premium Sivakasi crackers online from Sri Mahalakshmi Crackers. Best quality fireworks, gift boxes, sparklers, rockets, flower pots, sky shots and festival offers at wholesale prices.'
          });
        } else if (view === 'categories') {
          updateSEO({
            title: 'Cracker Categories | Sri Mahalakshmi Crackers',
            description: 'Browse our wide range of premium Sivakasi crackers by category including sparklers, flower pots, rockets, and gift boxes.'
          });
        } else if (view === 'products') {
          if (extra?.category) {
            updateSEO({
              title: `${extra.category} Collection | Sri Mahalakshmi Crackers`,
              description: `Shop our premium collection of ${extra.category}. High quality Sivakasi fireworks and crackers at wholesale prices.`
            });
          } else {
            updateSEO({
              title: 'All Products | Sri Mahalakshmi Crackers',
              description: 'View our complete catalog of premium fireworks and crackers at wholesale prices.'
            });
          }
        }
      };

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
      } else if (path.startsWith('/product/')) {
        const prodId = parseInt(path.substring('/product/'.length), 10);
        if (!isNaN(prodId)) {
          setAutoOpenProductId(prodId);
        }
        setCurrentView('products');
        setSelectedCategory('');
        window.scrollTo({ top: 0, behavior: 'instant' as any });
        applySEO('products');
      } else if (path.startsWith('/categories/')) {
        const catSlug = decodeURIComponent(path.substring('/categories/'.length)).toLowerCase();
        const categoriesList = [
          'Ground Chakkars',
          'Flower Pots',
          'Rockets',
          'Gift Boxes',
          'Fancy Items',
          'Atom Bomb',
          'Sparklers',
          'Sky Shots'
        ];
        const matched = categoriesList.find(c => c.toLowerCase().replace(/ /g, '-') === catSlug);
        if (matched) {
          setSelectedCategory(matched);
        }
        setCurrentView('products');
        setAutoOpenProductId(null);
        window.scrollTo({ top: 0, behavior: 'instant' as any });
        applySEO('products', { category: matched || undefined });
      } else if (path === '/categories' || hash.startsWith('#categories')) {
        setCurrentView('categories');
        setSelectedCategory('');
        setAutoOpenProductId(null);
        window.scrollTo({ top: 0, behavior: 'instant' as any });
        applySEO('categories');
      } else if (path === '/products' || hash.startsWith('#products')) {
        setCurrentView('products');
        setSelectedCategory('');
        setAutoOpenProductId(null);
        window.scrollTo({ top: 0, behavior: 'instant' as any });
        applySEO('products');
      } else if (path === '/offers' || hash.startsWith('#offers')) {
        setCurrentView('home');
        setSelectedCategory('');
        setAutoOpenProductId(null);
        setTimeout(() => {
          document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        applySEO('offers');
      } else {
        setCurrentView('home');
        setSelectedCategory('');
        setAutoOpenProductId(null);
        applySEO('home');
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
    //setCartOpen(true);
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
  const [customerLandmark, setCustomerLandmark] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerDeliveryDate, setCustomerDeliveryDate] = useState("");
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
    text += `👤 Name          : ${customerName}\n`;
    text += `📞 Mobile No.    : ${customerPhone}\n`;
    text += `🏠 Address       : ${customerAddress}\n`;
    text += `📍 Landmark      : ${customerLandmark.trim() || 'N/A'}\n`;
    text += `🏙️ City          : ${customerCity}\n`;
    text += `📮 Pincode       : ${customerPincode}\n`;
    text += `📅 Delivery Date : ${customerDeliveryDate || 'N/A'}\n`;
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
    if (!customerCity.trim()) {
      setCheckoutStatus({ status: 'error', message: 'Please enter your city/town.' });
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
          landmark: customerLandmark.trim() || null,
          city: customerCity.trim(),
          pincode: customerPincode.trim(),
          delivery_date: customerDeliveryDate || null,
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

      // 2. Insert items into public.order_items table
      const insertedOrderId = orderData[0].id;
      const orderItemsPayload = cartItems.map(item => ({
        order_id: insertedOrderId,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        qty: item.qty
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsError) throw itemsError;

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
      setCustomerLandmark("");
      setCustomerCity("");
      setCustomerDeliveryDate("");

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
    <div className={`min-h-screen bg-luxury-black font-body overflow-x-hidden pb-16 lg:pb-0 transition-all duration-300 ${cartOpen ? 'lg:pr-[380px] cart-open-active' : ''}`}>
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
            <SafetyGuidelines />
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
            autoOpenProductId={autoOpenProductId}
          />
        )}
      </main>

      <Footer />
      <ScrollToTop />
      <FloatingActions cartItems={cartItems} generateWhatsAppLink={generateWhatsAppLink} />
      <MobileBottomNav />

      {/* ── Floating Mini Cart Widget ── */}
      <FloatingMiniCart
        cartItems={cartItems}
        finalTotal={finalTotal}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* ── Shopping Cart Component ── */}
      <MiniCart
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQty={updateQty}
        originalTotal={originalTotal}
        finalTotal={finalTotal}
        savings={savings}
        discountPct={discountPct}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        customerAddress={customerAddress}
        setCustomerAddress={setCustomerAddress}
        customerPincode={customerPincode}
        setCustomerPincode={setCustomerPincode}
        customerLandmark={customerLandmark}
        setCustomerLandmark={setCustomerLandmark}
        customerCity={customerCity}
        setCustomerCity={setCustomerCity}
        customerDeliveryDate={customerDeliveryDate}
        setCustomerDeliveryDate={setCustomerDeliveryDate}
        checkoutStatus={checkoutStatus}
        handlePlaceOrder={handlePlaceOrder}
      />
    </div>
  );
}

export default App;