import React, { useState } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Eye, 
  Check, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const stepLabels = {
    'prep': '00 Prep',
    'cleanse': '01 Cleanse',
    'condition': '02 Condition',
    'treat': '03 Treat',
    'define': '04 Define',
    'protect': '05 Protect',
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="bg-halo-surface rounded-card border border-halo-border overflow-hidden shadow-halo-card hover:shadow-halo-subtle transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
    >
      
      {/* Product Image & Badges */}
      <div className="relative h-64 overflow-hidden bg-halo-bg">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          {product.is_bestseller && (
            <span className="bg-halo-navy text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-pill shadow-xs">
              Formula Core
            </span>
          )}
          {product.discount_percent > 0 && (
            <span className="bg-halo-accent text-halo-navy text-[10px] font-semibold px-2 py-0.5 rounded-pill shadow-xs">
              Save {product.discount_percent}%
            </span>
          )}
        </div>

        {/* Step Badge */}
        <div className="absolute top-3 right-3 bg-halo-surface/95 backdrop-blur-sm text-halo-navy border border-halo-border text-[10px] font-semibold px-2.5 py-0.5 rounded-pill">
          {stepLabels[product.routine_step] || product.routine_step}
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 bg-halo-surface/90 hover:bg-white text-halo-navy p-2 rounded-full shadow-sm hover:shadow transition opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-200"
          title="Quick View Formula"
        >
          <Eye className="w-4 h-4 stroke-[1.5]" />
        </button>

        {/* Size Badge */}
        <div className="absolute bottom-3 left-3 text-[11px] font-medium text-halo-muted bg-halo-surface/90 backdrop-blur-xs px-2 py-0.5 rounded-pill border border-halo-border/80">
          {product.size}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-1.5">
          {/* Hair types supported */}
          <div className="flex items-center space-x-1 overflow-hidden">
            {product.hair_types?.slice(0, 3).map(ht => (
              <span key={ht.id} className="text-[10px] font-medium text-halo-teal bg-halo-bg px-2 py-0.5 rounded-pill border border-halo-border/80">
                Type {ht.code}
              </span>
            ))}
          </div>

          {/* Title & Subtitle */}
          <h3 className="font-display text-base font-semibold text-halo-navy group-hover:text-halo-teal transition line-clamp-1 mt-1">
            {product.title}
          </h3>
          <p className="text-xs text-halo-muted line-clamp-1">
            {product.subtitle}
          </p>

          {/* Key Ingredients Pill */}
          <div className="pt-1.5 flex flex-wrap gap-1">
            {product.key_ingredients?.split(',').slice(0, 2).map((ing, i) => (
              <span key={i} className="text-[10px] text-halo-muted bg-halo-bg px-2 py-0.5 rounded-pill border border-halo-border/60">
                {ing.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-halo-border flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-display font-semibold text-halo-navy">
                ₹{product.effective_price || product.price}
              </span>
              {product.discount_percent > 0 && (
                <span className="text-xs text-halo-muted line-through">
                  ₹{product.price}
                </span>
              )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1 mt-0.5">
              <Star className="w-3 h-3 text-halo-teal fill-halo-teal" />
              <span className="text-[11px] font-semibold text-halo-navy">{product.rating}</span>
              <span className="text-[10px] text-halo-muted">({product.reviews_count})</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-pill transition-all duration-200 ${
              isAdded
                ? 'bg-halo-teal text-white'
                : 'bg-halo-navy hover:shadow-halo-glow text-white active:scale-95'
            }`}
            title="Add formula to cart"
          >
            {isAdded ? <Check className="w-4 h-4 stroke-[1.5]" /> : <ShoppingBag className="w-4 h-4 stroke-[1.5]" />}
          </button>
        </div>

      </div>

    </div>
  );
}
