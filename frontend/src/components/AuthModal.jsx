import React, { useState } from 'react';
import { X, Lock, Phone, User, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authModalMode === 'login') {
        await login(phone, password);
      } else if (authModalMode === 'signup') {
        await register({ name, phoneNumber: phone, password, email });
      } else if (authModalMode === 'forgot') {
        setForgotSubmitted(true);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-halo-navy/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-halo-surface rounded-card max-w-sm w-full p-6 sm:p-7 border border-halo-border shadow-halo-subtle relative animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-pill text-halo-muted hover:text-halo-navy hover:bg-halo-bg transition"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 stroke-[1.5]" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-5">
          <div className="w-10 h-10 rounded-full bg-halo-bg border border-halo-border flex items-center justify-center mx-auto text-halo-teal">
            <Lock className="w-5 h-5 stroke-[1.5]" />
          </div>
          <h3 className="font-display text-lg font-semibold text-halo-navy">
            {authModalMode === 'login' && 'Log in to Halo'}
            {authModalMode === 'signup' && 'Create Your Account'}
            {authModalMode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-halo-muted">
            {authModalMode === 'login' && 'Access saved regimens, orders & customized Aria guidance.'}
            {authModalMode === 'signup' && 'Unlock personalized hair profiles and order tracking.'}
            {authModalMode === 'forgot' && 'Enter your mobile number to receive reset instructions.'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-start space-x-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {forgotSubmitted ? (
          <div className="space-y-4 text-center py-3">
            <p className="text-xs text-halo-muted">
              If an account is associated with <strong>{phone}</strong>, a recovery verification link has been sent via SMS.
            </p>
            <button
              onClick={() => {
                setForgotSubmitted(false);
                setAuthModalMode('login');
              }}
              className="w-full py-2.5 bg-halo-navy text-white text-xs font-medium rounded-pill"
            >
              Back to Log In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {authModalMode === 'signup' && (
              <div>
                <label className="text-[11px] font-semibold text-halo-navy block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-halo-bg border border-halo-border rounded-lg text-xs text-halo-ink outline-none focus:border-halo-teal"
                  />
                  <User className="w-3.5 h-3.5 text-halo-muted absolute left-2.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-halo-navy block mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-halo-bg border border-halo-border rounded-lg text-xs text-halo-ink outline-none focus:border-halo-teal"
                />
                <Phone className="w-3.5 h-3.5 text-halo-muted absolute left-2.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
              </div>
            </div>

            {authModalMode === 'signup' && (
              <div>
                <label className="text-[11px] font-semibold text-halo-navy block mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-halo-bg border border-halo-border rounded-lg text-xs text-halo-ink outline-none focus:border-halo-teal"
                  />
                  <Mail className="w-3.5 h-3.5 text-halo-muted absolute left-2.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                </div>
              </div>
            )}

            {authModalMode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-semibold text-halo-navy">Password</label>
                  {authModalMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('forgot')}
                      className="text-[10px] text-halo-teal hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-halo-bg border border-halo-border rounded-lg text-xs text-halo-ink outline-none focus:border-halo-teal"
                  />
                  <Lock className="w-3.5 h-3.5 text-halo-muted absolute left-2.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 bg-halo-navy text-white text-xs font-medium rounded-pill hover:shadow-halo-glow transition flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {authModalMode === 'login' && 'Log in'}
                    {authModalMode === 'signup' && 'Create Account'}
                    {authModalMode === 'forgot' && 'Send Reset Code'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Mode Switcher Footer */}
        <div className="mt-4 pt-3 border-t border-halo-border text-center text-xs text-halo-muted">
          {authModalMode === 'login' && (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('signup')}
                className="text-halo-teal font-semibold hover:underline"
              >
                Sign up
              </button>
            </span>
          )}
          {authModalMode === 'signup' && (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-halo-teal font-semibold hover:underline"
              >
                Log in
              </button>
            </span>
          )}
          {authModalMode === 'forgot' && (
            <span>
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-halo-teal font-semibold hover:underline"
              >
                Back to log in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
