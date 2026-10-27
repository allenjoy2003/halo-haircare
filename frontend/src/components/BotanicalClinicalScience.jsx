import React, { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  FlaskConical, 
  Droplets, 
  ShieldCheck, 
  Sparkles,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { checkWebGLSupport, isLowPowerDevice } from '../three/device';
import { Droplet } from '../three/Droplet';

export default function BotanicalClinicalScience() {
  const canRender3D = typeof window !== 'undefined' && checkWebGLSupport() && !isLowPowerDevice();

  const pillars = [
    {
      icon: FlaskConical,
      badge: "Molecular Active",
      title: "Biomimetic Peptides & Ceramides",
      desc: "Bio-engineered peptides reinforce the keratin matrix, while biomimetic ceramides restore the hydrophobic lipid layer to shield fiber integrity against daily breakage."
    },
    {
      icon: Droplets,
      badge: "Chelation Science",
      title: "Mineral Neutralization",
      desc: "Chelating actives bind to mineral deposits from municipal hard water (calcium, magnesium, chlorine) within 60 seconds, preventing stiff, chalky fiber degradation."
    },
    {
      icon: Layers,
      badge: "Barrier Health",
      title: "Keratolytic Scalp Clarification",
      desc: "Micro-dosed 2% Salicylic Acid unclogs follicular ostia and clears excess sebum, supporting a balanced scalp environment without stripping essential moisture."
    },
    {
      icon: ShieldCheck,
      badge: "Clean Chemistry",
      title: "Zero-Silicone Breathability",
      desc: "Formulated without dimethicone or suffocating cyclic silicones. Lightweight plant hemisqualane imparts authentic, weightless shine without build-up."
    }
  ];

  return (
    <section id="science-section" className="py-16 sm:py-24 bg-halo-bg relative overflow-hidden border-b border-halo-border">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-halo-surface/80 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center space-x-2 bg-halo-surface border border-halo-border px-3.5 py-1.5 rounded-pill text-xs text-halo-ink font-medium shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-halo-accent" />
            <span>Formulation Principles</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-halo-navy tracking-tight">
            Science, clarified at the fiber level.
          </h2>

          <p className="text-sm sm:text-base text-halo-muted font-normal leading-relaxed">
            Every Halo formula is built around verified dermatological actives and clean carrier lipids, designed to work in synergy with your scalp microbiome.
          </p>
        </div>

        {/* Morphing Serum Droplet Visualizer */}
        <div className="mb-14 max-w-md mx-auto h-48 relative flex items-center justify-center">
          {canRender3D ? (
            <Canvas
              camera={{ position: [0, 0, 3.2], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
              onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
              <ambientLight intensity={0.9} />
              <directionalLight position={[4, 5, 4]} intensity={1.5} color="#FFFFFF" />
              <pointLight position={[-3, -2, -1]} intensity={0.8} color="#7FD6D0" />
              <Droplet scale={0.9} color="#7FD6D0" />
            </Canvas>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-halo-accent to-halo-teal/60 opacity-80 blur-sm animate-pulse" />
          )}
          <div className="absolute -bottom-2 text-[11px] text-halo-muted uppercase tracking-wider font-semibold">
            Fluid Micro-Emulsion Model
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-halo-surface rounded-card p-6 sm:p-7 border border-halo-border shadow-halo-card hover:shadow-halo-subtle transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-halo-bg border border-halo-border text-halo-teal flex items-center justify-center group-hover:bg-halo-navy group-hover:text-white transition duration-300">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-halo-teal bg-halo-bg px-2.5 py-1 rounded-pill">
                      {p.badge}
                    </span>
                    <h3 className="font-display text-base font-semibold text-halo-navy mt-2.5">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-halo-muted leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-halo-border/60 flex items-center space-x-1.5 text-[11px] font-medium text-halo-teal">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Lab Verified</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
