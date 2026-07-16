import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Search } from 'lucide-react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  color: string; trail: string;
  life: number; maxLife: number;
  type: 'burst' | 'ambient' | 'streak';
}

interface FireworkShell {
  x: number; y: number;
  vy: number; exploded: boolean;
  color: string;
}

const BURST_PALETTES = [
  ['#D4AF37', '#F0D060', '#FFE090', '#FFF4C2'],
  ['#FF6B6B', '#FF8E53', '#FFD93D', '#FFF'],
  ['#A855F7', '#EC4899', '#F43F5E', '#FFF'],
  ['#06B6D4', '#3B82F6', '#8B5CF6', '#FFF'],
  ['#D4AF37', '#FFFFFF', '#D4AF37', '#F0D060'],
  ['#FF3860', '#FF6B35', '#D4AF37', '#FFF'],
];

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const HeroSection = ({ searchQuery, setSearchQuery }: HeroSectionProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shellsRef = useRef<FireworkShell[]>([]);
  const frameRef = useRef<number>(0);
  const timerRef = useRef({ fw: 0, ambient: 0, shell: 0 });
// ... (rest of implementation)

  const spawnBurst = useCallback((x: number, y: number) => {
    const palette = BURST_PALETTES[Math.floor(Math.random() * BURST_PALETTES.length)];
    const count = 60 + Math.floor(Math.random() * 50);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 4;
      const color = palette[Math.floor(Math.random() * palette.length)];
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.2 + Math.random() * 2.5,
        opacity: 1,
        color,
        trail: color,
        life: 0,
        maxLife: 70 + Math.random() * 80,
        type: 'burst',
      });
    }
    // Streaks for realism
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.8,
        opacity: 0.9,
        color: palette[0],
        trail: palette[0],
        life: 0,
        maxLife: 30 + Math.random() * 30,
        type: 'streak',
      });
    }
  }, []);

  const spawnAmbient = useCallback((w: number, h: number) => {
    const colors = ['#D4AF37', '#F0D060', '#FFE090', '#FFFFFF', '#FFA500'];
    particlesRef.current.push({
      x: Math.random() * w,
      y: h + 5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 1.2),
      size: 0.8 + Math.random() * 1.8,
      opacity: 0.5 + Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      trail: '#D4AF37',
      life: 0,
      maxLife: 180 + Math.random() * 120,
      type: 'ambient',
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Launch shells that explode at top
    const launchShell = () => {
      const palette = BURST_PALETTES[Math.floor(Math.random() * BURST_PALETTES.length)];
      shellsRef.current.push({
        x: canvas.width * (0.1 + Math.random() * 0.8),
        y: canvas.height,
        vy: -(12 + Math.random() * 8),
        exploded: false,
        color: palette[0],
      });
    };

    const draw = () => {
      // Fade instead of full clear for trail effect
      ctx.fillStyle = 'rgba(11, 11, 11, 0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const t = timerRef.current;
      t.ambient++;
      t.fw++;
      t.shell++;

      if (t.ambient > 4) { spawnAmbient(canvas.width, canvas.height); t.ambient = 0; }
      if (t.shell > 90) { launchShell(); t.shell = 0; }

      // Update shells
      shellsRef.current = shellsRef.current.filter(s => {
        if (s.exploded) return false;
        s.y += s.vy;
        s.vy += 0.15; // gravity on shell
        // Draw shell trail
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Explode when velocity reverses or near top
        if (s.vy >= -2 && !s.exploded) {
          s.exploded = true;
          spawnBurst(s.x, s.y);
          return false;
        }
        return !s.exploded;
      });

      // Update particles
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      particlesRef.current.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        if (p.type === 'burst') p.vy += 0.04;
        if (p.type === 'streak') p.vy += 0.06;
        p.vx *= 0.98;
        p.opacity = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        if (p.type === 'ambient') {
          // Glow dot
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.type === 'streak' ? 15 : 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    // Initial burst
    setTimeout(() => {
      spawnBurst(canvas.width * 0.3, canvas.height * 0.3);
      spawnBurst(canvas.width * 0.7, canvas.height * 0.25);
    }, 600);
    setTimeout(() => launchShell(), 1500);

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [spawnBurst, spawnAmbient]);

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  };
  const up = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-luxury-black"
    >
      {/* Fireworks canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} aria-hidden />

      {/* Radial light cone — premium lighting */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(212,175,55,0.07) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 40% 30% at 30% 60%, rgba(91,10,26,0.18) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 40% 30% at 70% 60%, rgba(91,10,26,0.18) 0%, transparent 60%)',
        }} />
        {/* Vignette bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
          background: 'linear-gradient(to top, rgba(11,11,11,1) 0%, rgba(11,11,11,0.7) 40%, transparent 100%)',
        }} />
        {/* Top fade */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '20%',
          background: 'linear-gradient(to bottom, rgba(11,11,11,0.5) 0%, transparent 100%)',
        }} />
      </div>

      {/* Gold divider lines */}
      <div className="absolute left-0 right-0 h-px" style={{ top: '20%', zIndex: 2, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.15), transparent)' }} />
      <div className="absolute left-0 right-0 h-px" style={{ bottom: '22%', zIndex: 2, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.1), transparent)' }} />

      {/* Content */}
      <div className="relative text-center px-4 w-full max-w-6xl mx-auto" style={{ zIndex: 10 }}>
        <motion.div variants={stagger} initial="hidden" animate="visible">

          {/* Eyebrow */}
          <motion.div variants={up} className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12 md:w-20 bg-luxury-gold/50" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-luxury-gold" />
              <span className="font-body text-[10px] md:text-xs tracking-[0.45em] uppercase text-luxury-gold/75">
                Premium Fireworks · Est. Since 1985
              </span>
              <Sparkles className="w-3 h-3 text-luxury-gold" />
            </div>
            <div className="h-px w-12 md:w-20 bg-luxury-gold/50" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={up}
            className="font-heading font-bold leading-[0.88] mb-5"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7.5rem)' }}
          >
            <span className="text-white block">Celebrate Every</span>
            <span className="shimmer-text block">Festival</span>
            <span className="text-white/80 italic block" style={{ fontSize: '85%' }}>With Premium</span>
            <span className="shimmer-text block">Fireworks</span>
          </motion.h1>

          {/* Gold ornament */}
          <motion.div variants={up} className="flex items-center justify-center gap-3 my-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-luxury-gold/70" />
            <span className="text-luxury-gold text-sm">✦</span>
            <span className="text-luxury-gold/40 text-xs">◆</span>
            <span className="text-luxury-gold text-sm">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-luxury-gold/70" />
          </motion.div>

          {/* Subheading */}
          <motion.p
            variants={up}
            className="font-body text-sm md:text-base text-white/55 max-w-lg mx-auto leading-relaxed tracking-wide mb-8"
          >
            India's Most Trusted Luxury Fireworks Store.
            <span className="text-luxury-gold/60 mx-2">·</span>
            Factory Direct Pricing
            <span className="text-luxury-gold/60 mx-2">·</span>
            Up to 80% Off
          </motion.p>

          {/* Huge Premium Search Bar */}
          <motion.div
            variants={up}
            className="w-full max-w-2xl mx-auto mb-10 relative group"
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-luxury-gold" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              placeholder="Search for sparklers, sky shots, flower pots..."
              className="w-full bg-white/[0.03] backdrop-blur-md border border-luxury-gold/25 rounded-full py-4.5 pl-14 pr-32 text-sm sm:text-base text-white placeholder-white/30 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all duration-300 font-body shadow-gold-lg group-hover:border-luxury-gold/50"
              id="hero-huge-search"
            />
            <button
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-luxury-gold hover:bg-luxury-gold-light text-luxury-black font-body font-semibold text-xs tracking-wider uppercase px-6 py-3 rounded-full transition-colors duration-300 shadow-gold"
            >
              Search
            </button>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={up} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <motion.a
              href="#products"
              className="relative overflow-hidden inline-flex items-center justify-center gap-2 font-body font-semibold text-sm tracking-widest uppercase px-9 py-4 rounded-sm bg-luxury-gold text-luxury-black min-w-[210px]"
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(212,175,55,0.65), 0 8px 30px rgba(0,0,0,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">Explore Collection</span>
              {/* Shine sweep */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
              />
            </motion.a>

            <motion.a
              href="#offers"
              className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm tracking-widest uppercase px-9 py-4 rounded-sm border border-luxury-gold/50 text-luxury-gold min-w-[210px] hover:bg-luxury-gold/8 transition-colors duration-300"
              style={{ backdropFilter: 'blur(8px)' }}
              whileHover={{ scale: 1.04, borderColor: 'rgba(212,175,55,0.9)', boxShadow: '0 0 25px rgba(212,175,55,0.25), inset 0 0 20px rgba(212,175,55,0.05)' }}
              whileTap={{ scale: 0.97 }}
            >
              View Today's Offers
            </motion.a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={up}
            className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-14"
          >
            {[
              { value: '10,000+', label: 'Happy Customers' },
              { value: '500+', label: 'Premium Products' },
              { value: '38+', label: 'Years of Trust' },
              { value: '80%', label: 'Max Discount' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3 md:gap-4">
                {i > 0 && <div className="hidden md:block w-px h-8 bg-luxury-gold/15" />}
                <div className="text-center">
                  <div className="font-heading text-xl md:text-2xl font-bold text-luxury-gold leading-none">{stat.value}</div>
                  <div className="font-body text-[10px] md:text-xs text-white/40 tracking-widest uppercase mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer group"
        style={{ zIndex: 10 }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll down"
      >
        <span className="font-body text-[10px] text-white/35 tracking-[0.35em] uppercase group-hover:text-luxury-gold/60 transition-colors">Scroll</span>
        <div className="w-5 h-9 border border-luxury-gold/25 rounded-full flex justify-center group-hover:border-luxury-gold/50 transition-colors">
          <motion.div
            className="w-0.5 h-2 bg-luxury-gold rounded-full mt-1.5"
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-luxury-gold/35 group-hover:text-luxury-gold/70 transition-colors" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
