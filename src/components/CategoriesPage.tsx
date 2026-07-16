import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Search, ChevronRight, Home, Flame, Sparkles, VolumeX, Volume2, Gift, ArrowRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  description: string;
  count: string;
  emoji: string;
  image: string;
  type: 'Noiseless' | 'Sound' | 'Gift Sets' | 'Sky Displays';
  accent: string;
  glow: string;
}

const categoriesList: CategoryItem[] = [
  {
    id: 'ground-chakkars',
    name: 'Ground Chakkars',
    description: 'High-speed spinning wheels with rainbow sparks.',
    count: '45+ Items',
    emoji: '🌀',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    type: 'Noiseless',
    accent: 'from-amber-950/90 via-amber-900/60 to-transparent',
    glow: 'rgba(251,146,60,0.25)',
  },
  {
    id: 'flower-pots',
    name: 'Flower Pots',
    description: 'Blooming fountains of vibrant, multi-colour sparks.',
    count: '60+ Items',
    emoji: '🌸',
    image: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=600&q=80',
    type: 'Noiseless',
    accent: 'from-rose-950/90 via-rose-900/60 to-transparent',
    glow: 'rgba(244,63,94,0.25)',
  },
  {
    id: 'rockets',
    name: 'Sky Rockets',
    description: 'Soaring shells with brilliant 200-ft crown bursts.',
    count: '35+ Items',
    emoji: '🚀',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600&q=80',
    type: 'Sky Displays',
    accent: 'from-blue-950/90 via-indigo-900/60 to-transparent',
    glow: 'rgba(99,102,241,0.25)',
  },
  {
    id: 'gift-boxes',
    name: 'Gift Boxes',
    description: 'Curated luxury collections — perfect for family gifting.',
    count: '25+ Items',
    emoji: '🎁',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80',
    type: 'Gift Sets',
    accent: 'from-luxury-maroon/90 via-red-900/60 to-transparent',
    glow: 'rgba(91,10,26,0.45)',
  },
  {
    id: 'fancy-items',
    name: 'Fancy Items',
    description: 'Exotic novelty fireworks & theatrical effects.',
    count: '80+ Items',
    emoji: '✨',
    image: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=600&q=80',
    type: 'Sky Displays',
    accent: 'from-emerald-950/90 via-teal-900/60 to-transparent',
    glow: 'rgba(16,185,129,0.2)',
  },
  {
    id: 'atom-bomb',
    name: 'Atom Bomb',
    description: 'Maximum thunder, blinding flash & shockwave.',
    count: '20+ Items',
    emoji: '💥',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
    type: 'Sound',
    accent: 'from-zinc-950/90 via-zinc-800/60 to-transparent',
    glow: 'rgba(212,175,55,0.15)',
  },
  {
    id: 'sparklers',
    name: 'Sparklers',
    description: 'Golden rain wands — perfect for children and family joy.',
    count: '50+ Items',
    emoji: '🌟',
    image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=600&q=80',
    type: 'Noiseless',
    accent: 'from-yellow-950/90 via-amber-900/60 to-transparent',
    glow: 'rgba(212,175,55,0.3)',
  },
  {
    id: 'sky-shots',
    name: 'Sky Shots',
    description: 'Professional multi-shot aerial display candles.',
    count: '30+ Items',
    emoji: '🎆',
    image: 'https://images.unsplash.com/photo-1521478413868-1bbd982fa4a5?w=600&q=80',
    type: 'Sky Displays',
    accent: 'from-purple-950/90 via-violet-900/60 to-transparent',
    glow: 'rgba(139,92,246,0.25)',
  },
];

const filterOptions = [
  { label: 'All Categories', value: 'all', icon: Flame },
  { label: 'Noiseless / Sparkling', value: 'Noiseless', icon: VolumeX },
  { label: 'Sound / Thunder', value: 'Sound', icon: Volume2 },
  { label: 'Sky Displays', value: 'Sky Displays', icon: Sparkles },
  { label: 'Premium Gift Sets', value: 'Gift Sets', icon: Gift },
];

