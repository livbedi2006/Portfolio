import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ExternalLink, ChevronDown, AlertTriangle } from 'lucide-react';
import { Github } from '../lib/icons.jsx';
import { Reveal } from '../lib/motion.jsx';

/* ============================================================
   Every entry below maps to a real public repo. No invented
   metrics, no invented names, no star counts. Where a project
   has a known weakness, it is written down — the "limits" field
   is not optional.
   ============================================================ */
const PROJECTS = [
  {
    repo: 'Plagiarism-Detector',
    title: 'Plagiarism detector',
    kind: 'nlp',
    lang: 'Python',
    what: 'Flags copied text across a set of student submissions and reports a similarity score per pair.',
    how: 'TF-IDF vectorization over cleaned tokens, then cosine similarity between document vectors. Threshold chosen by hand on a small labelled sample.',
    limits:
      'TF-IDF is lexical, not semantic — it matches shared words, so it reliably catches copy-paste and reliably misses paraphrase. Swapping in sentence embeddings is the obvious next step, and I have not measured that delta yet.',
  },
  {
    repo: 'Placemux-exam-portal',
    title: 'Placemux — proctored exam portal',
    kind: 'cv',
    lang: 'TypeScript',
    what: 'An exam portal with a webcam-based invigilation layer that flags suspicious behaviour during a test and evaluates the submission.',
    how: 'Browser-side face and pose signals drive a heuristic flagging layer; the portal handles the exam lifecycle, timing and evaluation.',
    limits:
      'Automated proctoring is the riskiest thing here and I want to be direct about it. A false flag costs a student far more than a missed one costs the institution, so the threshold should be tuned for high precision, not high recall — and a human should make the final call, always. I have not measured per-subgroup false-positive rates (skin tone, lighting, glasses, disability, background), which is exactly where systems like this are documented to fail. Until that is measured I would not ship it as an automatic decision-maker; it is a "surface this clip to a human" tool.',
    flag: true,
  },
  {
    repo: 'Examination_portal',
    title: 'Examination portal',
    kind: 'web',
    lang: 'Python',
    what: 'The exam-delivery side of the above: setup, environment control, question flow and a private-invigilator experience.',
    how: 'Python backend handling exam sessions, question delivery and result capture.',
    limits:
      'Single-instance, not load-tested. No concurrency benchmarking, so I cannot tell you what it does under a real cohort of a few hundred simultaneous students.',
  },
  {
    repo: 'description-matching-system',
    title: 'Description matching system',
    kind: 'nlp',
    lang: 'Python',
    what: 'Scores how well a student profile matches a chosen job description, for a placement workflow.',
    how: 'Text features from both sides, then a similarity/ranking model to order candidates against a description.',
    limits:
      'Evaluated on a small internal set, so the ranking quality has no held-out benchmark behind it yet. It also inherits whatever bias is in the profile text — a matcher will happily learn to prefer whoever writes the most keyword-dense CV.',
  },
  {
    repo: 'Medicine_Scan',
    title: 'Medify — medicine scan & verification',
    kind: 'web',
    lang: 'HTML',
    what: 'Scan a QR or barcode on a medicine pack, then verify the user two ways and check where the scan happened.',
    how: 'Three-step flow: code scan → two-factor identity check → location check at scan time. Aimed at spotting counterfeit or diverted stock.',
    limits:
      'Verification is only as good as the code on the pack — a cloned QR passes. The location check tells you where a scan happened, not whether the medicine is genuine. Real anti-counterfeit work needs a serialized registry, which this does not have.',
  },
  {
    repo: 'Machine_learning_techniques',
    title: 'ML techniques — worked notes',
    kind: 'ml',
    lang: 'Jupyter / Python',
    what: 'A structured walk from basic to more advanced model-training techniques, kept as a reference I actually reuse.',
    how: 'Organised notebooks/scripts covering preprocessing, training and evaluation patterns, ordered so each builds on the last.',
    limits:
      'This is a learning repo, not a library. It is written to be read, not imported, and some of the earlier sections use small toy datasets.',
  },
];

const FILTERS = [
  { id: 'nlp', label: 'nlp' },
  { id: 'cv', label: 'vision' },
  { id: 'ml', label: 'ml' },
  { id: 'web', label: 'web' },
  { id: 'all', label: 'all' },
];

const GH = 'https://github.com/livbedi2006/';

export default function Projects() {
  const [filter, setFilter] = useState('nlp');
  const [open, setOpen] = useState(null);
  const reduce = useReducedMotion();

  const shown = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.kind === filter);

  return (
    <section id="work" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="mb-10">
          <span className="mono-label">02 / work</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-4 grad-text">
            GitHub project repos
          </h2>
          <p className="text-paper-dim text-sm sm:text-base max-w-2xl leading-relaxed">
            Every card links to actual source. Each one lists what it does, how it
            does it, and where it falls over — that last part is the one I'd want to
            read if I were hiring.
          </p>
        </Reveal>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8 p-1 rounded-xl border border-line bg-raise-1 w-fit" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={isActive}
                className="relative px-4 py-1.5 font-mono text-xs text-paper-dim hover:text-paper transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="workFilterPill"
                    className="absolute inset-0 rounded-lg bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? 'text-on-accent font-semibold' : ''}`}>
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <motion.div layout className="grid md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => {
              const isOpen = open === p.repo;
              return (
                <motion.article
                  key={p.repo}
                  layout
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  className="spotlight group rounded-2xl border border-line bg-ink-800/60 backdrop-blur-sm p-5 flex flex-col hover:border-line-hard transition-colors"
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-line text-paper-mut">
                            {p.kind}
                          </span>
                          <span className="font-mono text-[10px] text-paper-mut">{p.lang}</span>
                          {p.flag && (
                            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-warn/30 bg-warn/10 text-warn flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" aria-hidden="true" />
                              ethics note
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-paper leading-snug">{p.title}</h3>
                      </div>
                      <a
                        href={GH + p.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 p-2 rounded-lg bg-raise-1 border border-line text-paper-dim hover:text-paper hover:bg-raise-3 transition-colors"
                        aria-label={`View ${p.title} source on GitHub`}
                      >
                        <Github className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>

                    <p className="text-paper-dim text-[13px] leading-relaxed mb-3">{p.what}</p>

                    <div className="mb-4">
                      <span className="mono-label text-[9px]">method</span>
                      <p className="text-paper-mut text-[12.5px] leading-relaxed mt-1">{p.how}</p>
                    </div>

                    {/* Limits disclosure */}
                    <div className="mt-auto pt-3 border-t border-line-soft">
                      <button
                        onClick={() => setOpen(isOpen ? null : p.repo)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between font-mono text-[11px] text-paper-dim hover:text-paper transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="text-warn">!</span> limits &amp; what I'd fix
                        </span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-paper-mut text-[12.5px] leading-relaxed pt-3">
                              {p.limits}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/livbedi2006?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-raise-1 border border-line text-paper font-mono text-xs hover:bg-raise-3 transition-colors"
          >
            <Github className="w-4 h-4" aria-hidden="true" />
            <span>all repositories</span>
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
          <p className="font-mono text-[11px] text-paper-mut">
            no star counts shown — they'd be flattering to nobody and easy to check
          </p>
        </Reveal>
      </div>
    </section>
  );
}
