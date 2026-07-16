import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingCart, User, Menu, X, Flame, ChevronDown, Tag, Sparkles } from 'lucide-react';

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

  return (
    <>
      <motion.nav
        className="fixed left-0 right-0 z-50 transition-all duration-500"
        style={{ top: 32 }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glassmorphism backdrop */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: scrolled
              ? 'rgba(11, 11, 11, 0.95)'
              : 'rgba(11, 11, 11, 0.5)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: scrolled
              ? '1px solid rgba(212,175,55,0.22)'
              : '1px solid rgba(255,255,255,0.06)',
            boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.7)' : 'none',
          }}
        />

        {/* Main Header Container */}
        <div className="relative container-luxury flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <motion.a href="#home" className="flex items-center gap-3 group flex-shrink-0" whileHover={{ scale: 1.01 }}>
            <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
              <motion.div
                className="absolute inset-0 rounded-full bg-luxury-gold/15"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <Flame className="w-5 h-5 text-luxury-gold relative z-10" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-bold text-base md:text-lg text-white tracking-wide group-hover:text-luxury-gold transition-colors duration-300">
                Sri Mahalakshmi
              </span>
              <span className="font-body text-[9px] md:text-[10px] text-luxury-gold/70 tracking-[0.35em] uppercase">
                Premium Crackers
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((item) =>
              item.hasDropdown ? (
                <div key={item.label} ref={catRef} className="relative">
                  <motion.button
                    className="flex items-center gap-1.5 px-4 py-2 font-body text-sm font-medium text-white/65 hover:text-luxury-gold transition-colors duration-250 relative group rounded-sm"
                    onClick={() => setCatDropOpen(v => !v)}
                    whileHover={{ y: -1 }}
                  >
                    {item.label}
                    <motion.span
                      animate={{ rotate: catDropOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </motion.span>
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-luxury-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </motion.button>

                  <AnimatePresence>
                    {catDropOpen && (
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 overflow-hidden rounded-sm"
                        style={{
                          background: 'rgba(15,10,10,0.98)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(212,175,55,0.25)',
                          boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(212,175,55,0.05)',
                        }}
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-3 py-2.5 border-b border-luxury-gold/10">
                          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-luxury-gold/50">All Categories</span>
                        </div>
                        {categories.map((cat, i) => (
                          <motion.a
                            key={cat.label}
                            href={cat.href}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-luxury-gold/8 transition-colors duration-200 group/item"
                            onClick={() => {
                              setSelectedCategory(cat.label);
                              setCatDropOpen(false);
                              window.location.hash = '#products';
                            }}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <span className="text-base w-6 text-center">{cat.emoji}</span>
                            <span className="font-body text-sm text-white/65 group-hover/item:text-luxury-gold transition-colors duration-200">
                              {cat.label}
                            </span>
                            <span className="ml-auto w-0 group-hover/item:w-4 overflow-hidden transition-all duration-200">
                              <ChevronDown className="w-3 h-3 text-luxury-gold/60 -rotate-90" />
                            </span>
                          </motion.a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 font-body text-sm font-medium text-white/65 hover:text-luxury-gold transition-colors duration-250 relative group rounded-sm"
                  onClick={() => {
                    if (item.label === 'Home') setSelectedCategory('');
                    if (item.label === 'Products') setSelectedCategory('');
                  }}
                  whileHover={{ y: -1 }}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-3 right-3 h-px bg-luxury-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </motion.a>
              )
            )}
          </nav>

          {/* Action Icons Column */}
          <div className="flex items-center gap-1">
            {/* Search Toggle */}
            <motion.button
              onClick={() => setSearchOpen(v => !v)}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-luxury-gold/10 transition-colors duration-300"
              whileTap={{ scale: 0.88 }}
              aria-label="Search"
            >
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-4 h-4 text-luxury-gold" />
                  </motion.span>
                ) : (
                  <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Search className="w-4 h-4 text-white/60 hover:text-luxury-gold transition-colors" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Wishlist */}
            <motion.button
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-luxury-gold/10 transition-colors duration-300 text-white/60 hover:text-luxury-gold"
              whileTap={{ scale: 0.88 }}
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
                window.location.hash = '#products';
              }}
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <motion.span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-luxury-gold text-luxury-black text-[9px] font-bold rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </motion.button>

            {/* Cart with Glow Badge */}
            <motion.button
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-luxury-gold/10 transition-colors duration-300 text-white/60 hover:text-luxury-gold"
              whileTap={{ scale: 0.88 }}
              onClick={onCartOpen}
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-luxury-maroon text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-gold"
                  animate={{ boxShadow: ['0 0 0 rgba(212,175,55,0)', '0 0 8px rgba(212,175,55,0.7)', '0 0 0 rgba(212,175,55,0)'] }}
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
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-luxury-gold/10 transition-colors duration-300 text-white/60 hover:text-luxury-gold"
              whileTap={{ scale: 0.88 }}
              aria-label="Admin Portal"
            >
              <User className="w-4 h-4" />
            </motion.a>

            {/* Shop Now CTA */}
            <motion.a
              href="#products"
              className="hidden md:inline-flex items-center gap-1.5 ml-2 px-5 py-2 bg-luxury-gold text-luxury-black rounded-sm font-body font-semibold text-xs tracking-widest uppercase hover:bg-luxury-gold-light transition-colors duration-300"
              whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(212,175,55,0.45)' }}
              whileTap={{ scale: 0.96 }}
            >
              <Tag className="w-3 h-3" />
              Shop Now
            </motion.a>

            {/* Mobile Hamburger Toggle */}
            <motion.button
              className="lg:hidden w-9 h-9 flex items-center justify-center text-white/60 hover:text-luxury-gold transition-colors"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span key="x2" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span key="m" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Category Navigation Bar (Desktop Only) */}
        <div className="hidden lg:block border-t border-white/[0.04]" style={{ background: 'rgba(11, 11, 11, 0.65)' }}>
          <div className="container-luxury py-2 flex items-center justify-center gap-8">
            {categories.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(cat.label);
                  window.location.hash = '#products';
                }}
                className="flex items-center gap-1.5 font-body text-[11px] font-semibold text-white/50 hover:text-luxury-gold transition-colors duration-200 tracking-wider uppercase"
              >
                <span className="text-sm">{cat.emoji}</span>
                {cat.label}
              </a>
            ))}
          </div>
        </div>

        {/* Search Input Box */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="relative border-t"
              style={{ borderColor: 'rgba(212,175,55,0.12)' }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="container-luxury py-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold/50" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      window.location.hash = '#products';
                    }}
                    placeholder="Search sparklers, rockets, gift boxes…"
                    className="w-full bg-white/[0.04] border border-luxury-gold/15 rounded-sm py-3 pl-11 pr-4 text-sm text-white placeholder-white/25 font-body focus:outline-none focus:border-luxury-gold/50 transition-all duration-300"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-luxury-gold/30" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/75"
              style={{ backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="absolute right-0 top-0 bottom-0 w-72 flex flex-col"
              style={{
                background: 'rgba(10, 7, 7, 0.98)',
                borderLeft: '1px solid rgba(212,175,55,0.15)',
              }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-luxury-gold/10">
                <span className="font-heading text-xl text-luxury-gold">Menu</span>
                <button onClick={() => setMobileOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {navLinks.map((item, i) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between px-6 py-3.5 font-body text-sm text-white/60 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all duration-200 border-b border-white/[0.04]"
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => {
                      if (item.label === 'Home') setSelectedCategory('');
                      if (item.label === 'Products') setSelectedCategory('');
                      setMobileOpen(false);
                    }}
                  >
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-white/20" />
                  </motion.a>
                ))}

                <div className="px-6 py-4 border-t border-luxury-gold/10 mt-2">
                  <p className="font-body text-[10px] tracking-[0.4em] uppercase text-luxury-gold/40 mb-3">Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat, i) => (
                      <motion.a
                        key={cat.label}
                        href={cat.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-sm bg-white/[0.03] border border-white/[0.06] hover:border-luxury-gold/30 hover:bg-luxury-gold/[0.06] transition-all duration-200"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.06 }}
                        onClick={() => {
                          setSelectedCategory(cat.label);
                          setMobileOpen(false);
                          window.location.hash = '#products';
                        }}
                      >
                        <span className="text-sm">{cat.emoji}</span>
                        <span className="font-body text-xs text-white/50 truncate">{cat.label}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-luxury-gold/10 space-y-3">
                <motion.a
                  href="#products"
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-luxury-gold text-luxury-black font-body font-semibold text-sm tracking-widest uppercase rounded-sm"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Tag className="w-4 h-4" />
                  Shop Now
                </motion.a>
                <motion.a
                  href={isAdmin ? '#dashboard' : '#admin'}
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-white/10 hover:border-luxury-gold/30 hover:bg-white/[0.02] text-white/50 hover:text-luxury-gold font-body font-semibold text-xs tracking-widest uppercase rounded-sm"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="w-3.5 h-3.5" />
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
