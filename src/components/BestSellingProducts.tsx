import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, Check, X } from 'lucide-react';
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
  <div className="bg-white/[0.02] border border-white/5 rounded-sm p-4 animate-pulse flex flex-col justify-between" style={{ height: '380px' }}>
    <div>
      <div className="aspect-[4/3] bg-white/5 rounded-sm mb-4" />
      <div className="h-3 w-1/4 bg-white/5 rounded-sm mb-2" />
      <div className="h-5 w-3/4 bg-white/5 rounded-sm mb-3" />
      <div className="h-3.5 w-1/2 bg-white/5 rounded-sm mb-4" />
    </div>
    <div className="h-9 w-full bg-white/5 rounded-sm" />
  </div>
);

interface ProductCardProps {
  product: Product;
  index: number;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
}

const ProductCard = ({ product, index, isWishlisted, onWishlistToggle, onAddToCart }: ProductCardProps) => {
  const [added, setAdded] = useState(false);
  const [qv, setQv] = useState(false);

  const handleCart = () => {
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <motion.article
        className="group relative bg-white/[0.025] border border-white/8 rounded-sm overflow-hidden hover:border-luxury-gold/25 transition-all duration-400"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -7, boxShadow: '0 24px 60px rgba(0,0,0,0.65), 0 0 25px rgba(212,175,55,0.07)' }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
          <img
            src={product.image ?? ""} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-luxury-black/25 group-hover:bg-luxury-black/0 transition-colors duration-400" />

          {/* Badge */}
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-sm font-body text-[10px] font-semibold tracking-wide text-white"
            style={{ background: product.badgeColor, boxShadow: `0 2px 10px ${product.badgeColor}80` }}
          >
            {product.badge}
          </div>

          {/* Discount pill */}
          <div className="absolute top-3 right-3 bg-luxury-maroon/90 border border-luxury-maroon-light/40 px-2 py-1 rounded-sm">
            <span className="font-body text-[10px] font-black text-white">{product.discount}% OFF</span>
          </div>

          {/* Floating actions */}
          <div className="absolute right-3 bottom-3 flex flex-col gap-2 transition-all duration-300 translate-x-10 group-hover:translate-x-0">
            <motion.button
              onClick={onWishlistToggle}
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-250 backdrop-blur-sm ${isWishlisted ? 'bg-luxury-maroon border-luxury-maroon text-white' : 'bg-black/50 border-white/15 text-white/60 hover:border-luxury-gold/50'
                }`}
              whileTap={{ scale: 0.82 }}
              aria-label="Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
            </motion.button>
            <motion.button
              onClick={() => setQv(true)}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-white/15 bg-black/50 text-white/60 hover:border-luxury-gold/50 backdrop-blur-sm transition-all duration-250"
              whileTap={{ scale: 0.82 }}
              aria-label="Quick view"
            >
              <Eye className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="font-body text-[10px] tracking-[0.35em] uppercase text-luxury-gold/50 mb-1">{product.category}</div>
          <h3 className="font-heading text-base font-semibold text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <Stars r={product.rating ?? 5} />
            <span className="font-body text-[10px] text-white/35">{product.rating} ({product.reviews})</span>
          </div>
          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="font-heading text-xl font-bold text-luxury-gold">{fmt(product.discountPrice ?? product.price ?? product.price)}</span>
            <span className="font-body text-xs text-white/25 line-through">{fmt(product.original_price)}</span>
          </div>
          <motion.button
            onClick={handleCart}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-sm font-body text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${added
              ? 'bg-green-700/80 text-white'
              : 'bg-luxury-gold text-luxury-black hover:bg-luxury-gold-light'
              }`}
            whileTap={{ scale: 0.97 }}
          >
            {added ? <><Check className="w-3.5 h-3.5" />Added!</> : <><ShoppingCart className="w-3.5 h-3.5" />Add to Cart</>}
          </motion.button>
        </div>

        {/* Bottom gold bar on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </motion.article>

      <AnimatePresence>
        {qv && (
          <QuickViewModal
            product={product}
            onClose={() => setQv(false)}
            onAddToCart={onAddToCart}
            isWishlisted={isWishlisted}
            onWishlistToggle={onWishlistToggle}
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface BestSellingProductsProps {
  products: Product[];
  loading: boolean;
  addToCart: (item: any) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  searchQuery: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (q: string) => void;
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

const BestSellingProducts = ({
  products,
  loading,
  addToCart,
  wishlist,
  toggleWishlist,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  setSearchQuery,
}: BestSellingProductsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  // Dynamic filter
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = matchesCategory(p.category, selectedCategory);
    return matchesSearch && matchesCat;
  });

  return (
    <section id="products" className="section-padding bg-[#070507] relative overflow-hidden">
      <div className="container-luxury" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.75 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-luxury-gold/50" />
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/65">Top Picks</span>
            <div className="h-px w-10 bg-luxury-gold/50" />
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            Best <span className="gold-gradient-text">Selling</span> Products
          </h2>
          {selectedCategory && (
            <div className="inline-flex items-center gap-2 bg-luxury-gold/10 border border-luxury-gold/30 px-3 py-1 rounded-sm mb-3">
              <span className="font-body text-xs text-luxury-gold">Category: <b>{selectedCategory}</b></span>
              <button
                onClick={() => setSelectedCategory('')}
                className="text-white hover:text-luxury-gold text-[10px] ml-1 font-bold"
              >
                ✕
              </button>
            </div>
          )}
          {searchQuery && (
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-sm mb-3 ml-2">
              <span className="font-body text-xs text-white/70">Search: <i>"{searchQuery}"</i></span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-white hover:text-luxury-gold text-[10px] ml-1 font-bold"
              >
                ✕
              </button>
            </div>
          )}
          <p className="font-body text-white/45 max-w-md mx-auto text-sm">
            Loved by 10,000+ customers across India — our most celebrated fireworks.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <SkeletonCard key={s} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                isWishlisted={wishlist.includes(p.id)}
                onWishlistToggle={() => toggleWishlist(p.id)}
                onAddToCart={() => addToCart(p)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-sm">
            <p className="font-body text-white/45 mb-4">No products found matching your active filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-luxury-gold text-luxury-black font-body text-xs font-semibold tracking-wider uppercase rounded-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Simplified Quick View modal overlay inside BestSellingProducts file for compilation
function QuickViewModal({
  product, onClose, onAddToCart, isWishlisted, onWishlistToggle
}: { product: Product; onClose: () => void; onAddToCart: () => void; isWishlisted: boolean; onWishlistToggle: () => void }) {
  const handleCart = () => {
    onAddToCart();
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-black/85" style={{ backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg rounded-sm overflow-hidden"
        style={{ background: 'rgba(14,10,10,0.98)', border: '1px solid rgba(212,175,55,0.25)' }}
        initial={{ y: 60, scale: 0.94 }} animate={{ y: 0, scale: 1 }} exit={{ y: 60, scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className="h-0.5 bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />
        <div className="grid sm:grid-cols-2">
          <div className="relative" style={{ aspectRatio: '1/1' }}>
            <img src={product.image ?? ""} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(14,10,10,0.7)]" />
          </div>
          <div className="p-6 flex flex-col justify-between">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center bg-white/8 hover:bg-white/15 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/60" />
            </button>

            <div>
              <div className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/50 mb-1">{product.category}</div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">{product.name}</h3>
              <Stars r={product.rating ?? 5} />
              <p className="font-body text-xs text-white/45 mt-3 mb-4 leading-relaxed">{product.description}</p>
            </div>

            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-heading text-2xl font-bold text-luxury-gold">{fmt(product.discountPrice ?? product.price ?? product.price)}</span>
                <span className="font-body text-sm text-white/25 line-through">{fmt(product.original_price)}</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-luxury-maroon/30 border border-luxury-maroon/40 px-2.5 py-1 rounded-sm mb-5">
                <span className="font-body text-xs font-bold text-luxury-gold">{product.discount}% OFF</span>
              </div>

              <motion.button
                onClick={handleCart}
                className="w-full flex items-center justify-center gap-2 py-3 bg-luxury-gold text-luxury-black rounded-sm font-body font-semibold text-xs tracking-widest uppercase"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BestSellingProducts;
