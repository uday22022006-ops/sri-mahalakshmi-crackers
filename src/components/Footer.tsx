import { motion } from 'framer-motion';
import {
  Flame,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  ArrowRight,
} from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About SMP', href: '#' },
    { label: 'Our Story', href: '#' },
    { label: 'Sivakasi Factory', href: '#' },
    { label: 'Certifications', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  categories: [
    { label: 'Ground Chakkars', href: '#categories' },
    { label: 'Flower Pots', href: '#categories' },
    { label: 'Rockets', href: '#categories' },
    { label: 'Gift Boxes', href: '#categories' },
    { label: 'Fancy Items', href: '#categories' },
    { label: 'Atom Bomb', href: '#categories' },
  ],
  quickLinks: [
    { label: 'Home', href: '#home' },
    { label: 'Products', href: '#products' },
    { label: 'Today\'s Offers', href: '#festival-banner' },
    { label: 'Track Order', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Admin Login', href: '#admin' },
  ],
};

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: '#', color: '#E1306C' },
  { icon: Facebook, label: 'Facebook', href: '#', color: '#1877F2' },
  { icon: Youtube, label: 'YouTube', href: '#', color: '#FF0000' },
  { icon: Twitter, label: 'Twitter/X', href: '#', color: '#1DA1F2' },
];

const Footer = () => {
  return (
    <footer id="footer" className="bg-luxury-black border-t border-luxury-gold/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle, #D4AF37 1px, transparent 1px)`,
        backgroundSize: '30px 30px',
      }} />

      {/* Main Footer Content */}
      <div className="container-luxury relative z-10 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-luxury-gold/20 rounded-full" />
                <Flame className="w-6 h-6 text-luxury-gold relative z-10" />
              </div>
              <div>
                <div className="font-heading font-bold text-lg text-white">Sri Mahalakshmi Crackers</div>
                <div className="font-body text-xs text-luxury-gold/60 tracking-widest uppercase">Premium Fireworks Store</div>
              </div>
            </div>

            <p className="font-body text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              India's most trusted premium fireworks brand. Factory direct from Sivakasi since 1985.
              Bringing joy and brilliance to every celebration.
            </p>

            {/* WhatsApp CTA */}
            <motion.a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-green-600/10 border border-green-600/30 text-green-400 rounded-sm px-5 py-3 text-sm font-body font-medium hover:bg-green-600/20 transition-all duration-300 mb-8"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: +91 98765 43210
            </motion.a>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-sm flex items-center justify-center bg-white/[0.05] border border-white/10 text-white/50 hover:text-white hover:border-luxury-gold/30 transition-all duration-300"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-6 pb-3 border-b border-luxury-gold/20">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/40 hover:text-luxury-gold transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-6 pb-3 border-b border-luxury-gold/20">
              Categories
            </h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/40 hover:text-luxury-gold transition-colors duration-300 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Quick Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-6 pb-3 border-b border-luxury-gold/20">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4 mb-8">
              <li>
                <a href="tel:+918344112220" className="flex items-start gap-3 group">
                  <Phone className="w-4 h-4 text-luxury-gold/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-body text-xs text-white/30 uppercase tracking-wider mb-0.5">Phone</div>
                    <div className="font-body text-sm text-white/50 group-hover:text-luxury-gold transition-colors">
                      +91 83441 12220
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@srimahalakshmicrackers.com" className="flex items-start gap-3 group">
                  <Mail className="w-4 h-4 text-luxury-gold/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-body text-xs text-white/30 uppercase tracking-wider mb-0.5">Email</div>
                    <div className="font-body text-sm text-white/50 group-hover:text-luxury-gold transition-colors break-all">
                      info@smpcracker.com
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-luxury-gold/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-body text-xs text-white/30 uppercase tracking-wider mb-0.5">Factory</div>
                    <div className="font-body text-sm text-white/50 leading-relaxed">
                      123 Fireworks Lane,<br />Sivakasi – 626 123,<br />Tamil Nadu, India
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <h4 className="font-heading text-base font-semibold text-white mb-4 pb-3 border-b border-luxury-gold/20">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/40 hover:text-luxury-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-luxury-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-white/30 text-center md:text-left">
            © 2025 Sri Mahalakshmi Crackers. All rights reserved. |{' '}
            <span className="text-luxury-gold/40">Crafted with ❤️ in Sivakasi, Tamil Nadu</span>
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-5 bg-white/10 rounded-sm flex items-center justify-center">
              <span className="text-[8px] text-white/50 font-bold">VISA</span>
            </div>
            <div className="w-8 h-5 bg-white/10 rounded-sm flex items-center justify-center">
              <span className="text-[8px] text-white/50 font-bold">MC</span>
            </div>
            <div className="w-8 h-5 bg-white/10 rounded-sm flex items-center justify-center">
              <span className="text-[8px] text-white/50 font-bold">UPI</span>
            </div>
            <div className="w-8 h-5 bg-white/10 rounded-sm flex items-center justify-center">
              <span className="text-[8px] text-white/50 font-bold">GPay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
