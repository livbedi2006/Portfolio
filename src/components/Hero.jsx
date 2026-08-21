import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Mail } from 'lucide-react';
import { Github, Linkedin } from '../lib/icons.jsx';
import { Marquee } from '../lib/motion.jsx';

const BOOT = [
  { t: '$ whoami', c: 'cmd' },
  { t: 'livjot singh bedi — b.tech cse (ai/ml), chandigarh university', c: 'out' },
  { t: '$ cat focus.txt', c: 'cmd' },
  { t: 'computer vision · nlp · classical ml', c: 'out' },
  { t: 'i care whether a model holds up off the training set.', c: 'out' },
  { t: '$ ls projects/ | wc -l', c: 'cmd' },
  { t: '6 public repos — datasets, methods and limits documented below', c: 'out' },
  { t: '$ status', c: 'cmd' },
  { t: 'available for freelance ml work', c: 'ok' },
];

/* Types the boot log line-by-line. Skips straight to done for reduced motion. */
function useBootLog(reduce) {
  const [visible, setVisible] = useState(reduce ? BOOT.length : 0);
  const [charCount, setCharCount] = useState(reduce ? Infinity : 0);
  const timers = useRef([]);

  useEffect(() => {
    if (reduce) { setVisible(BOOT.length); setCharCount(Infinity); return; }
    let line = 0;
    let cancelled = false;

    const runLine = () => {
      if (cancelled || line >= BOOT.length) return;
      const text = BOOT[line].t;
      let ch = 0;
      setVisible(line + 1);
      setCharCount(0);
      const speed = BOOT[line].c === 'cmd' ? 26 : 9;
      const tick = () => {
        if (cancelled) return;
        ch += 1;
        setCharCount(ch);
        if (ch < text.length) {
          timers.current.push(setTimeout(tick, speed));
        } else {
          line += 1;
          timers.current.push(setTimeout(runLine, BOOT[line - 1].c === 'cmd' ? 160 : 320));
        }
      };
      timers.current.push(setTimeout(tick, 60));
    };
    timers.current.push(setTimeout(runLine, 550));

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [reduce]);

  return { visible, charCount };
}

const STACK = ['python', 'pytorch', 'scikit-learn', 'opencv', 'numpy', 'pandas', 'javascript', 'react', 'typescript', 'sql', 'git'];

export default function Hero() {
  const reduce = useReducedMotion();
  const { visible, charCount } = useBootLog(reduce);

  return (
    <section id="top" className="relative min-h-screen pt-32 pb-16 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          {/* ---------- Left: the claim ---------- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[2.6rem] sm:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6"
            >
              <span className="grad-text">I train models</span>
              <br />
              <span className="text-paper-dim">and then try</span>
              <br />
              <span className="grad-text">to break them.</span>
            </motion.h1>

            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-paper-dim text-base leading-relaxed max-w-xl mb-8"
            >
              Computer vision and NLP, mostly. Below you'll find the neural net on
              this page training live in your browser, then six real projects with
              their methods and their limits written down — including the ones that
              don't work as well as I'd like.
            </motion.p>

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <a
                href="#playground"
                className="group px-5 py-3 rounded-xl bg-paper text-ink-900 font-mono text-sm font-semibold hover:bg-white transition-colors flex items-center gap-2"
              >
                <span>run the network</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
              </a>
              <a
                href="mailto:livjotseerat@gmail.com"
                className="px-5 py-3 rounded-xl bg-white/[0.04] border border-line text-paper font-mono text-sm hover:bg-white/[0.08] transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span>email me</span>
              </a>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/livbedi2006"
                  target="_blank" rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/[0.04] border border-line text-paper-dim hover:text-paper transition-colors"
                  aria-label="GitHub profile"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="https://www.linkedin.com/in/livjot-singh-7909a0334/"
                  target="_blank" rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/[0.04] border border-line text-paper-dim hover:text-paper transition-colors"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* ---------- Right: boot terminal ---------- */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-line bg-ink-800/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-white/[0.02]">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e66767]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#fab219]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#0ca30c]" />
              </span>
              <span className="font-mono text-xs text-paper-mut ml-2">~/livjot — zsh</span>
            </div>

            <div className="p-5 font-mono text-[12.5px] leading-[1.85] min-h-[290px]">
              {BOOT.slice(0, visible).map((line, i) => {
                const isLast = i === visible - 1;
                const text = isLast && charCount !== Infinity ? line.t.slice(0, charCount) : line.t;
                return (
                  <div
                    key={i}
                    className={
                      line.c === 'cmd'
                        ? 'text-paper'
                        : line.c === 'ok'
                        ? 'text-ok'
                        : 'text-paper-dim pl-0'
                    }
                  >
                    {line.c !== 'cmd' && <span className="text-paper-faint select-none">› </span>}
                    {text}
                    {isLast && <span className="caret text-accent-lt">▋</span>}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stack marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-16 pt-8 border-t border-line-soft"
      >
        <div className="max-w-6xl mx-auto px-6 mb-4">
          <span className="mono-label">tools i actually use</span>
        </div>
        <Marquee>
          {STACK.map((tool) => (
            <span
              key={tool}
              className="font-mono text-sm text-paper-mut px-6 py-1 whitespace-nowrap"
            >
              {tool}
              <span className="text-paper-faint ml-6" aria-hidden="true">/</span>
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
