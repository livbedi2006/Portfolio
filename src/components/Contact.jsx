import React, { useState } from 'react';
import { Mail, ArrowUpRight, Copy, Check } from 'lucide-react';
import { Github, Linkedin } from '../lib/icons.jsx';
import { Reveal } from '../lib/motion.jsx';

const EMAIL = 'livjotseerat@gmail.com';

const KINDS = [
  { id: 'ml', label: 'ml / model work' },
  { id: 'data', label: 'data & automation' },
  { id: 'web', label: 'front-end build' },
  { id: 'other', label: 'something else' },
];

export default function Contact() {
  const [kind, setKind] = useState('ml');
  const [form, setForm] = useState({ name: '', from: '', detail: '' });
  const [copied, setCopied] = useState(false);

  const kindLabel = KINDS.find((k) => k.id === kind)?.label ?? kind;

  // Composes a real mailto: link — no backend, no fake success state.
  const mailto = () => {
    const subject = `Project enquiry — ${kindLabel}`;
    const body = [
      `Hi Livjot,`,
      ``,
      form.detail || `(what I need:)`,
      ``,
      `— ${form.name || 'name'}`,
      form.from ? `Reply to: ${form.from}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the address is visible on screen anyway */
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16">
          {/* Left: direct channels */}
          <Reveal>
            <span className="mono-label">05 / contact</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-4 grad-text">
              Tell me what you're building
            </h2>
            <p className="text-paper-dim text-sm leading-relaxed mb-8 max-w-md">
              Freelance enquiries, questions about any of the projects, or a
              correction if you think one of my numbers is wrong — all welcome. I
              reply to everything that isn't a template.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 p-4 rounded-xl border border-line bg-ink-800/60">
                <div className="flex items-center gap-3 min-w-0">
                  <Mail className="w-4 h-4 text-accent-lt shrink-0" aria-hidden="true" />
                  <a
                    href={`mailto:${EMAIL}`}
                    className="font-mono text-[13px] text-paper truncate hover:text-accent-lt transition-colors"
                  >
                    {EMAIL}
                  </a>
                </div>
                <button
                  onClick={copyEmail}
                  className="shrink-0 p-2 rounded-lg bg-raise-1 border border-line text-paper-dim hover:text-paper transition-colors"
                  aria-label={copied ? 'Email address copied' : 'Copy email address'}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-ok" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {[
                { icon: Github, label: 'github.com/livbedi2006', href: 'https://github.com/livbedi2006' },
                { icon: Linkedin, label: 'linkedin.com/in/livjot-singh', href: 'https://www.linkedin.com/in/livjot-singh-7909a0334/' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-line bg-ink-800/60 hover:border-line-hard hover:bg-raise-2 transition-colors group"
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 text-accent-lt shrink-0" aria-hidden="true" />
                    <span className="font-mono text-[13px] text-paper truncate">{label}</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-paper-mut group-hover:text-paper group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          </Reveal>

          {/* Right: enquiry composer */}
          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = mailto();
              }}
              className="rounded-2xl border border-line bg-ink-800/70 backdrop-blur-xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-raise-1">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warn" />
                  <span className="w-2.5 h-2.5 rounded-full bg-ok" />
                </span>
                <span className="font-mono text-xs text-paper-mut ml-2">new_enquiry.txt</span>
              </div>

              <div className="p-5 space-y-4">
                <fieldset>
                  <legend className="mono-label text-[10px] mb-2">what kind of work</legend>
                  <div className="flex flex-wrap gap-1.5">
                    {KINDS.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => setKind(k.id)}
                        aria-pressed={kind === k.id}
                        className={`px-3 py-1.5 rounded-lg font-mono text-[11.5px] border transition-colors ${
                          kind === k.id
                            ? 'bg-accent border-accent text-on-accent'
                            : 'bg-raise-1 border-line text-paper-dim hover:text-paper'
                        }`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className="mono-label text-[10px] block mb-1.5">your name</label>
                    <input
                      id="c-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-line text-paper text-[13px] font-mono focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="c-from" className="mono-label text-[10px] block mb-1.5">your email</label>
                    <input
                      id="c-from"
                      type="email"
                      value={form.from}
                      onChange={(e) => setForm({ ...form, from: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-line text-paper text-[13px] font-mono focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="c-detail" className="mono-label text-[10px] block mb-1.5">
                    what you need — rough is fine
                  </label>
                  <textarea
                    id="c-detail"
                    rows={5}
                    value={form.detail}
                    onChange={(e) => setForm({ ...form, detail: e.target.value })}
                    placeholder="the problem, roughly what data exists, and any deadline"
                    className="w-full px-3 py-2.5 rounded-lg bg-ink-900 border border-line text-paper text-[13px] font-mono focus:border-accent transition-colors resize-none placeholder:text-paper-faint"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-paper text-ink-900 font-mono text-[13px] font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>open this in my email app</span>
                </button>

                <p className="font-mono text-[10.5px] text-paper-mut leading-relaxed">
                  This page has no backend, so nothing is submitted or stored here —
                  the button just drafts the message in your own mail client, and you
                  send it. If you'd rather not, the address above works fine.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
