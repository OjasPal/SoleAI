import React from 'react';
import { FootwearItem } from '../../types';
import { Modal } from '../ui/Modal';
import { ShieldAlert, CheckCircle, ArrowRight, Truck } from 'lucide-react';

interface CheckoutHandoffModalProps {
  open: boolean;
  onClose: () => void;
  shoe: FootwearItem | null;
  sizeUK: number | null;
  paymentMethod: 'COD' | 'UPI';
}

export const CheckoutHandoffModal: React.FC<CheckoutHandoffModalProps> = ({
  open,
  onClose,
  shoe,
  sizeUK,
  paymentMethod,
}) => {
  if (!shoe || sizeUK === null) return null;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(shoe.priceINR);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Demo Checkout Handoff"
      description="Simulated order handoff flow for SoleAI demonstration."
    >
      <div className="space-y-5">
        {/* Prominent Mandatory Simulated Banner */}
        <div className="p-3.5 rounded-panel bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-warn" />
          <div className="text-small">
            <p className="font-semibold text-text">Demo checkout. No order or payment is created.</p>
            <p className="text-[12px] text-text-3 mt-0.5">
              In production, this hands off to the merchant’s Shopify checkout, WhatsApp 1-tap confirmation, or payment gateway.
            </p>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="p-4 rounded-panel bg-bg-sunken border border-line space-y-3">
          <div className="flex items-start justify-between border-b border-line pb-3">
            <div>
              <p className="font-display font-medium text-text text-body">{shoe.name}</p>
              <p className="text-[12px] text-text-3 font-mono mt-0.5">
                Selected Size: <span className="text-text font-medium">UK {sizeUK}</span> &middot; {shoe.category}
              </p>
            </div>
            <span className="font-mono text-body text-text font-medium">{formattedPrice}</span>
          </div>

          <div className="space-y-1.5 text-[12px] text-text-3 font-mono">
            <div className="flex justify-between">
              <span>Payment Option:</span>
              <span className="text-text">{paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Instant Pay'}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Dispatch:</span>
              <span className="text-ok">Within 24 Hours</span>
            </div>
            <div className="flex justify-between">
              <span>Doorstep Size Swap:</span>
              <span className="text-ok">100% Free Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Production Flow Explainer */}
        <div className="text-[12px] text-text-3 space-y-2 border-l-2 border-line-strong pl-3">
          <p>
            <strong className="text-text">How SoleAI handles this:</strong> If the shopper selects COD, SoleAI sends an automated WhatsApp message verifying the delivery address and shoe size, preventing RTO return costs before dispatch.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-line">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-pill bg-white text-black font-medium text-body hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Back to Store
          </button>
        </div>
      </div>
    </Modal>
  );
};
