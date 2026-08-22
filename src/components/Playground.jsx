import React, { Suspense, lazy } from 'react';
import { Reveal } from '../lib/motion.jsx';

/* The playground is the heaviest thing on the page — keep it out of
   first paint and mount it only when the visitor scrolls near it. */
const NeuralPlayground = lazy(() => import('./NeuralPlayground.jsx'));

function Skeleton() {
  return (
    <div className="rounded-2xl border border-line bg-ink-800/60 h-[520px] flex items-center justify-center">
      <span className="font-mono text-xs text-paper-mut">initialising network…</span>
    </div>
  );
}

export default function Playground() {
  return (
    <section id="playground" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-8">
          <span className="mono-label">01 / live demo</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-4 grad-text">
            A neural network, actually training
          </h2>
          <p className="text-paper-dim text-sm sm:text-base max-w-2xl leading-relaxed">
            Not a video and not a scripted animation. This is a 2·8·8·1 multilayer
            perceptron written from scratch in about 150 lines of plain JavaScript —
            forward pass, backpropagation, binary cross-entropy, SGD with momentum.
            Press <span className="text-paper font-mono">train</span> and watch the
            decision boundary carve itself out of noise while the loss drops.
          </p>
        </Reveal>

        <Reveal y={30}>
          <Suspense fallback={<Skeleton />}>
            <NeuralPlayground />
          </Suspense>
        </Reveal>

        <Reveal className="mt-6 grid sm:grid-cols-3 gap-4">
          {[
            {
              h: 'try the spiral',
              p: 'The hardest of the four. At a low learning rate it under-fits badly; push the slider up and it finds the arms — sometimes. Reset a few times and you get visibly different results from the same architecture. That variance is the point.',
            },
            {
              h: 'why xor matters',
              p: 'A single linear layer cannot solve xor at all — that limitation stalled neural nets for years. The hidden layers here are what make the diagonal split possible.',
            },
            {
              h: 'what it is not',
              p: 'A toy. Two input features, 220 points, full-batch gradient descent, no train/test split — so the accuracy shown is training accuracy and would be dishonest to quote as a result.',
            },
          ].map((c) => (
            <div key={c.h} className="rounded-xl border border-line bg-raise-1 p-4">
              <span className="mono-label text-[10px]">{c.h}</span>
              <p className="text-paper-mut text-[12.5px] leading-relaxed mt-2">{c.p}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
