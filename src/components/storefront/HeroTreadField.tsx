import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { FootwearItem } from '../../types';

interface HeroTreadFieldProps {
  featuredShoe?: FootwearItem;
  onShopClick: () => void;
  onFindSizeClick: () => void;
}

interface ParticleLine {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
}

export const HeroTreadField: React.FC<HeroTreadFieldProps> = ({
  featuredShoe,
  onShopClick,
  onFindSizeClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSupported, setCanvasSupported] = useState(true);
  const pointerPos = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const isVisible = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setCanvasSupported(false);
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const isMobile = width < 768;
    const count = isMobile ? 400 : 1200;

    const particles: ParticleLine[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 12 + Math.random() * 26,
        angle: 0,
        speed: 0.2 + Math.random() * 0.4,
        opacity: 0.05 + Math.random() * 0.18,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handlePointerMove = (e: MouseEvent) => {
      pointerPos.current.targetX = e.clientX / width;
      pointerPos.current.targetY = e.clientY / height;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handlePointerMove);

    // Visibility observer to pause loop offscreen or when tab hidden
    const observer = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting && !document.hidden;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const renderFrame = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer lerp
      pointerPos.current.x += (pointerPos.current.targetX - pointerPos.current.x) * 0.05;
      pointerPos.current.y += (pointerPos.current.targetY - pointerPos.current.y) * 0.05;

      const vanishingX = width * (0.5 + (pointerPos.current.x - 0.5) * 0.15);
      const horizonY = height * 0.62;

      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Vector field calculation: flow inward toward floor horizon line beneath featured pair
        const dx = vanishingX - p.x;
        const dy = horizonY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Tread contour field tangent
        const baseAngle = Math.atan2(dy, dx);
        const wave = Math.sin(p.y * 0.015 + p.x * 0.008) * 0.45;
        p.angle = baseAngle + wave;

        if (!prefersReducedMotion) {
          p.x += Math.cos(p.angle) * p.speed;
          p.y += Math.sin(p.angle) * p.speed + 0.15;

          if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || dist < 30) {
            p.x = Math.random() * width;
            p.y = Math.random() * (height * 0.4);
          }
        }

        const x2 = p.x + Math.cos(p.angle) * p.length;
        const y2 = p.y + Math.sin(p.angle) * p.length;

        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      if (!prefersReducedMotion && isVisible.current) {
        animId = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[90vh] md:min-h-screen bg-bg flex flex-col justify-center overflow-hidden border-b border-line"
    >
      {/* Tread Field Canvas */}
      {canvasSupported ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, var(--line), var(--line) 1px, transparent 1px, transparent 12px)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Radial soft spotlight behind the floor and shoe */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 62%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 75%)',
        }}
      />

      {/* Horizon reflection hairline */}
      <div className="absolute top-[62%] left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-line-strong to-transparent z-0 pointer-events-none" />

      {/* Content Layer */}
      <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Two-Tone Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-white/[0.04] border border-line text-[11px] font-mono uppercase tracking-widest text-text-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Fictional Indian Footwear Atelier</span>
          </div>

          <h1 className="text-display-xl font-display font-semibold tracking-tight text-balance leading-[1.02]">
            <span className="text-text">Shoes that fit the first time.</span>{' '}
            <span className="text-text-3">Sized by data, not guesswork.</span>
          </h1>

          <p className="text-body md:text-base text-text-2 max-w-xl leading-relaxed">
            Direct-to-consumer Indian craft footwear engineered with verified UK sizing data and instant doorstep exchange protection.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onShopClick}
              className="h-10 px-6 rounded-pill bg-white text-black font-medium text-body hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              Shop the collection
            </button>

            <button
              onClick={onFindSizeClick}
              className="h-10 px-5 rounded-pill bg-bg-raised border border-line hover:border-line-strong text-text font-medium text-body transition-colors flex items-center gap-2 cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Find my size</span>
              <ChevronRight className="w-4 h-4 text-text-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Featured Shoe Profile */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-[340px] md:max-w-[400px] group cursor-pointer" onClick={onShopClick}>
            <div className="relative rounded-panel overflow-hidden border border-line group-hover:border-line-strong transition-colors bg-bg-raised/70 backdrop-blur-sm p-4">
              <ProductImage
                slug={featuredShoe?.slug || 'astro-low-chai-beige'}
                alt={featuredShoe?.name || 'Astro Low Chai Beige'}
                name={featuredShoe?.name || 'Astro Low'}
                className="w-full aspect-[4/5] rounded-[4px]"
              />
              <div className="mt-3 flex items-center justify-between text-small">
                <div>
                  <p className="font-display font-medium text-text">{featuredShoe?.name || 'Astro Low "Chai Beige"'}</p>
                  <p className="text-[11px] font-mono text-text-3">Verified UK 6–11 Active Stock</p>
                </div>
                <span className="font-mono text-text font-medium">₹{featuredShoe?.priceINR?.toLocaleString('en-IN') || '2,999'}</span>
              </div>
            </div>
            <p className="text-center text-[10px] font-mono uppercase text-text-3 tracking-widest mt-3">
              Sample showcase pair &middot; Tap to inspect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
