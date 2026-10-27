import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Droplets, 
  Award, 
  ArrowRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import { BRAND } from '../brand';
import { checkWebGLSupport, isLowPowerDevice } from '../three/device';

// Lazy-load the procedural Three.js Hero Scene
const HeroScene = lazy(() => import('../three/HeroScene'));

export default function Hero({ onOpenQuiz, onOpenChat }) {
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    // Only mount 3D Canvas if WebGL is supported and device is not low-power
    const supported = checkWebGLSupport() && !isLowPowerDevice();
    setCanRender3D(supported);
  }, []);

  return (
    <section className="relative overflow-hidden bg-halo-bg pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-halo-border">
      
      {/* Calm Ambient Lighting Blobs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-halo-accent/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-6 left-10 w-96 h-96 bg-halo-surface/80 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Science-Forward CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 bg-halo-surface border border-halo-border px-3.5 py-1.5 rounded-pill shadow-xs text-xs text-halo-ink font-medium">
              <span className="w-2 h-2 rounded-full bg-halo-accent" />
              <span className="tracking-tight">Clinical Regimens × Clarified Formulations</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-halo-navy leading-[1.12] tracking-tight">
              Haircare, <span className="text-halo-teal">clarified</span> for your true texture.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-halo-muted max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Targeted, minimalist routines engineered for straight, wavy, and curly hair patterns facing humidity, hard water minerals, and daily mechanical stress. Active bio-peptides and clarifying cleansers. Zero silicones. No unnecessary additives.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onOpenQuiz}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-pill bg-halo-navy hover:shadow-halo-glow text-white text-sm font-medium tracking-tight transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 text-halo-accent stroke-[1.5]" />
                <span>Take the Hair Quiz</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80 stroke-[1.5]" />
              </button>

              <button
                onClick={onOpenChat}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-pill bg-halo-surface hover:bg-white text-halo-navy border border-halo-border hover:border-halo-teal text-sm font-medium tracking-tight shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Bot className="w-4 h-4 text-halo-teal stroke-[1.5]" />
                <span>Ask {BRAND.botName} (Hair Guide)</span>
              </button>
            </div>

            {/* Trust Highlights Strip */}
            <div className="pt-6 border-t border-halo-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-halo-surface rounded-lg border border-halo-border shadow-xs text-halo-navy shrink-0">
                  <Star className="w-4 h-4 text-halo-teal fill-halo-teal" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-halo-navy">4.9 / 5.0</div>
                  <div className="text-[11px] text-halo-muted">Verified Regimen Users</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-halo-surface rounded-lg border border-halo-border shadow-xs text-halo-navy shrink-0">
                  <Droplets className="w-4 h-4 text-halo-teal stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-halo-navy">Hard Water</div>
                  <div className="text-[11px] text-halo-muted">Chelating Balance</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-halo-surface rounded-lg border border-halo-border shadow-xs text-halo-navy shrink-0">
                  <ShieldCheck className="w-4 h-4 text-halo-teal stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-halo-navy">Zero Residue</div>
                  <div className="text-[11px] text-halo-muted">Free of Silicones</div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-halo-surface rounded-lg border border-halo-border shadow-xs text-halo-navy shrink-0">
                  <Award className="w-4 h-4 text-halo-teal stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-halo-navy">Clinical Actives</div>
                  <div className="text-[11px] text-halo-muted">Lab-Verified Efficacy</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Procedural Hero Scene with Lightweight Fallback */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none min-h-[460px] flex items-center justify-center">
              
              {canRender3D ? (
                <Suspense
                  fallback={
                    <div className="w-full h-[460px] rounded-card bg-halo-surface border border-halo-border flex items-center justify-center shadow-halo-card">
                      <div className="text-center space-y-2">
                        <div className="w-8 h-8 border-2 border-halo-teal border-t-transparent rounded-full animate-spin mx-auto" />
                        <div className="text-xs text-halo-muted">Clarifying 3D scene...</div>
                      </div>
                    </div>
                  }
                >
                  <HeroScene />
                </Suspense>
              ) : (
                /* Lightweight Poster Image Fallback for Mobile / Low-Power / Reduced-Motion */
                <div className="relative w-full rounded-card overflow-hidden shadow-halo-card border border-halo-border bg-halo-surface">
                  <img
                    src="https://images.unsplash.com/photo-1608248597359-00918c8b417c?auto=format&fit=crop&w=800&q=80"
                    alt="Halo Clarified Clinical Haircare Regimen"
                    className="w-full h-[460px] object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-halo-navy/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-halo-accent bg-halo-navy/80 px-2.5 py-1 rounded-pill">
                      Regimen System
                    </span>
                    <h3 className="font-display text-lg font-medium mt-1 text-white">
                      The 4-Step Clarifying & Shield Ritual
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
                      Peptide Complex • Salicylic Clarifier • Lightweight Fluid Barrier
                    </p>
                  </div>
                </div>
              )}

              {/* Floating Badge: Aria Guide */}
              <div className="absolute -top-3 -left-3 sm:-left-5 bg-halo-surface/95 backdrop-blur-md border border-halo-border p-3 rounded-card shadow-halo-subtle flex items-center space-x-3 max-w-[210px] z-10 pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-halo-bg border border-halo-border flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-halo-teal stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-halo-navy">{BRAND.botName} Guide</div>
                  <div className="text-[10px] text-halo-muted">Hair & Scalp Advice</div>
                </div>
              </div>

              {/* Floating Badge: Tested Metrics */}
              <div className="absolute -bottom-3 -right-3 sm:-right-5 bg-halo-surface/95 backdrop-blur-md border border-halo-border p-3 rounded-card shadow-halo-subtle flex items-center space-x-3 z-10 pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-halo-bg border border-halo-border flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-halo-teal stroke-[1.5]" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-halo-navy">94% Humidity Shield</div>
                  <div className="text-[10px] text-halo-muted">Lab-Tested Frizz Control</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
