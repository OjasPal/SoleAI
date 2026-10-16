import React, { useState } from 'react';
import { FootwearItem, BrandSettings } from '../../types';
import { ProductImage } from './ProductImage';
import { FitScale } from './FitScale';
import { Sparkles, Ruler, ShieldCheck, ChevronDown, Check, ArrowRight, X } from 'lucide-react';

interface ProductDetailModalProps {
  shoe: FootwearItem | null;
  brandSettings?: BrandSettings;
  open: boolean;
  onClose: () => void;
  onAddToCart: (shoe: FootwearItem, sizeUK: number) => void;
  onInstantCheckout: (shoe: FootwearItem, sizeUK: number, method: 'COD' | 'UPI') => void;
  onAskSoleAI: (shoe: FootwearItem, sizeUK: number | null) => void;
  onOpenSizeGuide: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  shoe,
  brandSettings,
  open,
  onClose,
  onAddToCart,
  onInstantCheckout,
  onAskSoleAI,
  onOpenSizeGuide,
}) => {
  if (!open || !shoe) return null;

  const [selectedSize, setSelectedSize] = useState<number | null>(() => {
    const firstInStock = shoe.sizes.find(s => s.inStock && s.stock > 0);
    return firstInStock ? firstInStock.sizeUK : null;
  });
  const [selectedColourway, setSelectedColourway] = useState<string>(
    shoe.colourways?.[0]?.name || shoe.colorway || 'Default'
  );
  const [openPolicy, setOpenPolicy] = useState<'returns' | 'shipping' | 'cod' | null>(null);

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(shoe.priceINR);

  const selectedSizeStock = shoe.sizes.find(s => s.sizeUK === selectedSize);
  const isOutOfStock = !selectedSizeStock || !selectedSizeStock.inStock || selectedSizeStock.stock <= 0;
  const isLowStock = selectedSizeStock && selectedSizeStock.stock > 0 && selectedSizeStock.stock <= 2;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
      <div className="relative w-full max-w-4xl bg-bg-raised border border-line rounded-panel overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-pill bg-bg/80 border border-line hover:border-line-strong text-text-2 hover:text-text flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Gallery & Thumbnails */}
          <div className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-line bg-bg-sunken flex flex-col justify-between">
            <div className="space-y-4">
              <div className="rounded-[4px] overflow-hidden border border-line">
                <ProductImage
                  slug={shoe.slug}
                  alt={shoe.name}
                  name={shoe.name}
                  className="w-full aspect-[4/5]"
                />
              </div>

              {/* Verified Materials Box */}
              <div className="p-3.5 rounded-panel bg-bg border border-line space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-3">Material Construction</span>
                <p className="text-small text-text font-medium">{shoe.material}</p>
                <p className="text-[12px] text-text-3 leading-snug">{shoe.description}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-[11px] font-mono text-text-3">
              <span>SKU: {shoe.id.toUpperCase()}</span>
              <span>100% Free Exchanges</span>
            </div>
          </div>

          {/* Right Column: Sizing, Fit Scale & Actions */}
          <div className="md:col-span-7 p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-text-3 px-2 py-0.5 rounded-pill bg-white/[0.04] border border-line">
                  {shoe.category}
                </span>
                {shoe.isBestSeller && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ok px-2 py-0.5 rounded-pill bg-ok/10 border border-ok/20">
                    High Demand
                  </span>
                )}
              </div>
              <h2 className="text-h1 font-display font-semibold text-text">{shoe.name}</h2>
              <p className="text-small text-text-3 mt-0.5">{shoe.tagline}</p>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-h2 font-semibold text-text">{formattedPrice}</span>
                <span className="text-[11px] font-mono text-ok">Inclusive of all taxes & free shipping</span>
              </div>
            </div>

            {/* Colour Selector */}
            {shoe.colourways && shoe.colourways.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-small mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-text-3">Colour:</span>
                  <span className="font-mono text-[11px] text-text">{selectedColourway}</span>
                </div>
                <div className="flex items-center gap-2">
                  {shoe.colourways.map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColourway(c.name)}
                      title={c.name}
                      className={`h-8 px-3 rounded-pill text-[12px] font-mono flex items-center gap-2 border transition-all cursor-pointer ${
                        selectedColourway === c.name
                          ? 'border-white text-white bg-white/10'
                          : 'border-line text-text-3 hover:border-line-strong'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* UK Size Selector with Live Stock */}
            <div>
              <div className="flex items-center justify-between text-small mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-text-3">Select UK Size:</span>
                  {selectedSize && (
                    <span className="font-mono text-[11px] text-text">UK {selectedSize}</span>
                  )}
                </div>
                <button
                  onClick={onOpenSizeGuide}
                  className="text-[11px] font-mono text-accent hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3 h-3" />
                  <span>Demo size chart</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {shoe.sizes.map(sz => {
                  const outOfStock = sz.stock <= 0;
                  const isSelected = selectedSize === sz.sizeUK;
                  return (
                    <button
                      key={sz.sizeUK}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(sz.sizeUK)}
                      className={`h-11 rounded-panel flex flex-col items-center justify-center border font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black border-white font-semibold'
                          : outOfStock
                          ? 'bg-bg-sunken border-line/40 text-text-3/40 cursor-not-allowed line-through'
                          : 'bg-bg-sunken border-line text-text hover:border-line-strong'
                      }`}
                    >
                      <span className="text-small">UK {sz.sizeUK}</span>
                      <span className="text-[9px] uppercase tracking-tight opacity-70">
                        {outOfStock ? 'Sold' : sz.stock <= 2 ? `${sz.stock} left` : 'In stock'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Stock Notification */}
              {isLowStock && (
                <p className="text-[11px] font-mono text-warn mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-warn" />
                  Only {selectedSizeStock?.stock} pairs remaining in UK {selectedSize}. Free size exchange active.
                </p>
              )}
            </div>

            {/* Fit Scale derived from data */}
            <FitScale fit={shoe.fit} />

            {/* Ask SoleAI Button */}
            <button
              onClick={() => onAskSoleAI(shoe, selectedSize)}
              className="w-full h-10 rounded-pill bg-bg-sunken border border-line hover:border-line-strong text-text flex items-center justify-center gap-2 text-small font-medium transition-colors cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Ask SoleAI about this pair’s fit & sizing</span>
              <ArrowRight className="w-3.5 h-3.5 text-text-3 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Purchase & Checkout Actions */}
            <div className="space-y-2.5 pt-2 border-t border-line">
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={isOutOfStock || selectedSize === null}
                  onClick={() => selectedSize && onInstantCheckout(shoe, selectedSize, 'COD')}
                  className="h-11 rounded-pill bg-white text-black font-medium text-small hover:bg-neutral-200 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Order via COD</span>
                </button>
                <button
                  disabled={isOutOfStock || selectedSize === null}
                  onClick={() => selectedSize && onInstantCheckout(shoe, selectedSize, 'UPI')}
                  className="h-11 rounded-pill bg-bg border border-line hover:border-line-strong text-text font-medium text-small disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Pay by UPI</span>
                </button>
              </div>

              <button
                disabled={isOutOfStock || selectedSize === null}
                onClick={() => selectedSize && onAddToCart(shoe, selectedSize)}
                className="w-full h-10 rounded-pill bg-transparent border border-line/60 hover:border-line text-text-2 hover:text-text text-small font-medium transition-colors cursor-pointer"
              >
                Add to Shopping Bag
              </button>
            </div>

            {/* Policy Accordions */}
            <div className="border-t border-line pt-4 space-y-2 text-small">
              {[
                { key: 'returns', title: '7-Day Free Size Exchange', text: brandSettings?.returnPolicyText || 'Free doorstep exchange.' },
                { key: 'shipping', title: 'Shipping & Delivery', text: brandSettings?.shippingPolicyText || 'Dispatched within 24 hours.' },
                { key: 'cod', title: 'Cash on Delivery (COD) Policy', text: brandSettings?.codPolicyText || 'Pan-India COD supported.' },
              ].map(pol => (
                <div key={pol.key} className="border border-line rounded-panel overflow-hidden">
                  <button
                    onClick={() => setOpenPolicy(openPolicy === pol.key ? null : pol.key as any)}
                    className="w-full px-4 py-2.5 bg-bg-sunken flex items-center justify-between text-left text-text cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="font-display font-medium text-[12px]">{pol.title}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-text-3 transition-transform ${openPolicy === pol.key ? 'rotate-180' : ''}`} />
                  </button>
                  {openPolicy === pol.key && (
                    <div className="p-3.5 bg-bg text-[12px] text-text-3 leading-relaxed border-t border-line">
                      {pol.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
