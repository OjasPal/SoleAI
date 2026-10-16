import React, { useState, useMemo } from 'react';
import { FootwearItem, FootwearCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';

interface CollectionSectionProps {
  shoes: FootwearItem[];
  loading?: boolean;
  onSelectShoe: (shoe: FootwearItem) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  shoes,
  loading = false,
  onSelectShoe,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedPriceBracket, setSelectedPriceBracket] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  const categories: { label: string; value: string }[] = [
    { label: 'All Pairs', value: 'all' },
    { label: 'Sneakers', value: 'sneakers' },
    { label: 'Retro Runners', value: 'retro-runners' },
    { label: 'Loafers', value: 'loafers' },
    { label: 'Chelsea & Boots', value: 'boots' },
    { label: 'Slides & Sandals', value: 'slides' },
  ];

  const ukSizes = [6, 7, 8, 9, 10, 11];

  const filteredShoes = useMemo(() => {
    return shoes.filter(shoe => {
      // Category filter
      if (selectedCategory !== 'all' && shoe.category !== selectedCategory) {
        return false;
      }

      // Size filter: shoe must have this size in stock
      if (selectedSize !== null) {
        const sz = shoe.sizes.find(s => s.sizeUK === selectedSize);
        if (!sz || !sz.inStock || sz.stock <= 0) return false;
      }

      // Price filter
      if (selectedPriceBracket === 'under-3000' && shoe.priceINR >= 3000) return false;
      if (selectedPriceBracket === '3000-4500' && (shoe.priceINR < 3000 || shoe.priceINR > 4500)) return false;
      if (selectedPriceBracket === 'above-4500' && shoe.priceINR <= 4500) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
      if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [shoes, selectedCategory, selectedSize, selectedPriceBracket, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSize(null);
    setSelectedPriceBracket('all');
    setSortBy('featured');
  };

  return (
    <section id="collection" className="py-12 border-b border-line bg-bg">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Header & Filter Controls Bar */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-text-3 uppercase tracking-widest mb-1.5">
                <span>The Catalogue</span>
                <span className="text-line-strong">&middot;</span>
                <span>{filteredShoes.length} of {shoes.length} Available</span>
              </div>
              <h2 className="text-h1 font-display font-semibold text-text">
                Explore Crafted Footwear
              </h2>
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <label htmlFor="sort-select" className="text-[11px] font-mono text-text-3 uppercase">Sort:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-bg-raised border border-line text-small text-text rounded-panel px-3 py-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Model Name A–Z</option>
              </select>
            </div>
          </div>

          {/* Filter Bar: Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-pill text-small font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'bg-white text-black'
                    : 'bg-bg-raised border border-line text-text-2 hover:border-line-strong hover:text-text'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sub-Filters: UK Size Chips & Price Brackets */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-line/60">
            {/* UK Size Chips */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-text-3 uppercase tracking-wider mr-1">
                UK Size:
              </span>
              {ukSizes.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? null : sz)}
                  className={`w-8 h-8 rounded-panel text-small font-mono transition-colors cursor-pointer flex items-center justify-center ${
                    selectedSize === sz
                      ? 'bg-white text-black font-semibold'
                      : 'bg-bg-sunken border border-line text-text-3 hover:text-text hover:border-line-strong'
                  }`}
                >
                  {sz}
                </button>
              ))}
              {selectedSize !== null && (
                <button
                  onClick={() => setSelectedSize(null)}
                  className="text-[11px] font-mono text-text-3 hover:text-text underline cursor-pointer ml-1"
                >
                  Reset Size
                </button>
              )}
            </div>

            {/* Price Filter Chips */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-text-3 uppercase tracking-wider mr-1">
                Price:
              </span>
              {[
                { label: 'All', value: 'all' },
                { label: '< ₹3,000', value: 'under-3000' },
                { label: '₹3,000–₹4,500', value: '3000-4500' },
                { label: '> ₹4,500', value: 'above-4500' },
              ].map(bracket => (
                <button
                  key={bracket.value}
                  onClick={() => setSelectedPriceBracket(bracket.value)}
                  className={`px-2.5 py-1 rounded-panel text-[11px] font-mono transition-colors cursor-pointer ${
                    selectedPriceBracket === bracket.value
                      ? 'bg-white/10 text-white border border-white/30'
                      : 'text-text-3 hover:text-text'
                  }`}
                >
                  {bracket.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Collection Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-line border border-line rounded-panel overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 bg-bg-raised space-y-3">
                <Skeleton className="w-full aspect-[4/5] rounded-[4px]" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredShoes.length === 0 ? (
          <div className="border border-line rounded-panel bg-bg-raised p-8">
            <EmptyState
              message="No matching shoes in this size or category. Try clearing filters to view our complete collection."
              actionLabel="Clear All Filters"
              onAction={handleClearFilters}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-line border border-line rounded-panel overflow-hidden">
            {filteredShoes.map(shoe => (
              <ProductCard
                key={shoe.id}
                shoe={shoe}
                selectedSizeFilter={selectedSize}
                onSelect={onSelectShoe}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
