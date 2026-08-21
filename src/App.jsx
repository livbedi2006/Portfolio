import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Playground from './components/Playground';
import Projects from './components/Projects';
import About from './components/About';
import Build from './components/Build';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-ink-900 text-paper grain">
      <a href="#main" className="skip-link">Skip to content</a>

      <Navbar />

      <main id="main">
        <Hero />
        <Playground />
        <Projects />
        <About />
        <Build />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
