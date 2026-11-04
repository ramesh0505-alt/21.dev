'use client';

import React from 'react';
import { DominoGallery, DominoItem } from './domino-gallery';

const sampleItems: DominoItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=440&h=800&fit=crop&q=80',
    title: 'Minimal Trench',
  },
  {
    src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=440&h=800&fit=crop&q=80',
    title: 'Studio Noir',
  },
  {
    src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=440&h=800&fit=crop&q=80',
    title: 'Linen & Shadow',
  },
  {
    src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=440&h=800&fit=crop&q=80',
    title: 'Earthy Wool',
  },
  {
    src: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=440&h=800&fit=crop&q=80',
    title: 'High Contrast',
  },
];

export function DominoGalleryDemo() {
  return (
    <div className="w-full flex items-center justify-center">
      <DominoGallery items={sampleItems} autoplay={true} cardWidth={160} cardHeight={380} />
    </div>
  );
}
