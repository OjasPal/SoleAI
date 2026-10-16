import React, { useState } from 'react';

interface ProductImageProps {
  src?: string;
  slug?: string;
  alt: string;
  name?: string;
  className?: string;
  index?: number;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  slug,
  alt,
  name,
  className = '',
  index = 1,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // If slug is provided without src, resolve canonical local path
  const imageSource = src || (slug ? `/products/${slug}-${index}.webp` : '');

  if (imageFailed || !imageSource) {
    return (
      <div
        className={`relative w-full aspect-[4/5] bg-bg-raised border border-line flex flex-col items-center justify-center overflow-hidden select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        {/* Soft radial spotlight behind the shoe silhouette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 55%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 50%, transparent 70%)',
          }}
        />

        {/* Floor reflection line */}
        <div className="absolute bottom-[22%] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Refined SVG Shoe Silhouette */}
        <svg
          viewBox="0 0 120 70"
          className="w-3/5 h-auto text-white/25 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outsole and upper lateral contour */}
          <path
            d="M8 52 C 14 53, 30 53, 45 52 C 60 51, 80 52, 100 52 C 110 52, 114 48, 112 42 C 110 36, 104 32, 92 30 C 82 28, 75 22, 68 18 C 62 14, 55 12, 48 14 C 44 16, 40 22, 38 27 C 32 28, 22 30, 15 36 C 10 40, 6 46, 8 52 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.03)"
          />
          {/* Ankle collar and tongue curve */}
          <path
            d="M48 14 C 55 12, 64 16, 68 22 C 70 25, 68 30, 65 32"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          {/* Outsole tread baseline */}
          <path
            d="M10 54 L 110 54"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.4"
          />
          {/* Subtle eyestay stitching */}
          <circle cx="52" cy="24" r="1" fill="currentColor" opacity="0.6" />
          <circle cx="58" cy="27" r="1" fill="currentColor" opacity="0.6" />
          <circle cx="64" cy="30" r="1" fill="currentColor" opacity="0.6" />
        </svg>

        {/* Product label in mono caps */}
        <div className="absolute bottom-4 left-3 right-3 text-center">
          <p className="text-[10px] font-mono tracking-widest uppercase text-text-3/70 truncate px-2">
            {name || alt}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-[4/5] bg-bg-raised overflow-hidden ${className}`}>
      <img
        src={imageSource}
        alt={alt}
        width={400}
        height={500}
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
};
