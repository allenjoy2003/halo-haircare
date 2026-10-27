import React, { useState, useRef, useEffect } from 'react';
import { User, Package, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AccountMenu({ onOpenOrders }) {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const rawName = user.first_name || user.username || 'Customer';
  const firstName = rawName.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 py-1.5 px-2.5 rounded-pill bg-halo-surface border border-halo-border hover:border-halo-teal transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-halo-teal"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="w-6 h-6 rounded-full bg-halo-navy text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
          {initial}
        </span>
        <span className="text-xs font-semibold text-halo-navy max-w-[85px] sm:max-w-[120px] truncate">
          {firstName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-halo-muted stroke-[1.5] transition-transform duration-200 ${isOpen ? 'rotate-180 text-halo-teal' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-48 bg-halo-surface rounded-card border border-halo-border shadow-halo-subtle p-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 border-b border-halo-border/60">
            <div className="text-[11px] text-halo-muted font-medium">Logged in as</div>
            <div className="text-xs font-semibold text-halo-navy truncate">{user.username}</div>
          </div>

          <div className="py-1 space-y-0.5">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenOrders) onOpenOrders();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-halo-ink hover:bg-halo-bg hover:text-halo-teal transition flex items-center space-x-2"
            >
              <Package className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-halo-error hover:bg-red-50 transition flex items-center space-x-2"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
