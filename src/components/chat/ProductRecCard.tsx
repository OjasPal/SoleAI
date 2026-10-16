import React from 'react';
import { FootwearItem } from '../../types';
import { formatINR } from '../../lib/format';
import { StatusDot } from '../ui/StatusDot';

export interface ProductRecCardProps {
  shoe: FootwearItem;
  onSelectSize?: (shoe: FootwearItem, sizeUK: number) => void;
}

export const ProductRecCard: React.FC<ProductRecCardProps> = ({ shoe, onSelectSize }) => {
  return (
    <div className="w-[220px] flex-shrink-0 bg-bg-raised border border-line rounded-panel overflow-hidden p-3 space-y-2.5 hover:border-line-strong transition-colors">
      <div className="relative aspect-square w-full rounded-md overflow-hidden bg-bg-sunken">
        <img
          src={shoe.imageUrl}
          alt={shoe.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {shoe.isBestSeller && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-pill bg-black/80 text-[9px] font-mono uppercase text-text border border-line">
            Top Seller
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-1">
          <h4 className="text-small font-medium text-text truncate" title={shoe.name}>
            {shoe.name}
          </h4>
          <span className="text-small font-mono font-semibold text-text flex-shrink-0">
            {formatINR(shoe.priceINR)}
          </span>
        </div>

        <p className="text-[11px] text-text-3 line-clamp-1">
          {shoe.fitGuidance}
        </p>
      </div>

      <div className="space-y-1 pt-1 border-t border-line">
        <div className="flex items-center justify-between text-[10px] font-mono text-text-3 uppercase">
          <span>UK Size</span>
          <span>Stock</span>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {shoe.sizes.map(sz => {
            const isAvailable = sz.inStock && sz.stock > 0;
            return (
              <button
                key={sz.sizeUK}
                type="button"
                disabled={!isAvailable}
                onClick={() => onSelectSize?.(shoe, sz.sizeUK)}
                title={isAvailable ? `Size UK ${sz.sizeUK} (${sz.stock} pairs in stock)` : `Size UK ${sz.sizeUK} out of stock`}
                aria-label={`Size UK ${sz.sizeUK} ${isAvailable ? 'in stock' : 'out of stock'}`}
                className={`h-6 rounded flex items-center justify-center text-[10px] font-mono transition-colors cursor-pointer ${
                  isAvailable
                    ? 'bg-white/[0.05] hover:bg-white text-text hover:text-black border border-line'
                    : 'bg-transparent text-text-3/40 line-through cursor-not-allowed border border-transparent'
                }`}
              >
                {sz.sizeUK}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
