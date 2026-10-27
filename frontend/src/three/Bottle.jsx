import React, { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Procedural Glass Serum Bottle
 * Features:
 * - LatheGeometry body with gentle shoulder curve
 * - Inner fluid core with soft aqua refraction tint
 * - Minimalist pump collar & dispenser top
 * - Clean glass transmission material
 */
export function Bottle({ scale = 1, fluidColor = '#A7E8E4', labelText = '01' }) {
  // Bottle outer profile points for LatheGeometry
  const outerProfile = useMemo(() => {
    const points = [];
    // Base flat
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.9, 0));
    // Base rounded corner
    points.push(new THREE.Vector2(1.0, 0.15));
    // Straight cylinder wall
    points.push(new THREE.Vector2(1.0, 2.2));
    // Shoulder curve
    points.push(new THREE.Vector2(0.95, 2.5));
    points.push(new THREE.Vector2(0.65, 2.85));
    // Neck
    points.push(new THREE.Vector2(0.48, 2.95));
    points.push(new THREE.Vector2(0.48, 3.4));
    // Rim
    points.push(new THREE.Vector2(0.52, 3.45));
    points.push(new THREE.Vector2(0.42, 3.48));
    points.push(new THREE.Vector2(0.38, 3.4));
    // Inner wall neck
    points.push(new THREE.Vector2(0.38, 2.9));
    // Inner fluid chamber
    points.push(new THREE.Vector2(0.85, 2.2));
    points.push(new THREE.Vector2(0.85, 0.2));
    points.push(new THREE.Vector2(0, 0.2));
    return points;
  }, []);

  const latheGeometry = useMemo(() => {
    const geom = new THREE.LatheGeometry(outerProfile, 48);
    geom.computeVertexNormals();
    return geom;
  }, [outerProfile]);

  return (
    <group scale={scale} dispose={null}>
      {/* Outer Frosted Glass Body */}
      <mesh geometry={latheGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          roughness={0.12}
          transmission={0.92}
          thickness={1.2}
          ior={1.48}
          color="#FFFFFF"
          attenuationColor="#E8F8F7"
          attenuationDistance={1.8}
          transparent={true}
          opacity={0.98}
        />
      </mesh>

      {/* Internal Clarified Serum Core */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 2.0, 36]} />
        <meshPhysicalMaterial
          color={fluidColor}
          roughness={0.05}
          transmission={0.7}
          ior={1.34}
          transparent={true}
          opacity={0.88}
        />
      </mesh>

      {/* Pump Collar (Deep Navy) */}
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.35, 36]} />
        <meshStandardMaterial color="#0B1B2B" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Pump Stem */}
      <mesh position={[0, 3.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.35, 24]} />
        <meshStandardMaterial color="#E1E6EB" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Precision Dispenser Head */}
      <group position={[0, 4.05, 0]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.3, 32]} />
          <meshStandardMaterial color="#0B1B2B" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Dispenser Nozzle Spout */}
        <mesh position={[0.32, 0.16, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <boxGeometry args={[0.35, 0.14, 0.18]} />
          <meshStandardMaterial color="#0B1B2B" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>

      {/* Minimal Lab Formulation Label Strip */}
      <mesh position={[0, 1.35, 1.01]}>
        <planeGeometry args={[1.1, 1.2]} />
        <meshBasicMaterial color="#FFFFFF" transparent={true} opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
