import React from 'react';
import { FootwearFit } from '../../types';

interface FitScaleProps {
  fit?: FootwearFit;
  className?: string;
}

export const FitScale: React.FC<FitScaleProps> = ({ fit, className = '' }) => {
  const tendency = fit?.tendency || 'true_to_size';
  const offset = fit?.offsetHalfSizes ?? 0;
  const note = fit?.note || 'True to standard UK size. Standard width.';

  // Determine active segment index: 0 = Snug, 1 = True, 2 = Roomy
  let activeIndex = 1;
  if (tendency === 'runs_snug') activeIndex = 0;
  if (tendency === 'roomy') activeIndex = 2;

  // Compute recommendation statement
  const getRecommendationText = () => {
    if (tendency === 'runs_snug') {
      return offset > 0
        ? `Runs snug (+${offset * 0.5} UK size recommended for wide feet).`
        : 'Runs slightly snug through collar and vamp.';
    }
    if (tendency === 'roomy') {
      return offset < 0
        ? `Relaxed roomy fit (size down ${Math.abs(offset * 0.5)} for narrow feet).`
        : 'Generous roomy toe box with relaxed volume.';
    }
    return 'True to standard UK footwear size. Order your regular size.';
  };

  return (
    <div className={`p-4 rounded-panel bg-bg-sunken border border-line ${className}`}>
      <div className="flex items-center justify-between text-small mb-2">
        <span className="font-mono text-[11px] uppercase tracking-wider text-text-3">Verified Fit Scale</span>
        <span className="font-mono text-[11px] text-text-2 uppercase">
          {tendency === 'runs_snug' ? 'Snug / Size Up' : tendency === 'roomy' ? 'Roomy / Relaxed' : 'True to Size'}
        </span>
      </div>

      {/* 3-segment visual scale */}
      <div className="grid grid-cols-3 gap-1.5 h-2 my-2">
        {['Snug', 'True to Size', 'Roomy'].map((label, idx) => {
          const isActive = idx === activeIndex;
          return (
            <div
              key={label}
              className={`h-full rounded-[2px] transition-all relative ${
                isActive ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-[10px] font-mono uppercase text-text-3 px-0.5">
        <span>Snug (-0.5)</span>
        <span>Standard (0)</span>
        <span>Roomy (+0.5)</span>
      </div>

      {/* Computed statement from data */}
      <p className="mt-3 text-small text-text-2 leading-relaxed border-t border-line/60 pt-2.5">
        <strong className="text-text font-medium">{getRecommendationText()}</strong>{' '}
        <span className="text-text-3">{note}</span>
      </p>
    </div>
  );
};
