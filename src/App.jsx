import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';

const Scene = React.lazy(() => import('./Scene'));

function ProjectsSection() {
  const projects = [
    { title: "Neon Cyberpunk UI", stack: "React • R3F • GSAP" },
    { title: "E-Commerce WebGL", stack: "Next.js • Three.js • Tailwind" },
    { title: "Awwwards Portfolio", stack: "Vite • Framer Motion • WebGL" }
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center items-center p-6 md:p-16 z-10 pointer-events-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl"
      >
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 text-center drop-shadow-[0_0_20px_rgba(0,255,166,0.3)]">
          Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffa6] to-[#00b8ff]">Works.</span>
        </h2>
        
        {/* Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="group flex flex-col justify-between p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:border-[#00ffa6]/50 hover:bg-white/10 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            >
              <div>
                <h3 className="text-2xl font-bold mb-2 uppercase tracking-wide group-hover:text-[#00ffa6] transition-colors">{proj.title}</h3>
                <p className="text-sm text-white/50 tracking-widest font-mono mb-8">{proj.stack}</p>
              </div>
              <button className="w-full py-3 px-4 bg-transparent border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#00ffa6] hover:text-black hover:border-transparent transition-all duration-300">
                Hire Me
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <div className="relative w-full bg-black text-white selection:bg-[#00ffa6] selection:text-black">
      
      {/* 3D WebGL Background Layer - Fixed to the back with touch-none for stable mobile scrolling */}
      <div className="fixed inset-0 z-0 touch-none">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-[#00ffa6] tracking-widest text-sm uppercase">
            Initializing Core...
          </div>
        }>
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-between p-6 md:p-16 z-10 pointer-events-none">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="flex justify-between items-center w-full pointer-events-auto"
        >
          <div className="text-sm font-bold tracking-[0.2em] text-white/80">SDX_</div>
          <div className="text-xs font-medium tracking-[0.3em] uppercase border border-white/20 px-4 py-2 rounded-full backdrop-blur-md bg-black/20">
            Creative Dev
          </div>
        </motion.header>

        <main className="flex flex-col justify-center items-center text-center pointer-events-none mt-auto mb-auto">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase mb-4 drop-shadow-[0_0_30px_rgba(0,255,166,0.2)]"
          >
            Shadow<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffa6] to-[#00b8ff]">Dev_X</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1 }}
            className="text-sm md:text-lg font-light tracking-[0.4em] text-white/60 uppercase"
          >
            Beyond Horizons
          </motion.p>
        </main>

        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
          className="flex justify-center items-center w-full pointer-events-auto"
        >
          <button 
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-white/20 hover:border-[#00ffa6]/50 transition-colors duration-500"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <div className="absolute inset-0 bg-[#00ffa6]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span className="relative text-xs md:text-sm font-bold tracking-[0.2em] text-white uppercase group-hover:text-[#00ffa6] transition-colors duration-500">
              Scroll To Explore
            </span>
          </button>
        </motion.footer>
      </section>

      {/* Modern Glassmorphism Projects Section */}
      <ProjectsSection />

    </div>
  );
}
