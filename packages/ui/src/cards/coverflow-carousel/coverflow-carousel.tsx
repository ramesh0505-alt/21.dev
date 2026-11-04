'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  fade?: number;
  cardWidth?: string;
  gap?: number;
  loop?: boolean;
  showNavigation?: boolean;
  className?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 40,
  depth = 0.5,
  falloff = 0.55,
  fade = 0.12,
  cardWidth = 'clamp(140px, 20vw, 220px)',
  gap = 0.08,
  loop = true,
  showNavigation = true,
  className,
}: CoverflowCarouselProps) {
  const count = slides.length;
  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);

  const [selected, setSelected] = React.useState(0);

  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count]
  );

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 80) * Math.sign(offset);

      card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.001) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.18;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint]
  );

  const goTo = React.useCallback(
    (index: number) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(target);
    },
    [count, loop, settle]
  );

  React.useEffect(() => {
    const measure = () => {
      const first = cardRefs.current[0];
      if (first) {
        widthRef.current = first.offsetWidth;
        paint();
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [paint]);

  return (
    <div className={cn('relative w-full max-w-4xl mx-auto py-8 select-none', className)}>
      {/* 3D Viewport Frame */}
      <div
        ref={frameRef}
        className="relative h-64 sm:h-72 w-full overflow-hidden"
        style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            onClick={() => goTo(index)}
            className="absolute top-1/2 left-1/2 -translate-y-1/2 h-56 sm:h-64 rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-900 shadow-2xl cursor-pointer transition-shadow hover:ring-2 hover:ring-purple-400"
            style={{
              width: cardWidth,
              willChange: 'transform, opacity',
            }}
          >
            <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
              {slide.title && (
                <span className="text-xs font-bold text-white truncate">{slide.title}</span>
              )}
              {slide.subtitle && (
                <span className="text-[10px] text-neutral-400 truncate">{slide.subtitle}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {showNavigation && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => goTo(selected - 1)}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            title="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-mono text-xs text-neutral-400">
            {selected + 1} / {count}
          </span>
          <button
            onClick={() => goTo(selected + 1)}
            className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
            title="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
