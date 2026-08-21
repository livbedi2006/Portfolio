import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { init3DHero } from '../../hero-3d.js';
import { initTextParticles, getTextParticleEngine } from '../../hero-text-particles.js';
import { ArrowRight, Terminal, Cpu, Zap, Activity } from 'lucide-react';

export default function Hero({ onOpenModal }) {
  const [activePreset, setActivePreset] = useState('Livjot');

  useEffect(() => {
    init3DHero();
    initTextParticles();
  }, []);

  const handlePresetChange = (presetName, lines) => {
    setActivePreset(presetName);
    const engine = getTextParticleEngine();
    if (engine && engine.setText) {
      engine.setText(lines);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden" id="home">
      {/* 3D Canvas Background */}
      <div id="hero3d-container" className="absolute inset-0 z-0 pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Hero Copy */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Ticker Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>MANAGING 10+ AI & FULL-STACK PROJECTS</span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Clarity, across every{' '}
              <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                system
              </span>{' '}
              you build.
            </motion.h1>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Livjot Singh delivers real-time AI/ML models, NLP pipelines, and high-performance web products — combining private-banking precision with high-trust engineering.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-12">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 rounded-full bg-white text-slate-950 font-semibold text-sm shadow-xl shadow-white/10 hover:shadow-purple-500/20 transition-all flex items-center gap-2 group"
              >
                <span>Request access</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>

              <motion.button
                onClick={onOpenModal}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                className="px-7 py-3.5 rounded-full bg-white/[0.05] border border-white/15 text-white font-semibold text-sm hover:bg-white/10 hover:border-white/25 transition-all"
              >
                Book a demo
              </motion.button>
            </motion.div>

            {/* Trust Stack */}
            <motion.div variants={itemVariants} className="pt-6 border-t border-white/10 w-full">
              <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase block mb-3">
                TRUSTED & POWERED BY TECH STACK AT
              </span>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                {['TensorFlow', 'PyTorch', 'Python', 'React', 'TypeScript', 'GCP'].map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ scale: 1.1, color: '#c4b5fd' }}
                    className="cursor-default px-2.5 py-1 rounded bg-white/[0.03] border border-white/5"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column Interactive 3D Glass Panel with Text Particles */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-[580px] bg-slate-950/70 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl shadow-purple-950/40 group overflow-hidden">
              {/* Top Controls */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  <span className="font-mono text-xs font-bold text-white tracking-widest">NEURAL FIELD</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    60 FPS
                  </span>
                </div>

                {/* Presets */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/10">
                  {[
                    { id: 'Livjot', lines: ['LIVJOT', 'SINGH'] },
                    { id: 'AI / ML', lines: ['AI / ML', 'ENGINEER'] },
                    { id: 'Systems', lines: ['NEURAL', 'SYSTEMS'] }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetChange(preset.id, preset.lines)}
                      className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                        activePreset === preset.id
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Particle Canvas Viewport */}
              <div className="relative h-[360px] flex items-center justify-center rounded-2xl bg-black/30 overflow-hidden border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-transparent to-cyan-500/10 pointer-events-none" />
                <canvas id="textParticleCanvas" className="w-full h-full block relative z-10" />
              </div>

              {/* Glass Card Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span>SPRING DISTORTION 0.06 ACTIVE</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>HOVER TO DISTORT FIELD</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
