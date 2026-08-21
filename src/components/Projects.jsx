import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ExternalLink, Github, Sparkles } from 'lucide-react';

const projectsData = [
  {
    id: 1,
    name: 'AI Exam Invigilation System',
    description: 'Real-time automated proctoring application utilizing computer vision, pose estimation, and face tracking algorithms.',
    category: 'ai',
    language: 'Python / OpenCV',
    stars: 12,
    repoUrl: 'https://github.com/livbedi2006'
  },
  {
    id: 2,
    name: 'NLP Plagiarism Detector',
    description: 'Advanced semantic text comparison tool leveraging TF-IDF vectorization and cosine similarity metrics.',
    category: 'ai',
    language: 'Python / NLTK',
    stars: 18,
    repoUrl: 'https://github.com/livbedi2006'
  },
  {
    id: 3,
    name: 'Fintech Portfolio Web App',
    description: 'Ultra-responsive dark grain private-banking UI featuring interactive dashboard previews, metrics, and radar charts.',
    category: 'web',
    language: 'JavaScript / CSS3',
    stars: 24,
    repoUrl: 'https://github.com/livbedi2006'
  },
  {
    id: 4,
    name: 'Model Drift Monitoring Suite',
    description: 'Lightweight Python utility for tracking concept drift and dataset shift in real-time machine learning pipelines.',
    category: 'tools',
    language: 'Python / Scikit-Learn',
    stars: 8,
    repoUrl: 'https://github.com/livbedi2006'
  },
  {
    id: 5,
    name: 'Neural Network Visualizer',
    description: 'Interactive HTML5 canvas tool to visualize layer weights, activations, and backpropagation gradients.',
    category: 'web',
    language: 'JavaScript / HTML5',
    stars: 15,
    repoUrl: 'https://github.com/livbedi2006'
  },
  {
    id: 6,
    name: 'Automated Data Pipeline Engine',
    description: 'High-throughput asynchronous ETL pipeline generator designed for Machine Learning feature engineering.',
    category: 'tools',
    language: 'Python / GCP',
    stars: 10,
    repoUrl: 'https://github.com/livbedi2006'
  }
];

const categories = [
  { id: 'ai', label: 'AI & ML' },
  { id: 'web', label: 'Web Systems' },
  { id: 'tools', label: 'Tools' }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('ai');

  const filteredProjects = projectsData.filter((p) => p.category === activeCategory);

  return (
    <section className="py-24 relative" id="projects">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-mono font-semibold tracking-widest text-purple-400 uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 inline-block mb-3">
            CASE STUDIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">GitHub Repositories</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Explore open-source engineering systems crafted with clean code, modular architecture, and high performance.
          </p>
        </motion.div>

        {/* Filter Category Bar with Framer Motion layoutId sliding pill */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-full border border-white/10 backdrop-blur-xl">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="relative px-5 py-2 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg shadow-purple-600/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid with Framer Motion AnimatePresence */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/40 transition-colors shadow-xl overflow-hidden"
              >
                <div>
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 uppercase">
                      {project.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{project.stars}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xs font-mono text-slate-300">
                      {project.language}
                    </span>

                    <motion.a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 text-xs"
                    >
                      <span>View Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View Repos Button */}
        <div className="text-center">
          <motion.a
            href="https://github.com/livbedi2006?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.05] border border-white/15 text-white font-medium text-xs hover:bg-white/10 transition-all"
          >
            <Github className="w-4 h-4" />
            <span>View all repositories on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </div>
      </div>
    </section>
  );
}
