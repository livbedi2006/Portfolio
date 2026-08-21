import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Cpu, Activity, Layers } from 'lucide-react';
import { MLP, makeDataset } from '../lib/nn.js';

/* Palette — data classes use the CVD-validated blue/red pair.
   Violet is UI chrome only; it never encodes a class. */
const C = {
  classA: '#3987e5',
  classB: '#e66767',
  accent: '#a78bfa',
};

const DATASETS = [
  { id: 'spiral', label: 'spiral' },
  { id: 'circles', label: 'circles' },
  { id: 'xor', label: 'xor' },
  { id: 'moons', label: 'moons' },
];

const BOUND_RES = 56; // decision-field grid resolution (offscreen, scaled up)
const LAYER_LABELS = ['hidden 1 · 8', 'hidden 2 · 8', 'out · 1'];

export default function NeuralPlayground() {
  const boundaryRef = useRef(null);
  const lossRef = useRef(null);
  const weightsRef = useRef(null);
  const fieldRef = useRef(null); // offscreen BOUND_RES×BOUND_RES field

  const netRef = useRef(null);
  const dataRef = useRef([]);
  const rafRef = useRef(null);
  const runningRef = useRef(false);
  const lossHistRef = useRef([]);
  const wScaleRef = useRef(1); // running max mean|w|, so bars have a stable scale
  const lastStatRef = useRef(0); // throttle React state updates to ~10Hz
  const epochRef = useRef(0); // true epoch count (setStats is throttled, so it can't derive this)
  const dprRef = useRef(1); // cached so the rAF loop never forces a layout read

  const [dataset, setDataset] = useState('spiral');
  const [running, setRunning] = useState(false);
  const [lr, setLr] = useState(0.03);
  const lrRef = useRef(0.03);
  const [stats, setStats] = useState({ epoch: 0, loss: 1, acc: 0 });

  const rebuild = useCallback((kind) => {
    dataRef.current = makeDataset(kind, 220);
    netRef.current = new MLP([2, 8, 8, 1], lrRef.current, 0.9);
    lossHistRef.current = [];
    wScaleRef.current = 1;
    lastStatRef.current = 0;
    epochRef.current = 0;
    setStats({ epoch: 0, loss: 1, acc: 0 });
  }, []);

  // ---- Renderers (work in device pixels; no ctx transform) --------------
  const drawBoundary = useCallback(() => {
    const canvas = boundaryRef.current;
    const net = netRef.current;
    if (!canvas || !net) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) return;

    // Offscreen decision field → one ImageData, then scale up (fast + smooth).
    let off = fieldRef.current;
    if (!off) {
      off = document.createElement('canvas');
      off.width = BOUND_RES;
      off.height = BOUND_RES;
      fieldRef.current = off;
    }
    const octx = off.getContext('2d');
    const img = octx.createImageData(BOUND_RES, BOUND_RES);
    const d = img.data;
    for (let gy = 0; gy < BOUND_RES; gy++) {
      const ny = 1 - (gy / (BOUND_RES - 1)) * 2;
      for (let gx = 0; gx < BOUND_RES; gx++) {
        const nx = (gx / (BOUND_RES - 1)) * 2 - 1;
        const p = net.predict([nx, ny]); // 0..1  (→1 class A/blue, →0 class B/red)
        const conf = Math.abs(p - 0.5) * 2;
        const a = Math.round((0.10 + conf * 0.44) * 255);
        const i = (gy * BOUND_RES + gx) * 4;
        if (p >= 0.5) { d[i] = 57; d[i + 1] = 135; d[i + 2] = 229; }
        else { d[i] = 230; d[i + 1] = 103; d[i + 2] = 103; }
        d[i + 3] = a;
      }
    }
    octx.putImageData(img, 0, 0);

    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const t = Math.round((i / 4) * W) + 0.5;
      const s = Math.round((i / 4) * H) + 0.5;
      ctx.beginPath(); ctx.moveTo(t, 0); ctx.lineTo(t, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, s); ctx.lineTo(W, s); ctx.stroke();
    }

    // Data points
    const r = Math.max(3, W / 110);
    for (const { x, y } of dataRef.current) {
      const px = ((x[0] + 1) / 2) * W;
      const py = ((1 - x[1]) / 2) * H;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = y === 1 ? C.classA : C.classB;
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = 'rgba(8,8,10,0.9)';
      ctx.stroke();
    }
  }, []);

  const drawLoss = useCallback(() => {
    const canvas = lossRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 1); ctx.lineTo(W, H - 1); ctx.stroke();

    const hist = lossHistRef.current;
    if (hist.length < 2) return;
    const maxL = Math.max(...hist, 0.75);
    const pad = 5;
    const px = (i) => (i / (hist.length - 1)) * (W - pad * 2) + pad;
    const py = (l) => H - pad - (l / maxL) * (H - pad * 2);

    ctx.beginPath();
    ctx.moveTo(px(0), H);
    hist.forEach((l, i) => ctx.lineTo(px(i), py(l)));
    ctx.lineTo(px(hist.length - 1), H);
    ctx.closePath();
    ctx.fillStyle = 'rgba(167,139,250,0.12)';
    ctx.fill();

    ctx.beginPath();
    hist.forEach((l, i) => (i === 0 ? ctx.moveTo(px(i), py(l)) : ctx.lineTo(px(i), py(l))));
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px(hist.length - 1), py(hist[hist.length - 1]), 3, 0, Math.PI * 2);
    ctx.fillStyle = C.accent;
    ctx.fill();
  }, []);

  /* Per-neuron mean |weight|, one bar per neuron, grouped by layer.
     Magnitude is a sequential encoding: single hue, bar height + alpha.
     Bars are never a class colour — blue/red stay reserved for the data. */
  const drawWeights = useCallback(() => {
    const canvas = weightsRef.current;
    const net = netRef.current;
    if (!canvas || !net) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    if (!W || !H) return;
    ctx.clearRect(0, 0, W, H);

    // mean |w| per neuron, flattened, with the layer each belongs to
    const mags = [];
    net.W.forEach((layer, l) => {
      layer.forEach((row) => {
        let s = 0;
        for (const v of row) s += Math.abs(v);
        mags.push({ l, m: s / row.length });
      });
    });
    if (!mags.length) return;

    // Stable, honest scale: grows to fit but never shrinks mid-run, so a
    // taller bar always means a bigger weight than it did a moment ago.
    const peak = Math.max(...mags.map((d) => d.m));
    if (peak > wScaleRef.current) wScaleRef.current = peak;
    const scale = wScaleRef.current;

    const dpr = dprRef.current;
    const gap = Math.max(2, Math.round(2 * dpr)); // 2px surface gap
    const groupGap = gap * 5;
    const base = H - Math.round(11 * dpr); // room for the layer labels
    const groups = net.W.length;
    const usable = W - groupGap * (groups - 1);
    const barW = Math.max(2, (usable - gap * (mags.length - groups)) / mags.length);

    let x = 0;
    let prevLayer = 0;
    ctx.textBaseline = 'top';
    ctx.font = `${Math.round(8 * dpr)}px ui-monospace, monospace`;
    const groupStart = [0];

    mags.forEach((d, i) => {
      if (d.l !== prevLayer) { x += groupGap - gap; groupStart.push(x); prevLayer = d.l; }
      const t = Math.min(1, d.m / scale);
      const h = Math.max(1 * dpr, t * (base - 2 * dpr));
      // baseline track
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(x, 2 * dpr, barW, base - 2 * dpr);
      // magnitude bar, anchored to the baseline, rounded top end
      ctx.fillStyle = `rgba(167,139,250,${(0.35 + t * 0.6).toFixed(3)})`;
      const r = Math.min(barW / 2, 2 * dpr);
      const y = base - h;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, barW, h, [r, r, 0, 0]);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barW, h);
      }
      x += barW + gap;
    });

    // Layer labels + baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.10)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, base + 0.5);
    ctx.lineTo(W, base + 0.5);
    ctx.stroke();

    ctx.fillStyle = 'rgba(138,138,147,1)';
    LAYER_LABELS.forEach((lab, i) => {
      if (groupStart[i] === undefined) return;
      ctx.fillText(lab, groupStart[i], base + 3 * dpr);
    });
  }, []);

  // ---- Training loop -----------------------------------------------------
  const step = useCallback((now) => {
    const net = netRef.current;
    if (!net) return;
    net.lr = lrRef.current;
    let loss = 0;
    const iters = 3; // epochs/frame — visibly brisk
    for (let k = 0; k < iters; k++) loss = net.trainEpoch(dataRef.current);
    epochRef.current += iters;
    const hist = lossHistRef.current;
    hist.push(loss);
    if (hist.length > 160) hist.shift();

    // Canvases repaint every frame; the numeric readout is throttled to ~10Hz.
    // Digits changing 60×/sec are unreadable, and accuracy() is a full forward
    // pass over the dataset — no reason to pay for it on every frame.
    const t = now ?? 0;
    if (t - lastStatRef.current > 100) {
      lastStatRef.current = t;
      setStats({ epoch: epochRef.current, loss, acc: net.accuracy(dataRef.current) });
    }
    drawBoundary();
    drawLoss();
    drawWeights();

    if (runningRef.current) rafRef.current = requestAnimationFrame(step);
  }, [drawBoundary, drawLoss, drawWeights]);

  const toggleRun = useCallback(() => {
    const next = !runningRef.current;
    runningRef.current = next;
    setRunning(next);
    if (next) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      // Flush the throttled readout so the paused numbers match what's drawn.
      const net = netRef.current;
      const hist = lossHistRef.current;
      if (net) {
        setStats({
          epoch: epochRef.current,
          loss: hist.length ? hist[hist.length - 1] : 1,
          acc: net.accuracy(dataRef.current),
        });
      }
    }
  }, [step]);

  const reset = useCallback(() => {
    rebuild(dataset);
    drawBoundary();
    drawLoss();
    drawWeights();
  }, [dataset, rebuild, drawBoundary, drawLoss, drawWeights]);

  const switchDataset = useCallback((kind) => {
    setDataset(kind);
    rebuild(kind);
    requestAnimationFrame(() => { drawBoundary(); drawLoss(); drawWeights(); });
  }, [rebuild, drawBoundary, drawLoss, drawWeights]);

  // Size a canvas to its CSS box × DPR (draw in device px, no ctx.scale).
  // Returns true if the backing store actually changed.
  const sizeCanvas = useCallback((cv) => {
    if (!cv) return false;
    const rect = cv.getBoundingClientRect();
    if (!rect.width || !rect.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (cv.width === w && cv.height === h) return false;
    cv.width = w;
    cv.height = h;
    return true;
  }, []);

  useEffect(() => {
    rebuild(dataset);

    const canvases = [boundaryRef.current, lossRef.current, weightsRef.current];
    const redraw = () => { drawBoundary(); drawLoss(); drawWeights(); };

    // A plain window 'resize' listener misses the case that actually bites:
    // this component is lazy-loaded, so its first measurement happens before
    // layout settles and the canvas ends up scaled (blurry). ResizeObserver
    // fires once observation begins — after layout — and on every container
    // change thereafter. Changing width/height alters the backing store, not
    // the CSS box, so this cannot feed back into a resize loop.
    const ro = new ResizeObserver(() => {
      let changed = false;
      for (const cv of canvases) if (sizeCanvas(cv)) changed = true;
      if (changed) redraw();
    });
    for (const cv of canvases) if (cv) ro.observe(cv);

    // Catch a window moving between displays of different pixel density.
    const dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    const onDpr = () => {
      for (const cv of canvases) sizeCanvas(cv);
      redraw();
    };
    dprQuery.addEventListener('change', onDpr);

    for (const cv of canvases) sizeCanvas(cv);
    redraw();

    return () => {
      ro.disconnect();
      dprQuery.removeEventListener('change', onDpr);
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { lrRef.current = lr; }, [lr]);

  return (
    <div className="rounded-2xl border border-line bg-ink-800/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e66767]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#fab219]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#0ca30c]" />
          </span>
          <span className="font-mono text-xs text-paper-mut ml-2">mlp_playground.js</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-paper-mut">
          <Cpu className="w-3.5 h-3.5 text-accent-lt" aria-hidden="true" />
          <span>MLP 2·8·8·1 · tanh · SGD+momentum</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_260px]">
        {/* Decision boundary */}
        <div className="p-4 border-b lg:border-b-0 lg:border-r border-line">
          <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
            <span className="mono-label">decision boundary</span>
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-line" role="group" aria-label="Dataset">
              {DATASETS.map((dset) => (
                <button
                  key={dset.id}
                  onClick={() => switchDataset(dset.id)}
                  aria-pressed={dataset === dset.id}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    dataset === dset.id ? 'bg-accent text-white' : 'text-paper-mut hover:text-paper'
                  }`}
                >
                  {dset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="relative aspect-square w-full max-w-[380px] mx-auto rounded-xl overflow-hidden border border-line bg-ink-900">
            <canvas ref={boundaryRef} className="w-full h-full block" aria-label="Neural network decision boundary, updating live during training" role="img" />
            <div className="absolute bottom-2 left-2 flex gap-3 font-mono text-[10px]">
              <span className="flex items-center gap-1.5 text-paper-dim">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.classA }} aria-hidden="true" /> class 1
              </span>
              <span className="flex items-center gap-1.5 text-paper-dim">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: C.classB }} aria-hidden="true" /> class 0
              </span>
            </div>
          </div>
        </div>

        {/* Metrics + controls */}
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2 font-mono">
            <Stat label="epoch" value={stats.epoch} />
            <Stat label="loss" value={stats.loss.toFixed(3)} />
            <Stat label="acc" value={(stats.acc * 100).toFixed(0) + '%'} accent />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="mono-label">loss (BCE)</span>
              <Activity className="w-3.5 h-3.5 text-accent-lt" aria-hidden="true" />
            </div>
            <div className="rounded-lg border border-line bg-ink-900 p-1">
              <canvas ref={lossRef} className="w-full h-16 block" aria-label="Training loss curve" role="img" />
            </div>
          </div>

          <div>
            <label htmlFor="lr-range" className="flex items-center justify-between mono-label mb-1.5">
              <span>learning rate</span>
              <span className="text-accent-lt">{lr.toFixed(3)}</span>
            </label>
            <input
              id="lr-range"
              type="range" min="0.005" max="0.15" step="0.005"
              value={lr}
              onChange={(e) => setLr(parseFloat(e.target.value))}
              className="w-full accent-[#8b5cf6] cursor-pointer"
            />
          </div>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={toggleRun}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent hover:bg-accent-lt text-white font-mono text-xs font-semibold transition-colors"
            >
              {running ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
              {running ? 'pause' : 'train'}
            </button>
            <button
              onClick={reset}
              className="px-3 py-2.5 rounded-lg bg-white/[0.05] border border-line text-paper-dim hover:text-paper hover:bg-white/10 transition-colors"
              aria-label="Reset network to fresh random weights"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="font-mono text-[10px] text-paper-mut leading-relaxed">
            Real forward pass + backprop, running in your browser — no library, no
            server. Weights start Xavier-initialized; the boundary is the network's
            live prediction as gradients flow.
          </p>
        </div>
      </div>

      {/* Weight magnitudes — one bar per neuron */}
      <div className="px-4 py-3.5 border-t border-line">
        <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
          <span className="mono-label flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-accent-lt" aria-hidden="true" />
            mean |weight| per neuron
          </span>
          <span className="font-mono text-[10px] text-paper-mut">
            17 neurons · scale fixed to peak so far
          </span>
        </div>
        <canvas
          ref={weightsRef}
          className="w-full h-14 block"
          role="img"
          aria-label="Bar chart of mean absolute weight per neuron, grouped by layer, updating during training"
        />
      </div>
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-line bg-ink-900 px-2 py-2 text-center">
      <div className={`text-lg font-bold tabular-nums ${accent ? 'text-accent-lt' : 'text-paper'}`}>{value}</div>
      <div className="mono-label text-[9px] mt-0.5">{label}</div>
    </div>
  );
}
