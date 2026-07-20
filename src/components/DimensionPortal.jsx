import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const NUM_PARTICLES = 40000;

// Custom Shader for high-performance morphing and interaction
const vertexShader = `
uniform float uTime;
uniform float uProgress;
uniform vec2 uMouse;

attribute vec3 aPosOrb;
attribute vec3 aPosVortex;
attribute vec3 aPosText;
attribute vec3 aColor;

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
        
        // Color transition (Golden/Mint -> Indigo/Blue)
        vec3 targetColor = mix(vec3(1.0, 0.7, 0.2), vec3(0.2, 0.4, 1.0), p); 
        vColor = mix(vColor, targetColor, p * 0.8);
        
    } else {
        float p2 = smoothstep(0.0, 1.0, uProgress - 1.0);
        
        // Swirling Vortex (maintain motion)
        float angle = atan(aPosVortex.z, aPosVortex.x) + uTime * 3.0;
        float radius = length(aPosVortex.xz);
        vec3 swirlingVortex = vec3(cos(angle) * radius, aPosVortex.y, sin(angle) * radius);
        
        // Text Position
        vec3 textPos = aPosText;
        
        // Mouse Repulsion Logic (The "Stackside" interaction)
        float dist = distance(textPos.xy, uMouse);
        if (dist < 3.0) {
            vec2 dir = normalize(textPos.xy - uMouse);
            // push particles away and slightly forward
            textPos.xy += dir * (3.0 - dist) * 0.5;
            textPos.z += (3.0 - dist) * 0.5;
        }
        
        // Add subtle continuous breathing to the text
        textPos.z += sin(uTime * 2.0 + textPos.x * 0.5) * 0.2;
        
        pos = mix(swirlingVortex, textPos, p2);
        
        // Color transition to text (Amber/Violet/Cyan gradient based on position)
        vec3 textColor = mix(vec3(1.0, 0.5, 0.0), vec3(0.0, 1.0, 0.8), (sin(textPos.x * 0.5 + uTime) + 1.0) * 0.5);
        vColor = mix(vec3(0.2, 0.4, 1.0), textColor, p2);
    }
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // Dynamic point size scaling by distance and time
    gl_PointSize = (15.0 / -mvPosition.z) * (1.0 + sin(uTime * 3.0 + pos.x) * 0.2);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;
void main() {
    // Create a soft glowing circle instead of a square
    float d = distance(gl_PointCoord, vec2(0.5));
    if(d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(vColor, alpha * 0.9);
}
`;

export default function DimensionPortal({ isOpen = false }) {
  const shaderRef = useRef();
  const targetProgress = useRef(0);
  const { viewport } = useThree();

  const [aPosOrb, aPosVortex, aPosText, aColor] = useMemo(() => {
    const orb = new Float32Array(NUM_PARTICLES * 3);
    const vortex = new Float32Array(NUM_PARTICLES * 3);
    const text = new Float32Array(NUM_PARTICLES * 3);
    const color = new Float32Array(NUM_PARTICLES * 3);

    // 1. Text Coordinates Extraction via Hidden Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 80px "Inter", sans-serif'; // Modern Sans Serif
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Welcome to my dimension", canvas.width / 2, canvas.height / 2);
    
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
          textPositions.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 1.5));
        }
      }
    }

    const baseColors = [
      new THREE.Color('#ffb347'), // Amber
      new THREE.Color('#00ffa6'), // Mint
      new THREE.Color('#d8b4e2'), // Violet
      new THREE.Color('#ffd700'), // Pale-gold
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

      // -- Base Colors
      const col = baseColors[Math.floor(Math.random() * baseColors.length)];
      color[i * 3] = col.r;
      color[i * 3 + 1] = col.g;
      color[i * 3 + 2] = col.b;
    }

    return [orb, vortex, text, color];
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  }), []);

  useEffect(() => {
    // 0 = Orb, 1 = Vortex, 2 = Text
    targetProgress.current = isOpen ? 2.0 : 0.0;
  }, [isOpen]);

  useFrame((state, delta) => {
    if (!shaderRef.current) return;
    const mat = shaderRef.current;
    
    // Time
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Smooth transition
    mat.uniforms.uProgress.value = THREE.MathUtils.lerp(
      mat.uniforms.uProgress.value,
      targetProgress.current,
      delta * 0.8 // Morph speed
    );
    
    // Mouse Interaction
    // Convert normalized device coordinates (state.pointer) to approximate world units
    mat.uniforms.uMouse.value.lerp(
      new THREE.Vector2(
        (state.pointer.x * viewport.width) / 2,
        (state.pointer.y * viewport.height) / 2
      ),
      0.15 // Lerp mouse for smooth tracking
    );
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={NUM_PARTICLES} array={aPosOrb} itemSize={3} />
        <bufferAttribute attach="attributes-aPosOrb" count={NUM_PARTICLES} array={aPosOrb} itemSize={3} />
        <bufferAttribute attach="attributes-aPosVortex" count={NUM_PARTICLES} array={aPosVortex} itemSize={3} />
        <bufferAttribute attach="attributes-aPosText" count={NUM_PARTICLES} array={aPosText} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={NUM_PARTICLES} array={aColor} itemSize={3} />
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
  );
}
