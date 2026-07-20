import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import DimensionPortal from '../components/DimensionPortal';

export default function ProjectDimension() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden m-0 p-0 absolute inset-0 touch-none">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-[#00ffa6] tracking-widest text-sm uppercase">
          Loading Dimension...
        </div>
      }>
        <Canvas 
          camera={{ position: [0, 0, 18], fov: 50 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
        >
          {/* Ensure DimensionPortal blasts after a slight delay */}
          <DimensionPortal isOpen={isOpen} />
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.1} mipmapBlur intensity={3.0} />
          </EffectComposer>
        </Canvas>
      </Suspense>
    </div>
  );
}
