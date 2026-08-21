import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/10 relative z-10 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-mono font-bold text-xs">
            LS
          </div>
          <span className="text-xs font-mono text-slate-400">
            © {new Date().getFullYear()} Livjot Singh. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <motion.a
            href="https://github.com/livbedi2006"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            className="p-2.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2"/></svg>
          </motion.a>

          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            className="p-2.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
