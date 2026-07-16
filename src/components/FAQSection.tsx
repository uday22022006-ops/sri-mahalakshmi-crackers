import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'Do you ship crackers pan-India?',
    answer: 'Yes! We ship to all major cities and towns across India. Delivery typically takes 2-5 business days. For metros like Chennai, Bangalore, Mumbai, and Delhi, we offer express 1-2 day delivery. Note: We comply with all state regulations regarding fireworks transport.',
  },
  {
    id: 2,
    question: 'Are your fireworks BIS certified and safe?',
    answer: 'Absolutely. All our products are BIS (Bureau of Indian Standards) certified and manufactured at our PESO-licensed factory in Sivakasi. We follow strict safety guidelines and each product is tested for quality before dispatch. Our packaging is designed to prevent any accidents during transport.',
  },
  {
    id: 3,
    question: 'What is the minimum order value for free delivery?',
    answer: 'We offer free shipping on all orders above ₹2,000. For orders below ₹2,000, a nominal delivery charge of ₹150-₹300 applies based on your location. Bulk orders above ₹10,000 also receive priority handling and complimentary gift wrapping.',
  },
  {
    id: 4,
    question: 'Can I place a bulk/wholesale order for events?',
    answer: 'Yes! We specialize in bulk orders for weddings, corporate events, temple festivals, and large Diwali celebrations. Contact us on WhatsApp at +91 98765 43210 for custom quotes. Bulk orders of ₹25,000+ receive an additional 15% corporate discount.',
  },
  {
    id: 5,
    question: 'What is your return and replacement policy?',
    answer: 'We offer a 100% replacement guarantee for any damaged or defective products. Please photograph the damaged items upon delivery and share via WhatsApp within 24 hours. We will arrange replacement or a full refund at no additional cost. Your satisfaction is our priority.',
  },
  {
    id: 6,
    question: 'Do you offer custom Diwali gift box packaging?',
    answer: 'Yes! We offer personalized gift boxes with custom printing, ribbons, and company branding for corporate gifting. Minimum order for custom boxes is 50 units. Lead time is 5-7 days. Contact our gifting team for catalogs and pricing.',
  },
];

const FAQItem = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className={`border rounded-sm overflow-hidden transition-all duration-300 ${
        isOpen ? 'border-luxury-gold/40 bg-luxury-gold/[0.03]' : 'border-white/10 bg-white/[0.02]'
      }`}
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <button
        className="w-full flex items-center justify-between p-6 text-left group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        id={`faq-button-${faq.id}`}
        aria-controls={`faq-content-${faq.id}`}
      >
        <span className={`font-body text-sm md:text-base font-medium transition-colors duration-300 pr-4 ${
          isOpen ? 'text-luxury-gold' : 'text-white group-hover:text-luxury-gold/80'
        }`}>
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={`flex-shrink-0 transition-colors duration-300 ${isOpen ? 'text-luxury-gold' : 'text-white/40'}`}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-content-${faq.id}`}
            role="region"
            aria-labelledby={`faq-button-${faq.id}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="px-6 pb-6">
              <div className="h-px bg-luxury-gold/20 mb-5" />
              <p className="font-body text-sm text-white/55 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="section-padding bg-[#080808] relative overflow-hidden">
      <div className="container-luxury" ref={ref}>
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 items-start">
          {/* Left Content */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:sticky lg:top-32"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-luxury-gold/60" />
              <span className="font-body text-xs tracking-[0.4em] uppercase text-luxury-gold/70">
                FAQ
              </span>
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently
              <br />
              <span className="gold-gradient-text">Asked</span>
              <br />
              Questions
            </h2>
            <p className="font-body text-white/50 text-sm leading-relaxed mb-8">
              Can't find your answer? Our team is here to help 24/7 on WhatsApp and phone.
            </p>
            <motion.a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-btn inline-flex items-center gap-2 bg-luxury-gold text-luxury-black rounded-sm text-xs font-semibold"
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(212,175,55,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              Contact Support
            </motion.a>
          </motion.div>

          {/* Right — FAQs */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ x: 40, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {faqs.map((faq, index) => (
              <FAQItem key={faq.id} faq={faq} index={index} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
