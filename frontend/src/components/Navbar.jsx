import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  ChevronDown, 
  Bot, 
  User,
  SlidersHorizontal,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { HaloLogo } from './brand/HaloLogo';
import AccountMenu from './AccountMenu';
import { BRAND } from '../brand';

export default function Navbar({ onOpenChat, onOpenQuiz, onSelectConcern, onSelectHairType, searchQuery, setSearchQuery, onOpenOrders }) {
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, isLoadingAuth, openLoginModal, openSignupModal } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoutineMenuOpen, setIsRoutineMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const routinesList = [
    { name: "Clarifying Moisture Shield", type: "wavy", desc: "For wavy strands in high-humidity climates" },
    { name: "Deep Curl Definition System", type: "curly", desc: "For curl patterns needing weightless clumping" },
    { name: "Follicular Density & Scalp Balance", concern: "hairfall-thinning", desc: "For micro-circulation and root fortification" },
    { name: "Mineral Clarification & Fiber Repair", concern: "hard-water-damage", desc: "Chelating wash routine for mineral-heavy water" },
  ];

  const handleRoutineClick = (routine) => {
    setIsRoutineMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (routine.type) onSelectHairType(routine.type);
    if (routine.concern) onSelectConcern(routine.concern);
    const element = document.getElementById('routines-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header 
      className={`sticky top-0 z-30 transition-all duration-300 ${
        isScrolled 
          ? 'bg-halo-surface/85 backdrop-blur-md border-b border-halo-border shadow-halo-card' 
          : 'bg-halo-bg border-b border-halo-border/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Mobile Toggle & Minimal Links */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-halo-ink hover:text-halo-teal focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
            </button>

            {/* Brand Logo */}
            <a href="#" className="flex items-center focus:outline-none" aria-label="Halo Home">
              <HaloLogo size={30} variant="navy" showTagline={false} />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7 pl-4 text-sm font-medium text-halo-muted">
              {/* Routines Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsRoutineMenuOpen(!isRoutineMenuOpen)}
                  onMouseEnter={() => setIsRoutineMenuOpen(true)}
                  className="flex items-center space-x-1.5 hover:text-halo-ink transition-colors focus:outline-none py-2"
                >
                  <span>Regimens</span>
                  <ChevronDown className={`w-3.5 h-3.5 stroke-[1.5] transition-transform duration-200 ${isRoutineMenuOpen ? 'rotate-180 text-halo-teal' : ''}`} />
                </button>

                {isRoutineMenuOpen && (
                  <div 
                    onMouseLeave={() => setIsRoutineMenuOpen(false)}
                    className="absolute top-full left-0 w-80 bg-halo-surface border border-halo-border rounded-card shadow-halo-subtle p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    <div className="text-[11px] font-semibold tracking-wider text-halo-muted uppercase px-3 py-1.5 border-b border-halo-border/60">
                      Curated Clinical Regimens
                    </div>
                    <div className="py-1 space-y-1">
                      {routinesList.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => handleRoutineClick(r)}
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-halo-bg transition group"
                        >
                          <div className="text-xs font-semibold text-halo-ink group-hover:text-halo-teal transition-colors">
                            {r.name}
                          </div>
                          <div className="text-[11px] text-halo-muted mt-0.5 line-clamp-1">
                            {r.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a 
                href="#products-section" 
                className="hover:text-halo-ink transition-colors"
              >
                Formulas
              </a>

              <button
                onClick={onOpenQuiz}
                className="hover:text-halo-ink transition-colors flex items-center space-x-1.5"
              >
                <span>Diagnostic Quiz</span>
              </button>

              <a 
                href="#science-section" 
                className="hover:text-halo-ink transition-colors"
              >
                The Science
              </a>
            </nav>
          </div>

          {/* Right: Search, Ask Aria, Auth Buttons / AccountMenu, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Inline search bar (Desktop) */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search formulas or concerns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 lg:w-64 pl-9 pr-4 py-2 bg-halo-surface border border-halo-border rounded-pill text-xs text-halo-ink placeholder:text-halo-muted/70 focus:bg-white focus:border-halo-teal focus:ring-1 focus:ring-halo-teal transition-all outline-none"
              />
              <Search className="w-4 h-4 stroke-[1.5] text-halo-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-halo-muted hover:text-halo-ink text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-halo-muted hover:text-halo-ink rounded-pill transition"
              aria-label="Search formulas"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* "Ask Aria" AI Guide Button */}
            <button
              onClick={onOpenChat}
              className="relative inline-flex items-center space-x-2 px-3 py-1.5 bg-halo-surface border border-halo-border hover:border-halo-teal text-halo-ink text-xs font-medium rounded-pill shadow-xs hover:shadow-halo-glow transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-halo-accent animate-pulse" />
              <span className="group-hover:text-halo-teal transition-colors">Ask {BRAND.botName}</span>
            </button>

            {/* Auth Buttons or Account Avatar Dropdown */}
            {isLoadingAuth ? (
              <div className="w-16 h-7 rounded-pill bg-halo-border/40 animate-pulse" />
            ) : isAuthenticated ? (
              <AccountMenu onOpenOrders={onOpenOrders} />
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => openLoginModal()}
                  className="px-3 py-1.5 rounded-pill border border-halo-navy text-halo-navy hover:bg-halo-navy hover:text-white text-xs font-medium transition shadow-xs"
                >
                  Log in
                </button>
                <button
                  onClick={() => openSignupModal()}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-pill bg-halo-navy text-white hover:bg-halo-navy/90 text-xs font-medium transition shadow-xs"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-halo-ink hover:text-halo-teal rounded-pill transition"
              aria-label={`Cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-halo-navy text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {isSearchOpen && (
          <div className="md:hidden pb-4 pt-1 animate-in fade-in duration-150">
            <div className="relative">
              <input
                type="text"
                placeholder="Search formulas or concerns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 bg-halo-surface border border-halo-border rounded-pill text-xs text-halo-ink placeholder:text-halo-muted outline-none focus:border-halo-teal"
              />
              <Search className="w-4 h-4 stroke-[1.5] text-halo-muted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-halo-border bg-halo-surface px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-halo-ink hover:text-halo-teal rounded-lg hover:bg-halo-bg"
            >
              Diagnostic Quiz
            </button>
            <a
              href="#products-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-halo-ink hover:text-halo-teal rounded-lg hover:bg-halo-bg"
            >
              Formulas Catalog
            </a>
            <a
              href="#routines-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-halo-ink hover:text-halo-teal rounded-lg hover:bg-halo-bg"
            >
              Curated Regimens
            </a>
            <a
              href="#science-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-halo-ink hover:text-halo-teal rounded-lg hover:bg-halo-bg"
            >
              The Science
            </a>
          </div>

          <div className="pt-2 border-t border-halo-border space-y-2">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openLoginModal();
                  }}
                  className="w-full py-2 border border-halo-navy text-halo-navy text-xs font-semibold rounded-pill text-center"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openSignupModal();
                  }}
                  className="w-full py-2 bg-halo-navy text-white text-xs font-semibold rounded-pill text-center"
                >
                  Sign up
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenOrders) onOpenOrders();
                }}
                className="w-full py-2 bg-halo-bg border border-halo-border text-halo-navy text-xs font-semibold rounded-pill text-center"
              >
                View My Orders
              </button>
            )}

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full py-2.5 bg-halo-navy text-white text-xs font-medium rounded-pill flex items-center justify-center space-x-2 shadow-sm"
            >
              <Bot className="w-4 h-4 text-halo-accent stroke-[1.5]" />
              <span>Consult with {BRAND.botName}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
