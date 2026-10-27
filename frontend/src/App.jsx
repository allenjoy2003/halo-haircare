import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RoutineSection from './components/RoutineSection';
import ConcernTextureFilter from './components/ConcernTextureFilter';
import ProductGrid from './components/ProductGrid';
import BotanicalClinicalScience from './components/BotanicalClinicalScience';
import SocialProofGrid from './components/SocialProofGrid';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import HairQuizModal from './components/HairQuizModal';
import AriaChat from './components/AriaChat';
import AuthModal from './components/AuthModal';
import OrdersModal from './components/OrdersModal';
import { api } from './api';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Bot } from 'lucide-react';
import { BRAND } from './brand';

function MainApp() {
  const [products, setProducts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [hairTypes, setHairTypes] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Filters & State
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [selectedHairType, setSelectedHairType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialProfile, setChatInitialProfile] = useState(null);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Fetch initial public catalog data
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        const [
          prodsData,
          routinesData,
          catsData,
          concernsData,
          typesData,
          reviewsData
        ] = await Promise.all([
          api.getProducts(),
          api.getRoutines(),
          api.getCategories(),
          api.getConcerns(),
          api.getHairTypes(),
          api.getReviews()
        ]);

        setProducts(prodsData || []);
        setRoutines(routinesData || []);
        setCategories(catsData || []);
        setConcerns(concernsData || []);
        setHairTypes(typesData || []);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error("Failed to load store data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    if (selectedCategory && p.category && p.category.slug !== selectedCategory) {
      return false;
    }
    if (selectedConcern) {
      const matchConcern = p.concerns && p.concerns.some(c => c.slug === selectedConcern);
      if (!matchConcern) return false;
    }
    if (selectedHairType) {
      const matchHair = p.hair_types && p.hair_types.some(ht => ht.code === selectedHairType);
      if (!matchHair) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchSub = p.subtitle?.toLowerCase().includes(q);
      const matchIng = p.key_ingredients?.toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchIng) return false;
    }
    return true;
  });

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedConcern(null);
    setSelectedHairType(null);
    setSearchQuery('');
  };

  const handleConsultDoctorFromQuiz = ({ initialMessage, userProfile }) => {
    setChatInitialProfile({ initialMessage, userProfile });
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-halo-bg text-halo-ink flex flex-col font-sans">
      
      {/* Minimal Announcement Bar */}
      <AnnouncementBar />

      {/* Navigation Bar with Public / Auth State */}
      <Navbar
        onOpenChat={() => setIsChatOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onSelectConcern={(c) => setSelectedConcern(c)}
        onSelectHairType={(ht) => setSelectedHairType(ht)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Routine Regimens Section */}
      <RoutineSection
        routines={routines}
        onQuickViewProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Interactive Texture & Concern Filter Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ConcernTextureFilter
          concerns={concerns}
          hairTypes={hairTypes}
          selectedConcern={selectedConcern}
          selectedHairType={selectedHairType}
          onSelectConcern={setSelectedConcern}
          onSelectHairType={setSelectedHairType}
          totalProductsCount={products.length}
        />
      </div>

      {/* Product Catalog Grid */}
      <ProductGrid
        products={filteredProducts}
        onQuickView={(p) => setQuickViewProduct(p)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        searchQuery={searchQuery}
        onClearFilters={handleClearFilters}
      />

      {/* Science Formulation Section */}
      <BotanicalClinicalScience />

      {/* Social Proof Regimen Grid */}
      <SocialProofGrid reviews={reviews} />

      {/* Minimal Footer */}
      <Footer
        onOpenChat={() => setIsChatOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      {/* Modals & Overlays */}
      <CartDrawer />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <HairQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onConsultDoctor={handleConsultDoctorFromQuiz}
        routines={routines}
      />

      <AriaChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialProfile={chatInitialProfile}
        onQuickViewProduct={(p) => setQuickViewProduct(p)}
      />

      <AuthModal />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />

      {/* Floating Action Button for Aria Guide (Bottom-Right) */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center">
          
          {/* Tooltip prompt bubble */}
          <div 
            onClick={() => setIsChatOpen(true)}
            className="hidden md:flex items-center space-x-2 bg-halo-surface/95 backdrop-blur-md border border-halo-border text-halo-ink px-3.5 py-2 rounded-card shadow-halo-card mr-3 cursor-pointer hover:border-halo-teal transition transform hover:-translate-x-1"
          >
            <span className="w-2 h-2 rounded-full bg-halo-teal animate-pulse" />
            <div className="text-left">
              <div className="text-[11px] font-semibold text-halo-navy">{BRAND.botName} Guide</div>
              <div className="text-[10px] text-halo-muted">Clarify your hair or scalp routine</div>
            </div>
          </div>

          {/* Pulsing action button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="relative w-13 h-13 rounded-full bg-halo-navy text-white shadow-halo-subtle hover:shadow-halo-glow hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group"
            aria-label="Ask Aria AI Hair Guide"
          >
            <Bot className="w-5 h-5 text-halo-accent stroke-[1.5]" />
            <span className="absolute -top-1 -right-1 bg-halo-teal text-white text-[9px] font-bold px-1.5 py-0.2 rounded-pill shadow-xs">
              AI
            </span>
          </button>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
