import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Sparkles } from 'lucide-react';

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
            className="p-2 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
          </motion.a>

          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.15, y: -2 }}
            className="p-2 rounded-full bg-white/[0.05] border border-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
