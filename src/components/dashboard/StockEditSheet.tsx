import React, { useState } from 'react';
import { FootwearItem } from '../../types';
import { Sheet } from '../ui/Sheet';
import { Button } from '../ui/Button';
import { Minus, Plus } from 'lucide-react';
import { formatINR } from '../../lib/format';

export interface StockEditSheetProps {
  shoe: FootwearItem | null;
  open: boolean;
  onClose: () => void;
  onUpdateStock: (shoeId: string, sizeUK: number, newStock: number) => Promise<void>;
}

export const StockEditSheet: React.FC<StockEditSheetProps> = ({
  shoe,
  open,
  onClose,
  onUpdateStock,
}) => {
  const [updatingSize, setUpdatingSize] = useState<number | null>(null);

  if (!shoe) return null;

  const handleAdjust = async (sizeUK: number, currentStock: number, delta: number) => {
    const nextStock = Math.max(0, currentStock + delta);
    setUpdatingSize(sizeUK);
    try {
      await onUpdateStock(shoe.id, sizeUK, nextStock);
    } finally {
      setUpdatingSize(null);
    }
  };

  const totalStock = shoe.sizes.reduce((acc, s) => acc + s.stock, 0);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={shoe.name}
      description={`SKU Inventory • Total ${totalStock} units available`}
    >
      <div className="space-y-6 pt-2">
        <div className="flex gap-4 items-center pb-4 border-b border-line">
          <img
            src={shoe.imageUrl}
            alt={shoe.name}
            className="w-20 h-20 rounded-panel object-cover bg-bg-sunken border border-line"
          />
          <div className="space-y-1">
            <span className="text-label font-mono uppercase text-text-3">{shoe.category}</span>
            <div className="text-h2 font-mono font-bold text-text">{formatINR(shoe.priceINR)}</div>
            <p className="text-small text-text-3 italic">{shoe.fitGuidance}</p>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-label font-mono uppercase text-text-3 block">
            UK Size Breakdown & Quantities
          </span>

          <div className="divide-y divide-line border border-line rounded-panel overflow-hidden">
            {shoe.sizes.map(sz => (
              <div key={sz.sizeUK} className="p-3 bg-bg-sunken flex items-center justify-between">
                <div>
                  <span className="font-mono text-body font-bold text-text">UK {sz.sizeUK}</span>
                  <span className="text-[11px] font-mono text-text-3 ml-2">
                    {sz.stock === 0 ? 'Out of stock' : `${sz.stock} pairs`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    disabled={sz.stock === 0 || updatingSize === sz.sizeUK}
                    onClick={() => handleAdjust(sz.sizeUK, sz.stock, -1)}
                    aria-label={`Decrease UK ${sz.sizeUK} stock`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>

                  <span className="w-8 text-center font-mono font-bold text-body text-text">
                    {sz.stock}
                  </span>

                  <Button
                    variant="secondary"
                    size="icon"
                    disabled={updatingSize === sz.sizeUK}
                    onClick={() => handleAdjust(sz.sizeUK, sz.stock, 1)}
                    aria-label={`Increase UK ${sz.sizeUK} stock`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Sheet>
  );
};
