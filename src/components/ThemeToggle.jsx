import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

/* ============================================================
   ThemeToggle — flips between the ABYSS (dark) and AQUA (light)
   token sets in index.css by setting data-theme on <html>.

   Three states matter, not two:
     stored 'dark'  → data-theme="dark"
     stored 'light' → data-theme="light"
     nothing stored → NO attribute, so the prefers-color-scheme
                      block in index.css follows the OS live.

   The first click is what commits a choice. Until then the site
   tracks the OS, including if the visitor changes it mid-visit —
   which is why we listen to the media query rather than reading
   it once.
   ============================================================ */

const KEY = 'theme';

function readStored() {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null; // storage disabled — treat as "no choice made"
  }
}

export default function ThemeToggle({ className = '' }) {
  // What the page is ACTUALLY showing right now, which is the stored
  // choice if there is one and the OS preference otherwise.
  const [resolved, setResolved] = useState(() => {
    const stored = readStored();
    if (stored) return stored;
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  // Keep following the OS until the visitor commits a choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      if (readStored()) return; // an explicit choice wins
      setResolved(e.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Enable the colour cross-fade only after the first paint, so the
  // initial load doesn't animate from the wrong palette.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      document.documentElement.classList.add('theme-anim')
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = useCallback(() => {
    const next = resolved === 'dark' ? 'light' : 'dark';
    setResolved(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch { /* nothing to do — the attribute above still applies */ }
  }, [resolved]);

  const goingTo = resolved === 'dark' ? 'light' : 'dark';
  const Icon = resolved === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${goingTo} mode`}
      title={`Switch to ${goingTo} mode`}
      className={`p-2.5 rounded-full bg-raise-1 border border-line text-paper-dim hover:text-paper hover:bg-raise-3 transition-colors ${className}`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}
