import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Eye, 
  Info,
  ChevronDown
} from 'lucide-react';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../brand';

const QUICK_PROMPTS = [
  "My scalp feels itchy with flaky buildup",
  "How can I manage wavy hair in high humidity?",
  "Hard tap water left my hair stiff and dull",
  "I'm experiencing excess wash-day shedding",
  "How do I achieve defined curls without crunch?"
];

function getGreeting(user) {
  if (user) {
    const rawName = user.first_name || user.username || 'there';
    const firstName = rawName.split(' ')[0];
    return `Hi ${firstName}, I'm **${BRAND.botName}**, your Halo hair guide. What would you like to work on today?`;
  }
  return `Hi, I'm **${BRAND.botName}**, your Halo hair guide. How can I help with your hair today?`;
}

export default function AriaChat({ isOpen, onClose, initialProfile, onQuickViewProduct }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'guide',
      text: getGreeting(user),
      recommended_products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => sessionStorage.getItem('halo_aria_session_id') || '');
  const [addedProductIds, setAddedProductIds] = useState({});
  const messagesEndRef = useRef(null);

  // When user logs in or out, reset conversation & start fresh
  const prevUserRef = useRef(user?.id);
  useEffect(() => {
    if (prevUserRef.current !== user?.id) {
      prevUserRef.current = user?.id;
      sessionStorage.removeItem('halo_aria_session_id');
      setSessionId('');
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          sender: 'guide',
          text: getGreeting(user),
          recommended_products: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle incoming initial profile from Quiz
  useEffect(() => {
    if (initialProfile && initialProfile.initialMessage) {
      handleSendMessage(initialProfile.initialMessage, initialProfile.userProfile);
    }
  }, [initialProfile]);

  const handleSendMessage = async (textToSend = null, customProfile = null) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message,
      recommended_products: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.sendHairConsultation({
        message,
        session_id: sessionId || undefined,
        hair_profile: customProfile || undefined,
      });

      if (response.session_id) {
        setSessionId(response.session_id);
        sessionStorage.setItem('halo_aria_session_id', response.session_id);
      }

      const guideMsg = {
        id: `guide-${Date.now()}`,
        sender: 'guide',
        text: response.reply,
        recommended_products: response.recommended_products || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, guideMsg]);
    } catch (err) {
      console.error('Aria consultation error:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'guide',
        text: "I'm having a brief connection issue reaching the formulation catalog. Please try your question again in a moment.",
        recommended_products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedProductIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductIds(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (!isOpen) return null;

  const userFirstName = user ? (user.first_name || user.username || '').split(' ')[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 pointer-events-none">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="pointer-events-auto bg-halo-surface w-full sm:max-w-md h-[92vh] sm:h-[650px] rounded-t-card sm:rounded-card border border-halo-border shadow-halo-drawer flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
      >
        
        {/* Header */}
        <div className="p-4 border-b border-halo-border bg-halo-bg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-halo-surface border border-halo-border flex items-center justify-center text-halo-navy">
                <Bot className="w-5 h-5 text-halo-teal stroke-[1.5]" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-halo-teal border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-display text-sm font-semibold text-halo-navy">{BRAND.botName}</h3>
                <span className="text-[10px] bg-halo-accent/20 text-halo-teal font-medium px-2 py-0.5 rounded-pill">
                  {BRAND.botTitle}
                </span>
              </div>
              <p className="text-[11px] text-halo-muted truncate max-w-[190px]">
                {userFirstName ? `Chatting as ${userFirstName}` : 'Halo formulation specialist'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-halo-muted hover:text-halo-navy rounded-pill hover:bg-halo-surface transition"
            aria-label="Close Aria chat"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Persistent Legal Disclaimer */}
        <div className="px-4 py-2 bg-halo-bg/70 border-b border-halo-border text-[11px] text-halo-muted text-center">
          {BRAND.disclaimer}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-card p-3.5 space-y-2 leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-halo-navy text-white'
                      : 'bg-halo-bg text-halo-navy border border-halo-border'
                  }`}
                >
                  <div className="whitespace-pre-line text-xs font-sans">
                    {msg.text}
                  </div>

                  <span className={`text-[10px] block text-right mt-1 ${isUser ? 'text-white/60' : 'text-halo-muted'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Grounded Product Recommendations Card Carousel */}
                {!isUser && msg.recommended_products && msg.recommended_products.length > 0 && (
                  <div className="mt-3 w-full space-y-2">
                    <span className="text-[11px] font-semibold text-halo-navy uppercase tracking-wider block">
                      Prescribed Formulations:
                    </span>
                    <div className="space-y-2">
                      {msg.recommended_products.map((p) => {
                        const isAdded = addedProductIds[p.id];
                        return (
                          <div
                            key={p.id}
                            className="bg-white rounded-card p-3 border border-halo-border flex items-center justify-between space-x-3 shadow-xs"
                          >
                            <img
                              src={p.image_url}
                              alt={p.title}
                              className="w-12 h-12 rounded-lg object-cover bg-halo-bg border border-halo-border shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-xs text-halo-navy truncate">
                                {p.title}
                              </h5>
                              <p className="text-[10px] text-halo-muted truncate">
                                {p.routine_step ? `Step: ${p.routine_step}` : ''} • ₹{p.price}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                onClick={() => onQuickViewProduct && onQuickViewProduct(p)}
                                className="p-1.5 text-halo-muted hover:text-halo-navy rounded-pill hover:bg-halo-bg"
                                title="View Details"
                              >
                                <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>
                              <button
                                onClick={() => handleAddToCart(p)}
                                className={`px-2.5 py-1.5 rounded-pill text-[10px] font-medium transition ${
                                  isAdded
                                    ? 'bg-halo-teal text-white'
                                    : 'bg-halo-navy text-white hover:bg-halo-navy/90'
                                }`}
                              >
                                {isAdded ? 'Added' : 'Add'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-2 text-halo-muted bg-halo-bg w-fit px-3 py-2 rounded-card border border-halo-border">
              <div className="w-2 h-2 rounded-full bg-halo-teal animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-halo-teal animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-halo-teal animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium ml-1">Aria is reviewing formulations...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Strip */}
        <div className="p-2 border-t border-halo-border bg-halo-surface overflow-x-auto no-scrollbar flex space-x-1.5">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] bg-halo-bg hover:bg-halo-surface text-halo-muted hover:text-halo-navy border border-halo-border hover:border-halo-teal px-2.5 py-1 rounded-pill whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Text Input Footer */}
        <div className="p-3 border-t border-halo-border bg-halo-bg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask Aria about your hair or scalp..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-halo-surface border border-halo-border rounded-pill text-xs text-halo-ink placeholder:text-halo-muted outline-none focus:border-halo-teal"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-halo-navy text-white rounded-pill disabled:opacity-40 hover:bg-halo-navy/90 transition shadow-xs"
              aria-label="Send message to Aria"
            >
              <Send className="w-4 h-4 stroke-[1.5]" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
