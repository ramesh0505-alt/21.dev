'use client';

import React from 'react';
import { ImageCardFan, FanCardItem } from './image-card-fan';

const demoCards: FanCardItem[] = [
  {
    id: 'nordic',
    title: 'Nordic Solitude',
    description: 'Serene fjord reflections captured in dramatic high-latitude evening light.',
    src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'tokyo',
    title: 'Tokyo Cyberpunk',
    description: 'Rain-drenched neon alleys in Shinjuku glowing through cinematic haze.',
    src: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'alps',
    title: 'Alpine Ridge',
    description: 'Crisp snowfields and granite pinnacles across the Mont Blanc massif.',
    src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'sahara',
    title: 'Sahara Dunes',
    description: 'Golden wind-rippled crests stretching across infinite desert horizons.',
    src: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'kyoto',
    title: 'Kyoto Bamboo',
    description: 'Towering green stalks filtering gentle morning sunlight in Arashiyama.',
    src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
  },
];

export function ImageCardFanDemo() {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <ImageCardFan cards={demoCards} />
    </div>
  );
}

