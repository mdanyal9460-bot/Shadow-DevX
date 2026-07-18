import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, ScrollControls, useScroll, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function GalaxyBackground() {
  const texture = useTexture('/textures/milky_way.jpg');
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      {/* THREE.BackSide renders the texture on the INSIDE of the sphere */}
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function CameraRig() {
  const scroll = useScroll();

  useFrame((state) => {
    // scroll.offset goes from 0 (top) to 1 (bottom)
    const startZ = 15;
    const endZ = 5; // End at z=5 so the camera doesn't clip inside the Earth (radius=2)
    
    // Smoothly interpolate the camera's Z position based on scroll progress
    state.camera.position.z = THREE.MathUtils.lerp(startZ, endZ, scroll.offset);
    state.camera.position.x = 0;
    state.camera.position.y = 0;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function PhotorealisticEarth() {
  const groupRef = useRef(null);
  
  // NOTE: Place these textures in your public/textures/ directory
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    '/textures/earth_day.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.jpg'
  ]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Continuously rotate the Earth and Clouds together slowly
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Earth Sphere */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specularMap} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Cloud Layer */}
      <mesh>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function Scene() {
  return (
    <>
      <Stars radius={150} depth={50} count={10000} factor={6} saturation={0} fade speed={1} />
      
      {/* BRIGHTENED LIGHTING */}
      <ambientLight intensity={1.5} />
      <directionalLight 
        position={[5, 3, 5]} 
        intensity={2.5} 
        color="#ffffff" 
      />

      {/* 360 SKYBOX GALAXY */}
      <Suspense fallback={null}>
        <GalaxyBackground />
      </Suspense>

      <ScrollControls pages={3} damping={0.25}>
        <CameraRig />
        <Suspense fallback={null}>
          <PhotorealisticEarth />
        </Suspense>
      </ScrollControls>
    </>
  );
}
