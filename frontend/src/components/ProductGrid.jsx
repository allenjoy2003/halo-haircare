import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { ArrowUpDown, FilterX } from 'lucide-react';

export default function ProductGrid({
  products,
  onQuickView,
  selectedCategory,
  onSelectCategory,
  categories,
  searchQuery,
  onClearFilters
}) {
  const [sortOption, setSortOption] = useState('bestselling');

  // Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'price-low') {
      return parseFloat(a.effective_price || a.price) - parseFloat(b.effective_price || b.price);
    }
    if (sortOption === 'price-high') {
      return parseFloat(b.effective_price || b.price) - parseFloat(a.effective_price || a.price);
    }
    if (sortOption === 'rating') {
      return parseFloat(b.rating) - parseFloat(a.rating);
    }
    return (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0);
  });

  return (
    <section id="products-section" className="py-12 bg-halo-bg border-b border-halo-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Controls Bar: Category Pills & Sorting */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          
          {/* Category Quick Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === null
                  ? 'bg-halo-navy text-white border-halo-navy shadow-xs'
                  : 'bg-halo-surface text-halo-muted border-halo-border hover:text-halo-navy hover:border-halo-teal'
              }`}
            >
              All Formulas
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(selectedCategory === cat.slug ? null : cat.slug)}
                className={`px-3.5 py-1.5 rounded-pill text-xs font-medium whitespace-nowrap transition border ${
                  selectedCategory === cat.slug
                    ? 'bg-halo-navy text-white border-halo-navy shadow-xs'
                    : 'bg-halo-surface text-halo-muted border-halo-border hover:text-halo-navy hover:border-halo-teal'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Product Counter */}
          <div className="flex items-center justify-between lg:justify-end space-x-4 shrink-0">
            <span className="text-xs text-halo-muted">
              Showing <strong className="text-halo-navy font-semibold">{sortedProducts.length}</strong> formulas
            </span>

            <div className="flex items-center space-x-1.5 bg-halo-surface border border-halo-border px-3 py-1.5 rounded-pill shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-halo-muted stroke-[1.5]" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-xs text-halo-ink bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="bestselling">Sort: Recommended</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search / Filter Notification Banner if active */}
        {(selectedCategory || searchQuery) && (
          <div className="mb-6 flex items-center justify-between bg-halo-surface border border-halo-border px-4 py-2.5 rounded-card text-xs text-halo-muted">
            <div className="flex items-center space-x-2">
              <span>Active filters:</span>
              {selectedCategory && (
                <span className="bg-halo-bg text-halo-navy font-medium px-2 py-0.5 rounded-pill border border-halo-border">
                  Category: {selectedCategory}
                </span>
              )}
              {searchQuery && (
                <span className="bg-halo-bg text-halo-navy font-medium px-2 py-0.5 rounded-pill border border-halo-border">
                  Search: "{searchQuery}"
                </span>
              )}
            </div>
            <button
              onClick={onClearFilters}
              className="text-halo-teal hover:underline flex items-center font-medium"
            >
              <FilterX className="w-3.5 h-3.5 mr-1 stroke-[1.5]" />
              <span>Reset filters</span>
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-halo-surface rounded-card border border-halo-border p-8 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-halo-bg border border-halo-border flex items-center justify-center mx-auto text-halo-muted">
              ✕
            </div>
            <h4 className="font-display text-base font-semibold text-halo-navy">No matching formulas</h4>
            <p className="text-xs text-halo-muted">
              We couldn't find any formulations matching your exact filters.
            </p>
            <button
              onClick={onClearFilters}
              className="mt-2 px-4 py-2 bg-halo-navy text-white text-xs font-medium rounded-pill"
            >
              View All Formulas
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
