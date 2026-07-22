import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, ChevronRight, Home, Flame, Heart, ShoppingCart, Eye, Star, Check, X } from 'lucide-react';
import type { Product } from '../types';

const fmt = (n?: number) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

const Stars = ({ r }: { r: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(r) ? 'fill-luxury-gold text-luxury-gold' : 'text-white/15'}`} />
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white/[0.02] border border-white/5 rounded-sm p-4 animate-pulse flex flex-col justify-between" style={{ height: '400px' }}>
    <div>
      <div className="aspect-[4/3] bg-white/5 rounded-sm mb-4" />
      <div className="h-3 w-1/4 bg-white/5 rounded-sm mb-2" />
      <div className="h-5 w-3/4 bg-white/5 rounded-sm mb-3" />
      <div className="h-3.5 w-1/2 bg-white/5 rounded-sm mb-4" />
    </div>
    <div className="h-10 w-full bg-white/5 rounded-sm" />
  </div>
);

const categoriesList = [
  { label: 'All Fireworks', value: '', emoji: '🔥' },
  { label: 'Ground Chakkars', value: 'Ground Chakkars', emoji: '🌀' },
  { label: 'Flower Pots', value: 'Flower Pots', emoji: '🌸' },
  { label: 'Rockets', value: 'Rockets', emoji: '🚀' },
  { label: 'Gift Boxes', value: 'Gift Boxes', emoji: '🎁' },
  { label: 'Fancy Items', value: 'Fancy Items', emoji: '✨' },
  { label: 'Atom Bomb', value: 'Atom Bomb', emoji: '💥' },
  { label: 'Sparklers', value: 'Sparklers', emoji: '🌟' },
  { label: 'Sky Shots', value: 'Sky Shots', emoji: '🎆' },
];

interface ProductsPageProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  addToCart: (product: any, qty?: number) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onNavigateHome: () => void;
  autoOpenProductId?: number | null;
}

const matchesCategory = (prodCat: string, selectedCat: string) => {
  if (!selectedCat) return true;
  const p = prodCat.toLowerCase();
  const s = selectedCat.toLowerCase();
  if (p === s) return true;
  if (s.startsWith(p) || p.startsWith(s)) return true;
  if (s === 'chakkars' && p === 'ground chakkars') return true;
  if (s === 'atom bombs' && p === 'atom bomb') return true;
  return false;
};

export default function ProductsPage({
  products,
  loading,
  error,
  addToCart,
  wishlist,
  toggleWishlist,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onNavigateHome,
  autoOpenProductId,
}: ProductsPageProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  // Auto-open product modal if autoOpenProductId is set and products exist
  useEffect(() => {
    if (autoOpenProductId && products.length > 0) {
      const prod = products.find(p => p.id === autoOpenProductId);
      if (prod) {
        setSelectedProduct(prod);
      }
    }
  }, [autoOpenProductId, products]);


  // Dynamic filter
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = matchesCategory(p.category, selectedCategory);
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div id="products" className="min-h-screen bg-luxury-black relative pt-[110px] pb-24 overflow-hidden">
      {/* Luxury light overlays */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle 50vw at 50% -10vw, rgba(91,10,26,0.25) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle 40vw at 90% 40%, rgba(212,175,55,0.06) 0%, transparent 50%)',
        }} />
      </div>

      <div className="container-luxury relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2.5 font-body text-xs text-white/40 mb-10" aria-label="Breadcrumb">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 hover:text-luxury-gold transition-colors duration-200"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-white/20" />
          <span className="text-luxury-gold font-medium">Products</span>
        </nav>

        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-10 bg-luxury-gold/50" />
              <Flame className="w-4 h-4 text-luxury-gold" />
              <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/75">Premium Sivakasi Fireworks</span>
              <Flame className="w-4 h-4 text-luxury-gold" />
              <div className="h-px w-10 bg-luxury-gold/50" />
            </div>

            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4">
              Signature <span className="gold-gradient-text">Catalogue</span>
            </h1>
            <p className="font-body text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Order premium quality Sivakasi crackers directly from the manufacturer. Safety certified, double checked, and packed with care.
            </p>
          </motion.div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-12">
          <div className="glass-card p-5 rounded-sm flex flex-col lg:flex-row gap-5 items-center justify-between border-luxury-gold/15">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold/50" />
              <input
                type="text"
                placeholder="Search premium fireworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-luxury-gold/15 rounded-sm py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/25 focus:outline-none focus:border-luxury-gold/55 transition-colors font-body"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end overflow-x-auto no-scrollbar py-1">
              {categoriesList.map((opt) => {
                const isSelected = selectedCategory === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => {
                      const href = opt.value
                        ? `/categories/${encodeURIComponent(opt.value.toLowerCase().replace(/ /g, '-'))}`
                        : '/products';
                      window.history.pushState(null, '', href);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-sm font-body text-xs font-semibold uppercase tracking-wider transition-all duration-300 border whitespace-nowrap ${isSelected
                      ? 'bg-luxury-gold border-luxury-gold text-luxury-black shadow-gold'
                      : 'bg-white/[0.02] border-white/5 text-white/60 hover:border-luxury-gold/40 hover:text-luxury-gold'
                      }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-sm">{opt.emoji}</span>
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Database connection status or error banner */}
        {error && (
          <div className="mb-8 p-4 rounded-sm bg-red-950/20 border border-red-900/30 text-center">
            <p className="font-body text-xs text-red-400">
              ⚠️ Connected to Offline Catalogue: Using cached premium product prices.
            </p>
          </div>
        )}

        {/* Products Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <SkeletonCard key={s} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((p, index) => {
                const isWishlisted = wishlist.includes(p.id);
                const isAdded = addedProductId === p.id;
                return (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group relative bg-white/[0.025] border border-white/8 rounded-sm overflow-hidden hover:border-luxury-gold/25 transition-all duration-400 flex flex-col justify-between"
                    whileHover={{ y: -7, boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 25px rgba(212,175,55,0.07)' }}
                  >
                    <div>
                      {/* Image container */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                        <img
                          src={p.image ?? undefined}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-luxury-black/25 group-hover:bg-luxury-black/0 transition-colors duration-400" />

                        {/* Badge */}
                        {p.badge && (
                          <div
                            className="absolute top-3 left-3 px-2.5 py-1 rounded-sm font-body text-[10px] font-semibold tracking-wide text-white"
                            style={{ background: p.badgeColor || '#D4AF37', boxShadow: `0 2px 10px ${(p.badgeColor || '#D4AF37')}80` }}
                          >
                            {p.badge}
                          </div>
                        )}

                        {/* Discount Pill */}
                        {(p.discount ?? 0) > 0 && (
                          <div className="absolute top-3 right-3 bg-luxury-maroon/90 border border-luxury-maroon-light/40 px-2 py-1 rounded-sm">
                            <span className="font-body text-[10px] font-black text-white">{p.discount}% OFF</span>
                          </div>
                        )}

                        {/* Floating actions */}
                        <div className="absolute right-3 bottom-3 flex flex-col gap-2 transition-all duration-300 translate-x-12 group-hover:translate-x-0">
                          <motion.button
                            onClick={() => toggleWishlist(p.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-250 backdrop-blur-sm ${isWishlisted ? 'bg-luxury-maroon border-luxury-maroon text-white' : 'bg-black/50 border-white/15 text-white/60 hover:border-luxury-gold/50'
                              }`}
                            whileTap={{ scale: 0.82 }}
                            aria-label="Wishlist"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                          </motion.button>
                          <motion.button
                            onClick={() => setSelectedProduct(p)}
                            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/15 bg-black/50 text-white/60 hover:border-luxury-gold/50 backdrop-blur-sm transition-all duration-250"
                            whileTap={{ scale: 0.82 }}
                            aria-label="Quick view"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Info Body */}
                      <div className="p-4">
                        <div className="font-body text-[10px] tracking-[0.35em] uppercase text-luxury-gold/50 mb-1">{p.category}</div>
                        <h3 className="font-heading text-base font-semibold text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Stars r={p.rating || 5} />
                          <span className="font-body text-[10px] text-white/35">{(p.rating || 5).toFixed(1)} ({p.reviews || 10})</span>
                        </div>
                        <div className="flex items-baseline gap-2.5 mb-2">
                          <span className="font-heading text-xl font-bold text-luxury-gold">{fmt(p.price)}</span>
                          <span className="font-body text-xs text-white/25 line-through">{fmt(p.original_price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="p-4 pt-0">
                      <motion.button
                        onClick={() => handleAddToCart(p)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-sm font-body text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${isAdded
                          ? 'bg-green-700/80 text-white'
                          : 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold-light'
                          }`}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Added!
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Add to Cart
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Hover Gold bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.article>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="text-center py-20 border border-white/5 rounded-sm bg-white/[0.01]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Flame className="w-10 h-10 text-luxury-gold/30 mx-auto mb-4 animate-pulse" />
              <h3 className="font-heading text-xl font-semibold text-white mb-2">No Fireworks Found</h3>
              <p className="font-body text-sm text-white/35">
                We couldn't find any products matching your active filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                }}
                className="mt-6 px-5 py-2.5 bg-luxury-gold text-luxury-black font-body text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-luxury-gold-light transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick View Modal Overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={() => handleAddToCart(selectedProduct)}
            isWishlisted={wishlist.includes(selectedProduct.id)}
            onWishlistToggle={() => toggleWishlist(selectedProduct.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

import { updateSEO } from '../lib/seo';

function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onWishlistToggle,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: () => void;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}) {
  // Update SEO for individual product
  useEffect(() => {
    updateSEO({
      title: `${product.name} | Sri Mahalakshmi Crackers`,
      description: product.description || `Buy ${product.name} from Sri Mahalakshmi Crackers at wholesale price.`
    });
    
    // Cleanup - revert to Products title when closing
    return () => {
      updateSEO({
        title: 'All Products | Sri Mahalakshmi Crackers',
        description: 'View our complete catalog of premium fireworks and crackers at wholesale prices.'
      });
    };
  }, [product]);

  const handleCart = () => {
    onAddToCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/85"
        style={{ backdropFilter: 'blur(8px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-lg rounded-sm overflow-hidden z-10"
        style={{ background: 'rgba(14,10,10,0.98)', border: '1px solid rgba(212,175,55,0.25)' }}
        initial={{ y: 60, scale: 0.94, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className="h-0.5 bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />
        <div className="grid sm:grid-cols-2">
          <div className="relative" style={{ aspectRatio: '1/1' }}>
            <img src={product.image ?? undefined} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(14,10,10,0.7)]" />
          </div>
          <div className="p-6 flex flex-col justify-between relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-white/8 hover:bg-white/15 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/60" />
            </button>

            <div>
              <div className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/50 mb-1">{product.category}</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2 leading-tight pr-6">{product.name}</h3>
              <Stars r={product.rating || 5} />
              <p className="font-body text-xs text-white/45 mt-3 mb-4 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-heading text-2xl font-bold text-luxury-gold">{fmt(product.price)}</span>
                <span className="font-body text-sm text-white/25 line-through">{fmt(product.original_price)}</span>
              </div>
              {(product.discount ?? 0) > 0 && (
                <div className="inline-flex items-center gap-1 bg-luxury-maroon/30 border border-luxury-maroon/40 px-2.5 py-1 rounded-sm mb-5">
                  <span className="font-body text-xs font-bold text-luxury-gold">{product.discount}% OFF</span>
                </div>
              )}

              <div className="flex gap-2">
                <motion.button
                  onClick={onWishlistToggle}
                  className={`px-3 border rounded-sm flex items-center justify-center transition-all duration-250 ${isWishlisted ? 'bg-luxury-maroon border-luxury-maroon text-white' : 'border-white/15 text-white/60 hover:border-luxury-gold/50'
                    }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                </motion.button>
                <motion.button
                  onClick={handleCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-luxury-gold text-luxury-black rounded-sm font-body font-semibold text-xs tracking-widest uppercase hover:bg-luxury-gold-light transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
