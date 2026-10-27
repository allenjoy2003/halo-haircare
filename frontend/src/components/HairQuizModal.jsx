import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  Bot, 
  ShoppingBag, 
  CheckCircle2, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { BRAND } from '../brand';

export default function HairQuizModal({ isOpen, onClose, onConsultDoctor, routines }) {
  const { addRoutineToCart } = useCart();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    texture: '',
    climate_scalp: '',
    goal: '',
  });
  const [recommendedRoutine, setRecommendedRoutine] = useState(null);

  if (!isOpen) return null;

  const handleTextureSelect = (texture) => {
    setAnswers(prev => ({ ...prev, texture }));
    setStep(2);
  };

  const handleClimateSelect = (climate_scalp) => {
    setAnswers(prev => ({ ...prev, climate_scalp }));
    setStep(3);
  };

  const handleGoalSelect = (goal) => {
    const finalAnswers = { ...answers, goal };
    setAnswers(finalAnswers);

    // Pick matching routine
    let matched = routines[0];
    if (finalAnswers.goal === 'hairfall' || finalAnswers.climate_scalp === 'hairfall') {
      matched = routines.find(r => r.slug?.includes('density') || r.slug?.includes('scalp')) || routines[1] || routines[0];
    } else if (finalAnswers.climate_scalp === 'hardwater') {
      matched = routines.find(r => r.slug?.includes('hard-water')) || routines[2] || routines[0];
    } else if (finalAnswers.texture === 'curly' || finalAnswers.texture === 'coily') {
      matched = routines.find(r => r.slug?.includes('curly') || r.slug?.includes('clump')) || routines[3] || routines[0];
    } else {
      matched = routines.find(r => r.slug?.includes('frizz') || r.slug?.includes('shield')) || routines[0];
    }

    setRecommendedRoutine(matched);
    setStep(4);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({ texture: '', climate_scalp: '', goal: '' });
    setRecommendedRoutine(null);
  };

  const handleAddPrescribedRoutine = () => {
    if (recommendedRoutine) {
      addRoutineToCart(recommendedRoutine);
      onClose();
    }
  };

  const handleTalkToGuideWithProfile = () => {
    onClose();
    if (onConsultDoctor) {
      onConsultDoctor({
        initialMessage: `Hello Aria, I completed the hair diagnostic quiz. My hair pattern is ${answers.texture}, my primary stressor is ${answers.climate_scalp}, and my goal is ${answers.goal}. Can you review my regimen?`,
        userProfile: {
          hair_type: answers.texture,
          concern: answers.climate_scalp,
          goal: answers.goal,
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-halo-navy/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-halo-surface rounded-card max-w-xl w-full p-6 sm:p-8 shadow-halo-subtle border border-halo-border relative max-h-[90vh] overflow-y-auto"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-pill text-halo-muted hover:text-halo-navy hover:bg-halo-bg transition"
          aria-label="Close diagnostic quiz"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-halo-muted mb-2">
            <span>Diagnostic Phase {step} of 4</span>
            <span className="text-halo-teal">
              {step === 1 && "Strand Pattern"}
              {step === 2 && "Environmental Stressor"}
              {step === 3 && "Regimen Goal"}
              {step === 4 && "Clarified Regimen"}
            </span>
          </div>
          <div className="w-full bg-halo-border h-1.5 rounded-pill overflow-hidden">
            <div 
              className="bg-halo-teal h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Texture */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-halo-navy">
                What is your natural hair pattern?
              </h3>
              <p className="text-xs text-halo-muted mt-1">
                Select the texture closest to your air-dried hair fiber.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { id: 'straight', code: '1A - 1C', title: 'Straight', desc: 'Fine to coarse, oily roots, prone to limpness' },
                { id: 'wavy', code: '2A - 2C', title: 'Wavy', desc: 'S-waves, frizzy in humidity, dry ends' },
                { id: 'curly', code: '3A - 3C', title: 'Curly', desc: 'Spirals & loops, craves moisture & clumping' },
                { id: 'coily', title: 'Coily & Textured', code: '4A - 4C', desc: 'Tight zig-zag coils, fragile cuticle' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleTextureSelect(opt.id)}
                  className="p-4 rounded-card border border-halo-border hover:border-halo-teal bg-halo-bg hover:bg-white text-left transition group shadow-xs"
                >
                  <div className="text-[10px] font-semibold text-halo-teal uppercase tracking-wider">
                    {opt.code}
                  </div>
                  <div className="font-display text-sm font-semibold text-halo-navy group-hover:text-halo-teal mt-0.5">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-halo-muted mt-1 leading-snug">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Environmental Stressor */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-halo-navy">
                What primary stressor affects your hair?
              </h3>
              <p className="text-xs text-halo-muted mt-1">
                Our formulas adapt to environmental and tap water conditions.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'humidity', title: 'Coastal Humidity & Frizz', desc: 'Strands puff up, lose definition, and expand within 30 minutes outside' },
                { id: 'hardwater', title: 'Hard Tap Water (>300 PPM TDS)', desc: 'Chalky mineral residue, brittle breakage, and lifeless dull color' },
                { id: 'hairfall', title: 'Excess Shedding & Scalp Imbalance', desc: 'Visible hair fall on wash days, dry scalp itching, or flaky buildup' },
                { id: 'heat_color', title: 'Chemical Color or Heat Damage', desc: 'Porous fibers that snap easily and struggle to hold hydration' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleClimateSelect(opt.id)}
                  className="w-full p-4 rounded-card border border-halo-border hover:border-halo-teal bg-halo-bg hover:bg-white text-left transition group shadow-xs"
                >
                  <div className="font-display text-sm font-semibold text-halo-navy group-hover:text-halo-teal">
                    {opt.title}
                  </div>
                  <div className="text-xs text-halo-muted mt-0.5 leading-snug">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center space-x-1.5 text-xs text-halo-muted hover:text-halo-navy pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Back to Pattern</span>
            </button>
          </div>
        )}

        {/* Step 3: Transformation Goal */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-halo-navy">
                What is your 90-day transformation goal?
              </h3>
              <p className="text-xs text-halo-muted mt-1">
                Select your primary priority to formulate your custom regimen.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              {[
                { id: 'frizz', title: 'Glassy, Weightless Frizz Immunity', desc: 'Smooth fiber alignment without silicone buildup' },
                { id: 'curls', title: 'Sculpted, Bouncy Curl Clumps', desc: 'Defined spirals with zero crunch and long-lasting hold' },
                { id: 'density', title: 'Root Density & Follicular Awakening', desc: 'Strengthened roots and reduced shedding on wash days' },
                { id: 'repair', title: 'Disulfide Bond Restoration & Moisture', desc: 'Deep hydration and split-end prevention for damaged cuticles' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleGoalSelect(opt.id)}
                  className="w-full p-4 rounded-card border border-halo-border hover:border-halo-teal bg-halo-bg hover:bg-white text-left transition group shadow-xs"
                >
                  <div className="font-display text-sm font-semibold text-halo-navy group-hover:text-halo-teal">
                    {opt.title}
                  </div>
                  <div className="text-xs text-halo-muted mt-0.5 leading-snug">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-1.5 text-xs text-halo-muted hover:text-halo-navy pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Back to Stressor</span>
            </button>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && recommendedRoutine && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-halo-teal bg-halo-bg px-3 py-1 rounded-pill border border-halo-border">
                Clarified Regimen Match
              </span>
              <h3 className="font-display text-xl font-semibold text-halo-navy pt-1">
                {recommendedRoutine.title}
              </h3>
              <p className="text-xs text-halo-muted max-w-sm mx-auto">
                {recommendedRoutine.tagline}
              </p>
            </div>

            {/* Routine Card Preview */}
            <div className="bg-halo-bg rounded-card border border-halo-border p-4 flex space-x-4 items-center">
              <img
                src={recommendedRoutine.image_url}
                alt={recommendedRoutine.title}
                className="w-20 h-20 rounded-lg object-cover border border-halo-border shrink-0"
              />
              <div className="flex-1 space-y-1">
                <div className="text-xs font-semibold text-halo-navy">
                  Includes {recommendedRoutine.routine_steps?.length || 4} Sequential Steps
                </div>
                <div className="text-[11px] text-halo-muted line-clamp-1">
                  {recommendedRoutine.clinical_results}
                </div>
                <div className="flex items-baseline space-x-2 pt-0.5">
                  <span className="text-base font-semibold text-halo-navy">₹{recommendedRoutine.bundle_price}</span>
                  <span className="text-xs text-halo-muted line-through">₹{recommendedRoutine.original_total_price}</span>
                  <span className="text-[10px] text-halo-teal font-medium">Save {recommendedRoutine.savings_percentage}%</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddPrescribedRoutine}
                className="w-full py-3 bg-halo-navy hover:shadow-halo-glow text-white text-xs font-medium rounded-pill transition flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                <span>Add Prescribed Regimen to Cart</span>
              </button>

              <button
                onClick={handleTalkToGuideWithProfile}
                className="w-full py-2.5 bg-halo-surface hover:bg-halo-bg border border-halo-border hover:border-halo-teal text-halo-navy text-xs font-medium rounded-pill transition flex items-center justify-center space-x-2"
              >
                <Bot className="w-4 h-4 text-halo-teal stroke-[1.5]" />
                <span>Review Diagnosis with {BRAND.botName}</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full text-center text-xs text-halo-muted hover:text-halo-navy pt-2"
              >
                Retake Diagnostic Quiz
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
