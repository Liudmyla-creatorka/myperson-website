"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./HeroBackground.module.css";

const GRAIN_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GRAIN_FRAGMENT_SHADER = `
  uniform float uTime;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec3 base = vec3(0.055, 0.055, 0.06);
    float grain = hash(vUv * vec2(900.0, 900.0) + uTime * 42.0);
    float vignette = smoothstep(1.05, 0.2, distance(vUv, vec2(0.5)));
    vec3 color = base * mix(0.72, 1.0, vignette) + (grain - 0.5) * 0.035;
    gl_FragColor = vec4(color, 1.0);
  }
`;

function GrainBackdrop() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} position={[0, 0, -1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={GRAIN_VERTEX_SHADER}
        fragmentShader={GRAIN_FRAGMENT_SHADER}
      />
    </mesh>
  );
}

const RIBBON_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const RIBBON_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 3.2);
    vec3 base = vec3(0.02, 0.02, 0.022);
    vec3 rim = vec3(1.0) * fresnel * 0.85;
    gl_FragColor = vec4(base + rim, 1.0);
  }
`;

function RibbonKnot() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.x += delta * 0.08;
    mesh.rotation.y += delta * 0.12;
  });

  return (
    <mesh ref={meshRef} position={[0.6, 0, 0]} rotation={[0.4, 0.2, 0]}>
      <torusKnotGeometry args={[1, 0.26, 180, 24, 2, 3]} />
      <shaderMaterial
        vertexShader={RIBBON_VERTEX_SHADER}
        fragmentShader={RIBBON_FRAGMENT_SHADER}
      />
    </mesh>
  );
}

export function HeroBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={styles.staticFallback} aria-hidden="true" />;
  }

  return (
    <div className={styles.canvasWrapper} aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        camera={{ position: [0, 0, 4.2], fov: 45 }}
      >
        <GrainBackdrop />
        <RibbonKnot />
      </Canvas>
    </div>
  );
}
