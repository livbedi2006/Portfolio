import React from 'react';
import { Brain, Database, LayoutTemplate, ArrowRight } from 'lucide-react';
import { Reveal, SpotlightCard } from '../lib/motion.jsx';

const OFFER = [
  {
    icon: Brain,
    title: 'ML prototypes that get measured',
    body:
      'Classical ML, NLP or vision — built to the point where there is a number you can trust. That means a stated baseline, a held-out split, and the failure cases written down, not just a demo that works on the happy path.',
    good: ['text classification / similarity', 'image & video classification', 'tabular models + feature work', 'evaluation and error analysis'],
  },
  {
    icon: Database,
    title: 'Data & Python automation',
    body:
      'The unglamorous 80%. Cleaning messy exports, reshaping datasets, scraping, joining sources that were never meant to be joined, and turning a manual spreadsheet ritual into a script that runs.',
    good: ['data cleaning & reshaping', 'scraping / API pulls', 'pandas pipelines', 'report generation'],
  },
  {
    icon: LayoutTemplate,
    title: 'Front-ends for data & models',
    body:
      'React interfaces that put a model or a dataset in front of a person — dashboards, internal tools, and canvas visualisations like the network at the top of this page.',
    good: ['React + Tailwind builds', 'canvas / interactive charts', 'model demo interfaces', 'responsive + accessible markup'],
  },
];

const HOW = [
  ['scoping', 'I would rather cut scope than miss. If a brief is too big for the time, I will say so at the quote stage and propose the smaller version that actually ships.'],
  ['what you get', 'Source in a repo you own, a README that explains how to run it, and a short honest write-up of what works and what does not.'],
  ['availability', 'Final-year student, so I work around coursework. I will tell you my real weekly hours before we agree anything.'],
];

const TURN_DOWN = [
  'Anything that needs production on-call or a 99.9% uptime promise — I have not run that and would be lying to say otherwise.',
  'Training runs that need a serious GPU budget or distributed setup.',
  'Automated systems that make a final decision about a person — hiring, discipline, credit — without a human in the loop. I will build the human-in-the-loop version instead.',
];

export default function Build() {
  return (
    <section id="build" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-10">
          <span className="mono-label">04 / freelance</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-4 grad-text">
            What I'll build for you
          </h2>
          <p className="text-paper-dim text-sm sm:text-base max-w-2xl leading-relaxed">
            I take on freelance ML and web work. No packages, no tiers — tell me the
            problem and I'll tell you whether I'm the right person for it, including
            when I'm not.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          {OFFER.map((o, i) => {
            const Icon = o.icon;
            return (
              <Reveal key={o.title} delay={i * 0.08}>
                <SpotlightCard className="h-full rounded-2xl border border-line bg-ink-800/60 backdrop-blur-sm p-6 hover:border-line-hard transition-colors">
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="w-10 h-10 rounded-xl border border-line bg-white/[0.04] flex items-center justify-center text-accent-lt mb-4">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-paper mb-2.5 leading-snug">{o.title}</h3>
                    <p className="text-paper-dim text-[13px] leading-relaxed mb-4">{o.body}</p>
                    <ul className="mt-auto space-y-1.5 pt-4 border-t border-line-soft">
                      {o.good.map((g) => (
                        <li key={g} className="font-mono text-[11.5px] text-paper-mut flex items-center gap-2">
                          <span className="text-accent-lt" aria-hidden="true">+</span>
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
          <Reveal>
            <div className="h-full rounded-2xl border border-line bg-ink-800/60 p-6">
              <span className="mono-label text-[10px]">how I work</span>
              <dl className="mt-4 space-y-4">
                {HOW.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[11.5px] text-accent-lt mb-1">{k}</dt>
                    <dd className="text-paper-dim text-[13px] leading-relaxed">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-line bg-ink-800/60 p-6">
              <span className="mono-label text-[10px]">what I'd turn down</span>
              <ul className="mt-4 space-y-3">
                {TURN_DOWN.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13px] text-paper-dim leading-relaxed">
                    <span className="text-[#e66767] font-mono shrink-0 mt-0.5" aria-hidden="true">×</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-5 pt-4 border-t border-line-soft flex items-center gap-2 font-mono text-xs text-paper hover:text-accent-lt transition-colors group"
              >
                <span>tell me what you need</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
