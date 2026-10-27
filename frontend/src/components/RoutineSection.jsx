import React, { Suspense, lazy } from 'react';
import RoutineBundleCard from './RoutineBundleCard';
import { Layers } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { checkWebGLSupport, isLowPowerDevice } from '../three/device';
import { RoutineShelf } from '../three/RoutineShelf';

export default function RoutineSection({ routines, onQuickViewProduct }) {
  if (!routines || routines.length === 0) return null;
  const canRender3D = typeof window !== 'undefined' && checkWebGLSupport() && !isLowPowerDevice();

  return (
    <section id="routines-section" className="py-16 sm:py-24 bg-halo-bg border-b border-halo-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 bg-halo-surface border border-halo-border px-3.5 py-1.5 rounded-pill text-xs text-halo-ink font-medium shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-halo-accent" />
            <span>Regimen Sequences</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-halo-navy tracking-tight">
            Cohesive routines. Zero guesswork.
          </h2>

          <p className="text-sm sm:text-base text-halo-muted font-normal leading-relaxed">
            Hair fiber optimization occurs when each step locks in the previous active. Sequenced from pre-wash scalp balancing to barrier finishing.
          </p>
        </div>

        {/* 3D Routine Assembly Shelf Visualizer */}
        {canRender3D && (
          <div className="hidden lg:block max-w-2xl mx-auto h-44 mb-10 relative">
            <Canvas
              camera={{ position: [0, 0, 6.2], fov: 42 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
              <ambientLight intensity={0.9} />
              <directionalLight position={[4, 6, 5]} intensity={1.5} color="#FFFFFF" />
              <directionalLight position={[-4, 3, -2]} intensity={0.6} color="#7FD6D0" />
              <RoutineShelf activeStep={1} />
            </Canvas>
            <div className="flex justify-between max-w-lg mx-auto text-[10px] font-semibold text-halo-muted uppercase tracking-wider -mt-4 px-2">
              <span>01 Cleanse</span>
              <span>02 Condition</span>
              <span>03 Define</span>
              <span>04 Protect</span>
            </div>
          </div>
        )}

        {/* Routines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {routines.map(bundle => (
            <RoutineBundleCard
              key={bundle.id}
              bundle={bundle}
              onQuickViewProduct={onQuickViewProduct}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
