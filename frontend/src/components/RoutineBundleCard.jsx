import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  HelpCircle,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function RoutineBundleCard({ bundle, onQuickViewProduct }) {
  const { addRoutineToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);

  const handleAddToCart = () => {
    addRoutineToCart(bundle);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const steps = bundle.routine_steps || [];

  return (
    <div className="bg-halo-surface rounded-card border border-halo-border overflow-hidden shadow-halo-card hover:shadow-halo-subtle transition-all duration-300 flex flex-col group">
      
      {/* Top Banner / Image Area */}
      <div className="relative h-64 overflow-hidden bg-halo-bg">
        <img
          src={bundle.image_url}
          alt={bundle.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
          <span className="bg-halo-navy text-white text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-pill shadow-xs">
            {bundle.badge_text || 'Clinical Regimen'}
          </span>
          <span className="bg-halo-accent text-halo-navy text-[10px] font-semibold px-2.5 py-0.5 rounded-pill shadow-xs">
            Save {bundle.savings_percentage}%
          </span>
        </div>

        {/* Clinical Results Pill */}
        <div className="absolute bottom-3 left-3 right-3 bg-halo-surface/95 backdrop-blur-md px-3.5 py-1.5 rounded-pill border border-halo-border text-[11px] text-halo-ink font-medium flex items-center space-x-2 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-halo-teal shrink-0" />
          <span className="truncate">{bundle.clinical_results}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        
        <div className="space-y-3">
          {/* Target Textures / Concerns pills */}
          <div className="flex flex-wrap gap-1.5">
            {bundle.target_hair_types?.map(ht => (
              <span key={ht.id} className="text-[10px] font-semibold bg-halo-bg text-halo-navy px-2.5 py-0.5 rounded-pill border border-halo-border">
                Type {ht.code}
              </span>
            ))}
            {bundle.target_concerns?.slice(0, 2).map(c => (
              <span key={c.id} className="text-[10px] font-medium bg-halo-bg text-halo-muted px-2.5 py-0.5 rounded-pill border border-halo-border">
                {c.name}
              </span>
            ))}
          </div>

          {/* Title & Tagline */}
          <h3 className="font-display text-lg font-semibold text-halo-navy group-hover:text-halo-teal transition line-clamp-1">
            {bundle.title}
          </h3>
          <p className="text-xs text-halo-muted leading-relaxed line-clamp-2">
            {bundle.tagline}
          </p>

          {/* Routine Steps Sequence Strip */}
          <div className="pt-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-halo-muted mb-2 flex items-center justify-between">
              <span>Sequenced Regimen ({steps.length} Steps)</span>
              <button
                onClick={() => setShowStepsModal(true)}
                className="text-halo-teal hover:underline flex items-center lowercase font-normal"
              >
                <HelpCircle className="w-3 h-3 mr-0.5 stroke-[1.5]" />
                <span>application tips</span>
              </button>
            </div>

            {/* Step Sequence Timeline */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 no-scrollbar">
              {steps.map((st, idx) => (
                <React.Fragment key={st.id || idx}>
                  <button
                    onClick={() => st.product && onQuickViewProduct(st.product)}
                    className="group/step relative bg-halo-bg hover:bg-white border border-halo-border hover:border-halo-teal px-2.5 py-1.5 rounded-lg text-left transition shrink-0 max-w-[120px]"
                    title={st.custom_instruction}
                  >
                    <div className="text-[9px] font-bold text-halo-teal uppercase tracking-wider">
                      {st.step_order ? `Step 0${st.step_order}` : `Phase ${idx+1}`}
                    </div>
                    <div className="text-[11px] font-medium text-halo-ink truncate">
                      {st.product?.title ? st.product.title.split(' ')[0] : `Step ${idx+1}`}
                    </div>
                  </button>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-halo-border shrink-0 stroke-[1.5]" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-4 border-t border-halo-border flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-display font-semibold text-halo-navy">
                ₹{bundle.bundle_price}
              </span>
              <span className="text-xs text-halo-muted line-through">
                ₹{bundle.original_total_price}
              </span>
            </div>
            <div className="text-[10px] text-halo-teal font-medium mt-0.5">
              Includes all {steps.length} full-size formulas
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-5 py-2.5 rounded-pill text-xs font-medium tracking-tight transition-all duration-200 flex items-center space-x-2 ${
              isAdded
                ? 'bg-halo-teal text-white'
                : 'bg-halo-navy hover:shadow-halo-glow text-white active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[1.5]" />
                <span>Regimen Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                <span>Add Regimen</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Routine Steps Details Modal */}
      {showStepsModal && (
        <div className="fixed inset-0 z-50 bg-halo-navy/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-halo-surface rounded-card border border-halo-border max-w-lg w-full p-6 space-y-4 shadow-halo-subtle">
            <div className="flex items-center justify-between border-b border-halo-border pb-3">
              <div>
                <h4 className="font-display text-base font-semibold text-halo-navy">
                  Application Guide: {bundle.title}
                </h4>
                <p className="text-xs text-halo-muted">
                  Sequenced for maximum fiber absorption & barrier retention
                </p>
              </div>
              <button 
                onClick={() => setShowStepsModal(false)}
                className="p-1.5 text-halo-muted hover:text-halo-navy rounded-pill hover:bg-halo-bg"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {steps.map((st, idx) => (
                <div key={st.id || idx} className="bg-halo-bg p-3.5 rounded-card border border-halo-border space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-halo-teal uppercase tracking-wider">
                    <span>Step 0{st.step_order || idx+1}: {st.step_type}</span>
                    <span className="text-[10px] text-halo-muted lowercase font-normal">{st.frequency}</span>
                  </div>
                  <div className="text-xs font-semibold text-halo-navy">
                    {st.product?.title}
                  </div>
                  <p className="text-xs text-halo-muted leading-relaxed">
                    {st.custom_instruction}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowStepsModal(false)}
              className="w-full py-2 bg-halo-navy text-white text-xs font-medium rounded-pill hover:bg-halo-navy/90"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
