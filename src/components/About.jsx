import React from 'react';
import { GraduationCap, Terminal, BookOpen, CircleSlash } from 'lucide-react';
import { Reveal, Stagger, StaggerItem, SpotlightCard } from '../lib/motion.jsx';

/* Honest tiers. "Comfortable" means I've shipped something with it and could
   debug it under pressure. "Working knowledge" means I've built with it but
   would look things up. "Learning" means exactly that. */
const TIERS = [
  {
    tier: 'comfortable',
    note: "shipped something with it, could debug it live",
    items: ['Python', 'NumPy / pandas', 'scikit-learn', 'TF-IDF & classical NLP', 'JavaScript', 'React', 'Git'],
  },
  {
    tier: 'working knowledge',
    note: 'built with it, would still reach for the docs',
    items: ['PyTorch', 'OpenCV', 'CNNs', 'TypeScript', 'SQL', 'Matplotlib'],
  },
  {
    tier: 'learning now',
    note: "actively studying, wouldn't claim it on a CV yet",
    items: ['Transformers', 'Model evaluation discipline', 'MLOps & serving', 'Docker'],
  },
];

const NOT_YET = [
  'Trained anything at scale — my largest runs are single-GPU / Colab class.',
  'Run a model in production with real users, monitoring and on-call.',
  'Used distributed training, TPUs, or a feature store.',
  'Published research or contributed to a major open-source ML library.',
];

/* The tier dot is an ORDINAL cue, so it gets a sequential encoding: one hue,
   three steps of the same accent. Deliberately not green/amber/grey — those
   are the status colours, and painting "learning now" amber would say
   "warning" about something that is just honest. The dot is aria-hidden and
   the tier is written in text beside it, so it carries no information alone. */
const TIER_DOT = ['bg-accent-lt', 'bg-accent-lt/55', 'bg-accent-lt/25'];

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-10">
          <span className="mono-label">03 / about</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-4 grad-text">
            Where I actually am
          </h2>
          <p className="text-paper-dim text-sm sm:text-base max-w-2xl leading-relaxed">
            I'm a final-year B.Tech CSE (AI/ML) student at Chandigarh University. I'd
            rather tell you the shape of what I know than pad a logo wall — so here it
            is in three tiers, plus the things I haven't done.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          {TIERS.map((t, i) => (
            <Reveal key={t.tier} delay={i * 0.08}>
              <SpotlightCard className="h-full rounded-2xl border border-line bg-ink-800/60 backdrop-blur-sm p-5">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${TIER_DOT[i]}`}
                      aria-hidden="true"
                    />
                    <span className="mono-label text-[10px]">{t.tier}</span>
                  </div>
                  <p className="text-paper-mut text-[11.5px] font-mono mb-4 leading-relaxed">{t.note}</p>
                  <ul className="flex flex-wrap gap-2">
                    {t.items.map((item) => (
                      <li
                        key={item}
                        className="font-mono text-[12px] px-2.5 py-1 rounded-lg bg-raise-1 border border-line text-paper-dim"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5">
          {/* Not yet — the honest column */}
          <Reveal>
            <div className="h-full rounded-2xl border border-line bg-ink-800/60 p-5">
              <div className="flex items-center gap-2 mb-4">
                <CircleSlash className="w-4 h-4 text-paper-mut" aria-hidden="true" />
                <span className="mono-label text-[10px]">things I have not done</span>
              </div>
              <ul className="space-y-2.5">
                {NOT_YET.map((n) => (
                  <li key={n} className="flex gap-2.5 text-[13px] text-paper-dim leading-relaxed">
                    <span className="text-paper-faint font-mono shrink-0 mt-0.5" aria-hidden="true">—</span>
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 pt-4 border-t border-line-soft font-mono text-[11px] text-paper-mut leading-relaxed">
                If a role needs these, I'm not the strongest candidate on paper — but
                you'll know that before the interview instead of after.
              </p>
            </div>
          </Reveal>

          {/* Education + currently */}
          <Reveal delay={0.08}>
            <div className="h-full flex flex-col gap-5">
              <div className="rounded-2xl border border-line bg-ink-800/60 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-accent-lt" aria-hidden="true" />
                  <span className="mono-label text-[10px]">education</span>
                </div>
                <p className="text-paper font-semibold text-sm">B.Tech — Computer Science</p>
                <p className="text-paper-dim text-[13px]">Specialisation in AI &amp; ML</p>
                <p className="text-paper-mut font-mono text-[11.5px] mt-1">Chandigarh University</p>
              </div>

              <div className="rounded-2xl border border-line bg-ink-800/60 p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-accent-lt" aria-hidden="true" />
                  <span className="mono-label text-[10px]">currently</span>
                </div>
                <p className="text-paper-dim text-[13px] leading-relaxed">
                  Working through evaluation properly — baselines, held-out splits,
                  error bars — because that's the gap between my projects and
                  something I'd defend in review.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
