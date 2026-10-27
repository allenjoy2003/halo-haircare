import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  FlaskConical,
  Plus,
  Minus
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductQuickViewModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-halo-navy/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-halo-surface rounded-card max-w-3xl w-full p-6 sm:p-8 shadow-halo-subtle border border-halo-border relative max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-pill hover:bg-halo-bg text-halo-muted hover:text-halo-navy transition z-10"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Product Image Column */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative rounded-card overflow-hidden bg-halo-bg border border-halo-border">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-80 object-cover object-center"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                {product.is_bestseller && (
                  <span className="bg-halo-navy text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-pill shadow-xs">
                    Core Formula
                  </span>
                )}
                {product.discount_percent > 0 && (
                  <span className="bg-halo-accent text-halo-navy text-[10px] font-semibold px-2 py-0.5 rounded-pill shadow-xs">
                    Save {product.discount_percent}%
                  </span>
                )}
              </div>
            </div>

            {/* Quick Specs Cards */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-halo-bg p-2.5 rounded-lg border border-halo-border">
                <span className="text-[10px] text-halo-muted uppercase font-semibold block">Acid Mantle</span>
                <span className="font-semibold text-halo-navy">{product.ph_level?.split(' ')[0] || 'pH 5.2'}</span>
              </div>
              <div className="bg-halo-bg p-2.5 rounded-lg border border-halo-border">
                <span className="text-[10px] text-halo-muted uppercase font-semibold block">Net Volume</span>
                <span className="font-semibold text-halo-navy">{product.size}</span>
              </div>
            </div>
          </div>

          {/* Product Specs & Add to Cart Column */}
          <div className="md:col-span-7 space-y-5">
            
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-halo-teal">
                Step: {product.routine_step} • {product.category?.name || 'Clarified Treatment'}
              </div>
              <h2 className="font-display text-2xl font-semibold text-halo-navy">
                {product.title}
              </h2>
              <p className="text-xs text-halo-muted">
                {product.subtitle}
              </p>

              {/* Rating */}
              <div className="flex items-center space-x-2 pt-1">
                <div className="flex items-center text-halo-teal">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-halo-teal" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-halo-navy">{product.rating}</span>
                <span className="text-xs text-halo-muted">({product.reviews_count} verified reviews)</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-3 pb-3 border-b border-halo-border">
              <span className="text-2xl font-display font-semibold text-halo-navy">
                ₹{product.effective_price || product.price}
              </span>
              {product.discount_percent > 0 && (
                <span className="text-sm text-halo-muted line-through">
                  ₹{product.price}
                </span>
              )}
            </div>

            {/* Actives & Formulation details */}
            <div className="space-y-2 text-xs">
              <div className="bg-halo-bg p-3 rounded-lg border border-halo-border space-y-1">
                <div className="font-semibold text-halo-navy flex items-center space-x-1">
                  <FlaskConical className="w-3.5 h-3.5 text-halo-teal stroke-[1.5]" />
                  <span>Clinical Actives:</span>
                </div>
                <div className="text-halo-muted leading-relaxed">
                  {product.clinical_actives || product.key_ingredients}
                </div>
              </div>

              <div>
                <span className="font-semibold text-halo-navy block mb-1">Fiber Action:</span>
                <p className="text-halo-muted leading-relaxed">
                  {product.description || product.benefits}
                </p>
              </div>
            </div>

            {/* Quantity Selector & Action */}
            <div className="pt-2 flex items-center space-x-3">
              <div className="flex items-center border border-halo-border rounded-pill bg-halo-bg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-halo-navy transition"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
                <span className="w-8 text-center text-xs font-semibold text-halo-navy">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-halo-navy transition"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3 px-6 rounded-pill text-xs font-medium tracking-tight transition-all flex items-center justify-center space-x-2 ${
                  isAdded
                    ? 'bg-halo-teal text-white'
                    : 'bg-halo-navy hover:shadow-halo-glow text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[1.5]" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                    <span>Add to Regimen • ₹{(parseFloat(product.effective_price || product.price) * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
