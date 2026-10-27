import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Bottle } from './Bottle';

/**
 * Routine Shelf - 4 aligned bottles representing:
 * Step 1: Cleanse (Clarifying Shampoo)
 * Step 2: Condition (Moisture Matrix)
 * Step 3: Define (Weightless Cream)
 * Step 4: Protect (Shield Serum)
 */
export function RoutineShelf({ activeStep = 0, scrollProgress = 0 }) {
  const shelfRef = useRef();

  const steps = [
    { label: 'Cleanse', color: '#BDECE8', x: -3.3, baseOffset: 0.1 },
    { label: 'Condition', color: '#D4F3F0', x: -1.1, baseOffset: 0.3 },
    { label: 'Define', color: '#A1E6E1', x: 1.1, baseOffset: 0.5 },
    { label: 'Protect', color: '#7FD6D0', x: 3.3, baseOffset: 0.7 },
  ];

  useFrame((state) => {
    if (!shelfRef.current) return;
    // Subtle idle breathing
    shelfRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05 - 1.5;
  });

  return (
    <group ref={shelfRef} position={[0, -1.5, 0]}>
      {steps.map((step, idx) => {
        const isHighlighted = activeStep === idx;
        const targetElevation = isHighlighted ? 0.35 : 0;

        return (
          <group
            key={idx}
            position={[step.x, targetElevation, 0]}
            scale={isHighlighted ? 0.78 : 0.72}
          >
            <Bottle scale={1} fluidColor={step.color} labelText={`0${idx + 1}`} />
          </group>
        );
      })}
    </group>
  );
}
