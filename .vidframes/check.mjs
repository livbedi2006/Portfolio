/* Composite the backdrop ramp over the page colour at a given opacity,
   then re-check every text token against the WORST resulting surface.
   The backdrop is only allowed to ship if nothing drops below its tier. */

const hex = (h) => {
  let s = h.replace('#', '');
  if (s.length === 3) s = s.split('').map((c) => c + c).join('');
  const n = parseInt(s, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a, b) => { const l1 = L(a), l2 = L(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); };
const over = (fg, bg, a) => fg.map((v, i) => v * a + bg[i] * (1 - a));
const tier = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA ' : r >= 3 ? 'AA-lg' : 'FAIL');

const MODES = {
  dark: {
    page: '#131a2a',
    // same hue trajectory as the video (222→208→190→182), compressed
    // into the dark end so text keeps its measured contrast
    ramp: ['#131a2a', '#12304a', '#0c6c80', '#2a8f93'],
    text: { primary: '#dfe9e8', secondary: '#a7bcc0', muted: '#8399a0' },
  },
  light: {
    page: '#a9d8d8',
    ramp: ['#d4ecec', '#a9d8d8', '#7fc4c4', '#45a9a9'],
    text: { primary: '#131a2a', secondary: '#12304a', muted: '#2c5566' },
  },
};

const FLOOR = { primary: 7, secondary: 4.5, muted: 4.5 };

for (const alpha of [0.35, 0.45, 0.55, 0.65, 0.8, 1.0]) {
  console.log(`\n╔═ opacity ${alpha.toFixed(2)} ${'═'.repeat(52)}`);
  for (const [mode, cfg] of Object.entries(MODES)) {
    const page = hex(cfg.page);
    const surfaces = cfg.ramp.map((r) => ({ src: r, out: over(hex(r), page, alpha) }));
    let worstLine = [];
    let ok = true;
    for (const [name, t] of Object.entries(cfg.text)) {
      const c = hex(t);
      let worst = Infinity, at = null;
      for (const s of surfaces) {
        const r = ratio(c, s.out);
        if (r < worst) { worst = r; at = s; }
      }
      const pass = worst >= FLOOR[name];
      if (!pass) ok = false;
      worstLine.push(
        `    ${name.padEnd(10)} ${worst.toFixed(2).padStart(5)} ${tier(worst).padEnd(5)} ` +
        `(floor ${FLOOR[name]}) worst over ${at.src}→${toHex(at.out)} ${pass ? '✓' : '✗'}`
      );
    }
    console.log(`  ${mode.padEnd(5)} ${ok ? 'PASS' : 'FAIL'}`);
    worstLine.forEach((l) => console.log(l));
  }
}
