import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingCart, User, Menu, X, ChevronDown, Tag, Sparkles } from 'lucide-react';

const categories = [
  { label: 'Ground Chakkars', href: '#categories', emoji: '🌀' },
  { label: 'Flower Pots', href: '#categories', emoji: '🌸' },
  { label: 'Rockets', href: '#categories', emoji: '🚀' },
  { label: 'Gift Boxes', href: '#categories', emoji: '🎁' },
  { label: 'Fancy Items', href: '#categories', emoji: '✨' },
  { label: 'Atom Bomb', href: '#categories', emoji: '💥' },
  { label: 'Sparklers', href: '#categories', emoji: '🌟' },
  { label: 'Sky Shots', href: '#categories', emoji: '🎆' },
];

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Categories', href: '#categories', hasDropdown: true },
  { label: 'Products', href: '#products' },
  { label: 'Offers', href: '#offers' },
  { label: 'About', href: '#why-smp' },
  { label: 'Contact', href: '#footer' },
];

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
  wishlistCount: number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string) => void;
  isAdmin?: boolean;
}

const Navbar = ({
  cartCount,
  onCartOpen,
  wishlistCount,
  searchQuery,
  setSearchQuery,
  setSelectedCategory,
  isAdmin = false,
}: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catDropOpen, setCatDropOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Background Particles
  const particles = Array.from({ length: 20 });

  return (
    <>
      <motion.nav
        className="fixed left-0 right-0 z-50 transition-all duration-700"
        style={{ top: 32 }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Particle Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          {particles.map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-luxury-gold rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Glassmorphism backdrop */}
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: scrolled
              ? 'rgba(5, 5, 5, 0.98)'
              : 'rgba(11, 11, 11, 0.4)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            borderBottom: scrolled
              ? '1px solid rgba(212,175,55,0.4)'
              : '1px solid rgba(212,175,55,0.1)',
            boxShadow: scrolled ? '0 10px 50px rgba(0,0,0,0.9), 0 0 20px rgba(212,175,55,0.05)' : 'none',
          }}
        />

        {/* Main Header Container */}
        <div className="relative container-luxury flex items-center justify-between h-20 md:h-24">
          {/* Animated Premium Logo */}
          <motion.a
            href="#home"
            className="flex items-center gap-4 group flex-shrink-0"
          >
            <motion.div
              className="relative flex items-center justify-center flex-shrink-0"
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{
                scale: 1.08,
                rotate: [0, -3, 3, 0],
                filter: 'drop-shadow(0px 0px 15px rgba(255,215,0,0.7))'
              }}
            >
              <img
                src="/logo.png"
                alt="SMC Logo"
                className="w-14 h-14 md:w-16 md:h-16 object-contain drop-shadow-lg"
              />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="font-heading font-bold text-xl md:text-2xl tracking-wide bg-gradient-to-r from-white via-white to-luxury-gold bg-clip-text text-transparent group-hover:from-luxury-gold group-hover:to-white transition-all duration-500">
                Sri Mahalakshmi
              </span>
              <span className="font-body text-[10px] md:text-[11px] text-luxury-gold/80 tracking-[0.4em] uppercase font-medium">
                Premium Crackers
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation">
            {navLinks.map((item) =>
              item.hasDropdown ? (
                <div key={item.label} ref={catRef} className="relative">
                  <motion.button
                    className="flex items-center gap-1.5 px-4 py-2 font-body text-sm font-medium text-white/80 hover:text-luxury-gold transition-colors duration-300 relative group rounded-md"
                    onClick={() => setCatDropOpen(v => !v)}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {item.label}
                    <motion.span
                      animate={{ rotate: catDropOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.span>
                    <span className="absolute -bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  </motion.button>

                  <AnimatePresence>
                    {catDropOpen && (
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 overflow-hidden rounded-xl"
                        style={{
                          background: 'rgba(15,10,10,0.85)',
                          backdropFilter: 'blur(30px)',
                          border: '1px solid rgba(212,175,55,0.3)',
                          boxShadow: '0 30px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(212,175,55,0.1), 0 0 30px rgba(212,175,55,0.05)',
                        }}
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-4 py-3 border-b border-luxury-gold/15 bg-black/40">
                          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-luxury-gold/60 font-semibold">Collections</span>
                        </div>
                        <div className="py-2">
                          {categories.map((cat, i) => (
                            <motion.a
                              key={cat.label}
                              href={cat.href}
                              className="flex items-center gap-3 px-5 py-3 hover:bg-luxury-gold/10 transition-colors duration-300 group/item relative overflow-hidden"
                              onClick={() => {
                                setSelectedCategory(cat.label);
                                setCatDropOpen(false);
                                window.location.hash = '#products';
                              }}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.05, ease: "easeOut" }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-luxury-gold/0 via-luxury-gold/5 to-luxury-gold/0 translate-x-[-100%] group-hover/item:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                              <motion.span
                                className="text-lg w-8 text-center"
                                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                              >{cat.emoji}</motion.span>
                              <span className="font-body text-sm font-medium text-white/70 group-hover/item:text-luxury-gold transition-colors duration-300 relative z-10">
                                {cat.label}
                              </span>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 font-body text-sm font-medium text-white/80 hover:text-luxury-gold transition-colors duration-300 relative group rounded-md"
                  onClick={() => {
                    if (item.label === 'Home') setSelectedCategory('');
                    if (item.label === 'Products') setSelectedCategory('');
                  }}
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                </motion.a>
              )
            )}
          </nav>

          {/* Action Icons Column */}
          <div className="flex items-center gap-2">
            {/* Search Toggle */}
            <motion.button
              onClick={() => setSearchOpen(v => !v)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-luxury-gold/15 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 text-white/70 hover:text-luxury-gold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Search"
            >
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}>
                    <X className="w-5 h-5 text-luxury-gold" />
                  </motion.span>
                ) : (
                  <motion.span key="s" initial={{ rotate: 90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.3 }}>
                    <Search className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Wishlist */}
            <motion.button
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-luxury-gold/15 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 text-white/70 hover:text-luxury-gold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                window.location.hash = '#products';
              }}
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <motion.span
                  className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-luxury-gold-light to-luxury-gold-dark text-luxury-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart with Glow Badge */}
            <motion.button
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-luxury-gold/15 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 text-white/70 hover:text-luxury-gold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onCartOpen}
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute top-0 right-0 w-4 h-4 bg-luxury-maroon border border-luxury-gold/50 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                  animate={{ boxShadow: ['0 0 10px rgba(212,175,55,0.3)', '0 0 20px rgba(212,175,55,0.8)', '0 0 10px rgba(212,175,55,0.3)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Admin Panel */}
            <motion.a
              href={isAdmin ? '#dashboard' : '#admin'}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-luxury-gold/15 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 text-white/70 hover:text-luxury-gold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Admin Portal"
            >
              <User className="w-5 h-5" />
            </motion.a>

            {/* Premium Shop Now CTA */}
            <motion.a
              href="#products"
              className="hidden md:flex relative items-center gap-2 ml-4 px-6 py-2.5 rounded-md overflow-hidden group font-body font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] bg-gradient-to-r from-luxury-gold-dark via-luxury-gold to-luxury-gold-light text-luxury-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12" />
              <Tag className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Shop Now</span>
            </motion.a>

            {/* Mobile Hamburger Toggle */}
            <motion.button
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white/80 hover:text-luxury-gold transition-colors ml-2"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span key="x2" initial={{ rotate: -90, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0.5 }} transition={{ duration: 0.3 }}>
                    <X className="w-6 h-6 text-luxury-gold" />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate: 90, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0.5 }} transition={{ duration: 0.3 }}>
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Category Navigation Bar (Desktop Only) */}
        <div className="hidden lg:block border-t border-luxury-gold/10" style={{ background: 'rgba(5, 5, 5, 0.7)', backdropFilter: 'blur(10px)' }}>
          <div className="container-luxury py-2.5 flex items-center justify-center gap-10">
            {categories.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(cat.label);
                  window.location.hash = '#products';
                }}
                className="flex items-center gap-2 font-body text-[11px] font-bold text-white/50 hover:text-luxury-gold transition-all duration-300 tracking-[0.15em] uppercase group"
              >
                <motion.span
                  className="text-base group-hover:scale-125 transition-transform duration-300"
                >{cat.emoji}</motion.span>
                {cat.label}
              </a>
            ))}
          </div>
        </div>

        {/* Premium Search Input Box */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="relative border-t overflow-hidden"
              style={{ borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(30px)' }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="container-luxury py-5">
                <div className="relative max-w-3xl mx-auto">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gold" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      window.location.hash = '#products';
                    }}
                    placeholder="Search premium collections..."
                    className="w-full bg-white/[0.03] border-2 border-luxury-gold/30 rounded-xl py-4 pl-14 pr-6 text-base text-white placeholder-white/30 font-body focus:outline-none focus:border-luxury-gold focus:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-luxury-gold/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Luxury Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/80"
              style={{ backdropFilter: 'blur(8px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
              style={{
                background: 'rgba(15, 10, 10, 0.98)',
                borderLeft: '1px solid rgba(212,175,55,0.3)',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-luxury-gold/20">
                <span className="font-heading text-2xl text-luxury-gold font-bold">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-luxury-gold transition-colors p-2 bg-white/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-1 px-4">
                  {navLinks.map((item, i) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className="flex items-center justify-between px-4 py-4 font-body text-base font-medium text-white/80 hover:text-luxury-gold hover:bg-luxury-gold/10 rounded-xl transition-all duration-300 group"
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + (i * 0.05), ease: "easeOut" }}
                      onClick={() => {
                        if (item.label === 'Home') setSelectedCategory('');
                        if (item.label === 'Products') setSelectedCategory('');
                        setMobileOpen(false);
                      }}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4 -rotate-90 text-luxury-gold/30 group-hover:text-luxury-gold/80 transition-colors" />
                    </motion.a>
                  ))}
                </div>

                <div className="px-6 py-6 border-t border-luxury-gold/20 mt-6">
                  <p className="font-body text-[11px] font-bold tracking-[0.4em] uppercase text-luxury-gold/60 mb-4">Collections</p>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map((cat, i) => (
                      <motion.a
                        key={cat.label}
                        href={cat.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-luxury-gold/10 hover:border-luxury-gold/40 hover:bg-luxury-gold/10 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05, ease: "easeOut" }}
                        onClick={() => {
                          setSelectedCategory(cat.label);
                          setMobileOpen(false);
                          window.location.hash = '#products';
                        }}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="font-body text-xs font-semibold text-white/80 truncate">{cat.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-luxury-gold/20 space-y-4 bg-black/40">
                <motion.a
                  href="#products"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-luxury-gold-dark via-luxury-gold to-luxury-gold-light text-luxury-black font-body font-bold text-sm tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Tag className="w-4 h-4" />
                  Shop Now
                </motion.a>
                <motion.a
                  href={isAdmin ? '#dashboard' : '#admin'}
                  className="flex items-center justify-center gap-2 w-full py-4 border-2 border-luxury-gold/30 hover:border-luxury-gold hover:bg-luxury-gold/10 text-white hover:text-luxury-gold font-body font-bold text-sm tracking-widest uppercase rounded-xl transition-all duration-300"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Admin Portal
                </motion.a>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;