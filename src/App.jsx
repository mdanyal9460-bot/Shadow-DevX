import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';

// Lazy load the scene to protect Vercel SSR and ensure stability
const Scene = React.lazy(() => import('./Scene'));

export default function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white">
      
      {/* 3D WebGL Background Layer */}
      <div className="absolute inset-0 z-0">
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

      {/* Modern UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-16">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          className="flex justify-between items-center w-full"
        >
          <div className="text-sm font-bold tracking-[0.2em] text-white/80">SDX_</div>
          <div className="text-xs font-medium tracking-[0.3em] uppercase border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
            Creative Dev
          </div>
        </motion.header>

        {/* Center Hero Typography */}
        <main className="flex flex-col justify-center items-center text-center">
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

        {/* Footer / Call to Action */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
          className="flex justify-center items-center w-full"
        >
          <button className="pointer-events-auto group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-white/20 hover:border-[#00ffa6]/50 transition-colors duration-500">
            <div className="absolute inset-0 bg-[#00ffa6]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            <span className="relative text-xs md:text-sm font-bold tracking-[0.2em] text-white uppercase group-hover:text-[#00ffa6] transition-colors duration-500">
              Enter The Void
            </span>
          </button>
        </motion.footer>

      </div>
    </div>
  );
}
