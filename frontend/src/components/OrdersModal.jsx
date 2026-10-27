import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function OrdersModal({ isOpen, onClose }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    async function loadOrders() {
      setIsLoading(true);
      setError('');
      try {
        const data = await api.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load orders.');
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-halo-navy/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-halo-surface rounded-card max-w-lg w-full p-6 border border-halo-border shadow-halo-subtle relative max-h-[85vh] flex flex-col justify-between animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-halo-border pb-3.5">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-halo-navy stroke-[1.5]" />
            <h3 className="font-display text-base font-semibold text-halo-navy">
              My Regimen Orders
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-pill text-halo-muted hover:text-halo-navy hover:bg-halo-bg transition"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Orders List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs">
          {isLoading ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-6 h-6 border-2 border-halo-teal border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-halo-muted">Loading your past orders...</div>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs">{error}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Package className="w-10 h-10 text-halo-muted/50 mx-auto stroke-[1.5]" />
              <h4 className="font-display text-sm font-semibold text-halo-navy">No orders found</h4>
              <p className="text-halo-muted text-xs">When you place an order, it will appear here.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.order_id} className="bg-halo-bg p-3.5 rounded-card border border-halo-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-halo-navy">Order #{ord.order_id.slice(0, 8)}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-pill ${
                    ord.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-halo-muted text-[11px]">
                  <span>Total: ₹{ord.amount.toFixed(2)}</span>
                  <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                </div>
                {ord.items && ord.items.length > 0 && (
                  <div className="pt-1.5 border-t border-halo-border/60 text-[11px] text-halo-muted">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="truncate">
                        • {it.title} × {it.quantity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 bg-halo-navy text-white text-xs font-medium rounded-pill hover:bg-halo-navy/90"
        >
          Close
        </button>
      </div>
    </div>
  );
}
