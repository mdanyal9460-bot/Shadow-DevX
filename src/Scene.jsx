import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, PerformanceMonitor, Html } from '@react-three/drei';
import * as THREE from 'three';

// Mobile detection for scale optimizations
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

function LoadingScreen() {
  return (
    <Html center>
      <div className="text-[#00ffa6] text-sm md:text-base tracking-[0.2em] uppercase font-bold whitespace-nowrap bg-black/50 p-4 rounded-xl backdrop-blur-md">
        Loading Space...
      </div>
    </Html>
  );
}

function SpaceDust() {
  const starsRef = useRef();

  useEffect(() => {
    if (starsRef.current) {
      starsRef.current.material.transparent = true;
      starsRef.current.material.opacity = 0.08;
      starsRef.current.material.depthWrite = false;
    }
  }, []);

  return (
    <Stars 
      ref={starsRef}
      radius={100} 
      depth={50} 
      count={isMobile ? 2100 : 4900} 
      factor={2} 
      saturation={0} 
      fade 
      speed={0.5} 
    />
  );
}

function InteractiveEarth() {
  const groupRef = useRef();
  
  // Mobile scale dynamically dropped to 0.75 for perfect fit
  const earthScale = isMobile ? 0.75 : 1;
  // Mobile touch & performance optimization: dynamically downgrade geometry to 32
  const segments = isMobile ? 32 : 64; 
  
  const [textures, setTextures] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const urls = {
      map: '/textures/earth_night.jpg',
      normalMap: '/textures/earth_normal.jpg',
      roughnessMap: '/textures/earth_specular.jpg',
      cloudsMap: '/textures/earth_clouds.jpg'
    };

    let loadedCount = 0;
    const result = {};
    const keys = Object.keys(urls);

    keys.forEach(key => {
      loader.load(
        urls[key],
        (texture) => {
          result[key] = texture;
          loadedCount++;
          if (loadedCount === keys.length) setTextures(result);
        },
        undefined,
        (error) => {
          console.warn(`[SafeLoader] 404 Missing Texture: ${urls[key]}. Using fallback.`);
          result[key] = null; 
          loadedCount++;
          if (loadedCount === keys.length) setTextures(result);
        }
      );
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.05;

    const targetX = state.pointer.x * 0.3;
    const targetY = state.pointer.y * 0.3;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetX, 0.05);
  });

  if (!textures) return null;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} scale={earthScale}>
        
        <mesh>
          <sphereGeometry args={[2, segments, segments]} />
          <meshStandardMaterial 
            map={textures.map || undefined} 
            normalMap={textures.normalMap || undefined} 
            roughnessMap={textures.roughnessMap || undefined} 
            emissive={new THREE.Color("#ffffff")}
            emissiveMap={textures.map || undefined}
            emissiveIntensity={textures.map ? 0.5 : 0} 
            color={!textures.map ? "#111111" : "#ffffff"} 
            roughness={0.6} 
            metalness={0.15} 
          />
        </mesh>

        {textures.cloudsMap && (
          <mesh>
            <sphereGeometry args={[2.02, segments, segments]} />
            <meshStandardMaterial 
              map={textures.cloudsMap} 
              transparent={true} 
              opacity={0.4} 
              depthWrite={false} 
              blending={THREE.AdditiveBlending} 
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

function AdaptivePerformance() {
  const { gl } = useThree();
  return (
    <PerformanceMonitor 
      onDecline={() => gl.setPixelRatio(1)} 
      onIncline={() => gl.setPixelRatio(1.5)} 
    />
  );
}

export default function Scene() {
  return (
    <>
      <AdaptivePerformance />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />

      <Suspense fallback={<LoadingScreen />}>
        <SpaceDust />
        <OrbitControls  
          makeDefault 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={true} 
        />
        <InteractiveEarth />
      </Suspense>
    </>
  );
}
