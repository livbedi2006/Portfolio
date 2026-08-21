import React from 'react';
import { Mail, ArrowUp } from 'lucide-react';
import { Github, Linkedin } from '../lib/icons.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-line relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg border border-line-hard bg-ink-750 flex items-center justify-center font-mono font-bold text-xs text-paper">
                lb
              </div>
              <span className="font-mono text-sm text-paper">livjot singh bedi</span>
            </div>
            <p className="font-mono text-[11px] text-paper-mut">
              © {new Date().getFullYear()} · built with react, tailwind &amp; a hand-written mlp
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { icon: Mail, href: 'mailto:livjotseerat@gmail.com', label: 'Email Livjot' },
              { icon: Github, href: 'https://github.com/livbedi2006', label: 'GitHub profile' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/livjot-singh-7909a0334/', label: 'LinkedIn profile' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={href}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="p-2.5 rounded-lg bg-white/[0.04] border border-line text-paper-dim hover:text-paper hover:bg-white/10 transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
            <a
              href="#top"
              className="p-2.5 rounded-lg bg-white/[0.04] border border-line text-paper-dim hover:text-paper hover:bg-white/10 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
