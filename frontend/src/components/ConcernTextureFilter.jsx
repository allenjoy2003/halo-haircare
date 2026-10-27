import React, { useState } from 'react';
import { 
  Sparkles, 
  Waves, 
  ShieldAlert, 
  CloudRain, 
  TrendingDown, 
  Droplets, 
  Flame, 
  Check 
} from 'lucide-react';

export default function ConcernTextureFilter({
  concerns,
  hairTypes,
  selectedConcern,
  selectedHairType,
  onSelectConcern,
  onSelectHairType,
  totalProductsCount
}) {
  const [activeTab, setActiveTab] = useState('concern');

  const concernIcons = {
    'dandruff-itch': ShieldAlert,
    'frizz-humidity': CloudRain,
    'hairfall-thinning': TrendingDown,
    'hard-water-damage': Droplets,
    'dry-damaged': Flame,
    'curl-definition': Waves,
  };

  return (
    <div className="bg-halo-surface rounded-card p-6 sm:p-8 border border-halo-border shadow-halo-card mb-10">
      
      {/* Top Filter Tabs: Filter By Concern vs Filter By Hair Texture */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-halo-border gap-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-halo-navy tracking-tight">
            Targeted Filter System
          </h3>
          <p className="text-xs sm:text-sm text-halo-muted mt-0.5">
            Filter our clinical formulations by primary hair stressor or strand pattern.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="inline-flex p-1 bg-halo-bg rounded-pill border border-halo-border shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('concern')}
            className={`px-4 py-1.5 rounded-pill text-xs font-medium transition ${
              activeTab === 'concern'
                ? 'bg-halo-navy text-white shadow-xs'
                : 'text-halo-muted hover:text-halo-navy'
            }`}
          >
            By Scalp / Fiber Concern
          </button>
          <button
            onClick={() => setActiveTab('texture')}
            className={`px-4 py-1.5 rounded-pill text-xs font-medium transition ${
              activeTab === 'texture'
                ? 'bg-halo-navy text-white shadow-xs'
                : 'text-halo-muted hover:text-halo-navy'
            }`}
          >
            By Hair Pattern (1A - 4C)
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="pt-6">
        {activeTab === 'concern' ? (
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onSelectConcern(null)}
              className={`px-4 py-2 rounded-pill text-xs font-medium transition border flex items-center space-x-1.5 ${
                selectedConcern === null
                  ? 'bg-halo-navy text-white border-halo-navy shadow-xs'
                  : 'bg-halo-surface text-halo-muted border-halo-border hover:border-halo-teal hover:text-halo-navy'
              }`}
            >
              <span>All Concerns</span>
            </button>
            {concerns.map(c => {
              const Icon = concernIcons[c.slug] || Sparkles;
              const isSelected = selectedConcern === c.slug;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectConcern(isSelected ? null : c.slug)}
                  className={`px-4 py-2 rounded-pill text-xs font-medium transition border flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-halo-navy text-white border-halo-navy shadow-xs'
                      : 'bg-halo-surface text-halo-muted border-halo-border hover:border-halo-teal hover:text-halo-navy'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 stroke-[1.5] ${isSelected ? 'text-halo-accent' : 'text-halo-muted'}`} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onSelectHairType(null)}
              className={`px-4 py-2 rounded-pill text-xs font-medium transition border flex items-center space-x-1.5 ${
                selectedHairType === null
                  ? 'bg-halo-navy text-white border-halo-navy shadow-xs'
                  : 'bg-halo-surface text-halo-muted border-halo-border hover:border-halo-teal hover:text-halo-navy'
              }`}
            >
              <span>All Patterns</span>
            </button>
            {hairTypes.map(ht => {
              const isSelected = selectedHairType === ht.code;
              return (
                <button
                  key={ht.id}
                  onClick={() => onSelectHairType(isSelected ? null : ht.code)}
                  className={`px-4 py-2 rounded-pill text-xs font-medium transition border flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-halo-navy text-white border-halo-navy shadow-xs'
                      : 'bg-halo-surface text-halo-muted border-halo-border hover:border-halo-teal hover:text-halo-navy'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-halo-accent text-halo-navy' : 'bg-halo-bg text-halo-muted'}`}>
                    {ht.code}
                  </span>
                  <span>{ht.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
