import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveEarth() {
  const groupRef = useRef();
  
  // Load standard WebGL textures securely
  const textures = useTexture({
    map: '/textures/earth_day.jpg',
    normalMap: '/textures/earth_normal.jpg',
    roughnessMap: '/textures/earth_specular.jpg',
    cloudsMap: '/textures/earth_clouds.jpg'
  });

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Organic constant rotation on the Y axis
    groupRef.current.rotation.y += delta * 0.05;

    // 2. Mouse Pointer Tilt Interaction
    // state.pointer returns normalized coordinates (-1 to +1)
    const targetX = state.pointer.x * 0.3; // Limit the max tilt
    const targetY = state.pointer.y * 0.3;

    // Smoothly lerp the Earth's X and Z rotation towards the mouse pointer
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -targetX, 0.05);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Core Earth Mesh */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial 
            map={textures.map} 
            normalMap={textures.normalMap} 
            roughnessMap={textures.roughnessMap} 
            roughness={0.7} 
            metalness={0.1} 
          />
        </mesh>

        {/* Floating Clouds Layer */}
        <mesh>
          <sphereGeometry args={[2.02, 64, 64]} />
          <meshStandardMaterial 
            map={textures.cloudsMap} 
            transparent={true} 
            opacity={0.4} 
            depthWrite={false} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function Scene() {
  return (
    <>
      {/* High-Contrast Cinematic Lighting */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 3, 5]} intensity={2.5} color="#ffffff" />

      {/* High-Density Milky Way Stars */}
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
      
      {/* Interactive Controls */}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      
      {/* The Hero Asset */}
      <InteractiveEarth />
    </>
  );
}