interface CategoriesPageProps {
  onNavigateHome: () => void;
  onSelectCategory: (catName: string) => void;
}

const CategoriesPage = ({ onNavigateHome, onSelectCategory }: CategoriesPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const filteredCategories = categoriesList.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || cat.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-luxury-black relative pt-[110px] pb-24 overflow-hidden">
      {/* Luxury light overlays */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle 50vw at 50% -10vw, rgba(91,10,26,0.25) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle 40vw at 10% 40%, rgba(212,175,55,0.06) 0%, transparent 50%)',
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
          <span className="text-luxury-gold font-medium">Categories</span>
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
              <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/75">Our Collections</span>
              <Flame className="w-4 h-4 text-luxury-gold" />
              <div className="h-px w-10 bg-luxury-gold/50" />
            </div>

            <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-4">
              Premium <span className="gold-gradient-text">Collections</span>
            </h1>
            <p className="font-body text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Explore our world-class Sivakasi fireworks selection. Curated with luxury, crafted for safety, and designed to celebrate.
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
                placeholder="Search collection categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-luxury-gold/15 rounded-sm py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/25 focus:outline-none focus:border-luxury-gold/55 transition-colors font-body"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
              {filterOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedFilter === opt.value;
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => setSelectedFilter(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-sm font-body text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
                      isSelected
                        ? 'bg-luxury-gold border-luxury-gold text-luxury-black shadow-gold'
                        : 'bg-white/[0.02] border-white/5 text-white/60 hover:border-luxury-gold/40 hover:text-luxury-gold'
                    }`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <AnimatePresence mode="popLayout">
          {filteredCategories.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCategories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-sm cursor-pointer"
                  style={{ aspectRatio: '3/4' }}
                  whileHover={{ y: -6 }}
                  onClick={() => onSelectCategory(cat.name)}
                >
                  {/* Category Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-108"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />

                  {/* Shading Overlays */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} opacity-100`} />
                  <div className="absolute inset-0 bg-luxury-black/40 group-hover:bg-luxury-black/20 transition-colors duration-300" />

                  {/* Corner Borders */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-luxury-gold/20 group-hover:border-luxury-gold/70 transition-colors duration-300" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-luxury-gold/20 group-hover:border-luxury-gold/70 transition-colors duration-300" />

                  {/* Item count tag */}
                  <div className="absolute top-4 right-4 bg-luxury-black/75 border border-luxury-gold/20 px-2.5 py-1 rounded-sm">
                    <span className="font-body text-[9px] tracking-widest text-luxury-gold/80 font-bold uppercase">{cat.count}</span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-3xl mb-2.5">{cat.emoji}</div>
                      <h3 className="font-heading text-xl font-bold text-white mb-1.5 group-hover:text-luxury-gold transition-colors duration-250">
                        {cat.name}
                      </h3>
                      <p className="font-body text-white/50 text-xs leading-relaxed mb-4 max-h-0 group-hover:max-h-20 overflow-hidden transition-all duration-400">
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-luxury-gold text-xs font-body font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="tracking-widest uppercase">Explore Items</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Hover Outer Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-sm pointer-events-none"
                    animate={{ boxShadow: 'none' }}
                    whileHover={{
                      boxShadow: `inset 0 0 0 1.5px rgba(212,175,55,0.6), 0 0 35px ${cat.glow}`,
                    }}
                    transition={{ duration: 0.25 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="text-center py-20 border border-white/5 rounded-sm bg-white/[0.01]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Flame className="w-10 h-10 text-luxury-gold/30 mx-auto mb-4 animate-pulse" />
              <h3 className="font-heading text-xl font-semibold text-white mb-2">No Categories Found</h3>
              <p className="font-body text-sm text-white/35">
                We couldn't find any collection category matching your filter or search.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoriesPage;
