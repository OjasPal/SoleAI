import React from 'react';
import { RotateCcw, ShieldCheck, Truck, Clock } from 'lucide-react';
import { BrandSettings } from '../../types';

interface FitPromiseStripProps {
  brandSettings?: BrandSettings;
}

export const FitPromiseStrip: React.FC<FitPromiseStripProps> = ({ brandSettings }) => {
  const items = [
    {
      icon: RotateCcw,
      title: 'Free Size Exchange',
      description: 'Doorstep pickup with zero courier charge on all UK sizes.',
      tag: 'Guaranteed',
    },
    {
      icon: ShieldCheck,
      title: 'COD Available',
      description: brandSettings?.codPolicyText
        ? 'Pan-India Cash on Delivery with verified SMS & WhatsApp notification.'
        : 'Pan-India Cash on Delivery with 1-tap verification.',
      tag: 'Pan-India',
    },
    {
      icon: Truck,
      title: '24h Dispatch',
      description: brandSettings?.shippingPolicyText
        ? 'Dispatched in 24 hours. Express air cargo to all Indian metros.'
        : 'Dispatched in 24h via BlueDart & Delhivery Express.',
      tag: 'Express Air',
    },
    {
      icon: Clock,
      title: '7-Day Doorstep Returns',
      description: brandSettings?.returnPolicyText
        ? '7-day doorstep replacement or hassle-free store credit.'
        : '7-day replacement window on unworn pairs.',
      tag: '7 Days',
    },
  ];

  return (
    <section className="border-b border-line bg-bg-raised/40">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 md:p-6 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-panel bg-white/[0.04] border border-line flex items-center justify-center text-text-2 group-hover:text-text transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-ok/90 px-2 py-0.5 rounded-pill bg-ok/10 border border-ok/20">
                  {item.tag}
                </span>
              </div>
              <div>
                <h4 className="text-small font-display font-medium text-text mb-1">{item.title}</h4>
                <p className="text-[12px] text-text-3 leading-snug line-clamp-2">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
