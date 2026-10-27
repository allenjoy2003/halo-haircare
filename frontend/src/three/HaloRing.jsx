import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Orbiting Halo Ring
 * Thin torus that gently hovers and tilts around the serum bottle with soft aqua illumination.
 */
export function HaloRing({ radius = 1.6, tube = 0.035, color = '#7FD6D0' }) {
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.45;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.25 + 0.35;
    }
  });

  return (
    <group ref={ringRef} position={[0, 2.2, 0]}>
      {/* Primary Torus Ring */}
      <mesh>
        <torusGeometry args={[radius, tube, 24, 64, Math.PI * 1.85]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Orbiting Focus Dot */}
      <mesh position={[radius * Math.cos(0.2), radius * Math.sin(0.2), 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#0B1B2B" />
      </mesh>
    </group>
  );
}
