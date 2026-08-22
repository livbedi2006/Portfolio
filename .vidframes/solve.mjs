/* Solve, don't guess: for each candidate ramp, binary-search the highest
   opacity that keeps every text token at or above its floor — with the
   worst case taken over EVERY ramp stop, so it holds no matter where the
   marbling happens to land behind a given paragraph.

   Cards are semi-transparent (bg-ink-800/60), so the page background is
   the honest surface to test against, not the card. */

const hex = (h) => {
  let s = h.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => { const l1 = L(a), l2 = L(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); };
const over = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a));

const FLOOR = { primary: 7, secondary: 4.5, muted: 4.5 };

function worstAt(cfg, alpha) {
  const page = hex(cfg.page);
  const out = {};
  for (const [name, t] of Object.entries(cfg.text)) {
    const c = hex(t);
    out[name] = Math.min(...cfg.ramp.map((r) => ratio(c, over(hex(r), page, alpha))));
  }
  return out;
}
const allPass = (w) => Object.entries(FLOOR).every(([k, f]) => w[k] >= f);

function maxOpacity(cfg) {
  if (!allPass(worstAt(cfg, 0.001))) return 0;
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (allPass(worstAt(cfg, mid))) lo = mid; else hi = mid;
  }
  return lo;
}

const DARK_TEXT = { primary: '#dfe9e8', secondary: '#a7bcc0', muted: '#8399a0' };
const LIGHT_TEXT = { primary: '#131a2a', secondary: '#12304a', muted: '#2c5566' };

const CANDIDATES = [
  // --- dark: how bright can the top stop go? ---
  { name: 'dark  A  abyss→teal      (video-faithful)', page: '#131a2a', text: DARK_TEXT, ramp: ['#131a2a', '#12304a', '#0c6c80', '#2a8f93'] },
  { name: 'dark  B  abyss→peacock', page: '#131a2a', text: DARK_TEXT, ramp: ['#131a2a', '#16243a', '#12304a', '#0c6c80'] },
  { name: 'dark  C  abyss→petrol', page: '#131a2a', text: DARK_TEXT, ramp: ['#131a2a', '#16202f', '#16243a', '#12304a'] },
  { name: 'dark  D  abyss→petrol+lift', page: '#131a2a', text: DARK_TEXT, ramp: ['#101622', '#16243a', '#12304a', '#154058'] },

  // --- light: how dark can the bottom stop go? ---
  { name: 'light A  lightaqua→turquoise (video-faithful)', page: '#a9d8d8', text: LIGHT_TEXT, ramp: ['#d4ecec', '#a9d8d8', '#7fc4c4', '#45a9a9'] },
  { name: 'light B  lightaqua→aqua-deep', page: '#a9d8d8', text: LIGHT_TEXT, ramp: ['#e2f3f3', '#c6e6e6', '#a9d8d8', '#8cc9c9'] },
  { name: 'light C  white→aqua', page: '#a9d8d8', text: LIGHT_TEXT, ramp: ['#f2fafa', '#dcf0f0', '#c1e5e5', '#a9d8d8'] },
];

for (const c of CANDIDATES) {
  const m = maxOpacity(c);
  const w = worstAt(c, Math.max(m, 0.001));
  const bar = '█'.repeat(Math.round(m * 30)).padEnd(30, '·');
  console.log(
    `${c.name.padEnd(42)} max α ${m.toFixed(2)} ${bar}  ` +
    `pri ${w.primary.toFixed(1)} / sec ${w.secondary.toFixed(1)} / mut ${w.muted.toFixed(1)}`
  );
}
