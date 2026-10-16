import React from 'react';
import { Sheet } from '../ui/Sheet';
import { FootwearItem } from '../../types';
import { ProductImage } from './ProductImage';
import { Trash2, ShoppingBag, ShieldAlert } from 'lucide-react';

export interface CartItem {
  shoe: FootwearItem;
  sizeUK: number;
  quantity: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (index: number) => void;
  onCheckout: (item: CartItem) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  items,
  onRemoveItem,
  onCheckout,
}) => {
  const subtotal = items.reduce((acc, item) => acc + item.shoe.priceINR * item.quantity, 0);

  const formattedSubtotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(subtotal);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Shopping Bag"
      description={`${items.length} ${items.length === 1 ? 'pair' : 'pairs'} selected`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Items List */}
        <div className="space-y-4 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white/[0.04] border border-line flex items-center justify-center text-text-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-body font-display text-text">Your bag is empty</p>
              <p className="text-[12px] text-text-3 max-w-xs mx-auto">
                Explore the collection, choose your verified UK size, and add handcrafted footwear to your order.
              </p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.shoe.id}-${item.sizeUK}-${idx}`}
                className="p-3.5 rounded-panel bg-bg-sunken border border-line flex gap-3.5 items-center justify-between"
              >
                <div className="w-16 h-20 rounded-[4px] overflow-hidden flex-shrink-0 border border-line">
                  <ProductImage
                    slug={item.shoe.slug}
                    alt={item.shoe.name}
                    name={item.shoe.name}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-small font-display font-medium text-text truncate">
                    {item.shoe.name}
                  </h4>
                  <p className="text-[12px] font-mono text-text-3">Size: UK {item.sizeUK}</p>
                  <p className="text-small font-mono text-text font-medium mt-1">
                    ₹{item.shoe.priceINR.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onRemoveItem(idx)}
                    aria-label="Remove item"
                    className="p-1.5 text-text-3 hover:text-risk transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onCheckout(item)}
                    className="text-[11px] font-mono text-text hover:text-white underline cursor-pointer"
                  >
                    Demo Handoff
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Actions */}
        {items.length > 0 && (
          <div className="pt-6 border-t border-line space-y-4">
            <div className="p-2.5 rounded-panel bg-white/[0.03] border border-line text-[11px] font-mono text-text-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-warn flex-shrink-0" />
              <span>Simulated cart. No financial charge or order generated.</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-small text-text-2">Estimated Total</span>
              <span className="font-mono text-h2 font-semibold text-text">{formattedSubtotal}</span>
            </div>

            <button
              onClick={() => onCheckout(items[0])}
              className="w-full h-11 rounded-pill bg-white text-black font-medium text-body hover:bg-neutral-200 transition-colors flex items-center justify-center cursor-pointer shadow-sm"
            >
              Proceed to Demo Checkout
            </button>
          </div>
        )}
      </div>
    </Sheet>
  );
};
