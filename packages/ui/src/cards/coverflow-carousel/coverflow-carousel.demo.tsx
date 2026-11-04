'use client';

import React from 'react';
import { CoverflowCarousel, CoverflowSlide } from './coverflow-carousel';

const demoSlides: CoverflowSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    alt: 'Abstract Waves',
    title: 'Neon Fluid Geometry',
    subtitle: 'Digital Art Vol. 1',
  },
  {
    src: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    alt: 'Floral Still Life',
    title: 'Botanical Harmony',
    subtitle: 'Classic Oil Series',
  },
  {
    src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop',
    alt: 'Color Splash',
    title: 'Vibrant Chroma',
    subtitle: 'Abstract Expressionism',
  },
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop',
    alt: 'Modern Villa',
    title: 'Brutalist Villa',
    subtitle: 'Architecture Monograph',
  },
  {
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    alt: 'Microchip Texture',
    title: 'Silicon Circuitry',
    subtitle: 'Deep Tech Micrograph',
  },
];

export function CoverflowCarouselDemo() {
  return (
    <div className="w-full flex items-center justify-center">
      <CoverflowCarousel slides={demoSlides} />
    </div>
  );
}
