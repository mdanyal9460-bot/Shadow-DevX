import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useForm, ValidationError } from '@formspree/react';
import { motion } from 'framer-motion';

// Lazy load the scene to protect Vercel SSR
const Scene = React.lazy(() => import('./Scene'));

// Magnetic Button Wrapper
function MagneticButton({ children, className, ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// Fade in slide up animation wrapper
function FadeUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ContactForm() {
  const [state, handleSubmit] = useForm("YOUR_FORMSPREE_ID");

  if (state.succeeded) {
      return (
        <FadeUp className="bg-[#1dbf73]/10 border border-[#1dbf73]/50 text-[#1dbf73] p-8 rounded-2xl text-center w-full max-w-md mt-6 shadow-[0_0_20px_rgba(29,191,115,0.2)]">
          <h3 className="text-2xl font-bold mb-2">Message Received!</h3>
          <p className="text-sm">I'll be in touch with you shortly.</p>
        </FadeUp>
      );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md mt-6">
      <FadeUp delay={0.1}>
        <input 
          id="name"
          type="text" 
          name="name" 
          placeholder="Name" 
          required
          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#00ffa6] transition-colors placeholder:text-gray-500"
        />
        <ValidationError prefix="Name" field="name" errors={state.errors} />
      </FadeUp>

      <FadeUp delay={0.2}>
        <input 
          id="email"
          type="email" 
          name="email" 
          placeholder="Email Address" 
          required
          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#00ffa6] transition-colors placeholder:text-gray-500"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </FadeUp>

      <FadeUp delay={0.3}>
        <textarea 
          id="message"
          name="message" 
          placeholder="Project Details" 
          rows="4"
          required
          className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none focus:border-[#00ffa6] transition-colors resize-none placeholder:text-gray-500"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </FadeUp>

      <FadeUp delay={0.4} className="flex flex-col items-center w-full">
        <MagneticButton 
          type="submit" 
          disabled={state.submitting}
          className="mt-2 flex justify-center items-center gap-2 bg-[#1dbf73] text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl hover:scale-105 hover:shadow-[0_0_30px_rgba(29,191,115,0.6)] border border-transparent hover:border-white/50 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed w-full"
        >
          {state.submitting ? 'Initiating Sequence...' : 'Send Message'}
        </MagneticButton>
      </FadeUp>
    </form>
  );
}

export default function App() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative w-full bg-transparent text-white overflow-hidden selection:bg-[#00ffa6] selection:text-black">
      
      {/* 1. FIXED CANVAS WRAPPER: Exact styling requested for ScrollControls */}
      <div 
        className="fixed inset-0 -z-10 bg-black" 
        style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
      >
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-[#00ffa6]">Initializing Core...</div>}>
          <Canvas 
            className="w-full h-full block"
            gl={{ antialias: false, powerPreference: "high-performance", toneMapping: 0 }} 
            dpr={[1, 1.5]} 
            camera={{ position: [0, 0, 5], fov: 45 }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      {/* DOM Flow Content */}
      {/* pointer-events-none added to sections so they don't block the ScrollControls canvas wrapper */}
      <section className="relative w-full min-h-screen flex flex-col justify-between p-6 md:p-10 pointer-events-none">
        <header className="flex justify-between items-center pointer-events-auto">
          <span className="font-bold tracking-widest text-sm uppercase">Shadow DevX</span>
          <span className="font-bold tracking-widest text-sm uppercase cursor-pointer">MENU</span>
        </header>

        <main className="w-full max-w-xl flex flex-col gap-4 md:gap-6 pointer-events-auto bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10">
          <FadeUp>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase">
              Shadow<br />
              <span className="text-cyan-400">DevX.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-gray-400 text-xs md:text-sm">
              Zero junk UI. Every element serves a purpose. I build premium, fluid landing pages that convert traffic into high-end clients.
            </p>
          </FadeUp>
          <FadeUp delay={0.2} className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2">
            <MagneticButton className="bg-white text-black font-semibold px-6 py-3 rounded-full text-sm md:text-base border border-transparent hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-colors">
              Start Project
            </MagneticButton>
            <MagneticButton className="border border-white/20 font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors text-sm md:text-base">
              Explore Work
            </MagneticButton>
          </FadeUp>
        </main>
        <div></div>
      </section>

      <section className="relative w-full min-h-screen flex flex-col justify-center items-end p-6 md:p-10 md:pr-24 pointer-events-none">
        <div className="w-full max-w-xl flex flex-col gap-4 md:gap-6 pointer-events-auto bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 text-left md:text-right">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase">
              My <span className="text-[#5b00ff]">Story.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-gray-400 text-xs md:text-sm md:ml-auto">
              I am a Lead Creative Developer obsessed with the intersection of design and engineering. I specialize in crafting high-end, WebGL-powered digital experiences that push the boundaries of what is possible in the browser. Every pixel has a purpose.
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="relative w-full min-h-screen flex flex-col justify-center items-start p-6 md:p-10 pointer-events-none">
        <div className="w-full max-w-xl flex flex-col gap-4 md:gap-6 pointer-events-auto bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/10 text-left">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase">
              Selected <br/><span className="text-[#00ffa6]">Works.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-gray-400 text-xs md:text-sm">
              Award-winning digital experiences crafted for industry leaders. We blend cutting-edge WebGL with flawless typography to create immersive digital products.
            </p>
          </FadeUp>
          <FadeUp delay={0.2} className="flex justify-start gap-4 mt-2 md:mt-4">
            <MagneticButton className="bg-[#00ffa6] text-black font-semibold px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,255,166,0.2)] border border-transparent hover:border-white/50 hover:shadow-[0_0_30px_rgba(0,255,166,0.5)] transition-colors text-sm md:text-base">
              View Case Studies
            </MagneticButton>
          </FadeUp>
        </div>
      </section>

      <section className="relative w-full min-h-screen flex flex-col justify-center items-center p-6 md:p-10 pointer-events-none pb-24">
        <div className="w-full max-w-2xl text-center flex flex-col items-center pointer-events-auto bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10">
          <FadeUp>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ffa6] to-[#1dbf73]">Talk.</span>
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-gray-400 text-xs md:text-base max-w-md mx-auto mt-4">
              Ready to elevate your digital presence? Send a message directly to my inbox.
            </p>
          </FadeUp>
          
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
