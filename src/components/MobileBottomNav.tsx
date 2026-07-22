import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Flame, Search, Gift, Heart } from 'lucide-react';

const MobileBottomNav = () => {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (path === '/categories' || hash.startsWith('#categories')) {
        setActiveTab('categories');
      } else if (path === '/products' || hash.startsWith('#products')) {
        setActiveTab('products');
      } else if (path === '/offers' || hash.startsWith('#offers')) {
        setActiveTab('offers');
      } else {
        setActiveTab('home');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'categories', label: 'Categories', icon: Flame, href: '/categories' },
    { id: 'search', label: 'Search', icon: Search, href: '/', triggerSearch: true },
    { id: 'offers', label: 'Offers', icon: Gift, href: '/offers' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/products' },
  ];

  const handleTap = (item: typeof navItems[0]) => {
    window.history.pushState(null, '', item.href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    if (item.triggerSearch) {
      setTimeout(() => {
        // Find navbar search button and click it to open
        const searchBtn = document.querySelector('button[aria-label="Search"]') as HTMLButtonElement | null;
        searchBtn?.click();
      }, 100);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-45 lg:hidden bg-luxury-black/85 backdrop-blur-xl border-t border-luxury-gold/15 px-4 py-2 flex items-center justify-around pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleTap(item)}
            className="flex flex-col items-center gap-1 py-1 px-3 relative focus:outline-none"
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-colors duration-300 ${
                  isActive ? 'text-luxury-gold' : 'text-white/40'
                }`}
              />
              {isActive && (
                <motion.div
                  layoutId="bottomBubble"
                  className="absolute -inset-2 bg-luxury-gold/8 rounded-full z-0"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </div>
            <span
              className={`font-body text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                isActive ? 'text-luxury-gold' : 'text-white/35'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
