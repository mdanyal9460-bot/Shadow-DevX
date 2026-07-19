import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';

const Scene = React.lazy(() => import('./Scene'));

function MyStory() {
  return (
    <section className="relative w-full py-24 flex flex-col justify-center items-center p-6 md:p-16 z-10 pointer-events-none">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Developer Avatar */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center md:justify-end pointer-events-auto"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] relative">
            <div className="w-48 h-48 rounded-full bg-slate-800 animate-pulse border-4 border-[#00ffa6] flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(0,255,166,0.2)]">
              {/* Neon abstract tech icon placeholder */}
              <svg className="w-20 h-20 text-[#00ffa6] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Right: Narrative */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col space-y-6 text-center md:text-left pointer-events-auto"
        >
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,166,0.3)]">
            The <span className="text-[#00ffa6]">Architect.</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed font-light font-sans">
            I am the driving force behind <span className="text-white font-bold">ShadowDev_X</span>, a specialized digital studio dedicated to merging high-end 3D environments with ultra-responsive web interfaces.
          </p>
          <p className="text-white/70 text-lg leading-relaxed font-light font-sans">
            My work focuses on the intersection of WebGL performance and immersive user experience. I don't just build websites; I engineer digital platforms that are optimized for speed, scalability, and cinematic impact.
          </p>
          <p className="text-white/70 text-lg leading-relaxed font-light font-sans">
            With a relentless focus on clean code and interactive design, I am redefining what high-performance frontend engineering looks like.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  const projects = [
    { 
      title: "ShadowDev Legacy Portfolio", 
      desc: "My initial frontend showcase featuring custom layout styles and responsive web engineering.",
      link: "https://shadowdev-portfolio.vercel.app/" 
    },
    { 
      title: "E-Commerce WebGL", 
      desc: "High-performance 3D product configurator built with Next.js and Tailwind.",
      link: "#" 
    }
  ];

  return (
    <section className="relative w-full py-24 flex flex-col justify-center items-center p-6 md:p-16 z-10 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl pointer-events-auto"
      >
        <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter mb-12 text-center drop-shadow-[0_0_20px_rgba(0,255,166,0.3)]">
          Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffa6] to-[#00b8ff]">Projects.</span>
        </h2>
        
        {/* Adjusted grid logic for 2 items to center cleanly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {projects.map((proj, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95, rotate: [0, -1, 1, -1, 0], transition: { duration: 0.2 } }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="relative flex flex-col justify-between p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:border-[#00ffa6]/50 hover:bg-white/10 transition-colors duration-300 overflow-hidden cursor-pointer group"
              onClick={() => window.open(proj.link, "_blank", "noopener,noreferrer")}
            >
              <div className="relative z-10 pointer-events-none">
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-wide text-white group-hover:text-[#00ffa6] transition-colors">{proj.title}</h3>
                <p className="text-sm text-white/70 tracking-wide font-light leading-relaxed mb-8">{proj.desc}</p>
              </div>
              <div className="relative z-10 w-full text-center py-3 px-4 bg-transparent border border-white/30 rounded-full text-xs font-bold uppercase tracking-widest text-white group-hover:bg-[#00ffa6] group-hover:text-black group-hover:border-transparent transition-all duration-300 pointer-events-none">
                View Project
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function FiverrCTA() {
  return (
    <section className="relative w-full py-24 flex flex-col justify-center items-center p-6 md:p-16 z-10 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:border-transparent hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-[#1dbf73]/10 transition-all duration-500 pointer-events-auto flex flex-col items-center text-center group"
      >
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Got an Idea? <span className="text-[#1dbf73] drop-shadow-[0_0_15px_rgba(29,191,115,0.4)]">Let's Build It Live.</span>
        </h2>
        <p className="text-white/70 text-lg leading-relaxed font-light font-sans mb-8 max-w-2xl">
          Available for custom 3D web experiences, advanced React apps, and premium frontend engineering on Fiverr.
        </p>
        
        <motion.a 
          href="https://fiverr.com/s/8z1DWKV"
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.95, rotate: [0, -1, 1, -1, 0] }}
          className="inline-block px-10 py-5 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(29,191,115,0.4)] hover:shadow-[0_0_30px_rgba(29,191,115,0.7)] hover:-translate-y-1 transition-all duration-300"
        >
          Hire Me on Fiverr
        </motion.a>
      </motion.div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="relative w-full pt-24 pb-32 flex flex-col justify-center items-center p-6 md:p-16 z-10 pointer-events-none bg-black/40 backdrop-blur-md border-t border-white/10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center pointer-events-auto"
      >
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          Connect With <span className="text-[#00ffa6]">Me.</span>
        </h2>
        <p className="text-white/60 mb-8 max-w-md tracking-wide font-light leading-relaxed">
          Ready to build something amazing? Let's discuss your next project over a quick chat.
        </p>
        
        <a 
          href="https://wa.me/923000253932" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(22,163,74,0.6)] hover:-translate-y-1"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
          </svg>
          Chat on WhatsApp (+92 300 0253932)
        </a>
      </motion.div>
    </section>
  );
}

export default function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <div className="relative w-full bg-black text-white selection:bg-[#00ffa6] selection:text-black font-sans overflow-x-hidden touch-pan-y">
      
      {/* 3D WebGL Background Layer */}
      <div className="fixed inset-0 z-0 touch-none pointer-events-auto">
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
      <section className="relative w-full min-h-[100dvh] flex flex-col justify-between p-6 md:p-16 z-10 pointer-events-none">
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

        <main className="flex flex-col justify-center items-center text-center mt-auto mb-auto">
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

      {/* Narrative Section */}
      <MyStory />

      {/* Featured Projects Section */}
      <ProjectsSection />

      {/* Fiverr CTA Section */}
      <FiverrCTA />

      {/* Connect With Me Section */}
      <ContactSection />

    </div>
  );
}
