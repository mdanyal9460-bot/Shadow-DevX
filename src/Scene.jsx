import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, PerformanceMonitor, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. Mobile Detection helper (Reduces load by 50% on small screens)
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// 2. Simple Loading Component for Suspense
function LoadingScreen() {
  return (
    <Html center>
      <div className="text-[#00ffa6] text-sm md:text-base tracking-[0.2em] uppercase font-bold whitespace-nowrap bg-black/50 p-4 rounded-xl backdrop-blur-md">
        Loading Space...
      </div>
    </Html>
  );
}

function InteractiveEarth() {
  const groupRef = useRef();
  
  const earthScale = isMobile ? 0.8 : 1;
  const segments = isMobile ? 32 : 64; // Optimized geometry for mobile
  
  // 3. Crash-Proof Texture Loading Mechanism
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
          result[key] = null; // Do NOT throw an error, gracefully fallback
          loadedCount++;
          if (loadedCount === keys.length) setTextures(result);
        }
      );
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Organic constant rotation
    groupRef.current.rotation.y += delta * 0.05;

    // Mouse Pointer Tilt Interaction
    const targetX = state.pointer.x * 0.3;
    const targetY = state.pointer.y * 0.3;

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetX, 0.05);
  });

  // Keep rendering null until textures finish attempting to load.
  // The Suspense wrapper will show the <LoadingScreen /> while we wait.
  if (!textures) return null;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} scale={earthScale}>
        
        {/* Core Night Earth Mesh */}
        <mesh>
          <sphereGeometry args={[2, segments, segments]} />
          <meshStandardMaterial 
            map={textures.map || undefined} 
            normalMap={textures.normalMap || undefined} 
            roughnessMap={textures.roughnessMap || undefined} 
            emissive={new THREE.Color("#ffffff")}
            emissiveMap={textures.map || undefined}
            emissiveIntensity={textures.map ? 0.5 : 0} 
            color={!textures.map ? "#111111" : "#ffffff"} // Simple fallback color
            roughness={0.7} 
            metalness={0.1} 
          />
        </mesh>

        {/* Floating Clouds Layer - Only load if texture succeeded */}
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

// Adaptive Performance Component
function AdaptivePerformance() {
  const { gl } = useThree();
  return (
    <PerformanceMonitor 
      onDecline={() => gl.setPixelRatio(1)} // Downgrade rendering quality if device lags
      onIncline={() => gl.setPixelRatio(1.5)} // Restore quality if device is fast
    />
  );
}

export default function Scene() {
  return (
    <>
      {/* 4. Performance Optimization */}
      <AdaptivePerformance />

      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />

      {/* 5. Loading State & Premium Controls */}
      <Suspense fallback={<LoadingScreen />}>
        <Stars 
          radius={100} 
          depth={50} 
          count={isMobile ? 3000 : 7000} // Less stars for mobile 
          factor={4} 
          saturation={0} 
          fade 
          speed={1} 
        />
        
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
