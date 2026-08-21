import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BentoGrid from './components/BentoGrid';
import Projects from './components/Projects';
import Services from './components/Services';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans selection:bg-purple-500 selection:text-white relative">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      <main>
        <Hero onOpenModal={() => setIsModalOpen(true)} />
        <BentoGrid />
        <Projects />
        <Services onOpenModal={() => setIsModalOpen(true)} />
      </main>

      <Footer />

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
