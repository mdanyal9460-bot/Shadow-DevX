import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const NUM_PARTICLES = 40000;

// Custom Shader for high-performance morphing and interaction
const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;
uniform float uPointerSpeed;
uniform float uPulseTimer;

attribute vec3 aPosOrb;
attribute vec3 aPosVortex;
attribute vec3 aPosText;
attribute vec3 aColor;
attribute float aLineIndex;

varying vec3 vColor;

void main() {
    vColor = aColor;
    
    vec3 pos = vec3(0.0);
    
    // Smooth transition logic based on uProgress (0.0 -> 1.0 -> 2.0)
    // 0.0 -> 1.0: Orb to Vortex
    // 1.0 -> 2.0: Vortex to Text
    
    if (uProgress < 1.0) {
        float p = smoothstep(0.0, 1.0, uProgress);
        
        // Breathing Orb
        vec3 breathingOrb = aPosOrb * (1.0 + sin(uTime * 2.0 + aPosOrb.y) * 0.05);
        
        // Swirling Vortex
        float angle = atan(aPosVortex.z, aPosVortex.x) + uTime * 3.0;
        float radius = length(aPosVortex.xz);
        vec3 swirlingVortex = vec3(cos(angle) * radius, aPosVortex.y, sin(angle) * radius);
        
        pos = mix(breathingOrb, swirlingVortex, p);
        
        // Color transition (Crimson -> Void Purple)
        vec3 targetColor = mix(vec3(1.0, 0.0, 0.0), vec3(0.1, 0.0, 0.2), p); 
        vColor = mix(vColor, targetColor, p * 0.8);
        
    } else {
        // Sequential Lock-in Logic
        // Line 1: Welcome (uProgress 1.0 to 1.5)
        float pLine1 = smoothstep(0.0, 0.5, uProgress - 1.0);
        
        // Line 2: Atomic (uProgress 1.8 to 2.5)
        float pLine2 = smoothstep(0.8, 1.5, uProgress - 1.0);
        
        float pActive = mix(pLine1, pLine2, aLineIndex);
        
        // Swirling Vortex (maintain motion)
        float angle = atan(aPosVortex.z, aPosVortex.x) + uTime * 3.0;
        float radius = length(aPosVortex.xz);
        vec3 swirlingVortex = vec3(cos(angle) * radius, aPosVortex.y, sin(angle) * radius);
        
        // Text Position (Completely Static - NO Wave Motion)
        vec3 textPos = aPosText;
        
        // The BOOM mathematical explosion for Line 2 (Triggers heavily around uProgress 1.6 - 1.8)
        float boom = 0.0;
        if (aLineIndex > 0.5) {
            float boomTiming = smoothstep(0.5, 0.7, uProgress - 1.0) * smoothstep(0.9, 0.7, uProgress - 1.0);
            boom = boomTiming * 5.0; 
            
            float hash = fract(sin(dot(aPosText.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
            vec3 chaosDir = normalize(vec3(hash - 0.5, fract(hash * 2.0) - 0.5, fract(hash * 3.0) - 0.5));
            textPos += chaosDir * boom * 8.0; 
        }
        
        // Mouse Repulsion Logic & Fracture
        float dist = distance(textPos.xy, uMouse);
        if (dist < 3.0) {
            vec2 dir = normalize(textPos.xy - uMouse);
            textPos.xy += dir * (3.0 - dist) * 0.5;
            textPos.z += (3.0 - dist) * 0.5;
        }
        
        float fractureEffect = smoothstep(30.0, 100.0, uPointerSpeed);
        if (fractureEffect > 0.0 && dist < 8.0) {
            float hash = fract(sin(dot(aPosText.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
            vec3 chaosDir = normalize(vec3(hash - 0.5, fract(hash * 2.0) - 0.5, fract(hash * 3.0) - 0.5));
            textPos += chaosDir * fractureEffect * (8.0 - dist) * 1.5;
        }
        
        pos = mix(swirlingVortex, textPos, pActive);
        
        // Color transition
        vec3 textColor = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.26, 0.26), (sin(textPos.x * 0.5 + uTime) + 1.0) * 0.5);
        vColor = mix(vec3(0.1, 0.0, 0.2), textColor, pActive);
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // Dynamic point size scaling by distance, time, and boom explosion
    float boomFactor = 0.0;
    if (aLineIndex > 0.5) {
        boomFactor = smoothstep(0.5, 0.7, max(0.0, uProgress - 1.0)) * smoothstep(0.9, 0.7, max(0.0, uProgress - 1.0));
    }
    gl_PointSize = (12.0 / -mvPosition.z) * (1.0 + sin(uTime * 3.0 + pos.x) * 0.2) + (boomFactor * 20.0);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;
void main() {
    // Crystal Prism Splatting & Refraction Math
    vec2 uv = gl_PointCoord - 0.5;
    float radius = length(uv);
    float angle = atan(uv.y, uv.x);
    
    // Add angular sharp cuts to create fractured star/crystal shapes
    float cuts = sin(angle * 6.0) * 0.1 + cos(angle * 3.0) * 0.1;
    if (radius > 0.4 + cuts) discard;
    
    // Refraction Highlights (Bright white edges)
    float innerGlow = smoothstep(0.4 + cuts, 0.0, radius);
    float edgeHighlight = smoothstep(0.3 + cuts, 0.4 + cuts, radius);
    
    // Mix base color with crystalline edge light
    vec3 crystalColor = mix(vColor, vec3(1.0), edgeHighlight * 0.8);
    gl_FragColor = vec4(crystalColor, innerGlow * 0.9);
}
`;

export default function DimensionPortal({ isOpen = false }) {
  const shaderRef = useRef();
  const targetProgress = useRef(0);
  const prevMouse = useRef(new THREE.Vector2());
  const { viewport } = useThree();

  // Background Quantum Lattice Mesh (z: -50)
  const latticePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < 2000; i++) {
      points.push(
        (Math.random() - 0.5) * 100, // X
        (Math.random() - 0.5) * 100, // Y
        -50 + (Math.random() - 0.5) * 20 // Z depth variation
      );
    }
    return new Float32Array(points);
  }, []);

  const [aPosOrb, aPosVortex, aPosText, aColor, aLineIndex] = useMemo(() => {
    const orb = new Float32Array(NUM_PARTICLES * 3);
    const vortex = new Float32Array(NUM_PARTICLES * 3);
    const text = new Float32Array(NUM_PARTICLES * 3);
    const color = new Float32Array(NUM_PARTICLES * 3);
    const lineIndex = new Float32Array(NUM_PARTICLES);

    // 1. Text Coordinates Extraction via Hidden Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Line 1: Welcome (Slightly smaller, placed higher)
    ctx.font = 'bold 50px "Arial Black", sans-serif';
    ctx.fillText("WELCOME TO MY DIMENSION", canvas.width / 2, canvas.height / 2 - 50);
    
    // Line 2: Atomic (Massive, placed lower)
    ctx.font = 'bold 110px "Arial Black", sans-serif';
    ctx.fillText("I AM ATOMIC", canvas.width / 2, canvas.height / 2 + 40);
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const textPositions = [];
    
    // Sample pixels
    for (let i = 0; i < canvas.height; i += 3) {
      for (let j = 0; j < canvas.width; j += 3) {
        const index = (j + i * canvas.width) * 4;
        if (imgData[index] > 128) {
          // Normalize coordinates and scale to fit viewport roughly
          const x = (j / canvas.width - 0.5) * 25;
          const y = -(i / canvas.height - 0.5) * 12.5;
          textPositions.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 0.4));
        }
      }
    }
    
    // Fallback if sampling missed (shouldn't happen, but ensures buffer fills)
    if (textPositions.length === 0) textPositions.push(new THREE.Vector3(0,0,0));

    const baseColors = [
      new THREE.Color('#ff0000'), // Deep Blood Crimson
      new THREE.Color('#1a0033'), // Void Purple/Black
      new THREE.Color('#ff4444'), // Stark, Neon Red
      new THREE.Color('#990000'), // Dark Crimson
    ];

    // Generate Buffers
    for (let i = 0; i < NUM_PARTICLES; i++) {
      // -- Phase 1: Hollow Orb
      const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES);
      const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi;
      const rOrb = 4 + Math.random() * 0.5; // Radius
      orb[i * 3] = rOrb * Math.cos(theta) * Math.sin(phi);
      orb[i * 3 + 1] = rOrb * Math.sin(theta) * Math.sin(phi);
      orb[i * 3 + 2] = rOrb * Math.cos(phi);

      // -- Phase 2: Eruption Vortex
      const angle = Math.random() * Math.PI * 20;
      const rVortex = angle * 0.4 + Math.random();
      vortex[i * 3] = Math.cos(angle) * rVortex;
      vortex[i * 3 + 1] = (Math.random() - 0.5) * 5; // spread height
      vortex[i * 3 + 2] = Math.sin(angle) * rVortex;

      // -- Phase 3: Text Morph
      const tp = textPositions[i % textPositions.length];
      text[i * 3] = tp.x;
      text[i * 3 + 1] = tp.y;
      text[i * 3 + 2] = tp.z;
      
      // Determine Line 1 vs Line 2 based on Y coordinate (Y is inverted here, so tp.y > 0 is top half)
      lineIndex[i] = tp.y > 0.0 ? 0.0 : 1.0;

      // -- Base Colors
      const col = baseColors[Math.floor(Math.random() * baseColors.length)];
      color[i * 3] = col.r;
      color[i * 3 + 1] = col.g;
      color[i * 3 + 2] = col.b;
    }

    return [orb, vortex, text, color, lineIndex];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uPointerSpeed: { value: 0 },
    uPulseTimer: { value: 0 }
  }), []);

  useEffect(() => {
    // 0 = Orb, 1 = Vortex, 1.0-1.5 = Line 1, 1.8-2.5 = Line 2
    targetProgress.current = isOpen ? 2.5 : 0.0;
  }, [isOpen]);

  useFrame((state, delta) => {
    if (!shaderRef.current) return;
    const mat = shaderRef.current;
    
    // Time
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Smooth transition (Majestic/Slow)
    mat.uniforms.uProgress.value = THREE.MathUtils.lerp(
      mat.uniforms.uProgress.value,
      targetProgress.current,
      delta * 0.5 // Slowed down Morph speed for majestic reveal
    );
    
    // Camera Shake during BOOM phase
    if (mat.uniforms.uProgress.value > 1.65 && mat.uniforms.uProgress.value < 1.8) {
      const shakeAmount = Math.sin(state.clock.elapsedTime * 50) * 0.3;
      camera.position.x = shakeAmount;
      camera.position.y = Math.cos(state.clock.elapsedTime * 45) * 0.3;
    } else {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.1);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.1);
    }
    
    // Mouse Interaction & Speed Tracking
    const currentMouse = new THREE.Vector2(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2
    );
    
    // Calculate speed based on distance traveled over delta
    const speed = currentMouse.distanceTo(prevMouse.current) / (delta || 0.01);
    prevMouse.current.copy(currentMouse);
    
    // Lerp speed to avoid jagged jumps
    mat.uniforms.uPointerSpeed.value = THREE.MathUtils.lerp(
      mat.uniforms.uPointerSpeed.value, 
      speed, 
      0.1
    );

    mat.uniforms.uMouse.value.lerp(currentMouse, 0.15);
  });

  return (
    <group>
      {/* Background Quantum Lattice */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2000} array={latticePoints} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#ff0000" size={0.05} transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Main Dimension Portal */}
      <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={NUM_PARTICLES} array={aPosOrb} itemSize={3} />
        <bufferAttribute attach="attributes-aPosOrb" count={NUM_PARTICLES} array={aPosOrb} itemSize={3} />
        <bufferAttribute attach="attributes-aPosVortex" count={NUM_PARTICLES} array={aPosVortex} itemSize={3} />
        <bufferAttribute attach="attributes-aPosText" count={NUM_PARTICLES} array={aPosText} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={NUM_PARTICLES} array={aColor} itemSize={3} />
        <bufferAttribute attach="attributes-aLineIndex" count={NUM_PARTICLES} array={aLineIndex} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      </points>
    </group>
  );
}
