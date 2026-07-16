import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const iconCategories = [
  { name: 'Chakkars', count: '45 Items', emoji: '🌀', bg: 'rgba(251,146,60,0.1)' },
  { name: 'Flower Pots', count: '60 Items', emoji: '🌸', bg: 'rgba(244,63,94,0.1)' },
  { name: 'Rockets', count: '35 Items', emoji: '🚀', bg: 'rgba(99,102,241,0.1)' },
  { name: 'Sky Shots', count: '30 Items', emoji: '🎆', bg: 'rgba(139,92,246,0.1)' },
  { name: 'Sparklers', count: '50 Items', emoji: '🌟', bg: 'rgba(212,175,55,0.1)' },
  { name: 'Atom Bombs', count: '20 Items', emoji: '💥', bg: 'rgba(239,68,68,0.1)' },
  { name: 'Gift Boxes', count: '25 Items', emoji: '🎁', bg: 'rgba(16,185,129,0.1)' },
  { name: 'Fancy Items', count: '80 Items', emoji: '✨', bg: 'rgba(6,182,212,0.1)' },
];

interface CategoryIconSectionProps {
  setSelectedCategory: (cat: string) => void;
}

const CategoryIconSection = ({ setSelectedCategory }: CategoryIconSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-16 bg-[#090709] border-t border-b border-white/5 relative">
      <div className="container-luxury" ref={ref}>
        {/* Row Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 25 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="font-body text-[10px] tracking-[0.45em] uppercase text-luxury-gold/70 block mb-2">Instant Discovery</span>
            <h2 className="font-heading text-2xl md:text-4xl font-bold text-white">
              Shop by <span className="gold-gradient-text">Category</span>
            </h2>
          </div>
          <p className="font-body text-white/40 text-xs md:text-sm max-w-xs md:text-right">
            Explore sivakasi's largest premium firework catalog grouped by experience.
          </p>
        </motion.div>

        {/* Categories Row */}
        <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-luxury-gold/30 scrollbar-track-transparent">
          {iconCategories.map((cat, i) => (
            <motion.a
              key={cat.name}
              href="#products"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory(cat.name);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-shrink-0 flex flex-col items-center group w-24 sm:w-28 text-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              {/* Circle container */}
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border border-white/5 relative overflow-hidden mb-3 transition-all duration-300"
                style={{ backgroundColor: cat.bg }}
                whileHover={{ y: -4, scale: 1.05, borderColor: 'rgba(212,175,55,0.4)' }}
              >
                {/* Glow ring */}
                <span className="absolute inset-0 rounded-full bg-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <span className="text-2xl sm:text-3xl relative z-10">{cat.emoji}</span>
              </motion.div>

              <span className="font-heading text-sm font-semibold text-white group-hover:text-luxury-gold transition-colors duration-200">
                {cat.name}
              </span>
              <span className="font-body text-[10px] text-white/30 mt-0.5">
                {cat.count}
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIconSection;
