import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const CART_STORAGE_KEY = 'halo_cart_v1';
const FREE_SHIPPING_THRESHOLD = 999;

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1, isBundle = false) => {
    setCartItems(prev => {
      const itemKey = `${isBundle ? 'bundle-' : 'prod-'}${product.id}`;
      const existing = prev.find(item => item.itemKey === itemKey);

      if (existing) {
        return prev.map(item =>
          item.itemKey === itemKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      const newItem = {
        itemKey,
        id: product.id,
        title: product.title,
        subtitle: product.subtitle || product.tagline || '',
        price: parseFloat(product.effective_price || product.bundle_price || product.price),
        original_price: parseFloat(product.original_price || product.price),
        image_url: product.image_url,
        size: product.size || (isBundle ? `${product.products?.length || 3}-Step Ritual` : ''),
        isBundle,
        quantity,
      };

      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const addRoutineToCart = (routineBundle) => {
    addToCart(routineBundle, 1, true);
  };

  const removeFromCart = (itemKey) => {
    setCartItems(prev => prev.filter(item => item.itemKey !== itemKey));
  };

  const updateQuantity = (itemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemKey);
      return;
    }
    setCartItems(prev =>
      prev.map(item => (item.itemKey === itemKey ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DRKESH10') {
      setAppliedPromo({ code: cleanCode, discountPercent: 10, label: 'Trichologist Consultation 10% Off' });
      setPromoError('');
      return true;
    } else if (cleanCode === 'AYURVEDA20') {
      setAppliedPromo({ code: cleanCode, discountPercent: 20, label: 'First Order 20% Off' });
      setPromoError('');
      return true;
    } else {
      setPromoError('Invalid coupon code. Try DRKESH10 or AYURVEDA20');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  // Calculations
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const rawSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const discountAmount = appliedPromo
    ? (rawSubtotal * appliedPromo.discountPercent) / 100
    : 0;

  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const shippingFee = cartItems.length > 0 && !isFreeShipping ? 99 : 0;
  const grandTotal = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        rawSubtotal,
        discountAmount,
        subtotal,
        shippingFee,
        grandTotal,
        isFreeShipping,
        remainingForFreeShipping,
        shippingProgress,
        appliedPromo,
        promoError,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen(prev => !prev),
        addToCart,
        addRoutineToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
