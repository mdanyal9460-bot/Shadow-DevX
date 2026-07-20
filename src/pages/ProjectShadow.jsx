import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Float, Sparkles, MeshTransmissionMaterial, Icosahedron } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

function ShadowScene() {
  const scroll = useScroll();
  const coreRef = useRef();
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current || !materialRef.current) return;
    
    // scroll.offset goes from 0.0 (top) to 1.0 (bottom)
    const offset = scroll.offset;

    // Define target states based on scroll section
    let targetX = 0;
    let targetScale = 1;
    let targetRotZ = 0;
    let targetColor = new THREE.Color("#050010");

    if (offset < 0.3) {
      // Transitioning out of Section 1 to Section 2
      const progress = offset / 0.3;
      targetX = THREE.MathUtils.lerp(0, 2, progress);
      targetScale = THREE.MathUtils.lerp(1, 1.5, progress);
      targetRotZ = THREE.MathUtils.lerp(0, Math.PI / 4, progress);
      targetColor.lerpColors(new THREE.Color("#050010"), new THREE.Color("#2a0a4a"), progress);
    } else if (offset >= 0.3 && offset < 0.7) {
      // Transitioning from Section 2 to Section 3
      const progress = (offset - 0.3) / 0.4;
      targetX = THREE.MathUtils.lerp(2, -2.5, progress);
      targetScale = THREE.MathUtils.lerp(1.5, 2.5, progress);
      targetRotZ = THREE.MathUtils.lerp(Math.PI / 4, -Math.PI, progress);
      targetColor.lerpColors(new THREE.Color("#2a0a4a"), new THREE.Color("#ff0000"), progress); // Dark/Neon red
    } else {
      // Locked at Section 3 (Alpha Protocol)
      targetX = -2.5;
      targetScale = 2.5;
      targetRotZ = -Math.PI;
      targetColor.set("#ff0000");
    }

    // Smoothly interpolate current values to target values
    coreRef.current.position.x = THREE.MathUtils.lerp(coreRef.current.position.x, targetX, 10 * delta);
    const currentScale = THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale, 10 * delta);
    coreRef.current.scale.setScalar(currentScale);
    coreRef.current.rotation.z = THREE.MathUtils.lerp(coreRef.current.rotation.z, targetRotZ, 10 * delta);
    
    // Continuous aggressive spin layered on top
    coreRef.current.rotation.x += delta * (0.5 + offset * 3.0);
    coreRef.current.rotation.y += delta * (0.3 + offset * 4.0);
    
    // Smoothly interpolate color
    materialRef.current.color.lerp(targetColor, 10 * delta);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#6a0dad" />
      
      {/* Dark Particles Vibe */}
      <Sparkles count={800} scale={15} color="#9b5de5" size={2} speed={0.4} opacity={0.5} />
      
      {/* Central Atomic Core */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <Icosahedron ref={coreRef} args={[1, 0]} position={[0, 0, 0]}>
          <MeshTransmissionMaterial 
            ref={materialRef}
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={1}
            anisotropy={0.3}
            distortion={0.8}
            distortionScale={0.5}
            temporalDistortion={0.2}
            color="#050010"
          />
        </Icosahedron>
      </Float>
      
      {/* Cinematic Post Processing */}
      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur luminanceThreshold={0.1} intensity={1.5} />
      </EffectComposer>
    </>
  );
}

export default function ProjectShadow() {
  useEffect(() => {
    // Initialize Lenis Smooth Scroll
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
    <div className="relative bg-[#050010] text-white selection:bg-[#6a0dad] w-full">
      {/* Step 1: The Scrollable HTML Overlay */}
      <div className="relative z-10 min-h-[300vh] flex flex-col w-full pointer-events-auto">
        
        {/* Section 1: Intro */}
        <section className="w-full h-screen flex flex-col justify-center items-center p-6">
          <div className="bg-black/20 backdrop-blur-2xl border border-[#6a0dad]/30 p-10 md:p-16 rounded-3xl text-center shadow-[0_0_50px_rgba(106,13,173,0.15)] max-w-4xl">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-[#6a0dad]">
              I Am Atomic.
            </h1>
            <p className="text-lg md:text-xl font-light tracking-widest text-white/70 uppercase">
              The Eminence in Shadow
            </p>
          </div>
        </section>

        {/* Section 2: The Garden */}
        <section className="w-full h-screen flex flex-col justify-center items-center p-6">
          <div className="bg-black/30 backdrop-blur-2xl border border-[#9b5de5]/30 p-10 md:p-16 rounded-3xl text-center shadow-[0_0_60px_rgba(155,93,229,0.2)] max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6 text-white drop-shadow-[0_0_15px_rgba(155,93,229,0.5)]">
              Absolute Power
            </h2>
            <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
              Hidden in the shadows, controlling the strings of the world. 
              This immersive experience is driven by pure WebGL and native smooth scrolling.
            </p>
          </div>
        </section>

        {/* Section 3: Alpha */}
        <section className="w-full h-screen flex flex-col justify-center items-center p-6">
          <div className="bg-[#050010]/60 backdrop-blur-3xl border border-white/10 p-10 md:p-16 rounded-3xl text-center shadow-[0_0_80px_rgba(0,0,0,0.5)] max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 text-white">
              Alpha Protocol
            </h2>
            <p className="text-sm md:text-md text-white/40 tracking-[0.3em] uppercase">
              More to come.
            </p>
          </div>
        </section>

      </div>

      {/* Step 2: The Fixed 3D Canvas */}
      <div className="fixed top-0 left-0 w-full h-full z-[-1] pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={['#050010']} />
          <ScrollControls pages={3} damping={0.1}>
            <ShadowScene />
          </ScrollControls>
        </Canvas>
      </div>
    </div>
  );
}
