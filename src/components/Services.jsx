import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, Wrench, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Cpu,
    title: 'AI/ML Engineering',
    tag: 'PRODUCTION MODELS',
    description: 'Custom computer vision models, pose estimation, face tracking, and TF-IDF/Cosine Similarity NLP plagiarism platforms.',
    features: ['Computer Vision & OpenCV', 'Pose & Face Tracking', 'NLP & Vector Embeddings', 'Model Drift Tracking']
  },
  {
    icon: Globe,
    title: 'Full-Stack Web Systems',
    tag: 'HIGH-PERFORMANCE UI',
    description: 'Ultra-responsive dark grain glassmorphism interfaces, fintech banking dashboards, and Three.js 3D web graphics.',
    features: ['React & Next.js Systems', 'Three.js & Canvas Motion', 'Tailwind & Modern CSS', 'REST & GraphQL APIs']
  },
  {
    icon: Wrench,
    title: 'Tooling & Data Pipelines',
    tag: 'AUTOMATION & ETL',
    description: 'Asynchronous high-throughput ETL data generators, Python developer utilities, and cloud ML deployment workflows.',
    features: ['ETL Pipeline Engines', 'GCP & Cloud Workflows', 'Developer CLI Tooling', 'CI/CD & Docker Build']
  }
];

export default function Services({ onOpenModal }) {
  return (
    <section className="py-24 relative" id="services">
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
            SERVICES & CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">Capabilities</span> & Solutions
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            End-to-end technical execution from neural model development to scalable web application delivery.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="spotlight-card relative bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-purple-500/40 transition-colors shadow-2xl overflow-hidden group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg shadow-purple-500/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 uppercase">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  onClick={onOpenModal}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white font-mono text-xs font-semibold hover:bg-purple-600 hover:border-purple-500 transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span>Request Capability</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
