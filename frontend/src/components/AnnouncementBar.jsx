import React from 'react';
import { Sparkles } from 'lucide-react';
import { BRAND } from '../brand';

export default function AnnouncementBar() {
  const announcements = [
    "Complimentary carbon-neutral shipping on orders over ₹999",
    "Precision formulas clarified for urban humidity & hard water",
    "Cruelty-free, sulfate-free, silicone-free clinical care",
    `Meet ${BRAND.botName}: your personalized hair and scalp guide`,
    "Use code HALO10 for 10% off your first clarifying regimen",
  ];

  return (
    <div className="bg-halo-navy text-halo-bg text-xs py-2 overflow-hidden border-b border-halo-border/20 select-none relative z-40">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...announcements, ...announcements].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-3 mx-8 text-white/90 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-halo-accent shrink-0 inline-block" />
            <span className="tracking-tight">{text}</span>
            <span className="text-white/30 mx-3">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
