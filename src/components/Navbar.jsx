import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';

const NAV = [
  { id: 'playground', label: 'playground' },
  { id: 'work', label: 'work' },
  { id: 'build', label: 'build' },
  { id: 'contact', label: 'contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('top');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        const pos = window.scrollY + 220;
        let current = 'top';
        for (const { id } of NAV) {
          const el = document.getElementById(id);
          if (el && pos >= el.offsetTop) current = id;
        }
        setActive(current);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-accent z-[10000] origin-left"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-ink-900/80 backdrop-blur-xl border-b border-line'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo / prompt */}
          <a href="#top" className="flex items-center gap-2.5 group" aria-label="Back to top">
            <div className="w-9 h-9 rounded-lg border border-line-hard bg-ink-750 flex items-center justify-center text-paper font-mono font-bold text-sm">
              lb
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-mono text-sm text-paper">livjot bedi</span>
              <span className="text-[11px] font-mono text-ok flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ok pulse-dot inline-block" aria-hidden="true" />
                available for freelance
              </span>
            </div>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-line" aria-label="Primary">
            {NAV.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="relative px-4 py-1.5 text-xs font-mono text-paper-dim hover:text-paper transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 bg-white/[0.06] rounded-full border border-line"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/livbedi2006"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/[0.04] border border-line text-paper-dim hover:text-paper hover:bg-white/10 transition-colors"
              aria-label="GitHub profile"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="group px-4 py-2 rounded-full bg-paper text-ink-900 font-mono font-semibold text-xs hover:bg-white transition-colors flex items-center gap-1.5"
            >
              <span>get in touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
            </a>
          </div>
        </div>
      </motion.header>
    </>
  );
}
