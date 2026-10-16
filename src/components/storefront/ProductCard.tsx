import React from 'react';
import { FootwearItem } from '../../types';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  shoe: FootwearItem;
  selectedSizeFilter: number | null;
  onSelect: (shoe: FootwearItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  shoe,
  selectedSizeFilter,
  onSelect,
}) => {
  // Check stock for active size filter if present
  const sizeObj = selectedSizeFilter
    ? shoe.sizes.find(s => s.sizeUK === selectedSizeFilter)
    : null;
  const isSelectedSizeInStock = sizeObj ? sizeObj.inStock && sizeObj.stock > 0 : null;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(shoe.priceINR);

  const formattedOriginalPrice = shoe.originalPriceINR
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(shoe.originalPriceINR)
    : null;

  return (
    <div
      onClick={() => onSelect(shoe)}
      className="group relative bg-bg-raised p-4 flex flex-col justify-between cursor-pointer transition-colors duration-200 hover:bg-white/[0.02]"
    >
      {/* Upper Media Container */}
      <div className="relative overflow-hidden rounded-[4px] border border-line group-hover:border-line-strong transition-colors">
        <ProductImage
          slug={shoe.slug}
          src={shoe.images?.[0] || shoe.imageUrl}
          alt={shoe.name}
          name={shoe.name}
          className="w-full aspect-[4/5]"
        />

        {/* Size Filter Availability Tag */}
        {selectedSizeFilter !== null && (
          <div className="absolute top-2.5 left-2.5 z-10">
            {isSelectedSizeInStock ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-bg/90 backdrop-blur-md border border-line text-[10px] font-mono uppercase text-ok">
                <span className="w-1.5 h-1.5 rounded-full bg-ok" />
                <span>UK {selectedSizeFilter} in stock</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-pill bg-bg/90 backdrop-blur-md border border-line text-[10px] font-mono uppercase text-risk">
                <span className="w-1.5 h-1.5 rounded-full bg-risk" />
                <span>UK {selectedSizeFilter} sold out</span>
              </span>
            )}
          </div>
        )}

        {/* Best seller or category badge */}
        {shoe.isBestSeller && !selectedSizeFilter && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 rounded-pill bg-bg/90 backdrop-blur-md border border-line text-[10px] font-mono uppercase text-text-2 tracking-wider">
              Best Seller
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="pt-3.5 space-y-2">
        {/* Colourways Swatch Dots */}
        {shoe.colourways && shoe.colourways.length > 0 && (
          <div className="flex items-center gap-1.5" aria-label="Available colourways">
            {shoe.colourways.map((c, idx) => (
              <span
                key={idx}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block"
              />
            ))}
            <span className="text-[10px] font-mono text-text-3 ml-1">
              {shoe.colourways.length} {shoe.colourways.length === 1 ? 'colour' : 'colours'}
            </span>
          </div>
        )}

        <div>
          <h3 className="text-small font-display font-medium text-text group-hover:text-white transition-colors line-clamp-1">
            {shoe.name}
          </h3>
          <p className="text-[12px] text-text-3 line-clamp-1">{shoe.tagline}</p>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-mono text-body font-medium text-text">{formattedPrice}</span>
          {formattedOriginalPrice && (
            <span className="font-mono text-[11px] text-text-3/60 line-through">
              {formattedOriginalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
