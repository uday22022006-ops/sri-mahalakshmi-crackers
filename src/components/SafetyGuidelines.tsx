import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Users, Droplet, Shirt, XCircle, Eye, Dog, Trash2, ShieldAlert, Leaf, CheckSquare, Square, Info } from 'lucide-react';

export default function SafetyGuidelines() {
  const [isChecked, setIsChecked] = useState(false);

  const safetyCards = [
    { icon: Flame, text: "Burst crackers only in open spaces.", delay: 0.1 },
    { icon: Users, text: "Children should burst crackers only under adult supervision.", delay: 0.2 },
    { icon: Droplet, text: "Keep a bucket of water and sand nearby.", delay: 0.3 },
    { icon: Shirt, text: "Wear cotton clothes and avoid synthetic fabrics.", delay: 0.4 },
    { icon: XCircle, text: "Never relight a cracker that fails to burst.", delay: 0.5 },
    { icon: Eye, text: "Maintain a safe distance after lighting fireworks.", delay: 0.6 },
    { icon: Dog, text: "Avoid bursting crackers near pets, elderly people and hospitals.", delay: 0.7 },
    { icon: Trash2, text: "Dispose of used fireworks only after they completely cool down.", delay: 0.8 }
  ];

  const greenCards = [
    "Burst only the required crackers",
    "Respect permitted bursting timings",
    "Keep surroundings clean",
    "Respect pets and senior citizens"
  ];

  const storageTips = [
    "Store in a cool place",
    "Keep away from sunlight",
    "Keep away from electrical appliances",
    "Keep away from children"
  ];

  return (
    <section className="py-16 bg-luxury-black border-t border-luxury-gold/10">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-luxury-gold mb-4"
          >
            <ShieldAlert className="inline-block w-8 h-8 md:w-10 md:h-10 mr-3 mb-1 align-middle" />
            Firecracker Safety Guidelines
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 font-body text-sm md:text-base"
          >
            Celebrate responsibly by following these important safety practices while using fireworks.
          </motion.p>
        </div>

        {/* 8 Safety Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {safetyCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: card.delay }}
              whileHover={{ scale: 1.03 }}
              className="glass-card p-6 rounded-2xl border border-luxury-gold/20 flex flex-col items-center text-center shadow-luxury transition-all"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: index * 0.2 }}
                className="w-14 h-14 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center mb-4 text-luxury-gold"
              >
                <card.icon className="w-7 h-7" />
              </motion.div>
              <p className="text-white/80 font-body text-sm leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Emergency First Aid Premium Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-black/60 border border-white/10 border-l-4 border-l-red-600 rounded-2xl p-6 md:p-8 mb-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-4 flex items-center">
              <span className="text-2xl mr-2">🚨</span> Emergency First Aid
            </h3>
            <ul className="space-y-3">
              {[
                "Cool burns with clean running water for 15–20 minutes.",
                "Never apply toothpaste, oil or butter.",
                "Cover burns with a clean cloth.",
                "Seek medical assistance immediately if required."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start text-white/70 font-body text-sm md:text-base">
                  <span className="text-red-500 mr-3 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Green Diwali & Storage Tips Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          
          {/* Celebrate a Green Diwali */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-900/10 to-transparent"
          >
            <h3 className="font-heading text-xl font-bold text-green-400 mb-6 flex items-center">
              <Leaf className="w-6 h-6 mr-2" />
              Celebrate a Green Diwali
            </h3>
            <div className="space-y-4">
              {greenCards.map((item, idx) => (
                <div key={idx} className="flex items-center text-white/80 font-body text-sm">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3 text-green-400 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Storage Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 md:p-8 rounded-2xl border border-luxury-gold/20 bg-gradient-to-br from-luxury-gold/5 to-transparent"
          >
            <h3 className="font-heading text-xl font-bold text-luxury-gold mb-6 flex items-center">
              <span className="text-2xl mr-2">📦</span> Storage Tips
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storageTips.map((tip, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors flex items-center justify-center min-h-[80px]">
                  <p className="text-white/70 font-body text-sm leading-snug">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Legal Safety Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-white/5 border border-luxury-gold/30 rounded-2xl p-6 md:p-8 mb-16 relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-luxury-black border border-luxury-gold/30 px-4 py-1 rounded-full text-luxury-gold text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3 h-3" /> Legal Safety Notice
          </div>
          <div className="text-white/60 font-body space-y-3 mt-2 text-sm md:text-base">
            <p>Fireworks are intended for outdoor use only.</p>
            <p>Please follow your local government regulations and permitted bursting timings.</p>
            <p>Always read the instructions printed on every firework before use.</p>
          </div>
        </motion.div>

        {/* Informational Checkbox Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto flex items-center justify-center"
        >
          <button 
            onClick={() => setIsChecked(!isChecked)}
            className={`flex items-center gap-4 border rounded-xl p-4 md:p-5 transition-all text-left w-full ${
              isChecked 
                ? 'bg-luxury-gold/20 border-luxury-gold' 
                : 'bg-luxury-gold/5 border-luxury-gold/30 hover:bg-luxury-gold/10'
            }`}
          >
            <div className="text-luxury-gold shrink-0 transition-transform duration-200">
              {isChecked ? (
                <CheckSquare className="w-6 h-6 md:w-8 md:h-8" />
              ) : (
                <Square className="w-6 h-6 md:w-8 md:h-8" />
              )}
            </div>
            <p className="text-white/80 font-body text-sm md:text-base font-medium">
              I understand the Firecracker Safety Guidelines and will use fireworks responsibly.
            </p>
          </button>
        </motion.div>

      </div>
    </section>
  );
}
