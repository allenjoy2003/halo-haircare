import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';

export default function SocialProofGrid({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section id="social-proof" className="py-16 sm:py-20 bg-halo-surface border-t border-b border-halo-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center space-x-2 bg-halo-bg border border-halo-border px-3.5 py-1.5 rounded-pill text-xs text-halo-ink font-medium shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-halo-accent" />
            <span>Verified Regimen Outcomes</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-halo-navy tracking-tight">
            Real Strands. Real Climates. Clarified Results.
          </h2>

          <p className="text-sm sm:text-base text-halo-muted font-normal leading-relaxed">
            Real user feedback across coastal humidity and hard water tap zones following structured Halo routines.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map(review => (
            <div
              key={review.id}
              className="bg-halo-bg rounded-card p-6 border border-halo-border shadow-halo-card hover:shadow-halo-subtle transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              
              <div className="space-y-3">
                {/* Reviewer Header */}
                <div className="flex items-center space-x-3">
                  {review.before_after_image ? (
                    <img
                      src={review.before_after_image}
                      alt={review.reviewer_name}
                      className="w-11 h-11 rounded-full object-cover border border-halo-border shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-halo-surface border border-halo-border text-halo-navy font-semibold flex items-center justify-center shrink-0 text-xs">
                      {review.reviewer_name.charAt(0)}
                    </div>
                  )}

                  <div className="overflow-hidden">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-semibold text-halo-navy truncate">
                        {review.reviewer_name}
                      </span>
                      <span className="text-[11px] text-halo-muted">({review.age}y)</span>
                    </div>
                    <div className="flex items-center text-[10px] text-halo-muted truncate mt-0.5">
                      <MapPin className="w-3 h-3 text-halo-teal mr-1 shrink-0 stroke-[1.5]" />
                      <span className="truncate">{review.location}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Verified */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center text-halo-teal">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-halo-teal" />
                    ))}
                  </div>
                  {review.verified_purchase && (
                    <span className="inline-flex items-center text-[10px] font-medium text-halo-teal bg-halo-surface px-2 py-0.5 rounded-pill border border-halo-border">
                      <ShieldCheck className="w-3 h-3 mr-1 stroke-[1.5]" />
                      Verified
                    </span>
                  )}
                </div>

                {/* Hair Type Pill */}
                <div className="bg-halo-surface p-2 rounded-lg border border-halo-border/70 text-[11px]">
                  <div className="text-halo-navy font-medium">Pattern: {review.hair_type_profile}</div>
                  <div className="text-halo-muted text-[10px] mt-0.5">Stress: {review.climate_condition}</div>
                </div>

                {/* Testimonial Quote */}
                <blockquote className="text-xs text-halo-navy/90 leading-relaxed italic">
                  "{review.review_text}"
                </blockquote>
              </div>

              {/* Verified Product / Regimen */}
              <div className="pt-3 border-t border-halo-border/60 text-[10px] text-halo-muted flex items-center justify-between">
                <span>Prescribed Routine</span>
                <span className="font-medium text-halo-navy truncate max-w-[140px]">
                  {review.product_used || 'Full Regimen'}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
