import React, { useRef, useState, useEffect, useMemo } from 'react';
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
varying float vLineIndex;
varying float vProgress;

void main() {
    vLineIndex = aLineIndex;
    vProgress = uProgress;
    
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
    
    // Phase 4: Line 2 & Face Lock (2.5 to 3.0)
    float pLine2AndFace = smoothstep(2.5, 2.9, uProgress);
    
    float pActive = mix(pLine1, pLine2AndFace, step(0.5, aLineIndex));
    
    // Phase 3: Second Boom for Line 2 and Face (2.0 to 2.5)
    float secondBoomTiming = 0.0;
    if (aLineIndex > 0.5) {
        secondBoomTiming = smoothstep(2.0, 2.25, uProgress) * smoothstep(2.5, 2.25, uProgress);
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
    
    // Vibrant Color Logic
    vec3 baseColor = aColor; // Maintain multi-color spectrum
    
    // Phase 3: Flash extreme white and dark purple/black during second boom
    if (aLineIndex > 0.5) {
        vec3 flashColor = mix(vec3(1.0), vec3(0.05, 0.0, 0.1), sin(uTime * 50.0) * 0.5 + 0.5);
        baseColor = mix(baseColor, flashColor, secondBoomTiming);
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
uniform float uTime;
varying vec3 vColor;
varying float vLineIndex;
varying float vProgress;

void main() {
    // Soft radial gradient for plasma particle
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, dist);
    
    vec3 finalColor = vColor;
    
    // Phase 4 Red Light Flash Effect on "I AM ATOMIC"
    if (vLineIndex > 0.5 && vLineIndex < 1.5) {
        float pLock = smoothstep(2.5, 2.7, vProgress);
        float redPulse = (sin(uTime * 10.0) + 1.0) * 0.5;
        vec3 redFlash = vec3(1.0, 0.0, 0.0) * (1.0 + redPulse * 2.0);
        finalColor = mix(finalColor, redFlash, pLock * redPulse * 0.8);
    }
    
    // Intense hot core, softer outer glow
    vec3 coreColor = mix(finalColor, vec3(1.0), smoothstep(0.2, 0.0, dist) * 0.8);
    gl_FragColor = vec4(coreColor, alpha * 0.85);
}
`;

export default function DimensionPortal({ isOpen = false }) {
  const shaderRef = useRef();
  const targetProgress = useRef(0);
  const prevMouse = useRef(new THREE.Vector2());
  const { viewport } = useThree();

  const [buffers, setBuffers] = useState(null);

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

  useEffect(() => {
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
    
    // Line 1: Welcome (High-Tech font)
    ctx.font = \`bold \${isMobile ? 22 : 50}px "Courier New", monospace\`;
    ctx.fillText("WELCOME TO MY DIMENSION", canvas.width / 2, canvas.height / 2 - (isMobile ? 35 : 70));
    
    // Line 2: Atomic (Massive font)
    ctx.font = \`bold \${isMobile ? 45 : 110}px "Arial Black", sans-serif\`;
    ctx.fillText("I AM ATOMIC", canvas.width / 2, canvas.height / 2 + (isMobile ? 25 : 60));
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const textPositions1 = [];
    const textPositions2 = [];
    
    for (let i = 0; i < canvas.height; i += 3) {
      for (let j = 0; j < canvas.width; j += 3) {
        const index = (j + i * canvas.width) * 4;
        if (imgData[index] > 128) {
          const x = (j / canvas.width - 0.5) * 25;
          const y = -(i / canvas.height - 0.5) * 12.5;
          if (y > 0) {
            textPositions1.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 0.4));
          } else {
            textPositions2.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 0.4));
          }
        }
      }
    }
    
    const finalizeBuffers = (facePositions) => {
        const orb = new Float32Array(NUM_PARTICLES * 3);
        const vortex = new Float32Array(NUM_PARTICLES * 3);
        const text = new Float32Array(NUM_PARTICLES * 3);
        const color = new Float32Array(NUM_PARTICLES * 3);
        const lineIndex = new Float32Array(NUM_PARTICLES);
    
        const baseColors = [
          new THREE.Color('#00ffff'), // Neon Blue
          new THREE.Color('#ffffff'), // Bright White
          new THREE.Color('#ff00ff'), // Hot Pink
          new THREE.Color('#39ff14'), // Electric Green
        ];
    
        for (let i = 0; i < NUM_PARTICLES; i++) {
          const phi = Math.acos(-1 + (2 * i) / NUM_PARTICLES);
          const theta = Math.sqrt(NUM_PARTICLES * Math.PI) * phi;
          const rOrb = 4 + Math.random() * 0.5;
          orb[i * 3] = rOrb * Math.cos(theta) * Math.sin(phi);
          orb[i * 3 + 1] = rOrb * Math.sin(theta) * Math.sin(phi);
          orb[i * 3 + 2] = rOrb * Math.cos(phi);
    
          const angle = Math.random() * Math.PI * 20;
          const rVortex = angle * 0.4 + Math.random();
          vortex[i * 3] = Math.cos(angle) * rVortex;
          vortex[i * 3 + 1] = (Math.random() - 0.5) * 5;
          vortex[i * 3 + 2] = Math.sin(angle) * rVortex;
    
          let tp;
          let idx;
          const rand = Math.random();
          if (rand < 0.33 && textPositions1.length > 0) {
              tp = textPositions1[i % textPositions1.length];
              idx = 0.0;
          } else if (rand < 0.66 && textPositions2.length > 0) {
              tp = textPositions2[i % textPositions2.length];
              idx = 1.0;
          } else if (facePositions.length > 0) {
              tp = facePositions[i % facePositions.length];
              idx = 2.0;
          } else {
              tp = textPositions1[0] || new THREE.Vector3(0,0,0);
              idx = 0.0;
          }
          
          text[i * 3] = tp.x;
          text[i * 3 + 1] = tp.y;
          text[i * 3 + 2] = tp.z;
          lineIndex[i] = idx;
    
          const col = baseColors[Math.floor(Math.random() * baseColors.length)];
          color[i * 3] = col.r;
          color[i * 3 + 1] = col.g;
          color[i * 3 + 2] = col.b;
        }
        setBuffers({ orb, vortex, text, color, lineIndex });
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/cid-face.png";
    img.onload = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 256;
      cvs.height = 256;
      const fCtx = cvs.getContext('2d');
      fCtx.drawImage(img, 0, 0, 256, 256);
      const faceData = fCtx.getImageData(0, 0, 256, 256).data;
      const facePositions = [];
      for(let i=0; i<256; i+=2) {
        for(let j=0; j<256; j+=2) {
          const index = (j + i * 256) * 4;
          // Check alpha threshold to capture the silhouette
          if (faceData[index+3] > 128) { 
            // Position it below "I AM ATOMIC"
            const x = (j / 256 - 0.5) * 15;
            const y = -(i / 256 - 0.5) * 15 - (isMobile ? 12 : 18);
            facePositions.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 0.4));
          }
        }
      }
      if(facePositions.length === 0) facePositions.push(new THREE.Vector3(0,-(isMobile ? 12 : 18),0));
      finalizeBuffers(facePositions);
    };
    img.onerror = () => {
      // Fallback if cid-face.png does not exist
      finalizeBuffers([new THREE.Vector3(0, -(isMobile ? 12 : 18), 0)]);
    };
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
    // Phase 1: 0.0-1.0, Phase 2: Pause 1.0-2.0, Phase 3: Boom 2.0-2.5, Phase 4: Lock 2.5-3.0
    targetProgress.current = isOpen ? 3.0 : 0.0;
  }, [isOpen]);

  useFrame((state, delta) => {
    if (!shaderRef.current) return;
    const mat = shaderRef.current;
    
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Linear transition for exact suspense pacing (delta * 1.0 means 1 unit per second)
    if (targetProgress.current > 0) {
      mat.uniforms.uProgress.value = Math.min(3.0, mat.uniforms.uProgress.value + delta * 1.0);
    } else {
      mat.uniforms.uProgress.value = Math.max(0.0, mat.uniforms.uProgress.value - delta * 1.0);
    }
    
    const prog = mat.uniforms.uProgress.value;
    
    // Phase 1: First scatter shake (Subtle)
    if (prog > 0.05 && prog < 0.3) {
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 60) * 0.2;
      state.camera.position.y = Math.cos(state.clock.elapsedTime * 55) * 0.2;
    }
    // Phase 3: Second massive boom shake (Heavy)
    else if (prog > 2.05 && prog < 2.45) {
      state.camera.position.x = Math.sin(state.clock.elapsedTime * 100) * 0.6;
      state.camera.position.y = Math.cos(state.clock.elapsedTime * 95) * 0.6;
    } 
    // Recovery
    else {
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.2);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.2);
    }
    
    const currentMouse = new THREE.Vector2(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2
    );
    
    const speed = currentMouse.distanceTo(prevMouse.current) / (delta || 0.01);
    prevMouse.current.copy(currentMouse);
    
    mat.uniforms.uPointerSpeed.value = THREE.MathUtils.lerp(
      mat.uniforms.uPointerSpeed.value, 
      speed, 
      0.1
    );

    mat.uniforms.uMouse.value.lerp(currentMouse, 0.15);
  });

  if (!buffers) {
    return (
      <group>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={2000} array={latticePoints} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial color="#00ffff" size={0.05} transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      </group>
    );
  }

  return (
    <group>
      {/* Background Quantum Lattice */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={2000} array={latticePoints} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#00ffff" size={0.05} transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Main Dimension Portal */}
      <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={NUM_PARTICLES} array={buffers.orb} itemSize={3} />
        <bufferAttribute attach="attributes-aPosOrb" count={NUM_PARTICLES} array={buffers.orb} itemSize={3} />
        <bufferAttribute attach="attributes-aPosVortex" count={NUM_PARTICLES} array={buffers.vortex} itemSize={3} />
        <bufferAttribute attach="attributes-aPosText" count={NUM_PARTICLES} array={buffers.text} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={NUM_PARTICLES} array={buffers.color} itemSize={3} />
        <bufferAttribute attach="attributes-aLineIndex" count={NUM_PARTICLES} array={buffers.lineIndex} itemSize={1} />
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
