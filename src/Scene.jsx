import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function InteractiveEarth() {
  const groupRef = useRef();
  const { size } = useThree();
  const isMobile = size.width < 768;
  const earthScale = isMobile ? 0.8 : 1;
  
  // ROBUST LOADING STATE
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
          result[key] = null; // Set to null so the app doesn't crash
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

  // FALLBACK RENDER: While loading or if textures completely fail
  if (!textures) {
    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group scale={earthScale}>
          <mesh>
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial color="#111111" roughness={0.9} />
          </mesh>
        </group>
      </Float>
    );
  }

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} scale={earthScale}>
        {/* Core Night Earth Mesh */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial 
            map={textures.map || undefined} 
            normalMap={textures.normalMap || undefined} 
            roughnessMap={textures.roughnessMap || undefined} 
            emissive={new THREE.Color("#ffffff")}
            emissiveMap={textures.map || undefined} // Use map as emissive map for city lights
            emissiveIntensity={textures.map ? 0.5 : 0} 
            color={!textures.map ? "#111111" : "#ffffff"} // Fallback color if map is missing
            roughness={0.7} 
            metalness={0.1} 
          />
        </mesh>

        {/* Floating Clouds Layer - Only render if clouds texture exists */}
        {textures.cloudsMap && (
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
        )}
      </group>
    </Float>
  );
}

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />

      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
      
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      
      <InteractiveEarth />
    </>
  );
}
