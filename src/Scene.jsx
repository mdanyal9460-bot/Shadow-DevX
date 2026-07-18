import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function GlassCluster() {
  const groupRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.2;
      groupRef.current.rotation.z = time * 0.1;
      groupRef.current.position.y = Math.sin(time * 1.5) * 0.1;
    }
  });

  const glassProps = {
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.9, 
    transparent: true,
    opacity: 1,
    thickness: 2,
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh position={[-1.2, 0.2, 0]}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshPhysicalMaterial {...glassProps} color="#00ffa6" />
      </mesh>
      
      <mesh position={[1.2, -0.2, 0.5]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshPhysicalMaterial {...glassProps} color="#ffffff" />
      </mesh>
      
      <mesh position={[0, 0.3, 1]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
        <meshPhysicalMaterial {...glassProps} color="#5b00ff" />
      </mesh>
    </group>
  );
}

function CyberpunkEarth() {
  const earthRef = useRef();

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001; 
      earthRef.current.rotation.x += 0.0005; 
    }
  });

  return (
    <mesh ref={earthRef} position={[10, -5, -20]}>
      <sphereGeometry args={[15, 32, 32]} />
      <meshBasicMaterial 
        color="#5b00ff" 
        wireframe={true} 
      />
    </mesh>
  );
}

function WireframeTerrain() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      setScrollProgress(scrollY / maxScroll);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); 
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const geometry = useMemo(() => new THREE.PlaneGeometry(80, 80, 40, 40), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const positionAttribute = geometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i); 
      
      const z = Math.sin(x * 0.2 + time) * 0.4 + Math.cos(y * 0.2 + time * 0.8) * 0.4;
      positionAttribute.setZ(i, z);
    }
    positionAttribute.needsUpdate = true;

    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, THREE.MathUtils.lerp(0, -1.5, scrollProgress), 0.1);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, THREE.MathUtils.lerp(5, 2.5, scrollProgress), 0.1);
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, THREE.MathUtils.lerp(0, 0.2, scrollProgress), 0.1);
  });

  return (
    <mesh 
      geometry={geometry} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -2, -5]}
    >
      <meshBasicMaterial 
        color="#1dbf73" 
        wireframe={true} 
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <>
      <fog attach="fog" args={['#000000', 5, 35]} />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={2.0} color="#00ffa6" />
      
      <CyberpunkEarth />
      <GlassCluster />
      <WireframeTerrain />
    </>
  );
}
