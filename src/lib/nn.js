/* ============================================================
   Tiny neural network — a real MLP with forward + backprop,
   trained live in the browser. No dependencies, no backend.

   Architecture: 2 → 8 → 8 → 1, tanh hidden, sigmoid output,
   binary cross-entropy loss, vanilla SGD with momentum.

   This is genuine gradient descent, not a scripted animation:
   the decision boundary, loss curve, and weights all come from
   actual training steps.
   ============================================================ */

function randn() {
  // Box–Muller
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const tanh = (x) => Math.tanh(x);
const dtanh = (y) => 1 - y * y; // derivative in terms of activation
const sigmoid = (x) => 1 / (1 + Math.exp(-x));

export class MLP {
  constructor(layers = [2, 8, 8, 1], lr = 0.03, momentum = 0.9) {
    this.layers = layers;
    this.lr = lr;
    this.momentum = momentum;
    this.init();
  }

  init() {
    const L = this.layers;
    this.W = [];
    this.b = [];
    this.vW = [];
    this.vb = [];
    for (let l = 1; l < L.length; l++) {
      const fanIn = L[l - 1];
      // Xavier-ish init
      const scale = Math.sqrt(2 / (fanIn + L[l]));
      const w = [];
      const vw = [];
      for (let i = 0; i < L[l]; i++) {
        const row = [];
        const vrow = [];
        for (let j = 0; j < fanIn; j++) {
          row.push(randn() * scale);
          vrow.push(0);
        }
        w.push(row);
        vw.push(vrow);
      }
      this.W.push(w);
      this.vW.push(vw);
      this.b.push(new Array(L[l]).fill(0));
      this.vb.push(new Array(L[l]).fill(0));
    }
  }

  // Forward pass. Returns activations per layer (input included).
  forward(x) {
    const acts = [x];
    let a = x;
    for (let l = 0; l < this.W.length; l++) {
      const isLast = l === this.W.length - 1;
      const out = new Array(this.W[l].length);
      for (let i = 0; i < this.W[l].length; i++) {
        let z = this.b[l][i];
        const row = this.W[l][i];
        for (let j = 0; j < row.length; j++) z += row[j] * a[j];
        out[i] = isLast ? sigmoid(z) : tanh(z);
      }
      acts.push(out);
      a = out;
    }
    return acts;
  }

  predict(x) {
    const acts = this.forward(x);
    return acts[acts.length - 1][0];
  }

  // One epoch over the batch. Returns mean BCE loss.
  trainEpoch(data) {
    const L = this.W.length;
    // gradient accumulators
    const gW = this.W.map((layer) => layer.map((row) => row.map(() => 0)));
    const gb = this.b.map((row) => row.map(() => 0));
    let loss = 0;

    for (const { x, y } of data) {
      const acts = this.forward(x);
      const out = acts[acts.length - 1];
      const pred = out[0];
      const p = Math.min(Math.max(pred, 1e-7), 1 - 1e-7);
      loss += -(y * Math.log(p) + (1 - y) * Math.log(1 - p));

      // output delta (sigmoid + BCE → pred - y)
      let delta = [pred - y];
      for (let l = L - 1; l >= 0; l--) {
        const aPrev = acts[l];
        const dNext = new Array(this.W[l][0].length).fill(0);
        for (let i = 0; i < this.W[l].length; i++) {
          const d = delta[i];
          gb[l][i] += d;
          const row = this.W[l][i];
          for (let j = 0; j < row.length; j++) {
            gW[l][i][j] += d * aPrev[j];
            dNext[j] += d * row[j];
          }
        }
        if (l > 0) {
          // backprop through tanh of the previous layer's activations
          for (let j = 0; j < dNext.length; j++) dNext[j] *= dtanh(acts[l][j]);
          delta = dNext;
        }
      }
    }

    const n = data.length;
    for (let l = 0; l < L; l++) {
      for (let i = 0; i < this.W[l].length; i++) {
        for (let j = 0; j < this.W[l][i].length; j++) {
          const g = gW[l][i][j] / n;
          this.vW[l][i][j] = this.momentum * this.vW[l][i][j] - this.lr * g;
          this.W[l][i][j] += this.vW[l][i][j];
        }
        const gbi = gb[l][i] / n;
        this.vb[l][i] = this.momentum * this.vb[l][i] - this.lr * gbi;
        this.b[l][i] += this.vb[l][i];
      }
    }
    return loss / n;
  }

  accuracy(data) {
    let correct = 0;
    for (const { x, y } of data) {
      const p = this.predict(x);
      if ((p >= 0.5 ? 1 : 0) === y) correct++;
    }
    return correct / data.length;
  }
}

/* ---- Datasets: coordinates normalized to [-1, 1] ---- */

export function makeDataset(kind, n = 220) {
  const data = [];
  if (kind === 'spiral') {
    const perClass = Math.floor(n / 2);
    for (let c = 0; c < 2; c++) {
      for (let i = 0; i < perClass; i++) {
        const r = (i / perClass) * 0.95;
        const t = c * Math.PI + (i / perClass) * 3.2 + randn() * 0.18;
        data.push({ x: [r * Math.sin(t), r * Math.cos(t)], y: c });
      }
    }
  } else if (kind === 'circles') {
    for (let i = 0; i < n; i++) {
      const inner = i % 2 === 0;
      const r = inner ? Math.random() * 0.4 : 0.6 + Math.random() * 0.35;
      const t = Math.random() * Math.PI * 2;
      data.push({ x: [r * Math.cos(t) + randn() * 0.03, r * Math.sin(t) + randn() * 0.03], y: inner ? 1 : 0 });
    }
  } else if (kind === 'xor') {
    for (let i = 0; i < n; i++) {
      const px = Math.random() * 2 - 1;
      const py = Math.random() * 2 - 1;
      const label = (px > 0) !== (py > 0) ? 1 : 0;
      data.push({ x: [px + randn() * 0.02, py + randn() * 0.02], y: label });
    }
  } else {
    // moons
    const perClass = Math.floor(n / 2);
    for (let i = 0; i < perClass; i++) {
      const t = (i / perClass) * Math.PI;
      data.push({ x: [Math.cos(t) * 0.7 - 0.25, Math.sin(t) * 0.7 - 0.2 + randn() * 0.05], y: 0 });
      data.push({ x: [Math.cos(t) * 0.7 + 0.25, -Math.sin(t) * 0.7 + 0.2 + randn() * 0.05], y: 1 });
    }
  }
  return data;
}
