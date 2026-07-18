import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveEarth() {
  const groupRef = useRef();
  
  // Mobile Responsiveness using R3F's useThree hook
  const { size } = useThree();
  const isMobile = size.width < 768;
  const earthScale = isMobile ? 0.8 : 1;
  
  // Load standard WebGL textures
  // Note: We use earth_night.jpg for both the color map and the emissive (glow) map!
  const textures = useTexture({
    map: '/textures/earth_night.jpg',
    normalMap: '/textures/earth_normal.jpg',
    roughnessMap: '/textures/earth_specular.jpg',
    cloudsMap: '/textures/earth_clouds.jpg',
    emissiveMap: '/textures/earth_night.jpg' 
  });

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

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} scale={earthScale}>
        {/* Core Night Earth Mesh */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial 
            map={textures.map} 
            normalMap={textures.normalMap} 
            roughnessMap={textures.roughnessMap} 
            emissive={new THREE.Color("#ffffff")}
            emissiveMap={textures.emissiveMap}
            emissiveIntensity={0.5} // Makes the city lights glow in the dark
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
      <ambientLight intensity={0.2} /> {/* Darkened ambient light to emphasize the night glow */}
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />

      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      
      <InteractiveEarth />
    </>
  );
}
