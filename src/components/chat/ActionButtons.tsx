import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export interface ActionButtonsProps {
  actionType?: string;
  actionData?: any;
  quickReplies?: string[];
  onSelectQuickReply?: (text: string) => void;
  onOpenDemoNotice?: (title: string, desc: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  actionType,
  actionData,
  quickReplies,
  onSelectQuickReply,
  onOpenDemoNotice,
}) => {
  if (!actionType && (!quickReplies || quickReplies.length === 0)) {
    return null;
  }

  const handleActionClick = (label: string) => {
    onOpenDemoNotice?.(
      label,
      'Demo only. No order or payment is created. In production, this directs the buyer to the official checkout or WhatsApp Pay gateway.'
    );
  };

  return (
    <div className="space-y-2 pt-1">
      {/* Primary Action Button */}
      {actionType === 'cod_confirmation' && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleActionClick('Confirm COD Delivery')}
          className="w-full sm:w-auto"
        >
          Confirm Cash on Delivery
        </Button>
      )}

      {actionType === 'checkout_link' && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleActionClick('Proceed to Checkout')}
          className="w-full sm:w-auto"
        >
          Proceed to Checkout ({actionData?.shoeName ? `UK ${actionData.sizeUK || 'Size'}` : 'Buy'})
        </Button>
      )}

      {actionType === 'discount_offer' && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleActionClick('Apply 10% Coupon SOLE10')}
          className="w-full sm:w-auto"
        >
          Apply 10% Discount Code (SOLE10)
        </Button>
      )}

      {/* Quick Reply Chips */}
      {quickReplies && quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickReplies.map(qr => (
            <button
              key={qr}
              type="button"
              onClick={() => onSelectQuickReply?.(qr)}
              className="h-7 px-3 rounded-pill bg-bg-sunken border border-line hover:border-line-strong text-[11px] text-text-2 hover:text-text transition-colors cursor-pointer"
            >
              {qr}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
