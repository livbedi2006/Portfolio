import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Code, Cpu, Database, Award, CheckCircle, TrendingUp, Layers, Terminal } from 'lucide-react';

function BentoCard({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-200, 200], [-8, 8]), { stiffness: 300, damping: 20 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);

    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      className={`spotlight-card relative bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl hover:border-purple-500/40 transition-colors overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function BentoGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-24 relative" id="architecture">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 inline-block mb-3">
            TECHNICAL ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Scale & Precision</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Exploring core competencies, neural model precision, and high-trust engineering systems.
          </p>
        </motion.div>

        {/* Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
        >
          {/* Card 1: Bio & Credentials */}
          <motion.div variants={itemVariants} className="md:col-span-8">
            <BentoCard className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">ABOUT & CREDENTIALS</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Computer Science & AI Specialist
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Passionate about designing real-time AI invigilation engines, NLP plagiarism filters, and ultra-responsive fintech user interfaces. Focused on latency optimization, modular design, and robust deployment.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {['Chandigarh University', 'Computer Science Eng', 'AI/ML Specialist'].map((badge) => (
                    <span key={badge} className="text-xs font-mono px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-purple-300">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center">
                <div>
                  <div className="stat-num text-2xl font-extrabold text-white mb-1">10+</div>
                  <div className="text-[11px] font-mono text-slate-400">Projects Built</div>
                </div>
                <div>
                  <div className="stat-num text-2xl font-extrabold text-white mb-1">99.4%</div>
                  <div className="text-[11px] font-mono text-slate-400">Model Precision</div>
                </div>
                <div>
                  <div className="stat-num text-2xl font-extrabold text-white mb-1">3+ Yrs</div>
                  <div className="text-[11px] font-mono text-slate-400">Coding Exp</div>
                </div>
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 2: Core Stack Matrix */}
          <motion.div variants={itemVariants} className="md:col-span-4">
            <BentoCard className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">STACK MATRIX</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Core Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Java', 'GCP'].map((tag) => (
                    <motion.span
                      key={tag}
                      whileHover={{ scale: 1.08, y: -2 }}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-slate-200 hover:border-purple-400/50 hover:text-purple-300 transition-all cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle className="w-4 h-4" />
                <span>Production Ready Codebase</span>
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 3: Model Drift Monitor */}
          <motion.div variants={itemVariants} className="md:col-span-6">
            <BentoCard>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">AI METRICS</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">LIVE FEED</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Model Drift & Latency Monitor</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Real-time tracking of concept drift and inference latency across edge AI deployments.
              </p>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5 text-slate-300">
                  <span>Inference Speed</span>
                  <span className="text-emerald-400 font-bold">&lt; 15ms</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-black/40 border border-white/5 text-slate-300">
                  <span>Detection Accuracy</span>
                  <span className="text-purple-400 font-bold">99.4%</span>
                </div>
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 4: High-Trust Fintech Design */}
          <motion.div variants={itemVariants} className="md:col-span-6">
            <BentoCard>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">DESIGN PHILOSOPHY</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">UI / UX</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Private-Banking Precision UI</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Dark-grain glassmorphism layouts, subtle micro-animations, and high-trust data visualizations.
              </p>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/20 flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Interactive Motion System</span>
                </span>
                <span className="text-cyan-400">ACTIVE</span>
              </div>
            </BentoCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
