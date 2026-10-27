import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Check,
  Phone,
  KeyRound,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { BRAND } from '../brand';

export default function CartDrawer() {
  const {
    cartItems,
    totalItems,
    rawSubtotal,
    discountAmount,
    grandTotal,
    shippingFee,
    isFreeShipping,
    remainingForFreeShipping,
    shippingProgress,
    appliedPromo,
    promoError,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useCart();

  const { user, isAuthenticated, openLoginModal } = useAuth();

  const [promoInput, setPromoInput] = useState('');
  
  // Checkout & Verification Workflow States:
  // 'cart' -> 'details_otp' -> 'verify_otp' -> 'razorpay' -> 'complete'
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [razorpayOrderData, setRazorpayOrderData] = useState(null);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromoCode(promoInput);
      setPromoInput('');
    }
  };

  // Step 1: Request Twilio OTP SMS
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!customerPhone.trim()) {
      setErrorMessage('Please enter a valid mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendOtp(customerPhone);
      setCheckoutStep('verify_otp');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch SMS verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify Twilio OTP Code & Create Razorpay Order
  const handleVerifyOtpAndProceed = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!otpCode.trim() || otpCode.length < 4) {
      setErrorMessage('Please enter the 6-digit code sent to your phone.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Verify OTP with Twilio Verify Service
      await api.verifyOtp(customerPhone, otpCode);
      setIsPhoneVerified(true);

      // 2. Create Razorpay Order on Backend
      const orderPayload = {
        amount: grandTotal,
        customer_phone: customerPhone,
        customer_name: customerName,
        customer_email: customerEmail,
        shipping_address: shippingAddress,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          is_bundle: item.is_bundle || false
        }))
      };

      const rzpRes = await api.createRazorpayOrder(orderPayload);
      setCurrentOrderId(rzpRes.order_id);
      setRazorpayOrderData(rzpRes);

      // 3. Launch Razorpay Checkout Modal
      openRazorpayModal(rzpRes);
    } catch (err) {
      setErrorMessage(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Trigger Razorpay Modal
  const openRazorpayModal = (rzpData) => {
    if (!window.Razorpay) {
      setErrorMessage('Razorpay SDK failed to load. Please refresh the page.');
      return;
    }

    const options = {
      key: rzpData.key_id,
      amount: rzpData.amount,
      currency: rzpData.currency || 'INR',
      name: 'halo',
      description: 'Precision Haircare Regimen Order',
      order_id: rzpData.razorpay_order_id,
      image: '/favicon.svg',
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      theme: {
        color: '#0B1B2B' // Halo Deep Navy
      },
      handler: async function (response) {
        setIsLoading(true);
        try {
          // Verify cryptographic HMAC-SHA256 signature on backend
          await api.verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order_id: rzpData.order_id
          });

          // Successful payment confirmation
          setCheckoutStep('complete');
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // ignore
          }
        } catch (err) {
          setErrorMessage('Payment confirmation failed. Please contact support.');
        } finally {
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setErrorMessage('Payment was cancelled. You can retry when ready.');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      setErrorMessage(`Payment Failed: ${response.error.description}`);
    });
    rzp.open();
  };

  const handleCloseAndReset = () => {
    closeCart();
    if (checkoutStep === 'complete') {
      clearCart();
      setCheckoutStep('cart');
      setCustomerName('');
      setCustomerPhone('');
      setCustomerEmail('');
      setShippingAddress('');
      setOtpCode('');
      setErrorMessage('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      // Prompt login without losing cart, and auto-resume checkout after login
      openLoginModal(() => {
        setCheckoutStep('details_otp');
      });
      return;
    }
    setCheckoutStep('details_otp');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={handleCloseAndReset}
        className="absolute inset-0 bg-halo-navy/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-halo-surface border-l border-halo-border shadow-halo-drawer flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-halo-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-halo-navy stroke-[1.5]" />
              <h2 className="font-display text-base font-semibold text-halo-navy">
                {checkoutStep === 'cart' && 'Your Regimen Cart'}
                {checkoutStep === 'details_otp' && 'Shipping & Verification'}
                {checkoutStep === 'verify_otp' && 'Verify Phone via SMS'}
                {checkoutStep === 'complete' && 'Order Confirmed'}
              </h2>
              {checkoutStep === 'cart' && (
                <span className="text-xs bg-halo-bg text-halo-muted px-2 py-0.5 rounded-pill font-medium border border-halo-border">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>

            <button
              onClick={handleCloseAndReset}
              className="p-1.5 text-halo-muted hover:text-halo-navy rounded-pill hover:bg-halo-bg transition"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 stroke-[1.5]" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* STEP: ORDER COMPLETE */}
            {checkoutStep === 'complete' ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-halo-accent/20 border border-halo-accent flex items-center justify-center mx-auto text-halo-teal">
                  <Check className="w-8 h-8 stroke-[2]" />
                </div>
                <h3 className="font-display text-xl font-semibold text-halo-navy">
                  Payment Confirmed
                </h3>
                <p className="text-xs text-halo-muted max-w-xs mx-auto leading-relaxed">
                  Your payment via Razorpay was captured successfully. A confirmation SMS has been dispatched to <strong>{customerPhone}</strong>.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleCloseAndReset}
                    className="w-full py-3 bg-halo-navy text-white text-xs font-medium rounded-pill hover:shadow-halo-glow transition"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>

            /* STEP: DETAILS & PHONE NUMBER */
            ) : checkoutStep === 'details_otp' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-semibold text-halo-navy">
                    1. Shipping & Contact Details
                  </h3>
                  <p className="text-[11px] text-halo-muted">
                    We verify your phone with an instant Twilio SMS OTP to secure your order.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-halo-navy block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-halo-bg border border-halo-border rounded-lg text-xs text-halo-ink outline-none focus:border-halo-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-halo-navy block mb-1">Mobile Number (for Twilio OTP)</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-halo-bg border border-halo-border rounded-lg text-xs text-halo-ink outline-none focus:border-halo-teal"
                      />
                      <Phone className="w-4 h-4 text-halo-muted absolute left-3 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-halo-navy block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="priya@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-halo-bg border border-halo-border rounded-lg text-xs text-halo-ink outline-none focus:border-halo-teal"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-halo-navy block mb-1">Delivery Address</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat, building, street, city & PIN code"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-halo-bg border border-halo-border rounded-lg text-xs text-halo-ink outline-none focus:border-halo-teal"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-halo-navy text-white text-xs font-medium rounded-pill hover:shadow-halo-glow transition flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-halo-accent stroke-[1.5]" />
                        <span>Send Twilio SMS Verification Code</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="w-full text-center text-xs text-halo-muted hover:text-halo-navy py-1"
                  >
                    ← Back to Cart
                  </button>
                </div>
              </form>

            /* STEP: ENTER OTP */
            ) : checkoutStep === 'verify_otp' ? (
              <form onSubmit={handleVerifyOtpAndProceed} className="space-y-4 animate-in fade-in">
                <div className="space-y-1">
                  <h3 className="font-display text-sm font-semibold text-halo-navy">
                    2. Enter SMS Verification Code
                  </h3>
                  <p className="text-[11px] text-halo-muted">
                    Twilio dispatched a 6-digit verification code to <strong>{customerPhone}</strong>.
                  </p>
                </div>

                <div className="py-2">
                  <label className="text-[11px] font-semibold text-halo-navy block mb-1">6-Digit Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full tracking-widest text-center text-lg font-bold py-2.5 bg-halo-bg border border-halo-border rounded-lg text-halo-navy outline-none focus:border-halo-teal"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 4}
                    className="w-full py-3 bg-halo-navy text-white text-xs font-medium rounded-pill hover:shadow-halo-glow transition flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-halo-accent stroke-[1.5]" />
                        <span>Verify & Pay with Razorpay (₹{grandTotal.toFixed(2)})</span>
                      </>
                    )}
                  </button>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('details_otp')}
                      className="text-halo-muted hover:text-halo-navy"
                    >
                      ← Change number
                    </button>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={isLoading}
                      className="text-halo-teal font-medium hover:underline"
                    >
                      Resend SMS Code
                    </button>
                  </div>
                </div>
              </form>

            /* STEP: CART ITEMS */
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-12 h-12 rounded-full bg-halo-bg border border-halo-border flex items-center justify-center mx-auto text-halo-muted">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="font-display text-base font-semibold text-halo-navy">
                  Your cart is empty
                </h3>
                <p className="text-xs text-halo-muted max-w-xs mx-auto">
                  Explore our targeted formulas or take the 60-second hair quiz for a custom prescription.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 px-6 py-2.5 bg-halo-navy text-white text-xs font-medium rounded-pill"
                >
                  Explore Formulas
                </button>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress Indicator */}
                <div className="bg-halo-bg p-4 rounded-card border border-halo-border space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-halo-navy">
                    <span className="flex items-center space-x-1.5">
                      <Truck className="w-3.5 h-3.5 text-halo-teal stroke-[1.5]" />
                      <span>{isFreeShipping ? 'Complimentary carbon-neutral shipping unlocked' : `Add ₹${remainingForFreeShipping} more for free shipping`}</span>
                    </span>
                    <span className="text-[11px] text-halo-muted">{Math.round(shippingProgress)}%</span>
                  </div>
                  <div className="w-full bg-halo-border/80 h-1.5 rounded-pill overflow-hidden">
                    <div 
                      className="bg-halo-teal h-full transition-all duration-300" 
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex space-x-3.5 pb-4 border-b border-halo-border/60 last:border-b-0"
                    >
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg object-cover bg-halo-bg border border-halo-border shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-semibold text-halo-navy line-clamp-1">
                              {item.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-halo-muted hover:text-halo-error p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                            </button>
                          </div>
                          {item.is_bundle && (
                            <span className="inline-block text-[10px] text-halo-teal font-medium">
                              Full Regimen ({item.routine_steps?.length || 4} Steps)
                            </span>
                          )}
                          <div className="text-xs font-semibold text-halo-navy mt-0.5">
                            ₹{item.price}
                          </div>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center space-x-2 pt-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full border border-halo-border flex items-center justify-center text-halo-muted hover:border-halo-teal hover:text-halo-navy text-xs"
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                          <span className="text-xs font-semibold text-halo-navy w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full border border-halo-border flex items-center justify-center text-halo-muted hover:border-halo-teal hover:text-halo-navy text-xs"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Field */}
                <form onSubmit={handleApplyPromo} className="space-y-1.5 pt-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. HALO10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-halo-bg border border-halo-border rounded-pill text-xs text-halo-ink uppercase placeholder:normal-case outline-none focus:border-halo-teal"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-halo-navy text-white text-xs font-medium rounded-pill hover:bg-halo-navy/90"
                    >
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center justify-between text-xs text-halo-teal bg-halo-accent/15 px-3 py-1.5 rounded-lg">
                      <span>Applied: {appliedPromo.code} ({appliedPromo.discountPercent}% off)</span>
                      <button onClick={removePromoCode} className="text-halo-muted hover:text-halo-error text-[11px]">
                        Remove
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <div className="text-xs text-halo-error">{promoError}</div>
                  )}
                </form>
              </>
            )}

          </div>

          {/* Footer Checkout Breakdown */}
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <div className="p-5 border-t border-halo-border bg-halo-bg space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-halo-muted">
                  <span>Subtotal</span>
                  <span>₹{rawSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-halo-teal font-medium">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-halo-muted">
                  <span>Shipping</span>
                  <span>{isFreeShipping ? 'FREE' : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-halo-navy pt-2 border-t border-halo-border">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-halo-navy hover:shadow-halo-glow text-white text-xs font-medium rounded-pill transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
