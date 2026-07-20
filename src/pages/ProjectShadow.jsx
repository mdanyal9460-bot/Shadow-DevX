import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import Lenis from '@studio-freight/lenis';

export default function ProjectShadow() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-[#050010] text-white selection:bg-[#6a0dad] overflow-hidden relative">
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0 touch-none">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={['#050010']} />
          <ScrollControls pages={3} damping={0.25}>
            {/* HTML Foreground Overlay with Glassmorphism */}
            <Scroll html style={{ width: '100vw' }}>
              <div className="w-full relative">
                
                {/* Section 1 */}
                <section className="w-full h-screen flex flex-col justify-center items-center p-6 pointer-events-none">
                  <div className="bg-black/20 backdrop-blur-2xl border border-[#6a0dad]/30 p-10 md:p-16 rounded-3xl text-center shadow-[0_0_50px_rgba(106,13,173,0.15)] max-w-4xl pointer-events-auto">
                    <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-[#6a0dad]">
                      I Am Atomic.
                    </h1>
                    <p className="text-lg md:text-xl font-light tracking-widest text-white/70 uppercase">
                      The Eminence in Shadow
                    </p>
                  </div>
                </section>

                {/* Section 2 */}
                <section className="w-full h-screen flex flex-col justify-center items-center p-6 pointer-events-none">
                  <div className="bg-black/30 backdrop-blur-2xl border border-[#9b5de5]/30 p-10 md:p-16 rounded-3xl text-center shadow-[0_0_60px_rgba(155,93,229,0.2)] max-w-4xl pointer-events-auto">
                    <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6 text-white drop-shadow-[0_0_15px_rgba(155,93,229,0.5)]">
                      Absolute Power
                    </h2>
                    <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
                      Hidden in the shadows, controlling the strings of the world. 
                      This immersive experience is driven by pure WebGL and native smooth scrolling.
                    </p>
                  </div>
                </section>

                {/* Section 3 */}
                <section className="w-full h-screen flex flex-col justify-center items-center p-6 pointer-events-none">
                  <div className="bg-[#050010]/60 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-3xl text-center shadow-[0_0_80px_rgba(0,0,0,0.5)] max-w-4xl pointer-events-auto">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 text-white">
                      The End
                    </h2>
                    <p className="text-sm md:text-md text-white/40 tracking-[0.3em] uppercase">
                      More to come.
                    </p>
                  </div>
                </section>

              </div>
            </Scroll>
          </ScrollControls>
        </Canvas>
      </div>
    </div>
  );
}
