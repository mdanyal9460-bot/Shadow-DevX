import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Float, Sparkles, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

function ShadowScene() {
  const scroll = useScroll();
  const coreRef = useRef();
  const materialRef = useRef();

  useFrame((state, delta) => {
    if (!coreRef.current || !materialRef.current) return;
    
    // Read the scroll offset directly from ScrollControls (0 to 1)
    const offset = scroll.offset;

    // Define initial targets
    let targetX = 0;
    let targetScale = 1;
    let targetColor = new THREE.Color("#6a0dad");
    let spinSpeed = 1.0;

    // Interpolation Logic Based on Scroll Offset
    if (offset < 0.3) {
      // Transitioning out of Section 1 to Section 2
      const progress = offset / 0.3;
      targetX = THREE.MathUtils.lerp(0, 2.5, progress);
      targetScale = THREE.MathUtils.lerp(1, 1.5, progress);
      targetColor.lerpColors(new THREE.Color("#6a0dad"), new THREE.Color("#6a0dad"), progress);
      spinSpeed = THREE.MathUtils.lerp(1.0, 2.0, progress);
    } else if (offset >= 0.3 && offset < 0.7) {
      // Transitioning from Section 2 to Section 3
      const progress = (offset - 0.3) / 0.4;
      targetX = THREE.MathUtils.lerp(2.5, -2.5, progress);
      targetScale = THREE.MathUtils.lerp(1.5, 2.5, progress);
      targetColor.lerpColors(new THREE.Color("#6a0dad"), new THREE.Color("#ff0000"), progress);
      spinSpeed = THREE.MathUtils.lerp(2.0, 5.0, progress);
    } else {
      // Locked in Section 3
      targetX = -2.5;
      targetScale = 2.5;
      targetColor.set("#ff0000");
      spinSpeed = 5.0;
    }

    // Apply Smooth Lerping to Position and Scale
    coreRef.current.position.x = THREE.MathUtils.lerp(coreRef.current.position.x, targetX, 10 * delta);
    const currentScale = THREE.MathUtils.lerp(coreRef.current.scale.x, targetScale, 10 * delta);
    coreRef.current.scale.setScalar(currentScale);
    
    // Apply Rotation Math (Spin gets more aggressive as you scroll)
    coreRef.current.rotation.x += delta * (0.5 * spinSpeed);
    coreRef.current.rotation.y += delta * (0.8 * spinSpeed);

    // Apply Smooth Color Lerping to the Emissive property
    materialRef.current.emissive.lerp(targetColor, 10 * delta);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={3} color="#6a0dad" />
      
      {/* Immersive Dark Particles */}
      <Sparkles count={1000} scale={20} color="#9b5de5" size={2} speed={0.5} opacity={0.6} />
      
      {/* Floating Atomic Core */}
      <Float speed={3} rotationIntensity={2} floatIntensity={2}>
        <Icosahedron ref={coreRef} args={[1, 0]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            ref={materialRef}
            color="#050010" 
            emissive="#6a0dad" 
            emissiveIntensity={1.5} 
            roughness={0.1} 
            metalness={0.9} 
            wireframe={false} 
          />
        </Icosahedron>
      </Float>
    </>
  );
}

export default function ProjectShadow() {
  useEffect(() => {
    // Premium Lenis Smooth Scroll Initialization
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
      {/* 1. The Premium HTML Overlay */}
      <div className="relative z-10 min-h-[300vh] flex flex-col w-full pointer-events-auto">
        
        {/* Section 1: Intro */}
        <section className="w-full h-screen flex flex-col justify-center items-center p-6">
          <div className="bg-black/30 backdrop-blur-3xl border border-[#6a0dad]/40 shadow-[0_0_50px_rgba(106,13,173,0.3)] rounded-3xl p-12 text-center max-w-5xl">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-600">
              I Am Atomic
            </h1>
            <p className="text-xl md:text-3xl font-light tracking-[0.3em] text-white/70 uppercase">
              The Eminence in Shadow
            </p>
          </div>
        </section>

        {/* Section 2: Power */}
        <section className="w-full h-screen flex flex-col justify-center items-center p-6">
          <div className="bg-black/30 backdrop-blur-3xl border border-[#6a0dad]/40 shadow-[0_0_50px_rgba(106,13,173,0.3)] rounded-3xl p-12 text-center max-w-5xl">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 text-white drop-shadow-[0_0_20px_rgba(106,13,173,0.8)]">
              Absolute Power
            </h2>
            <p className="text-lg md:text-2xl text-white/60 font-light leading-relaxed tracking-widest uppercase">
              Hidden in the shadows, controlling the strings of the world.
            </p>
          </div>
        </section>

        {/* Section 3: Protocol */}
        <section className="w-full h-screen flex flex-col justify-center items-center p-6">
          <div className="bg-black/30 backdrop-blur-3xl border border-[#6a0dad]/40 shadow-[0_0_50px_rgba(106,13,173,0.3)] rounded-3xl p-12 text-center max-w-5xl">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-[0.2em] mb-4 text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]">
              Alpha Protocol
            </h2>
            <p className="text-md md:text-xl text-white/50 tracking-[0.4em] uppercase mt-4">
              The End of the Beginning.
            </p>
          </div>
        </section>

      </div>

      {/* 2. The Fixed 3D Canvas */}
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
