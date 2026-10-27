import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ambient aqua droplets drifting slowly in 3D depth.
 * Implemented with InstancedMesh for optimal GPU batching.
 */
export function AmbientParticles({ count = 35 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Initialize random particle trajectories
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 8 - 2,
        z: (Math.random() - 0.5) * 6 - 2,
        speed: 0.2 + Math.random() * 0.4,
        scale: 0.04 + Math.random() * 0.08,
        swaySpeed: 0.5 + Math.random() * 0.8,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      // Gentle vertical drifting & horizontal sway
      const currentY = ((p.y + time * p.speed) % 8) - 2;
      const currentX = p.x + Math.sin(time * p.swaySpeed + p.offset) * 0.25;

      dummy.position.set(currentX, currentY, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color="#7FD6D0"
        transmission={0.8}
        roughness={0.1}
        ior={1.33}
        transparent={true}
        opacity={0.65}
      />
    </instancedMesh>
  );
}
