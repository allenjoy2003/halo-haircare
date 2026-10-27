import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Morphing Serum Droplet
 * Simulates a surface-tension droplet utilizing dynamic vertex displacement.
 */
export function Droplet({ scale = 1, color = '#7FD6D0' }) {
  const meshRef = useRef();

  // Create base sphere geometry
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(1.2, 48, 48);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime * 1.5;
    
    // Morph scale slightly along axes for organic surface tension wobble
    meshRef.current.scale.x = scale * (1 + Math.sin(time) * 0.08);
    meshRef.current.scale.y = scale * (1 + Math.cos(time * 1.2) * 0.06);
    meshRef.current.scale.z = scale * (1 + Math.sin(time * 0.8) * 0.08);

    meshRef.current.rotation.y += 0.008;
    meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.15;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        roughness={0.05}
        transmission={0.88}
        thickness={1.5}
        ior={1.38}
        attenuationColor="#E0F7F6"
        attenuationDistance={1.2}
        transparent={true}
        opacity={0.92}
      />
    </mesh>
  );
}
