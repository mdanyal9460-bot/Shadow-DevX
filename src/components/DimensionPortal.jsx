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
uniform float uBasePointSize;

attribute vec3 aPosOrb;
attribute vec3 aPosVortex;
attribute vec3 aPosText;
attribute vec3 aColor;
attribute float aLineIndex;

varying vec3 vColor;

void main() {
    vec3 pos = vec3(0.0);
    
    // Phase 1: 0.0 -> 0.4: First Boom Scatter & Vortex
    float firstBoomTiming = smoothstep(0.0, 0.2, uProgress) * smoothstep(0.4, 0.2, uProgress);
    float pVortex = smoothstep(0.0, 0.4, uProgress);
    
    // Breathing Orb
    vec3 breathingOrb = aPosOrb * (1.0 + sin(uTime * 2.0 + aPosOrb.y) * 0.05);
    
    // Swirling Vortex
    float angle = atan(aPosVortex.z, aPosVortex.x) + uTime * 3.0;
    float radius = length(aPosVortex.xz);
    vec3 swirlingVortex = vec3(cos(angle) * radius, aPosVortex.y, sin(angle) * radius);
    
    // Text Position (Microscopic Living Dark Energy Breathing)
    vec3 textPos = aPosText;
    float breathingScale = 0.04; 
    textPos.x += sin(uTime * 2.0 + textPos.y * 10.0) * breathingScale;
    textPos.y += cos(uTime * 2.5 + textPos.x * 10.0) * breathingScale;
    textPos.z += sin(uTime * 1.5 + textPos.x * 5.0) * (breathingScale * 2.0);

    // Initial state (Orb -> Vortex)
    vec3 basePos = mix(breathingOrb, swirlingVortex, pVortex);
    
    // First Boom Chaos (affects everything)
    float hash1 = fract(sin(dot(aPosOrb.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
    vec3 chaos1 = normalize(vec3(hash1 - 0.5, fract(hash1 * 2.0) - 0.5, fract(hash1 * 3.0) - 0.5));
    basePos += chaos1 * firstBoomTiming * 10.0;
    
    // Phase 1: Line 1 Lock (0.4 to 1.0)
    float pLine1 = smoothstep(0.4, 1.0, uProgress);
    
    // Phase 4: Line 2 Lock (2.4 to 2.8) - Forms after the blast
    float pLine2 = smoothstep(2.4, 2.8, uProgress);
    
    float pActive = mix(pLine1, pLine2, aLineIndex);
    
    // Phase 3: Second Boom for Line 2 (2.0 to 2.4)
    float secondBoomTiming = 0.0;
    if (aLineIndex > 0.5) {
        secondBoomTiming = smoothstep(2.0, 2.2, uProgress) * smoothstep(2.5, 2.2, uProgress);
        float noise = sin(aPosText.x * 50.0) * 15.0;
        float hash2 = fract(sin(dot(aPosText.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        vec3 chaos2 = normalize(vec3(hash2 - 0.5, fract(hash2 * 2.0) - 0.5, fract(hash2 * 3.0) - 0.5));
        textPos += chaos2 * secondBoomTiming * abs(noise) * 2.0; // Aggressive displacement
    }
    
    // Interaction logic
    float dist = distance(textPos.xy, uMouse);
    if (dist < 3.0) {
        vec2 dir = normalize(textPos.xy - uMouse);
        textPos.xy += dir * (3.0 - dist) * 0.5;
        textPos.z += (3.0 - dist) * 0.5;
    }
    float fractureEffect = smoothstep(30.0, 100.0, uPointerSpeed);
    if (fractureEffect > 0.0 && dist < 8.0) {
        float hash3 = fract(sin(dot(aPosText.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        vec3 chaos3 = normalize(vec3(hash3 - 0.5, fract(hash3 * 2.0) - 0.5, fract(hash3 * 3.0) - 0.5));
        textPos += chaos3 * fractureEffect * (8.0 - dist) * 1.5;
    }
    
    pos = mix(basePos, textPos, pActive);
    
    // Color Logic
    vec3 targetColor = mix(aColor, vec3(0.1, 0.0, 0.2), pVortex);
    vec3 finalTextColor = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 0.26, 0.26), (sin(textPos.x * 0.5 + uTime) + 1.0) * 0.5);
    vec3 baseColor = mix(targetColor, finalTextColor, pActive);
    
    // Phase 3: Flash extreme white/neon red during second boom
    if (aLineIndex > 0.5) {
        baseColor = mix(baseColor, vec3(1.0, 0.9, 0.9), secondBoomTiming);
    }
    vColor = baseColor;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    
    // Point Size logic
    float pSize = uBasePointSize;
    pSize += firstBoomTiming * 15.0; // First explosion size spike
    if (aLineIndex > 0.5) {
        pSize += secondBoomTiming * 50.0; // Second explosion massive spike
    }
    
    gl_PointSize = (pSize / -mvPosition.z) * (1.0 + sin(uTime * 3.0 + pos.x) * 0.2);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;
void main() {
    // Soft radial gradient for plasma particle
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, dist);
    
    // Intense hot core, softer outer glow
    vec3 coreColor = mix(vColor, vec3(1.0), smoothstep(0.2, 0.0, dist) * 0.8);
    gl_FragColor = vec4(coreColor, alpha * 0.85);
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
    
    const isMobile = window.innerWidth < 768;
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Line 1: Welcome
    ctx.font = `bold ${isMobile ? 22 : 50}px "Arial Black", sans-serif`;
    ctx.fillText("WELCOME TO MY DIMENSION", canvas.width / 2, canvas.height / 2 - (isMobile ? 25 : 50));
    
    // Line 2: Atomic
    ctx.font = `bold ${isMobile ? 45 : 110}px "Arial Black", sans-serif`;
    ctx.fillText("I AM ATOMIC", canvas.width / 2, canvas.height / 2 + (isMobile ? 20 : 40));
    
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
      new THREE.Color('#2a004d'), // Obsidian Purple
      new THREE.Color('#ff3333'), // Neon Red
      new THREE.Color('#000000'), // Absolute Black
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
    uPulseTimer: { value: 0 },
    uBasePointSize: { value: window.innerWidth < 768 ? 7.5 : 12.0 }
  }), []);

  useEffect(() => {
    // Phase 1: 0.0-1.0, Phase 2: Pause 1.0-2.0, Phase 3: Boom 2.0-2.4, Phase 4: Lock 2.4-2.8
    targetProgress.current = isOpen ? 3.0 : 0.0;
  }, [isOpen]);

  useFrame((state, delta) => {
    if (!shaderRef.current) return;
    const mat = shaderRef.current;
    
    // Time
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Linear transition for exact suspense pacing
    if (targetProgress.current > 0) {
      mat.uniforms.uProgress.value = Math.min(3.0, mat.uniforms.uProgress.value + delta * 0.6);
    } else {
      mat.uniforms.uProgress.value = Math.max(0.0, mat.uniforms.uProgress.value - delta * 0.6);
    }
    
    const prog = mat.uniforms.uProgress.value;
    
    // Phase 1: First scatter shake (Subtle)
    if (prog > 0.05 && prog < 0.3) {
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 60) * 0.2;
      state.camera.position.y = Math.cos(state.clock.elapsedTime * 55) * 0.2;
    }
    // Phase 3: Second massive boom shake (Heavy)
    else if (prog > 2.05 && prog < 2.35) {
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 100) * 0.6;
      state.camera.position.y = Math.cos(state.clock.elapsedTime * 95) * 0.6;
    } 
    // Recovery
    else {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.2);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.2);
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
