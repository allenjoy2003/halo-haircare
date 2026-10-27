import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Droplets, 
  Sparkles, 
  ArrowRight,
  Bot,
  Mail,
  Check
} from 'lucide-react';
import { HaloLogo } from './brand/HaloLogo';
import { BRAND } from '../brand';

export default function Footer({ onOpenChat, onOpenQuiz }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-halo-surface border-t border-halo-border text-halo-ink pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Diagnostic / Consultation Callout Card */}
        <div className="bg-halo-bg rounded-card p-8 sm:p-10 border border-halo-border flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-halo-card">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[11px] uppercase font-semibold tracking-wider text-halo-teal">
              Precision Scalp & Strand Analysis
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-halo-navy tracking-tight">
              Clarify your hair routine in 60 seconds.
            </h3>
            <p className="text-xs sm:text-sm text-halo-muted leading-relaxed">
              Take the guided diagnostic or consult with {BRAND.botName} to assess porosity, water hardness impact, and routine steps tailored to your hair pattern.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onOpenQuiz}
              className="px-6 py-3 rounded-pill bg-halo-navy text-white hover:shadow-halo-glow text-xs font-medium tracking-tight transition-all"
            >
              Take the Hair Quiz
            </button>
            <button
              onClick={onOpenChat}
              className="px-6 py-3 rounded-pill bg-white hover:bg-halo-bg text-halo-navy border border-halo-border hover:border-halo-teal text-xs font-medium tracking-tight transition-all flex items-center justify-center space-x-2"
            >
              <Bot className="w-4 h-4 text-halo-teal stroke-[1.5]" />
              <span>Ask {BRAND.botName}</span>
            </button>
          </div>
        </div>

        {/* Links & Newsletter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-6">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <HaloLogo size={32} variant="navy" showTagline={true} />
            <p className="text-xs text-halo-muted leading-relaxed max-w-sm pt-2">
              Clean, minimalist haircare formulations engineered for real textures and urban environmental stressors. Focused actives, zero filler.
            </p>
            <div className="text-[11px] text-halo-muted/80 pt-2 border-t border-halo-border/60">
              {BRAND.disclaimer}
            </div>
          </div>

          {/* Regimens */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-halo-navy">Regimens</h4>
            <ul className="space-y-2 text-xs text-halo-muted">
              <li><a href="#routines-section" className="hover:text-halo-navy transition-colors">Moisture Balance</a></li>
              <li><a href="#routines-section" className="hover:text-halo-navy transition-colors">Curl Definition</a></li>
              <li><a href="#routines-section" className="hover:text-halo-navy transition-colors">Scalp Equilibrium</a></li>
              <li><a href="#routines-section" className="hover:text-halo-navy transition-colors">Mineral Clarification</a></li>
              <li><a href="#products-section" className="hover:text-halo-navy transition-colors">All Formulas</a></li>
            </ul>
          </div>

          {/* Science & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-halo-navy">Tools & Science</h4>
            <ul className="space-y-2 text-xs text-halo-muted">
              <li><button onClick={onOpenQuiz} className="hover:text-halo-navy transition-colors text-left">Hair Quiz</button></li>
              <li><button onClick={onOpenChat} className="hover:text-halo-navy transition-colors text-left">Ask {BRAND.botName}</button></li>
              <li><a href="#science-section" className="hover:text-halo-navy transition-colors">Active Ingredients</a></li>
              <li><a href="#science-section" className="hover:text-halo-navy transition-colors">Porosity Testing</a></li>
              <li><a href="#science-section" className="hover:text-halo-navy transition-colors">Water Hardness Map</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-halo-navy">Stay Clarified</h4>
            <p className="text-xs text-halo-muted">
              Monthly scientific breakdowns on hair fiber health and new batch releases.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="your.email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-halo-bg border border-halo-border rounded-pill px-4 py-2 text-xs text-halo-ink placeholder:text-halo-muted outline-none focus:border-halo-teal"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-halo-navy text-white rounded-pill text-[11px] font-medium hover:bg-halo-navy/90 transition flex items-center justify-center"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5 text-halo-accent stroke-[1.5]" /> : <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />}
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-halo-teal font-medium">Thank you for subscribing.</div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-halo-border flex flex-col sm:flex-row items-center justify-between text-xs text-halo-muted gap-4">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved. Clean, clarified haircare.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-halo-navy transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-halo-navy transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-halo-navy transition-colors">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
