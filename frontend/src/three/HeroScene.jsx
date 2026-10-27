import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { Bottle } from './Bottle';
import { HaloRing } from './HaloRing';
import { AmbientParticles } from './AmbientParticles';

function HeroSceneContent() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    // Interactive mouse parallax
    const mouseX = state.pointer.x * 0.35;
    const mouseY = state.pointer.y * 0.25;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.05);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY * 0.5, 0.05);
  });

  return (
    <>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 6]} intensity={1.4} castShadow color="#FFFFFF" />
      <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#7FD6D0" />
      <pointLight position={[0, 4, 3]} intensity={0.7} color="#FFFFFF" />

      {/* Floating Interactive Bottle with Orbiting Halo */}
      <group ref={groupRef} position={[0, -1.8, 0]}>
        <Float speed={2.0} rotationIntensity={0.25} floatIntensity={0.5}>
          <Bottle scale={1.05} fluidColor="#A7E8E4" />
          <HaloRing radius={1.75} color="#7FD6D0" />
        </Float>
      </group>

      {/* Atmospheric Ambient Particles */}
      <AmbientParticles count={32} />
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full min-h-[460px] relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <HeroSceneContent />
      </Canvas>
    </div>
  );
}
