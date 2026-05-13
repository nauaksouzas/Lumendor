import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Instagram, Star, Droplet, Sparkles, Diamond, Fingerprint } from 'lucide-react';

const Decor = () => (
  <>
    <div className="ornamental-border" />
    <div className="ornamental-corner top-left" />
    <div className="ornamental-corner top-right" />
    <div className="ornamental-corner bottom-left" />
    <div className="ornamental-corner bottom-right" />
  </>
);

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 py-8">
      <div className="max-w-7xl mx-auto px-10 md:px-16 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src="/monogram.png" 
            alt="Lumen d'Or" 
            className="h-10 md:h-12 object-contain mix-blend-screen opacity-90"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden font-serif text-xl md:text-2xl text-primary tracking-widest uppercase">
            Lumen d'Or
          </span>
        </div>
        
        <div className="flex items-center space-x-8">
          <a href="#reserve" className="hidden md:block font-sans text-[9px] tracking-[0.4em] text-white/80 hover:text-primary transition-colors duration-700 uppercase font-light">
            Follow the Light
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-primary transition-colors duration-700">
            <Instagram size={18} strokeWidth={1} />
          </a>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-8 overflow-hidden">
      
      {/* Soft spotlight from upper left */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Abstract covered object / black silk fabric visual (shadowed curves) */}
      <div className="absolute bottom-[-30%] right-[-20%] w-[80vw] h-[80vw] bg-black rounded-full shadow-[0_0_150px_rgba(201,155,59,0.08)] pointer-events-none transform rotate-12" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#020202] rounded-full shadow-[inset_0_40px_100px_rgba(201,155,59,0.03)] pointer-events-none transform rotate-45 scale-125 box-border border-t border-l border-primary/5" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 2.5, ease: "easeOut" }}
           className="mb-14"
        >
          <span className="font-sans text-[10px] md:text-xs text-primary/90 tracking-[0.6em] uppercase font-light mb-6 block">
            Something
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.1] tracking-[0.1em] font-light uppercase">
            Luminous
          </h1>
          <span className="font-sans text-[10px] md:text-xs text-primary/90 tracking-[0.6em] uppercase font-light mt-6 block">
            Is Taking Shape
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
          className="font-serif text-lg md:text-xl text-white/80 mb-16 max-w-lg mx-auto leading-relaxed italic font-light tracking-wide"
        >
          A private world of elegance, <br className="hidden md:block" />
          scent, and light is quietly forming.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 1.6 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="w-px h-20 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0" />
          <span className="font-sans text-[9px] tracking-[0.6em] text-primary/80 uppercase font-light">
            No reveal. Not yet.
          </span>
        </motion.div>
      </div>

      {/* Ornamental Stars representing mysterious glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[25%] left-[20%] text-primary/70 pointer-events-none"
      >
        <Star size={12} strokeWidth={1} />
      </motion.div>
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[30%] right-[25%] text-primary/60 pointer-events-none"
      >
        <Star size={16} strokeWidth={1} />
      </motion.div>
    </section>
  );
};

const EmailSignup = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="reserve" className="py-24 px-8 relative z-20">
      <div className="max-w-xl mx-auto backdrop-blur-md bg-black/60 border border-primary/20 p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative corners inside the card */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/40" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/40" />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="font-serif text-2xl md:text-3xl text-white mb-6 tracking-widest font-light uppercase">Be Among The First</h2>
              <p className="font-serif text-white/70 mb-12 font-light leading-relaxed italic text-sm md:text-base tracking-wide">
                Join the private list and be the first to know<br className="hidden md:block"/> when the light is ready to be revealed.
              </p>
              
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="relative group">
                  <input 
                    type="email" id="email" required
                    className="w-full bg-transparent border-b border-primary/20 py-4 text-center text-white focus:outline-none focus:border-primary transition-colors placeholder-white/50 font-sans font-light text-xs tracking-widest"
                    placeholder="ENTER YOUR EMAIL"
                  />
                </div>
                
                <div className="pt-2">
                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full relative px-8 py-5 overflow-hidden border border-primary/30 hover:border-primary transition-colors duration-700 disabled:opacity-50 group"
                  >
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <span className="relative z-10 font-sans text-[10px] tracking-[0.5em] text-primary uppercase font-light group-hover:text-primary-light transition-colors duration-700">
                      {loading ? 'Entering...' : 'Join The List'}
                    </span>
                  </button>
                </div>
                <p className="font-sans text-[8px] tracking-[0.3em] text-white/50 uppercase pt-4">Your privacy is sacred.</p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12"
            >
              <div className="w-14 h-14 mx-auto rounded-full border border-primary/30 flex items-center justify-center mb-8 text-primary">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-5 font-light uppercase tracking-widest">You are on the list.</h3>
              <p className="font-serif text-white/70 italic font-light tracking-wide text-base leading-relaxed">
                When the light is ready,<br/> you will know.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const WhatsComing = () => {
  const items = [
    { label: "Crafted With Purpose", icon: <Fingerprint size={24} strokeWidth={1} /> },
    { label: "Inspired By Rare Elements", icon: <Sparkles size={24} strokeWidth={1} /> },
    { label: "Designed For The Exceptional", icon: <Diamond size={24} strokeWidth={1} /> },
    { label: "Made To Leave A Lasting Impression", icon: <Droplet size={24} strokeWidth={1} /> },
  ];

  return (
    <section className="py-24 px-8 max-w-6xl mx-auto text-center relative z-20">
      <h2 className="font-sans text-[10px] tracking-[0.6em] text-primary/70 uppercase font-light mb-20">What's Coming</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
        {items.map((item, idx) => (
          <motion.div 
             key={idx}
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: idx * 0.2, duration: 1 }}
             className="flex flex-col items-center gap-8"
          >
             <div className="w-20 h-20 flex items-center justify-center rounded-full border border-primary/10 text-primary/80 hover:text-primary hover:border-primary/40 hover:scale-105 transition-all duration-700 bg-black/20">
                {item.icon}
             </div>
             <span className="font-serif text-sm tracking-widest text-white/80 font-light max-w-[180px] leading-relaxed uppercase">
               {item.label}
             </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 text-center border-t border-white/5 relative z-20 bg-black/40">
      <div className="flex flex-col items-center space-y-6">
        <img 
            src="/monogram.png" 
            alt="Lumen d'Or Monogram" 
            className="h-10 mb-2 opacity-60 mix-blend-screen"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
        <span className="font-serif text-2xl md:text-3xl text-white/80 tracking-widest uppercase font-light">Lumen d'Or</span>
        <span className="font-sans text-[9px] tracking-[0.6em] text-primary/70 uppercase font-light">Private Atelier</span>
        
        <div className="flex space-x-8 mt-12 mb-8">
          <a href="#" className="font-sans text-[8px] tracking-[0.3em] text-white/50 hover:text-white/80 uppercase transition-colors">Privacy</a>
          <a href="#" className="font-sans text-[8px] tracking-[0.3em] text-white/50 hover:text-white/80 uppercase transition-colors">Terms</a>
        </div>
        
        <p className="font-sans text-[8px] tracking-[0.3em] text-white/50 uppercase mt-4">
          © 2026 Lumen d'Or. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-transparent selection:bg-primary/20 relative font-sans">
      <Decor />
      <div className="grain" />
      <div className="luxury-overlay" />
      <Navbar />
      <main>
        <Hero />
        <EmailSignup />
        <WhatsComing />
      </main>
      <Footer />
    </div>
  );
}
