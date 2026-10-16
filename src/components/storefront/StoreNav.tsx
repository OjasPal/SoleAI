import React from 'react';
import { ShoppingBag, Footprints } from 'lucide-react';
import { BrandSettings } from '../../types';

interface StoreNavProps {
  brandSettings?: BrandSettings;
  cartCount: number;
  onOpenCart: () => void;
  onOpenFitGuide: () => void;
  onOpenPolicies: () => void;
  onScrollToShop: () => void;
}

export const StoreNav: React.FC<StoreNavProps> = ({
  brandSettings,
  cartCount,
  onOpenCart,
  onOpenFitGuide,
  onOpenPolicies,
  onScrollToShop,
}) => {
  const brandName = brandSettings?.brandName || 'KICKSCRAFT INDIA';

  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-line">
      {/* 28px Demo Banner */}
      <div className="h-7 bg-bg-sunken border-b border-line flex items-center justify-between px-4 text-[11px] font-mono text-text-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>Demo storefront powered by SoleAI. Fictional brand.</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>UK 6–11 Live Stock Engine</span>
          <span className="text-line-strong">/</span>
          <span>COD Protection Active</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-[1280px] mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={onScrollToShop}
            className="flex items-center gap-2 group cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-panel bg-white/[0.05] border border-line flex items-center justify-center text-text group-hover:border-line-strong transition-colors">
              <Footprints className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-semibold text-small tracking-wider uppercase text-text group-hover:text-white transition-colors">
                {brandName}
              </span>
              <span className="hidden md:inline-block ml-2 text-[10px] font-mono text-text-3 uppercase tracking-widest">
                Atelier
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-small text-text-2">
          <button
            onClick={onScrollToShop}
            className="hover:text-text transition-colors cursor-pointer"
          >
            Shop
          </button>
          <button
            onClick={onOpenFitGuide}
            className="hover:text-text transition-colors cursor-pointer"
          >
            Fit Guide
          </button>
          <button
            onClick={onOpenPolicies}
            className="hover:text-text transition-colors cursor-pointer"
          >
            Policies
          </button>
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCart}
            aria-label={`Cart with ${cartCount} items`}
            className="relative h-9 px-3 rounded-pill bg-bg-raised border border-line hover:border-line-strong text-text flex items-center gap-2 cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-text-2" />
            <span className="font-mono text-[12px]">{cartCount}</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
