import React, { useState } from 'react';
import { FootwearItem, BrandSettings } from '../../types';
import { StoreNav } from '../storefront/StoreNav';
import { HeroTreadField } from '../storefront/HeroTreadField';
import { FitPromiseStrip } from '../storefront/FitPromiseStrip';
import { CollectionSection } from '../storefront/CollectionSection';
import { ProductDetailModal } from '../storefront/ProductDetailModal';
import { SizeGuideDrawer } from '../storefront/SizeGuideDrawer';
import { CartDrawer, CartItem } from '../storefront/CartDrawer';
import { CheckoutHandoffModal } from '../storefront/CheckoutHandoffModal';
import { FloatingAssistantWidget } from '../storefront/FloatingAssistantWidget';

interface BrandDemoStoreProps {
  shoes: FootwearItem[];
  brandSettings?: BrandSettings;
  onOpenWhatsApp?: () => void;
}

export const BrandDemoStore: React.FC<BrandDemoStoreProps> = ({
  shoes,
  brandSettings,
  onOpenWhatsApp,
}) => {
  // Navigation & Drawer states
  const [activeShoe, setActiveShoe] = useState<FootwearItem | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantInitialQuery, setAssistantInitialQuery] = useState<string | undefined>(undefined);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Checkout Handoff state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<{
    shoe: FootwearItem | null;
    sizeUK: number | null;
    paymentMethod: 'COD' | 'UPI';
  }>({
    shoe: null,
    sizeUK: null,
    paymentMethod: 'COD',
  });

  const featuredShoe = shoes.find(s => s.id === 'shoe-1') || shoes[0];

  const handleAddToCart = (shoe: FootwearItem, sizeUK: number) => {
    setCartItems(prev => [...prev, { shoe, sizeUK, quantity: 1 }]);
    setCartOpen(true);
    setActiveShoe(null);
  };

  const handleInstantCheckout = (shoe: FootwearItem, sizeUK: number, method: 'COD' | 'UPI') => {
    setCheckoutTarget({ shoe, sizeUK, paymentMethod: method });
    setCheckoutModalOpen(true);
  };

  const handleAskSoleAI = (shoe: FootwearItem, sizeUK: number | null) => {
    const query = sizeUK
      ? `Can you explain the fit of ${shoe.name} in UK ${sizeUK}? Will it suit wide feet?`
      : `How does the ${shoe.name} fit? Should I order true to size?`;
    setAssistantInitialQuery(query);
    setAssistantOpen(true);
  };

  const handleFindMySize = () => {
    setAssistantInitialQuery('Help me find the right shoe size for my feet across your catalogue.');
    setAssistantOpen(true);
  };

  const handleScrollToShop = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent selection:text-white relative">
      {/* 1280px Container with Framing Hatches & Hairline Borders */}
      <div className="max-w-[1280px] mx-auto border-x border-line relative min-h-screen flex flex-col">
        {/* Top Section Junction Corner Marks */}
        <div className="absolute -top-1.5 -left-1.5 text-text-3 font-mono text-[10px] select-none pointer-events-none">+</div>
        <div className="absolute -top-1.5 -right-1.5 text-text-3 font-mono text-[10px] select-none pointer-events-none">+</div>

        {/* Storefront Nav Bar */}
        <StoreNav
          brandSettings={brandSettings}
          cartCount={cartItems.length}
          onOpenCart={() => setCartOpen(true)}
          onOpenFitGuide={() => setSizeGuideOpen(true)}
          onOpenPolicies={() => {
            const el = document.getElementById('brand-policies');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onScrollToShop={handleScrollToShop}
        />

        {/* Hero Section with Tread Field Canvas */}
        <HeroTreadField
          featuredShoe={featuredShoe}
          onShopClick={handleScrollToShop}
          onFindSizeClick={handleFindMySize}
        />

        {/* Fit Promise Strip with 4 Hairline-Separated Cells */}
        <FitPromiseStrip brandSettings={brandSettings} />

        {/* Hatched Divider Strip */}
        <div
          className="h-2 w-full border-b border-line opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, var(--line), var(--line) 1px, transparent 1px, transparent 8px)',
          }}
        />

        {/* 36-Product Catalog Grid with Live UK Filters */}
        <CollectionSection
          shoes={shoes}
          onSelectShoe={setActiveShoe}
        />

        {/* Brand Story / Sample Content Footer */}
        <footer id="brand-policies" className="border-t border-line bg-bg-sunken p-8 md:p-12 mt-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-small">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-3 px-2 py-0.5 rounded-pill bg-white/[0.04] border border-line">
                Sample Content
              </span>
              <h4 className="font-display font-medium text-text mt-2">{brandSettings?.brandName || 'KicksCraft India'}</h4>
              <p className="text-[12px] text-text-3 leading-relaxed">
                Handcrafted urban sneakers and timeless Goodyear-welted leather footwear. Made with zero synthetic plastic filler in sole cores.
              </p>
            </div>

            <div className="space-y-1.5 text-[12px] text-text-3 font-mono">
              <p className="text-text font-medium uppercase tracking-wider mb-2">Verified Policies</p>
              <p>Return Window: 7 Days Free Exchange</p>
              <p>Dispatched: Within 24h via Air</p>
              <p>COD Policy: Verified SMS Confirmation</p>
            </div>

            <div className="space-y-2 text-[12px] text-text-3">
              <p className="text-text font-medium uppercase font-mono tracking-wider">SoleAI Intelligence</p>
              <p className="leading-relaxed">
                Integrated sizing engine checking UK stock in real-time to cut COD returns and eliminate customer sizing doubts.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        shoe={activeShoe}
        brandSettings={brandSettings}
        open={Boolean(activeShoe)}
        onClose={() => setActiveShoe(null)}
        onAddToCart={handleAddToCart}
        onInstantCheckout={handleInstantCheckout}
        onAskSoleAI={handleAskSoleAI}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemoveItem={idx => setCartItems(prev => prev.filter((_, i) => i !== idx))}
        onCheckout={item => {
          setCartOpen(false);
          handleInstantCheckout(item.shoe, item.sizeUK, 'COD');
        }}
      />

      {/* Size Guide Drawer */}
      <SizeGuideDrawer
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />

      {/* Checkout Handoff Modal */}
      <CheckoutHandoffModal
        open={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        shoe={checkoutTarget.shoe}
        sizeUK={checkoutTarget.sizeUK}
        paymentMethod={checkoutTarget.paymentMethod}
      />

      {/* Floating SoleAI Assistant Widget */}
      <FloatingAssistantWidget
        open={assistantOpen}
        onToggle={() => setAssistantOpen(prev => !prev)}
        initialQuery={assistantInitialQuery}
      />
    </div>
  );
};
