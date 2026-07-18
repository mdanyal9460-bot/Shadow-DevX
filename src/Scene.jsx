import React, { useRef, useMemo, Suspense, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, useTexture, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// 1. SCROLL CAMERA LOGIC
function CameraRig() {
  const scroll = useScroll();
  useFrame((state) => {
    // Lerp the Z position for scroll depth.
    // NOTE: Removed state.camera.lookAt(0,0,0) so it doesn't fight with OrbitControls!
    state.camera.position.z = THREE.MathUtils.lerp(15, 5, scroll.offset);
  });
  return null;
}

// 2. REALISTIC GALAXY BACKGROUND
function GalaxyBackground() {
  const texture = useTexture('/textures/milky_way.jpg');
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// 3. INTERACTIVE EARTH + CLOUDS
function Earth() {
  const groupRef = useRef();
  
  // Interactive Hover State
  const [hovered, setHovered] = useState(false);
  
  // Textures - Names MUST match files in public/textures/
  const [color, normal, specular, clouds] = useTexture([
    '/textures/earth_day.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.jpg'
  ]);

  useFrame((_, delta) => {
    // Smoothly scale the earth based on hover state
    const targetScale = hovered ? 1.1 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    
    // Constant rotation
    groupRef.current.rotation.y += delta * 0.05;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group 
        ref={groupRef}
        onPointerOver={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={color} normalMap={normal} roughnessMap={specular} roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.02, 64, 64]} />
          <meshStandardMaterial map={clouds} transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </Float>
  );
}

// 4. CRASH-FREE SPACE DUST
function SafeSpaceDust() {
  const particlesCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) pos[i] = (Math.random() - 0.5) * 50;
    return pos;
  }, []);

  const dustRef = useRef();
  const scroll = useScroll();

  useFrame((_, delta) => {
    if (dustRef.current) {
      dustRef.current.position.z += delta * (1 + scroll.offset * 10);
      if (dustRef.current.position.z > 20) dustRef.current.position.z = -20;
    }
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

export default function Scene() {
  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 3, 5]} intensity={2.5} color="#ffffff" />
      
      <ScrollControls pages={3} damping={0.25}>
        <CameraRig />
        <Suspense fallback={null}>
          <GalaxyBackground />
          <Earth />
          <SafeSpaceDust />
        </Suspense>
      </ScrollControls>

      {/* OrbitControls added for mouse interaction */}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
    </>
  );
}
